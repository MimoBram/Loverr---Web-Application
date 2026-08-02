"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MOCK_COUPLE, MOCK_PROFILES, MOCK_PIN } from "@/lib/mock-data";
import type { PublicProfile } from "@/lib/supabase/types";

/**
 * Local-first "mock backend" for the core flow, backed by localStorage.
 *
 * This is intentionally shaped like the real Supabase tables (couple name +
 * a 2-profile array) so wiring in `src/lib/supabase/client.ts` later is a
 * matter of swapping these getters/setters for real queries, not a UI
 * rewrite. Falls back to src/lib/mock-data.ts until Setup Awal is run.
 */

interface SessionState {
  hydrated: boolean;
  /** Which profile is currently "unlocked" on this device (post-PIN). */
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
  /** Whether Setup Awal has been completed on this device. */
  hasCompletedSetup: boolean;
  coupleName: string;
  profiles: PublicProfile[];
  completeSetup: (input: {
    coupleName: string;
    profiles: { display_name: string; avatar_key: string; pin: string }[];
  }) => void;
  logoutProfile: () => void;
  verifyPin: (profileId: string, attempt: string) => boolean;
  updateProfile: (
    profileId: string,
    input: { display_name: string; avatar_key: string },
  ) => void;
  updatePin: (profileId: string, oldPin: string, newPin: string) => boolean;
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

  function completeSetup(input: {
    coupleName: string;
    profiles: { display_name: string; avatar_key: string; pin: string }[];
  }) {
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

    localStorage.setItem(KEY_COUPLE_NAME, input.coupleName);
    localStorage.setItem(KEY_PROFILES, JSON.stringify(nextProfiles));
    localStorage.setItem(KEY_PINS, JSON.stringify(nextPins));
    localStorage.setItem(KEY_SETUP, "true");

    setCoupleName(input.coupleName);
    setProfiles(nextProfiles);
    setPins(nextPins);
    setHasCompletedSetup(true);
  }

  function logoutProfile() {
    setActiveProfileId(null);
  }

  function verifyPin(profileId: string, attempt: string) {
    const expected = pins[profileId] ?? MOCK_PIN;
    return attempt === expected;
  }

  function updateProfile(
    profileId: string,
    input: { display_name: string; avatar_key: string },
  ) {
    const next = profiles.map((p) =>
      p.id === profileId ? { ...p, ...input } : p,
    );
    localStorage.setItem(KEY_PROFILES, JSON.stringify(next));
    setProfiles(next);
  }

  function updatePin(profileId: string, oldPin: string, newPin: string) {
    if (!verifyPin(profileId, oldPin)) return false;
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
