import { createClient } from "@/lib/supabase/client";
import { hashPin, verifyPin as verifyPinHash } from "@/lib/pin";
import { isSupabaseConfigured } from "@/lib/config";
import { MOCK_COUPLE, FIXED_ACCOUNT, FIXED_COUPLE_NAME, FIXED_PROFILES } from "@/lib/mock-data";
import type { Profile, PublicProfile } from "@/lib/supabase/types";

type SupabaseBrowserClient = ReturnType<typeof createClient>;

/**
 * Bridges the app's "shared login for a couple" UX to real Supabase Auth.
 *
 * Model: ONE Supabase Auth user per couple. `couples.id` == `auth.users.id`.
 * Every RLS policy in supabase/migrations/0001_init.sql keys off
 * `auth.uid() = couple_id`, so this auth session is what actually unlocks
 * read/write access — the per-profile PIN (see src/lib/pin.ts) is a
 * lightweight "whose turn is it" gate on top, not the security boundary.
 *
 * This app is permanently seeded for exactly one couple (Mimo & Odyy), so
 * there is no registration UI: `ensureCoupleSession` silently signs into
 * (or, on the very first run anywhere, creates) the single fixed shared
 * account below, on every device, with no email/password ever shown to
 * the user.
 *
 * Requires "Confirm email" to be OFF in Supabase Auth settings (Authentication
 * > Sign In / Providers > Email), otherwise `signUp` won't return an active
 * session and the couple/profile inserts below will be rejected by RLS.
 */

function stripPinHash(row: Profile): PublicProfile {
  return {
    id: row.id,
    couple_id: row.couple_id,
    display_name: row.display_name,
    avatar_key: row.avatar_key,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

export interface SignUpCoupleInput {
  email: string;
  password: string;
  coupleName: string;
  profiles: { display_name: string; avatar_key: string; pin: string }[];
}

export interface CoupleSession {
  coupleId: string;
  coupleName: string;
  profiles: PublicProfile[];
}

/** Setup Awal (real backend): create the shared auth user + couple + profiles. */
export async function signUpCouple(input: SignUpCoupleInput): Promise<CoupleSession> {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId || !authData.session) {
    throw new Error(
      "Pendaftaran akun belum aktif. Pastikan 'Confirm email' dimatikan di pengaturan Supabase Auth, lalu coba lagi.",
    );
  }

  const { error: coupleError } = await supabase
    .from("couples")
    .insert({ id: userId, couple_name: input.coupleName });
  if (coupleError) throw coupleError;

  const profileRows = await Promise.all(
    input.profiles.map(async (p, i) => ({
      couple_id: userId,
      display_name: p.display_name,
      avatar_key: p.avatar_key,
      pin_hash: await hashPin(p.pin),
      sort_order: i,
    })),
  );

  const { data: insertedProfiles, error: profilesError } = await supabase
    .from("profiles")
    .insert(profileRows)
    .select();
  if (profilesError) throw profilesError;

  return {
    coupleId: userId,
    coupleName: input.coupleName,
    profiles: (insertedProfiles ?? []).map(stripPinHash),
  };
}

/**
 * Force the two profiles under this couple to exactly match FIXED_PROFILES
 * (name, avatar, and — critically — PIN), creating any that are missing.
 *
 * This exists because the shared account may already have been created by
 * an earlier build of this app (back when Setup Awal let people type their
 * own names/PINs during testing). Signing into that pre-existing account
 * alone would keep serving those stale PINs forever, silently drifting
 * from "Mimo = 290606 / Odyy = 201004". Running this on every bootstrap
 * makes the fixed PINs authoritative no matter what was seeded before.
 */
async function reconcileFixedProfiles(
  supabase: SupabaseBrowserClient,
  coupleId: string,
  existingProfiles: Profile[],
): Promise<PublicProfile[]> {
  const bySortOrder = [...existingProfiles].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  const results: PublicProfile[] = [];
  for (let i = 0; i < FIXED_PROFILES.length; i++) {
    const fixed = FIXED_PROFILES[i];
    const pinHash = await hashPin(fixed.pin);
    const existing = bySortOrder[i];

    if (existing) {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          display_name: fixed.display_name,
          avatar_key: fixed.avatar_key,
          pin_hash: pinHash,
          sort_order: i,
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      results.push(stripPinHash(data));
    } else {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          couple_id: coupleId,
          display_name: fixed.display_name,
          avatar_key: fixed.avatar_key,
          pin_hash: pinHash,
          sort_order: i,
        })
        .select()
        .single();
      if (error) throw error;
      results.push(stripPinHash(data));
    }
  }

  return results;
}

