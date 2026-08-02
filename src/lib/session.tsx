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
  signUpCouple,
  signInCouple,
  verifyProfilePin,
  updateProfilePin as updateProfilePinRemote,
} from "@/lib/data/auth";
import { createClient } from "@/lib/supabase/client";
import type { PublicProfile } from "@/lib/supabase/types";

/**
 * Session state for "which couple / which profile is active on this device".
 *
 * Two backends, same shape:
 * - Mock (no Supabase configured): everything lives in localStorage, PINs
 *   are compared as plain strings. Good enough for click-through demos.
 * - Real (Supabase configured): Setup Awal creates a shared Supabase Auth
 *   user (email + password) for the couple — that auth session is what
 *   Row Level Security actually checks (see supabase/migrations/0001_init.sql).
 *   The per-profile PIN stays a lightweight "whose turn is it" gate checked
 *   via src/lib/data/auth.ts against the real bcrypt hash, not a security
 *   boundary on its own.
 */

interface SessionState {
  hydrated: boolean;
  /** Which profile is currently "unlocked" on this device (post-PIN). */
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
  /** Whether Setup Awal / Masuk has been completed on this device. */
  hasCompletedSetup: boolean;
  coupleName: string;
  profiles: PublicProfile[];
  completeSetup: (input: {
    email: string;
    password: string;
    coupleName: string;
    profiles: { display_name: string; avatar_key: string; pin: string }[];
  }) => Promise<void>;
  /** Second device joining an existing couple's shared account. */
  signIn: (email: string, password: string) => Promise<void>;
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
const KEY_SETUP = "loverr:setup-complete";
const KEY_COUPLE_NAME = "loverr:couple-name";
const KEY_PROFILES = "loverr:profiles";
const KEY_PINS = "loverr:pins";

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(
    null,
  );
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
  const [coupleName, setCoupleName] = useState(MOCK_COUPLE.couple_name);
  const [profiles, setProfiles] = useState<PublicProfile[]>(MOCK_PROFILES);
  const [pins, setPins] = useState<Record<string, string>>({});

  useEffect(() => {
    setActiveProfileIdState(localStorage.getItem(KEY_PROFILE));
    setHasCompletedSetup(localStorage.getItem(KEY_SETUP) === "true");

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
  }, []);

  function setActiveProfileId(id: string | null) {
    setActiveProfileIdState(id);
    if (id) localStorage.setItem(KEY_PROFILE, id);
    else localStorage.removeItem(KEY_PROFILE);
  }

  function persistCoupleSession(name: string, nextProfiles: PublicProfile[]) {
    localStorage.setItem(KEY_COUPLE_NAME, name);
    localStorage.setItem(KEY_PROFILES, JSON.stringify(nextProfiles));
    localStorage.setItem(KEY_SETUP, "true");
    setCoupleName(name);
    setProfiles(nextProfiles);
    setHasCompletedSetup(true);
  }

  async function completeSetup(input: {
    email: string;
    password: string;
    coupleName: string;
    profiles: { display_name: string; avatar_key: string; pin: string }[];
  }) {
    if (isSupabaseConfigured) {
      const result = await signUpCouple({
        email: input.email,
        password: input.password,
        coupleName: input.coupleName,
        profiles: input.profiles,
      });
      persistCoupleSession(result.coupleName, result.profiles);
      return;
    }

    const nextProfiles: PublicProfile[] = input.profiles.map((p, i) => ({
      id: `local-profile-${i + 1}`,
      couple_id: "local-couple",
      display_name: p.display_name,
      avatar_key: p.avatar_key,
      sort_order: i,
      created_at: new Date().toISOString(),
    }));
    const nextPins = Object.fromEntries(
      nextProfiles.map((p, i) => [p.id, input.profiles[i].pin]),
    );

    localStorage.setItem(KEY_PINS, JSON.stringify(nextPins));
    setPins(nextPins);
    persistCoupleSession(input.coupleName, nextProfiles);
  }

  async function signIn(email: string, password: string) {
    const result = await signInCouple(email, password);
    persistCoupleSession(result.coupleName, result.profiles);
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
  // so would blank out every page (including ones that don't need auth,
  // like Splash/Setup Awal) until localStorage is read. Consumers that
  // need to avoid a flash of the wrong state (see the (app) route group's
  // layout) should check `hydrated` themselves before redirecting.

  return (
    <SessionContext.Provider
      value={{
        hydrated,
        activeProfileId,
        setActiveProfileId,
        hasCompletedSetup,
        coupleName,
        profiles,
        completeSetup,
        signIn,
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
