import { createClient } from "@/lib/supabase/client";
import { hashPin, verifyPin as verifyPinHash } from "@/lib/pin";
import { isSupabaseConfigured } from "@/lib/config";
import { MOCK_COUPLE } from "@/lib/mock-data";
import type { Profile, PublicProfile } from "@/lib/supabase/types";

/**
 * Bridges the app's "shared login for a couple" UX to real Supabase Auth.
 *
 * Model: ONE Supabase Auth user per couple (email + password chosen once
 * during Setup Awal). `couples.id` == `auth.users.id`. Every RLS policy in
 * supabase/migrations/0001_init.sql keys off `auth.uid() = couple_id`, so
 * this auth session is what actually unlocks read/write access — the
 * per-profile PIN (see src/lib/pin.ts) is a lightweight "whose turn is it"
 * gate on top, not the security boundary.
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

/** "Masuk" screen (second device): sign in to the shared account, load its data. */
export async function signInCouple(email: string, password: string): Promise<CoupleSession> {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) throw authError;

  const userId = authData.user?.id;
  if (!userId) throw new Error("Login gagal — coba lagi.");

  const { data: coupleRow, error: coupleError } = await supabase
    .from("couples")
    .select("*")
    .eq("id", userId)
    .single();
  if (coupleError) throw coupleError;

  const { data: profileRows, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .eq("couple_id", userId)
    .order("sort_order");
  if (profilesError) throw profilesError;

  return {
    coupleId: userId,
    coupleName: coupleRow.couple_name,
    profiles: (profileRows ?? []).map(stripPinHash),
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