/**
 * Silently signs into the single fixed shared account on every device —
 * or, the very first time this app is ever opened anywhere, creates it.
 * This is what every screen calls on startup; there is no user-facing
 * sign-up or sign-in form.
 */
export async function ensureCoupleSession(): Promise<CoupleSession> {
  const supabase = createClient();

  const { data: existing } = await supabase.auth.getSession();

  if (!existing.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: FIXED_ACCOUNT.email,
      password: FIXED_ACCOUNT.password,
    });

    if (signInError) {
      // First run anywhere: the shared account doesn't exist yet — create it.
      return signUpCouple({
        email: FIXED_ACCOUNT.email,
        password: FIXED_ACCOUNT.password,
        coupleName: FIXED_COUPLE_NAME,
        profiles: FIXED_PROFILES.map((p) => ({
          display_name: p.display_name,
          avatar_key: p.avatar_key,
          pin: p.pin,
        })),
      });
    }
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("Gagal memuat sesi akun.");
  const userId = userData.user.id;

  const { data: coupleRow, error: coupleError } = await supabase
    .from("couples")
    .select("*")
    .eq("id", userId)
    .single();
  if (coupleError) throw coupleError;

  if (coupleRow.couple_name !== FIXED_COUPLE_NAME) {
    await supabase
      .from("couples")
      .update({ couple_name: FIXED_COUPLE_NAME })
      .eq("id", userId);
  }

  const { data: profileRows, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .eq("couple_id", userId)
    .order("sort_order");
  if (profilesError) throw profilesError;

  const profiles = await reconcileFixedProfiles(
    supabase,
    userId,
    profileRows ?? [],
  );

  return {
    coupleId: userId,
    coupleName: FIXED_COUPLE_NAME,
    profiles,
  };
}

/** The signed-in couple's id (== auth.uid()), or null if no session. */
export async function getCurrentCoupleId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/**
 * Resolves the couple_id every data-layer function should scope its
 * queries to. Screens never pass one explicitly — this is what stops
 * every real-mode query from silently falling back to MOCK_COUPLE.id
 * (which doesn't exist as a row and would just RLS-block everything).
 */
export async function resolveCoupleId(explicit?: string): Promise<string> {
  if (explicit) return explicit;
  if (!isSupabaseConfigured) return MOCK_COUPLE.id;

  const coupleId = await getCurrentCoupleId();
  if (!coupleId) {
    throw new Error("Belum masuk ke akun. Silakan masuk ulang lewat halaman Masuk.");
  }
  return coupleId;
}

/** Verify a PIN attempt against the real pin_hash stored in Supabase. */
export async function verifyProfilePin(profileId: string, attempt: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("pin_hash")
    .eq("id", profileId)
    .single();
  if (error || !data) return false;
  return verifyPinHash(attempt, data.pin_hash);
}

/** Change a profile's PIN after verifying the old one. */
export async function updateProfilePin(
  profileId: string,
  oldPin: string,
  newPin: string,
): Promise<boolean> {
  const ok = await verifyProfilePin(profileId, oldPin);
  if (!ok) return false;

  const supabase = createClient();
  const newHash = await hashPin(newPin);
  const { error } = await supabase
    .from("profiles")
    .update({ pin_hash: newHash })
    .eq("id", profileId);
  if (error) throw error;
  return true;
}
