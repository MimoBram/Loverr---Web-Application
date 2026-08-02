"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  type NotificationPrefs,
} from "@/lib/notification-prefs";
import { useT } from "@/lib/i18n";

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex h-7 w-12 items-center rounded-pill px-1 transition-colors",
        checked ? "bg-onyx justify-end" : "bg-divider justify-start",
      )}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow" />
    </button>
  );
}

/**
 * Pengaturan Notifikasi — matches Figma node 249:26.
 *
 * This app has no push-notification delivery (no service worker/APNs), so
 * these toggles govern what's *shown* in the in-app Notifications feed and
 * Home's activity card on this device, not real device push. See
 * src/lib/notification-prefs.ts.
 */
export default function NotificationSettingsPage() {
  const router = useRouter();
  const t = useT();
  const [state, setState] = useState<NotificationPrefs>({
    entries: true,
    notes: true,
    quiz: true,
  });

  const TOGGLES = [
    { key: "entries", label: t("notifSettings.entries"), desc: t("notifSettings.entriesDesc") },
    { key: "notes", label: t("notifSettings.notes"), desc: t("notifSettings.notesDesc") },
    { key: "quiz", label: t("notifSettings.quiz"), desc: t("notifSettings.quizDesc") },
  ] as const;

  useEffect(() => {
    setState(loadNotificationPrefs());
  }, []);

  function toggle(key: keyof NotificationPrefs) {
    setState((s) => {
      const next = { ...s, [key]: !s[key] };
      saveNotificationPrefs(next);
      return next;
    });
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          aria-label={t("common.back")}
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[19px] font-extrabold text-ink">{t("notifSettings.title")}</h1>
      </div>

      <div className="overflow-hidden rounded-[24px] bg-card shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
        {TOGGLES.map(({ key, label, desc }, i) => (
          <div
            key={key}
            className={cn(
              "flex items-center gap-3 px-4 py-4",
              i > 0 && "border-t border-divider",
            )}
          >
            <div className="flex-1">
              <p className="text-[14px] font-bold text-ink">{label}</p>
              <p className="text-caption text-muted">{desc}</p>
            </div>
            <Switch checked={state[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </main>
  );
}
