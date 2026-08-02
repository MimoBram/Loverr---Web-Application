"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, BookHeart, MessageCircleHeart, Heart } from "lucide-react";
import { useSession } from "@/lib/session";
import { listEntries } from "@/lib/data/entries";
import { listNotifications } from "@/lib/data/notifications";
import type { ScrapbookEntry, AppNotification } from "@/lib/supabase/types";

const AVATAR_COLORS: Record<string, string> = {
  "avatar-1": "bg-coral",
  "avatar-2": "bg-periwinkle",
  "avatar-3": "bg-violet",
  "avatar-4": "bg-rose",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "Baru saja";
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

/** Home / Landing screen — matches Figma node 166:3. */
export default function HomePage() {
  const { activeProfileId, profiles } = useSession();
  const me = profiles.find((p) => p.id === activeProfileId);

  const [entries, setEntries] = useState<ScrapbookEntry[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    Promise.all([listEntries(), listNotifications()])
      .then(([entryData, notifData]) => {
        if (cancelled) return;
        setEntries(entryData.slice(0, 1));
        setNotifications(notifData.slice(0, 2));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const latestEntry = entries[0];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <main className="flex flex-col gap-6 px-5 pt-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            aria-label="Profil"
            className={`flex h-14 w-14 items-center justify-center rounded-full font-extrabold text-white ${
              AVATAR_COLORS[me?.avatar_key ?? "avatar-1"]
            }`}
          >
            {me?.display_name?.charAt(0).toUpperCase() ?? "?"}
          </Link>
          <div className="flex flex-col gap-1.5">
            <p className="text-heading text-ink">Halo, sayang :)</p>
            <div className="h-1.5 w-[150px] overflow-hidden rounded-full bg-divider">
              <div className="h-full w-[59%] rounded-full bg-rose" />
            </div>
          </div>
        </div>
        <Link
          href="/notifications"
          aria-label="Notifikasi"
          className="relative flex h-[52px] w-[52px] items-center justify-center rounded-squircle bg-ink shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
        >
          <Bell size={20} className="text-white" />
          {unreadCount > 0 && (
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose ring-2 ring-ink" />
          )}
        </Link>
      </header>

      <Link
        href={latestEntry ? `/timeline/${latestEntry.id}` : "/timeline/new"}
        className="relative block h-[220px] w-full overflow-hidden rounded-card-lg bg-coral"
      >
        <div className="absolute -right-10 -bottom-10 h-[180px] w-[180px] rounded-full bg-white/10" />
        <div className="absolute right-5 top-5 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-rose-deep">
          <Heart size={20} className="fill-white text-white" />
        </div>
        <p className="absolute left-5 top-6 text-[12.5px] font-bold text-ink/85">
          MOMEN TERAKHIR
        </p>
        {latestEntry ? (
          <p className="absolute left-5 top-[139px] w-[220px] text-card-title text-white">
            {latestEntry.title}
          </p>
        ) : (
          <p className="absolute left-5 top-[139px] w-[220px] text-card-title text-white">
            Belum ada kenangan — yuk tambahkan!
          </p>
        )}
        <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-squircle bg-ink shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
          <Heart size={16} className="text-white" />
        </div>
      </Link>

      <div className="flex gap-3">
        <Link
          href="/timeline"
          className="relative h-[170px] w-1/2 overflow-hidden rounded-[28px] bg-violet p-4"
        >
          <div className="absolute -right-6 -bottom-6 h-[120px] w-[120px] rounded-full bg-white/10" />
          <div className="flex h-14 w-14 items-center justify-center rounded-squircle bg-ink shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
            <BookHeart size={24} className="text-white" />
          </div>
          <p className="absolute bottom-8 left-4 text-[16px] font-extrabold text-white">
            Scrapbook
          </p>
          <p className="absolute bottom-4 left-4 text-[12px] font-medium text-ink/85">
            Timeline momen
          </p>
        </Link>

        <Link
          href="/notes"
          className="relative h-[170px] w-1/2 overflow-hidden rounded-[28px] bg-periwinkle p-4"
        >
          <div className="absolute -right-6 -bottom-6 h-[120px] w-[120px] rounded-full bg-white/10" />
          <div className="flex h-14 w-14 items-center justify-center rounded-squircle bg-ink shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
            <MessageCircleHeart size={24} className="text-white" />
          </div>
          <p className="absolute bottom-8 left-4 text-[16px] font-extrabold text-white">
            Notes &amp; Quiz
          </p>
          <p className="absolute bottom-4 left-4 text-[12px] font-medium text-ink/85">
            Pesan &amp; tebakan
          </p>
        </Link>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-section-title text-ink">Aktivitas Terbaru</h2>

        {status === "loading" && (
          <p className="text-caption text-muted">Memuat aktivitas…</p>
        )}
        {status === "error" && (
          <p className="text-caption text-error">
            Gagal memuat aktivitas. Coba muat ulang halaman.
          </p>
        )}

        {status === "ready" && (
          <Link
            href="/notifications"
            className="block rounded-[28px] border-[1.5px] border-divider bg-white shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]"
          >
            {notifications.length === 0 ? (
              <p className="px-5 py-6 text-body-medium text-muted">
                Belum ada aktivitas baru.
              </p>
            ) : (
              notifications.map((n, i) => (
                <div key={n.id}>
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle ${
                        i % 2 === 0 ? "bg-coral" : "bg-periwinkle"
                      }`}
                    >
                      <Bell size={16} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[12.5px] font-bold text-ink">
                        {n.title}
                      </p>
                      <p className="text-caption text-subtle">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                  </div>
                  {i < notifications.length - 1 && (
                    <div className="h-px w-full bg-divider" />
                  )}
                </div>
              ))
            )}
          </Link>
        )}
      </section>

    </main>
  );
}
