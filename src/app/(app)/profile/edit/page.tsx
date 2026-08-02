"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";

const AVATAR_OPTIONS = ["avatar-1", "avatar-2", "avatar-3", "avatar-4"];

export default function EditProfilePage() {
  const router = useRouter();
  const { profiles, activeProfileId, updateProfile } = useSession();
  const me = profiles.find((p) => p.id === activeProfileId);

  const [name, setName] = useState(me?.display_name ?? "");
  const [avatarKey, setAvatarKey] = useState(me?.avatar_key ?? "avatar-1");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    if (!activeProfileId) return;

    updateProfile(activeProfileId, { display_name: name.trim(), avatar_key: avatarKey });
    setSaved(true);
    setTimeout(() => router.push("/profile"), 600);
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
        <h1 className="text-heading text-ink">Edit Profil</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          {AVATAR_OPTIONS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setAvatarKey(key)}
              className={cn(
                "rounded-full transition-transform",
                avatarKey === key && "scale-110 ring-2 ring-rose ring-offset-2",
              )}
              aria-label={`Pilih avatar ${key}`}
            >
              <Avatar avatarKey={key} name={name || "?"} size="sm" />
            </button>
          ))}
        </div>

        <Input label="Nama" value={name} onChange={(e) => setName(e.target.value)} />

        {error && <p className="text-caption text-error">{error}</p>}
        {saved && <p className="text-caption text-ink">Tersimpan!</p>}

        <Button type="submit">Simpan Perubahan</Button>
      </form>
    </main>
  );
}
