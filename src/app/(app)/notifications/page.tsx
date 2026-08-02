"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image, MessageCircleHeart, Sparkles, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { listNotifications, markNotificationRead } from "@/lib/data/notifications";
import type { AppNotification, NotificationType } from "@/lib/supabase/types";

const ICONS: Record<NotificationType, typeof Bell> = {
  new_entry: Image,
  new_note: MessageCircleHeart,
  quiz_reminder: Sparkles,
  quiz_result_ready: Sparkles,
  system: Bell,
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    listNotifications()
      .then((data) => {
        if (!cancelled) {
          setNotifications(data);
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

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-heading text-ink">Notifikasi</h1>
      </div>

      {status === "loading" && (
        <p className="text-caption text-muted">Memuat notifikasi…</p>
      )}
      {status === "error" && (
        <p className="text-caption text-error">
          Gagal memuat notifikasi. Coba muat ulang halaman.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {status === "ready" && notifications.length === 0 && (
          <p className="text-body-medium text-muted">Belum ada notifikasi.</p>
        )}

        {notifications.map((n) => {
          const Icon = ICONS[n.type];
          const content = (
            <div
              className={cn(
                "flex items-start gap-3 rounded-card-lg p-4",
                n.is_read ? "bg-white" : "bg-cream shadow-sm",
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
                <Icon size={18} className="text-rose" />
              </div>
              <div className="flex-1">
                <p className="text-body-medium text-ink">{n.title}</p>
                {n.body && <p className="text-caption text-muted">{n.body}</p>}
                <p className="mt-1 text-caption text-muted">
                  {formatTime(n.created_at)}
                </p>
              </div>
              {!n.is_read && (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose" />
              )}
            </div>
          );

          return n.related_entry_id ? (
            <Link key={n.id} href={`/timeline/${n.related_entry_id}`} onClick={() => handleOpen(n)}>
              {content}
            </Link>
          ) : (
            <button key={n.id} onClick={() => handleOpen(n)} className="text-left">
              {content}
            </button>
          );
        })}
      </div>
    </main>
  );
}
