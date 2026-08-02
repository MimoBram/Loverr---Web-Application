"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { useT } from "@/lib/i18n";

/**
 * Thin banner shown whenever the browser goes offline. The app's data
 * layer already falls back to in-memory mock data when Supabase isn't
 * configured, but once a real project is connected, network calls can
 * genuinely fail — this gives the user a clear reason instead of a
 * silent stuck loading/error state.
 */
export function OfflineBanner() {
  const t = useT();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-onyx px-4 py-2 text-caption text-white">
      <WifiOff size={14} />
      {t("common.offline")}
    </div>
  );
}
