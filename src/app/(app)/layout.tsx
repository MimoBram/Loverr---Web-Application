"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/ui/BottomNav";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { useSession } from "@/lib/session";

/**
 * Shared shell for every screen that requires an unlocked profile
 * (Home, Timeline, Notes, Profile). Redirects back to Pilih Profil if
 * no profile is active on this device yet.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeProfileId, hydrated } = useSession();

  useEffect(() => {
    if (hydrated && !activeProfileId) {
      router.replace("/pilih-profil");
    }
  }, [hydrated, activeProfileId, router]);

  // Wait for localStorage to be read before deciding — otherwise a
  // returning user with a valid session would flash to Pilih Profil first.
  if (!hydrated || !activeProfileId) return null;

  return (
    <div className="pb-20">
      <OfflineBanner />
      {children}
      <BottomNav />
    </div>
  );
}
