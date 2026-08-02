"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { listEntries } from "@/lib/data/entries";
import type { ScrapbookEntry } from "@/lib/supabase/types";

const CARD_COLORS = ["bg-coral", "bg-violet", "bg-periwinkle"] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Scrapbook Timeline — matches Figma node 167:3. */
export default function TimelinePage() {
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

  return (
    <main className="flex flex-col gap-6 px-5 pt-7">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold leading-none text-ink">
            Scrapbook
          </h1>
          <p className="mt-2 text-[12.5px] font-medium text-muted">
            {entries.length} momen tersimpan
          </p>
        </div>
        <Link
          href="/timeline/new"
          aria-label="Tambah kenangan"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-squircle bg-ink shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
        >
          <Plus size={22} className="text-white" />
        </Link>
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
        <div className="rounded-card-lg bg-surface p-5">
          <p className="text-body-medium text-ink">
            Belum ada kenangan tersimpan. Tap tombol + untuk mulai.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 pb-6">
        {entries.map((entry, i) => (
          <Link
            key={entry.id}
            href={`/timeline/${entry.id}`}
            className={`relative block h-[240px] w-full overflow-hidden rounded-card-lg ${
              CARD_COLORS[i % CARD_COLORS.length]
            }`}
          >
            <div className="absolute -right-2 bottom-[-40px] h-[220px] w-[220px] rounded-full bg-white/10" />

            {entry.photo_path ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.photo_path}
                alt={entry.title}
                className="absolute left-4 right-4 top-4 h-[130px] rounded-[16px] object-cover"
              />
            ) : (
              <div className="absolute left-[122.5px] top-[75px] h-[48.4px] w-[88px] rounded-[11px] border-[2.2px] border-ink" />
            )}

            <div className="absolute left-[15px] top-[171px] flex h-[52px] w-[303px] flex-col justify-center rounded-[20px] bg-white px-4">
              <p className="truncate text-[14.5px] font-extrabold text-ink">
                {entry.title}
              </p>
              <p className="text-[12.5px] font-medium text-ink">
                {formatDate(entry.entry_date)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/timeline/new"
        aria-label="Tambah kenangan"
        className="fixed bottom-28 right-6 flex h-16 w-16 items-center justify-center rounded-squircle bg-ink shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
      >
        <Plus size={26} className="text-white" />
      </Link>
    </main>
  );
}
