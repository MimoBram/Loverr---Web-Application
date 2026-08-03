"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { cn, errorMessage } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";

const AVATAR_OPTIONS = ["avatar-1", "avatar-2", "avatar-3", "avatar-4"];

export default function EditProfilePage() {
  const router = useRouter();
  const { profiles, activeProfileId, updateProfile } = useSession();
  const t = useT();
  const me = profiles.find((p) => p.id === activeProfileId);

  const [name, setName] = useState(me?.display_name ?? "");
  const [avatarKey, setAvatarKey] = useState(me?.avatar_key ?? "avatar-1");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("editProfile.nameEmpty"));
      return;
    }
    if (!activeProfileId) return;

    try {
      await updateProfile(activeProfileId, { display_name: name.trim(), avatar_key: avatarKey });
      setSaved(true);
      setTimeout(() => router.push("/profile"), 600);
    } catch (err) {
      console.error("updateProfile failed:", err);
      setError(`${t("editProfile.saveError")} (${errorMessage(err)})`);
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label={t("common.back")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-heading text-ink">{t("editProfile.title")}</h1>
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
              aria-label={t("editProfile.chooseAvatar", { key })}
            >
              <Avatar avatarKey={key} name={name || "?"} size="sm" />
            </button>
          ))}
        </div>

        <Input label={t("editProfile.nameLabel")} value={name} onChange={(e) => setName(e.target.value)} />

        {error && <p className="text-caption text-error">{error}</p>}
        {saved && <p className="text-caption text-ink">{t("editProfile.saved")}</p>}

        <Button type="submit">{t("editProfile.save")}</Button>

        <Link href="/profile/pin" className="text-center text-label text-rose">
          {t("profile.changePin")}
        </Link>
      </form>
    </main>
  );
}
