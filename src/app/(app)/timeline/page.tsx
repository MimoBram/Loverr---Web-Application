"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ImageOff } from "lucide-react";
import { Card, CardTitle, CardMeta } from "@/components/ui/Card";
import { useSession } from "@/lib/session";
import { listEntries } from "@/lib/data/entries";
import type { ScrapbookEntry } from "@/lib/supabase/types";

const CARD_COLORS = ["coral", "violet", "periwinkle"] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TimelinePage() {
  const { profiles } = useSession();
  const [entries, setEntries] = useState<ScrapbookEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    listEntries()
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
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

  function authorName(profileId: string) {
    return profiles.find((p) => p.id === profileId)?.display_name ?? "kamu";
  }

  return (
    <main className="flex flex-col gap-6 px-5 pt-10 pb-24">
      <header>
        <h1 className="text-heading text-ink">Scrapbook</h1>
        <p className="text-body-medium text-muted">
          Semua kenangan yang sudah kalian simpan.
        </p>
      </header>

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
            Belum ada kenangan tersimpan. Tap tombol + untuk mulai.
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {entries.map((entry, i) => (
          <Link key={entry.id} href={`/timeline/${entry.id}`}>
            <Card color={CARD_COLORS[i % CARD_COLORS.length]}>
              {entry.photo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.photo_path}
                  alt={entry.title}
                  className="mb-3 h-32 w-full rounded-card object-cover"
                />
              ) : (
                <div className="mb-3 flex h-32 w-full items-center justify-center rounded-card bg-white/20">
                  <ImageOff size={28} className="text-white/70" />
                </div>
              )}
              <CardTitle>{entry.title}</CardTitle>
              <CardMeta>
                {formatDate(entry.entry_date)} · oleh {authorName(entry.author_profile_id)}
              </CardMeta>
            </Card>
          </Link>
        ))}
      </div>

      <Link
        href="/timeline/new"
        aria-label="Tambah kenangan"
        className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose text-white shadow-lg"
      >
        <Plus size={26} />
      </Link>
    </main>
  );
}
