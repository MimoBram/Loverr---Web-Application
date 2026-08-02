"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ImageOff, MoreVertical } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useSession } from "@/lib/session";
import { getEntry } from "@/lib/data/entries";
import type { ScrapbookEntry } from "@/lib/supabase/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { profiles } = useSession();

  const [entry, setEntry] = useState<ScrapbookEntry | null | undefined>(undefined);

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

  const author = profiles.find((p) => p.id === entry.author_profile_id);

  return (
    <main className="flex flex-col gap-5 pb-10">
      {entry.photo_path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.photo_path}
          alt={entry.title}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="flex h-64 w-full items-center justify-center bg-surface">
          <ImageOff size={36} className="text-muted" />
        </div>
      )}

      <div className="flex items-center justify-between px-5">
        <button
          onClick={() => router.push("/timeline")}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <button
          aria-label="Menu lainnya"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <MoreVertical size={20} className="text-ink" />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-5">
        <div>
          <h1 className="text-heading text-ink">{entry.title}</h1>
          <p className="text-caption text-muted">{formatDate(entry.entry_date)}</p>
        </div>

        {entry.caption && (
          <p className="text-body-medium text-ink">{entry.caption}</p>
        )}

        {author && (
          <div className="flex items-center gap-2 pt-2">
            <Avatar avatarKey={author.avatar_key} name={author.display_name} size="sm" />
            <p className="text-caption text-muted">
              Ditulis oleh {author.display_name}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
