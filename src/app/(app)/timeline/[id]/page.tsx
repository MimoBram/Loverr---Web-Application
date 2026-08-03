"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft,
  MoreHorizontal,
  Share2,
  Star,
  BookHeart,
  Trash2,
} from "lucide-react";
import { getEntry, deleteEntry, setEntryFavorite } from "@/lib/data/entries";
import { getMoodEmoji } from "@/lib/moods";
import { ActionSheet, type ActionSheetItem } from "@/components/ui/ActionSheet";
import { ConfirmSheet } from "@/components/ui/ConfirmSheet";
import { useT, useLanguage } from "@/lib/i18n";
import { errorMessage } from "@/lib/utils";
import type { ScrapbookEntry } from "@/lib/supabase/types";

const CARD_COLORS = ["bg-coral", "bg-violet", "bg-periwinkle"] as const;

/** Entry Detail — matches Figma node 169:38. */
export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const t = useT();
  const { lang } = useLanguage();

  function formatDate(iso: string) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const [entry, setEntry] = useState<ScrapbookEntry | null | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

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
    } catch (err) {
      console.error("deleteEntry failed:", err);
      setShareStatus(`${t("entryDetail.deleteError")} (${errorMessage(err)})`);
      setTimeout(() => setShareStatus(null), 5000);
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  async function handleToggleFavorite() {
    if (!entry) return;
    setOptionsOpen(false);
    const next = !entry.is_favorite;
    setEntry({ ...entry, is_favorite: next }); // optimistic
    try {
      await setEntryFavorite(entry.id, next);
    } catch (err) {
      console.error("setEntryFavorite failed:", err);
      setEntry({ ...entry, is_favorite: !next }); // revert on failure
    }
  }

  async function handleShare() {
    if (!entry) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${entry.title} — ${formatDate(entry.entry_date)}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: entry.title, text, url });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareStatus(t("entryDetail.shareCopied"));
        setTimeout(() => setShareStatus(null), 2500);
      }
    } catch {
      // User cancelled the native share sheet — nothing to do.
    }
    setOptionsOpen(false);
  }

  const momenOptions: ActionSheetItem[] = entry
    ? [
        {
          key: "share",
          label: t("entryDetail.share"),
          icon: Share2,
          iconBg: "bg-coral",
          onClick: handleShare,
        },
        {
          key: "favorite",
          label: entry.is_favorite ? t("entryDetail.favoriteOn") : t("entryDetail.favoriteOff"),
          icon: Star,
          iconBg: "bg-rose",
          onClick: handleToggleFavorite,
        },
        {
          key: "timeline",
          label: t("entryDetail.viewTimeline"),
          icon: BookHeart,
          iconBg: "bg-onyx",
          onClick: () => {
            setOptionsOpen(false);
            router.push("/timeline");
          },
        },
      ]
    : [];

  if (entry === undefined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">{t("entryDetail.loading")}</p>
      </main>
    );
  }

  if (entry === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">
          {t("entryDetail.notFound")}
        </p>
        <button
          onClick={() => router.push("/timeline")}
          className="text-label text-rose"
        >
          {t("entryDetail.backToScrapbook")}
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
          aria-label={t("common.back")}
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[20px] font-extrabold text-ink">{t("entryDetail.title")}</h1>
        <button
          aria-label={t("entryDetail.opsiMomen")}
          onClick={() => setOptionsOpen(true)}
          className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-squircle border border-divider bg-card shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]"
        >
          <MoreHorizontal size={18} className="text-ink" />
        </button>
      </div>

      {shareStatus && (
        <p className="rounded-input bg-surface px-4 py-2 text-center text-caption text-ink">
          {shareStatus}
        </p>
      )}

      <div className="relative">
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
        {entry.is_favorite && (
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
            <Star size={16} className="fill-rose text-rose" />
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-[22px] font-extrabold leading-tight text-ink">
            {entry.title}
          </h2>
          {getMoodEmoji(entry.mood) && (
            <span className="text-[20px]" aria-label={t("entryDetail.moodAria", { mood: entry.mood ?? "" })}>
              {getMoodEmoji(entry.mood)}
            </span>
          )}
        </div>
        <p className="mt-2 text-[12.5px] font-medium text-muted">
          {formatDate(entry.entry_date)}
        </p>
        {entry.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-pill border border-divider bg-card px-3 py-1 text-[12px] font-semibold text-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {entry.caption && (
        <div className="flex flex-col gap-2">
          <p className="text-[13.5px] font-bold text-subtle">{t("entryDetail.story")}</p>
          <p className="text-body leading-[21px] text-muted">{entry.caption}</p>
        </div>
      )}

      <div className="fixed bottom-28 left-5 right-5 z-30 mx-auto flex max-w-[335px] gap-3.5">
        <Link
          href={`/timeline/new?edit=${entry.id}`}
          className="flex h-16 flex-1 items-center justify-center rounded-[32px] border-2 border-ink bg-card text-[14.5px] font-bold text-ink shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]"
        >
          {t("entryDetail.edit")}
        </Link>
        <button
          onClick={() => setConfirmOpen(true)}
          className="flex h-16 flex-1 items-center justify-center rounded-[32px] bg-onyx text-[14.5px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
        >
          {t("entryDetail.delete")}
        </button>
      </div>

      <ActionSheet
        open={optionsOpen}
        title={t("entryDetail.opsiMomen")}
        items={momenOptions}
        onClose={() => setOptionsOpen(false)}
      />

      <ConfirmSheet
        open={confirmOpen}
        icon={Trash2}
        iconBg="bg-error"
        title={t("entryDetail.confirmTitle")}
        description={t("entryDetail.confirmDesc")}
        confirmLabel={t("entryDetail.confirmYes")}
        confirmingLabel={t("entryDetail.deleting")}
        confirming={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
}
