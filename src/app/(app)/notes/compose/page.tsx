"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Smile, MessageCircle } from "lucide-react";
import { useSession } from "@/lib/session";
import { createNote, listNotes } from "@/lib/data/notes";
import { createNotification } from "@/lib/data/notifications";
import { useT } from "@/lib/i18n";
import type { Note } from "@/lib/supabase/types";

function ExclaimIcon({ className }: { size?: number; className?: string }) {
  return <span className={`text-[18px] font-bold ${className ?? ""}`}>!</span>;
}

const QUICK_REACTIONS = [
  { icon: Heart, insert: "❤️ " },
  { icon: Smile, insert: "😊 " },
  { icon: ExclaimIcon, insert: "Wah! " },
  { icon: MessageCircle, insert: "" },
];

/** Note Compose / Reply — matches Figma node 171:3. */
export default function NoteComposePage() {
  const router = useRouter();
  const { activeProfileId, profiles } = useSession();
  const t = useT();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fromPartner, setFromPartner] = useState<Note | null>(null);

  useEffect(() => {
    let cancelled = false;
    listNotes().then((notes) => {
      if (cancelled) return;
      const latest = notes.find((n) => n.author_profile_id !== activeProfileId);
      setFromPartner(latest ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [activeProfileId]);

  async function handleSubmit() {
    if (!content.trim()) {
      setError(t("noteCompose.emptyError"));
      return;
    }
    if (!activeProfileId) return;

    setError(null);
    setSaving(true);

    try {
      const trimmed = content.trim();
      await createNote({
        author_profile_id: activeProfileId,
        content: trimmed,
      });

      const author = profiles.find((p) => p.id === activeProfileId);
      createNotification({
        type: "new_note",
        title: t("noteCompose.notifTitle", { name: author?.display_name ?? t("common.partner") }),
        body: trimmed.length > 80 ? `${trimmed.slice(0, 77)}...` : trimmed,
      }).catch(() => {
        // Non-critical — the note itself already saved successfully.
      });

      router.push("/notes");
    } catch {
      setError(t("noteCompose.error"));
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-28 pt-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          aria-label={t("common.back")}
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[19px] font-extrabold text-ink">{t("noteCompose.title")}</h1>
      </div>

      {fromPartner && (
        <div className="relative overflow-hidden rounded-[24px] bg-coral py-4 pl-5 pr-4">
          <div className="absolute left-0 top-0 h-full w-[5px] bg-onyx" />
          <p className="text-[12.5px] font-bold text-onyx">{t("noteCompose.from")}</p>
          <p className="mt-1 text-[13px] leading-[19px] text-onyx/90">
            {fromPartner.content}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3">
        <p className="text-[13.5px] font-bold text-subtle">{t("noteCompose.writeReplyLabel")}</p>
        <textarea
          autoFocus
          placeholder={t("noteCompose.placeholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-[320px] w-full rounded-[24px] border-[1.5px] border-divider bg-card px-4 py-3.5 text-body text-ink shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)] placeholder:text-subtle focus:border-rose focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[13.5px] font-bold text-subtle">{t("noteCompose.quickReactionsLabel")}</p>
        <div className="flex items-center gap-2.5">
          {QUICK_REACTIONS.map(({ icon: Icon, insert }, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setContent((prev) => prev + insert)}
              className="flex h-11 w-11 items-center justify-center rounded-squircle border border-divider bg-card shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]"
            >
              <Icon size={18} className="text-ink" />
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-caption text-error">{error}</p>}

      <p className="text-center text-[13px] text-muted">
        {t("noteCompose.footer")}
      </p>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="fixed bottom-28 left-5 right-5 z-30 mx-auto flex h-16 w-[calc(100%-40px)] max-w-[335px] items-center justify-center rounded-[32px] bg-onyx text-[15px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)] disabled:opacity-60"
      >
        {saving ? t("noteCompose.sending") : t("noteCompose.send")}
      </button>
    </main>
  );
}
