"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Image, MessageCircleHeart, Sparkles, Bell } from "lucide-react";
import { listNotifications, markNotificationRead } from "@/lib/data/notifications";
import { loadNotificationPrefs, isNotificationTypeEnabled } from "@/lib/notification-prefs";
import { useT, useLanguage } from "@/lib/i18n";
import type { AppNotification, NotificationType } from "@/lib/supabase/types";

const ICONS: Record<NotificationType, typeof Bell> = {
  new_entry: Image,
  new_note: MessageCircleHeart,
  quiz_reminder: Sparkles,
  quiz_result_ready: Sparkles,
  system: Bell,
};

const UNREAD_COLORS = ["bg-coral", "bg-periwinkle"] as const;

function targetHref(n: AppNotification) {
  if (n.related_entry_id) return `/timeline/${n.related_entry_id}`;
  if (n.type === "quiz_reminder" || n.type === "quiz_result_ready") return "/notes/quiz";
  if (n.type === "new_note") return "/notes";
  return undefined;
}

export default function NotificationsPage() {
  const router = useRouter();
  const t = useT();
  const { lang } = useLanguage();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString(lang === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function dayGroup(iso: string) {
    const diffDays = Math.floor(
      (Date.now() - new Date(iso).getTime()) / 86_400_000,
    );
    if (diffDays < 1) return t("notifications.today");
    if (diffDays < 2) return t("notifications.yesterday");
    if (diffDays < 7) return t("notifications.thisWeek");
    return t("notifications.older");
  }

  useEffect(() => {
    let cancelled = false;

    const prefs = loadNotificationPrefs();

    listNotifications()
      .then((data) => {
        if (!cancelled) {
          setNotifications(
            data.filter((n) => isNotificationTypeEnabled(n.type, prefs)),
          );
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleOpen(n: AppNotification) {
    if (n.is_read) return;
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item)),
    );
    markNotificationRead(n.id).catch(() => {
      // Non-critical — the read state will just re-sync on next load.
    });
  }

  const groups: Record<string, AppNotification[]> = {};
  for (const n of notifications) {
    const g = dayGroup(n.created_at);
    (groups[g] ??= []).push(n);
  }
  const groupOrder = [
    t("notifications.today"),
    t("notifications.yesterday"),
    t("notifications.thisWeek"),
    t("notifications.older"),
  ].filter((g) => groups[g]?.length);

  let unreadColorIndex = 0;

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
        <h1 className="text-[19px] font-extrabold text-ink">{t("notifications.title")}</h1>
      </div>

      {status === "loading" && (
        <p className="text-caption text-muted">{t("notifications.loading")}</p>
      )}
      {status === "error" && (
        <p className="text-caption text-error">
          {t("notifications.error")}
        </p>
      )}
      {status === "ready" && notifications.length === 0 && (
        <p className="text-body-medium text-muted">{t("notifications.empty")}</p>
      )}

      {groupOrder.map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <p className="text-[13.5px] font-bold text-subtle">{group}</p>
          <div className="flex flex-col gap-3">
            {groups[group].map((n) => {
              const Icon = ICONS[n.type];
              const href = targetHref(n);
              const colorClass = !n.is_read
                ? UNREAD_COLORS[unreadColorIndex++ % UNREAD_COLORS.length]
                : null;

              const inner = (
                <div
                  className={`relative flex items-start gap-3 overflow-hidden rounded-[24px] p-4 ${
                    colorClass ? colorClass : "bg-card shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]"
                  }`}
                >
                  {colorClass && (
                    <div className="absolute -right-8 -top-8 h-[100px] w-[100px] rounded-full bg-white/10" />
                  )}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-squircle bg-card shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
                    <Icon size={20} className="text-ink" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[13px] font-extrabold ${
                        colorClass ? "text-onyx" : "text-ink"
                      }`}
                    >
                      {n.title}
                    </p>
                    {n.body && (
                      <p
                        className={`mt-0.5 truncate text-[13px] font-medium ${
                          colorClass ? "text-onyx/85" : "text-muted"
                        }`}
                      >
                        {n.body}
                      </p>
                    )}
                    <p
                      className={`mt-1 text-[12px] ${
                        colorClass ? "text-onyx/75" : "text-subtle"
                      }`}
                    >
                      {formatTime(n.created_at)}
                    </p>
                  </div>
                  {colorClass && (
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-white" />
                  )}
                </div>
              );

              return href ? (
                <Link key={n.id} href={href} onClick={() => handleOpen(n)}>
                  {inner}
                </Link>
              ) : (
                <button key={n.id} onClick={() => handleOpen(n)} className="text-left">
                  {inner}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
