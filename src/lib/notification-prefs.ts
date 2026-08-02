import type { NotificationType } from "@/lib/supabase/types";

/**
 * Per-device notification preferences, set on the "Notifikasi" settings
 * screen (src/app/(app)/profile/notifications/page.tsx). This app has no
 * push-notification delivery infrastructure (no service worker/APNs), so
 * these toggles don't control *whether* an activity gets logged — they
 * control whether it's *shown* in the in-app Notifications feed and Home's
 * activity card on this device.
 */

const KEY = "loverr:notif-prefs";

export interface NotificationPrefs {
  entries: boolean;
  notes: boolean;
  quiz: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  entries: true,
  notes: true,
  quiz: true,
};

export function loadNotificationPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveNotificationPrefs(prefs: NotificationPrefs): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

const TYPE_TO_PREF_KEY: Record<NotificationType, keyof NotificationPrefs | null> = {
  new_entry: "entries",
  new_note: "notes",
  quiz_reminder: "quiz",
  quiz_result_ready: "quiz",
  system: null, // system messages are never muted
};

export function isNotificationTypeEnabled(
  type: NotificationType,
  prefs: NotificationPrefs,
): boolean {
  const key = TYPE_TO_PREF_KEY[type];
  return key === null ? true : prefs[key];
}
