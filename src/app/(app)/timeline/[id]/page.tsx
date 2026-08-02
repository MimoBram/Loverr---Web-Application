"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { getEntry, deleteEntry } from "@/lib/data/entries";
import type { ScrapbookEntry } from "@/lib/supabase/types";

const CARD_COLORS = ["bg-coral", "bg-violet", "bg-periwinkle"] as const;

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Entry Detail — matches Figma node 169:38. */
export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [entry, setEntry] = useState<ScrapbookEntry | null | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getEntry(params.id)
      .then((data) => {
        if (!cancelled) setEntry(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setEntry(null);
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function handleDelete() {
    if (!entry) return;
    setDeleting(true);
    try {
      await deleteEntry(entry.id);
      router.push("/timeline");
    } catch {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (entry === undefined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">Memuat kenangan…</p>
      </main>
    );
  }

  if (entry === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">
          Kenangan tidak ditemukan.
        </p>
        <button
          onClick={() => router.push("/timeline")}
          className="text-label text-rose"
        >
          Kembali ke Scrapbook
        </button>
      </main>
    );
  }

  const cardColor = CARD_COLORS[entry.id.length % CARD_COLORS.length];

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-28 pt-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.push("/timeline")}
          aria-label="Kembali"
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[20px] font-extrabold text-ink">Detail Momen</h1>
        <button
          aria-label="Menu lainnya"
          onClick={() => setConfirmOpen(true)}
          className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-squircle border border-divider bg-white shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]"
        >
          <MoreHorizontal size={18} className="text-ink" />
        </button>
      </div>

      {entry.photo_path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.photo_path}
          alt={entry.title}
          className="h-[260px] w-full rounded-card-lg object-cover"
        />
      ) : (
        <div className={`h-[260px] w-full rounded-card-lg ${cardColor}`} />
      )}

      <div>
        <h2 className="text-[22px] font-extrabold leading-tight text-ink">
          {entry.title}
        </h2>
        <p className="mt-2 text-[12.5px] font-medium text-muted">
          {formatDate(entry.entry_date)}
        </p>
      </div>

      {entry.caption && (
        <div className="flex flex-col gap-2">
          <p className="text-[13.5px] font-bold text-subtle">CERITA</p>
          <p className="text-body leading-[21px] text-muted">{entry.caption}</p>
        </div>
      )}

      <div className="fixed bottom-6 left-5 right-5 mx-auto flex max-w-[335px] gap-3.5">
        <Link
          href="/timeline/new"
          className="flex h-16 flex-1 items-center justify-center rounded-[32px] border-2 border-ink bg-white text-[14.5px] font-bold text-ink shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]"
        >
          Edit
        </Link>
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex h-16 flex-1 items-center justify-center rounded-[32px] bg-ink text-[14.5px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
        >
          Hapus
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 px-5 pb-8">
          <div className="w-full max-w-[335px] rounded-card-lg bg-white p-6 shadow-lg">
            <p className="text-heading text-ink">Hapus kenangan ini?</p>
            <p className="mt-2 text-body-medium text-muted">
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-pill border-2 border-ink text-label text-ink"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex h-12 flex-1 items-center justify-center rounded-pill bg-error text-label text-white disabled:opacity-60"
              >
                {deleting ? "Menghapus…" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
