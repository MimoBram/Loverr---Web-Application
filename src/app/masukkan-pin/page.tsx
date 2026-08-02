"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Delete } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const PIN_LENGTH = 4;
const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

function MasukkanPinInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get("profile");
  const { profiles, setActiveProfileId, verifyPin } = useSession();

  const profile = profiles.find((p) => p.id === profileId);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleKey(key: string) {
    setError(false);
    if (key === "back") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (!key || pin.length >= PIN_LENGTH) return;

    const next = pin + key;
    setPin(next);

    if (next.length === PIN_LENGTH) {
      if (profileId && verifyPin(profileId, next)) {
        setActiveProfileId(profileId);
        router.push("/home");
      } else {
        setError(true);
        setTimeout(() => {
          setPin("");
        }, 400);
      }
    }
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
        <p className="text-body-medium text-muted">
          Profil tidak ditemukan.
        </p>
        <button
          onClick={() => router.push("/pilih-profil")}
          className="text-label text-rose"
        >
          Kembali ke Pilih Profil
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-cream px-6 pt-16">
      <div className="flex flex-col items-center gap-3">
        <Avatar avatarKey={profile.avatar_key} name={profile.display_name} size="lg" />
        <h1 className="text-heading text-ink">Hai, {profile.display_name}</h1>
        <p className="text-body-medium text-muted">Masukkan PIN kamu</p>
      </div>

      <div className={cn("flex gap-3", error && "animate-pulse")}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-4 w-4 rounded-full border-2",
              i < pin.length
                ? error
                  ? "border-error bg-error"
                  : "border-rose bg-rose"
                : "border-input-stroke bg-transparent",
            )}
          />
        ))}
      </div>
      {error && (
        <p className="-mt-4 text-caption text-error">
          PIN salah, coba lagi.
        </p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {KEYPAD.map((key, i) =>
          key === "" ? (
            <div key={i} />
          ) : key === "back" ? (
            <button
              key={i}
              onClick={() => handleKey(key)}
              aria-label="Hapus"
              className="flex h-16 w-16 items-center justify-center rounded-full text-ink active:bg-surface"
            >
              <Delete size={22} />
            </button>
          ) : (
            <button
              key={i}
              onClick={() => handleKey(key)}
              className="flex h-16 w-16 items-center justify-center rounded-full text-heading text-ink active:bg-surface"
            >
              {key}
            </button>
          ),
        )}
      </div>
    </main>
  );
}

export default function MasukkanPinPage() {
  return (
    <Suspense fallback={null}>
      <MasukkanPinInner />
    </Suspense>
  );
}
