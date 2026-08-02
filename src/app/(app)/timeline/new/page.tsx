"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, Calendar, X } from "lucide-react";
import { useSession } from "@/lib/session";
import { createEntry, uploadEntryPhoto } from "@/lib/data/entries";
import { resolveCoupleId } from "@/lib/data/auth";
import { cn } from "@/lib/utils";

const PRESET_TAGS = ["Liburan", "Momen Spesial", "Harian", "Kejutan"];
const MOODS = [
  { key: "senang", emoji: "😊", color: "bg-coral" },
  { key: "santai", emoji: "😌", color: "bg-violet" },
  { key: "seru", emoji: "😉", color: "bg-[#b08a3e]" },
  { key: "sayang", emoji: "🩷", color: "bg-periwinkle" },
];

function deriveTitle(caption: string) {
  const firstLine = caption.split("\n")[0].trim();
  if (!firstLine) return "Kenangan baru";
  return firstLine.length > 60 ? `${firstLine.slice(0, 57)}...` : firstLine;
}

/** New Entry — matches Figma node 169:3. */
export default function NewEntryPage() {
  const router = useRouter();
  const { activeProfileId } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [caption, setCaption] = useState("");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Liburan",
    "Momen Spesial",
  ]);
  const [visibleTags, setVisibleTags] = useState(PRESET_TAGS.slice(0, 2));
  const [mood, setMood] = useState<string | null>("senang");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function addMoreTags() {
    const next = PRESET_TAGS.filter((t) => !visibleTags.includes(t));
    if (next.length > 0) setVisibleTags((prev) => [...prev, next[0]]);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto(e: React.MouseEvent) {
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function formatDateLabel(iso: string) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeProfileId) return;

    setError(null);
    setSaving(true);

    try {
      const coupleId = await resolveCoupleId();
      const entryId = `entry-${Date.now()}`;

      let photoPath: string | null = null;
      if (photoFile) {
        photoPath = await uploadEntryPhoto(photoFile, coupleId, entryId);
      }

      await createEntry({
        id: entryId,
        couple_id: coupleId,
        author_profile_id: activeProfileId,
        title: deriveTitle(caption),
        caption: caption.trim() || null,
        photo_path: photoPath,
        entry_date: entryDate,
      });

      router.push("/timeline");
    } catch {
      setError("Gagal menyimpan kenangan. Coba lagi.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-screen flex-col gap-6 px-5 pb-28 pt-5"
    >
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[20px] font-extrabold text-ink">Entri Baru</h1>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative flex h-[200px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[28px] border-2 border-dashed border-ink bg-white"
      >
        {photoPreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoPreview}
              alt="Pratinjau foto"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              onClick={removePhoto}
              role="button"
              aria-label="Hapus foto"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink/60 text-white"
            >
              <X size={16} />
            </span>
          </>
        ) : (
          <>
            <div className="h-[37.4px] w-[68px] rounded-[8px] border-[2.2px] border-ink" />
            <p className="text-[13px] font-semibold text-muted">
              Ketuk untuk tambah foto
            </p>
          </>
        )}
      </button>

      <div className="flex flex-col gap-3">
        <p className="text-[13.5px] font-bold text-subtle">CERITA SINGKAT</p>
        <textarea
          rows={4}
          placeholder="Tulis cerita singkat tentang momen ini..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="h-[100px] w-full rounded-input border-[1.5px] border-divider bg-white px-4 py-3 text-body text-ink shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)] placeholder:text-subtle focus:border-rose focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[13.5px] font-bold text-subtle">TAG MOMEN</p>
        <div className="flex flex-wrap items-center gap-2">
          {visibleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "h-[38px] rounded-pill px-4 text-[13.5px] font-semibold",
                selectedTags.includes(tag)
                  ? "bg-ink text-white"
                  : "border border-divider bg-white text-ink",
              )}
            >
              {tag}
            </button>
          ))}
          <button
            type="button"
            onClick={addMoreTags}
            aria-label="Tambah tag"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-squircle border border-divider bg-white shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]"
          >
            <Plus size={16} className="text-ink" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[13.5px] font-bold text-subtle">TANGGAL</p>
        <label className="relative flex h-[52px] w-full items-center gap-3 rounded-input border-[1.5px] border-divider bg-white px-4 shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
          <Calendar size={18} className="text-ink" />
          <span className="text-[13.5px] font-semibold text-ink">
            {formatDateLabel(entryDate)}
          </span>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[13.5px] font-bold text-subtle">MOOD</p>
        <div className="flex items-center gap-3">
          {MOODS.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMood(m.key)}
              aria-label={m.key}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full text-[20px]",
                m.color,
                mood === m.key && "ring-2 ring-ink ring-offset-2",
              )}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-caption text-error">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="fixed bottom-6 left-5 right-5 mx-auto flex h-16 w-[calc(100%-40px)] max-w-[335px] items-center justify-center rounded-[32px] bg-ink text-[15px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)] disabled:opacity-60"
      >
        {saving ? "Menyimpan…" : "Simpan Entri"}
      </button>
    </form>
  );
}
