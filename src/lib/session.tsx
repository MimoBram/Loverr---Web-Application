"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MOCK_COUPLE, MOCK_PROFILES, MOCK_PINS } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/config";
import {
  ensureCoupleSession,
  verifyProfilePin,
  updateProfilePin as updateProfilePinRemote,
} from "@/lib/data/auth";
import { createClient } from "@/lib/supabase/client";
import type { PublicProfile } from "@/lib/supabase/types";

/**
 * Session state for "which couple / which profile is active on this device".
 *
 * This app is permanently seeded for exactly one couple (Mimo & Odyy), so
 * there is no registration/login UI. Two backends, same shape:
 * - Mock (no Supabase configured): profiles/PINs are the hardcoded
 *   MOCK_PROFILES / MOCK_PINS, ready instantly.
 * - Real (Supabase configured): on mount, silently signs into (or, on the
 *   very first run anywhere, creates) the single fixed shared Supabase Auth
 *   account via `ensureCoupleSession` — that auth session is what Row Level
 *   Security actually checks (see supabase/migrations/0001_init.sql). The
 *   per-profile PIN stays a lightweight "whose turn is it" gate checked via
 *   src/lib/data/auth.ts against the real bcrypt hash, not a security
 *   boundary on its own.
 */

interface SessionState {
  hydrated: boolean;
  /** True once coupleName/profiles reflect the real backend (instant in mock mode). */
  ready: boolean;
  /** Which profile is currently "unlocked" on this device (post-PIN). */
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
  coupleName: string;
  profiles: PublicProfile[];
  logoutProfile: () => void;
  verifyPin: (profileId: string, attempt: string) => Promise<boolean>;
  updateProfile: (
    profileId: string,
    input: { display_name: string; avatar_key: string },
  ) => Promise<void>;
  updatePin: (
    profileId: string,
    oldPin: string,
    newPin: string,
  ) => Promise<boolean>;
}

const KEY_PROFILE = "loverr:active-profile";
const KEY_COUPLE_NAME = "loverr:couple-name";
const KEY_PROFILES = "loverr:profiles";
const KEY_PINS = "loverr:pins";

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(
    null,
  );
  const [coupleName, setCoupleName] = useState(MOCK_COUPLE.couple_name);
  const [profiles, setProfiles] = useState<PublicProfile[]>(MOCK_PROFILES);
  const [pins, setPins] = useState<Record<string, string>>({});

  useEffect(() => {
    setActiveProfileIdState(localStorage.getItem(KEY_PROFILE));

    const storedName = localStorage.getItem(KEY_COUPLE_NAME);
    if (storedName) setCoupleName(storedName);

    const storedProfiles = localStorage.getItem(KEY_PROFILES);
    if (storedProfiles) {
      try {
        setProfiles(JSON.parse(storedProfiles));
      } catch {
        // ignore malformed local data, keep mock fallback
      }
    }

    const storedPins = localStorage.getItem(KEY_PINS);
    if (storedPins) {
      try {
        setPins(JSON.parse(storedPins));
      } catch {
        // ignore malformed local data
      }
    }

    setHydrated(true);

    // No registration UI: silently sign into (or create) the single fixed
    // shared account in the background. Until this resolves, `ready` stays
    // false so screens like Pilih Profil don't act on stale mock ids.
    if (isSupabaseConfigured) {
      ensureCoupleSession()
        .then((result) => {
          persistCoupleSession(result.coupleName, result.profiles);
          setReady(true);
        })
        .catch((err) => {
          console.error("Gagal menyiapkan sesi akun bersama:", err);
          setReady(true);
        });
    }
  }, []);

  function setActiveProfileId(id: string | null) {
    setActiveProfileIdState(id);
    if (id) localStorage.setItem(KEY_PROFILE, id);
    else localStorage.removeItem(KEY_PROFILE);
  }

  function persistCoupleSession(name: string, nextProfiles: PublicProfile[]) {
    localStorage.setItem(KEY_COUPLE_NAME, name);
    localStorage.setItem(KEY_PROFILES, JSON.stringify(nextProfiles));
    setCoupleName(name);
    setProfiles(nextProfiles);
  }

  function logoutProfile() {
    setActiveProfileId(null);
  }

  async function verifyPin(profileId: string, attempt: string) {
    if (isSupabaseConfigured) {
      return verifyProfilePin(profileId, attempt);
    }
    const expected = pins[profileId] ?? MOCK_PINS[profileId] ?? "";
    return attempt === expected;
  }

  async function updateProfile(
    profileId: string,
    input: { display_name: string; avatar_key: string },
  ) {
    const next = profiles.map((p) =>
      p.id === profileId ? { ...p, ...input } : p,
    );
    localStorage.setItem(KEY_PROFILES, JSON.stringify(next));
    setProfiles(next);

    if (isSupabaseConfigured) {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update(input)
        .eq("id", profileId);
      if (error) throw error;
    }
  }

  async function updatePin(profileId: string, oldPin: string, newPin: string) {
    if (isSupabaseConfigured) {
      return updateProfilePinRemote(profileId, oldPin, newPin);
    }

    const ok = await verifyPin(profileId, oldPin);
    if (!ok) return false;
    const nextPins = { ...pins, [profileId]: newPin };
    localStorage.setItem(KEY_PINS, JSON.stringify(nextPins));
    setPins(nextPins);
    return true;
  }

  // Note: we deliberately do NOT gate rendering on `hydrated` here — doing
  // so would blank out every page (including Splash) until localStorage is
  // read. Consumers that need to avoid a flash of the wrong state (see the
  // (app) route group's layout, and Pilih Profil) should check `hydrated`
  // and `ready` themselves before redirecting or rendering profile data.

  return (
    <SessionContext.Provider
      value={{
        hydrated,
        ready,
        activeProfileId,
        setActiveProfileId,
        coupleName,
        profiles,
        logoutProfile,
        verifyPin,
        updateProfile,
        updatePin,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
