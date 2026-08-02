"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/session";
import { createNote } from "@/lib/data/notes";

/** Note Compose — write a short note for your partner. */
export default function NoteComposePage() {
  const router = useRouter();
  const { activeProfileId } = useSession();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-heading text-ink">Note Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
        <textarea
          autoFocus
          rows={8}
          placeholder="Tulis sesuatu yang manis untuk pasanganmu..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full flex-1 rounded-card-lg border-2 border-input-stroke bg-white px-4 py-3 text-body-medium text-ink placeholder:text-muted focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
        />
        {error && <p className="text-caption text-error">{error}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? "Mengirim…" : "Kirim Note"}
        </Button>
      </form>
    </main>
  );
}
