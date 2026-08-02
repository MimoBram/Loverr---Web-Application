"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, Smile, MessageCircle } from "lucide-react";
import { useSession } from "@/lib/session";
import { createNote, listNotes } from "@/lib/data/notes";
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
  const { activeProfileId } = useSession();
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
      setError("Tulis sesuatu dulu sebelum dikirim.");
      return;
    }
    if (!activeProfileId) return;

    setError(null);
    setSaving(true);

    try {
      await createNote({
        author_profile_id: activeProfileId,
        content: content.trim(),
      });
      router.push("/notes");
    } catch {
      setError("Gagal mengirim note. Coba lagi.");
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[19px] font-extrabold text-ink">Balas Catatan</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="absolute right-0 flex h-10 items-center justify-center rounded-pill bg-ink px-5 text-[12.5px] font-bold text-white disabled:opacity-60"
        >
          {saving ? "…" : "Kirim"}
        </button>
      </div>

      {fromPartner && (
        <div className="relative overflow-hidden rounded-[24px] bg-coral py-4 pl-5 pr-4">
          <div className="absolute left-0 top-0 h-full w-[5px] bg-ink" />
          <p className="text-[12.5px] font-bold text-ink">Dari pasanganmu</p>
          <p className="mt-1 text-[13px] leading-[19px] text-ink/90">
            {fromPartner.content}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3">
        <p className="text-[13.5px] font-bold text-subtle">TULIS BALASAN</p>
        <textarea
          autoFocus
          placeholder="Tulis balasan untuk pasanganmu..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-[320px] w-full rounded-[24px] border-[1.5px] border-divider bg-white px-4 py-3.5 text-body text-ink shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)] placeholder:text-subtle focus:border-rose focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[13.5px] font-bold text-subtle">REAKSI CEPAT</p>
        <div className="flex items-center gap-2.5">
          {QUICK_REACTIONS.map(({ icon: Icon, insert }, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setContent((prev) => prev + insert)}
              className="flex h-11 w-11 items-center justify-center rounded-squircle border border-divider bg-white shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]"
            >
              <Icon size={18} className="text-ink" />
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-caption text-error">{error}</p>}

      <p className="text-center text-[13px] text-muted">
        Balasan akan langsung terkirim ke pasanganmu 💌
      </p>
    </main>
  );
}
