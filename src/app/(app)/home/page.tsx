"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Plus, ArrowRight } from "lucide-react";
import { Card, CardTitle, CardMeta } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/session";
import { listEntries } from "@/lib/data/entries";
import { listNotifications } from "@/lib/data/notifications";
import type { ScrapbookEntry } from "@/lib/supabase/types";

const CARD_COLORS = ["coral", "violet", "periwinkle"] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
  });
}

export default function HomePage() {
  const { activeProfileId, profiles, coupleName } = useSession();
  const me = profiles.find((p) => p.id === activeProfileId);

  const [entries, setEntries] = useState<ScrapbookEntry[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    Promise.all([listEntries(), listNotifications()])
      .then(([entryData, notifData]) => {
        if (cancelled) return;
        setEntries(entryData.slice(0, 3));
        setUnreadCount(notifData.filter((n) => !n.is_read).length);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function authorName(profileId: string) {
    return profiles.find((p) => p.id === profileId)?.display_name ?? "kamu";
  }

  return (
    <main className="flex flex-col gap-6 px-5 pt-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-body text-muted">Halo, {me?.display_name ?? "kamu"} 👋</p>
          <h1 className="text-heading text-ink">{coupleName}</h1>
        </div>
        <Link
          href="/notifications"
          aria-label="Notifikasi"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Bell size={20} className="text-ink" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
          )}
        </Link>
      </header>

      <Link href="/timeline/new">
        <Button className="flex items-center justify-center gap-2">
          <Plus size={18} />
          Tambah Kenangan Hari Ini
        </Button>
      </Link>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-section-title text-ink">Kenangan Terbaru</h2>
          <Link
            href="/timeline"
            className="flex items-center gap-1 text-label text-rose"
          >
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>

        {status === "loading" && (
          <p className="text-caption text-muted">Memuat kenangan…</p>
        )}
        {status === "error" && (
          <p className="text-caption text-error">
            Gagal memuat kenangan. Coba muat ulang halaman.
          </p>
        )}
        {status === "ready" && entries.length === 0 && (
          <Card color="surface">
            <p className="text-body-medium text-ink">
              Belum ada kenangan. Yuk tambahkan yang pertama!
            </p>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          {entries.map((entry, i) => (
            <Link key={entry.id} href={`/timeline/${entry.id}`}>
              <Card color={CARD_COLORS[i % CARD_COLORS.length]}>
                <CardTitle>{entry.title}</CardTitle>
                <CardMeta>
                  {formatDate(entry.entry_date)} · oleh {authorName(entry.author_profile_id)}
                </CardMeta>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-section-title text-ink">Notes &amp; Quiz</h2>
        <Link href="/notes">
          <Card color="surface" className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-card-title text-ink">Buka Notes &amp; Quiz Hub</p>
              <p className="text-caption text-muted">
                Tulis catatan atau jawab quiz mingguan bareng pasanganmu.
              </p>
            </div>
            <ArrowRight size={18} className="shrink-0 text-rose" />
          </Card>
        </Link>
      </section>
    </main>
  );
}
