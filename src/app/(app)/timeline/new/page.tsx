"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";
import { createEntry, uploadEntryPhoto } from "@/lib/data/entries";
import { resolveCoupleId } from "@/lib/data/auth";

/** New Entry — add a scrapbook card for today (or a chosen date). */
export default function NewEntryPage() {
  const router = useRouter();
  const { activeProfileId } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul kenangan wajib diisi.");
      return;
    }
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
        title: title.trim(),
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
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-heading text-ink">Kenangan Baru</h1>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {photoPreview ? (
        <div className="relative h-40 w-full overflow-hidden rounded-card-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoPreview}
            alt="Pratinjau foto"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={removePhoto}
            aria-label="Hapus foto"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/60 text-white"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-card-lg border-2 border-dashed border-input-stroke bg-white text-muted"
        >
          <Camera size={28} />
          <span className="text-caption">Tambah foto (opsional)</span>
        </button>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Judul"
          placeholder="cth. Piknik di Taman"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Tanggal"
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-label text-ink" htmlFor="caption">
            Cerita singkat
          </label>
          <textarea
            id="caption"
            rows={4}
            placeholder="Apa yang bikin hari ini spesial?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded-input border-2 border-input-stroke bg-white px-4 py-3 text-body-medium text-ink placeholder:text-muted focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
          />
        </div>

        {error && <p className="text-caption text-error">{error}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan…" : "Simpan Kenangan"}
        </Button>
      </form>
    </main>
  );
}
