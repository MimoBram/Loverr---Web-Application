"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { useSession } from "@/lib/session";

/** Pilih Profil — choose which partner is using the device right now. */
export default function PilihProfilPage() {
  const router = useRouter();
  const { profiles, coupleName, ready, bootstrapError } = useSession();

  // Wait for the silent shared-account bootstrap before rendering real
  // profile ids — otherwise a tap here could carry a stale mock id into
  // Masukkan PIN and fail verification against the real backend.
  if (!ready) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center">
        <p className="text-body-medium text-muted">Menyiapkan ruang kenangan…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 bg-cream px-6 pt-20">
      <div className="text-center">
        <h1 className="text-heading text-ink">Siapa yang masuk?</h1>
        <p className="text-body-medium text-muted">{coupleName}</p>
      </div>

      {bootstrapError && (
        <p className="max-w-[300px] text-center text-caption text-error">
          Gagal menyiapkan akun bersama: {bootstrapError}. PIN mungkin belum
          ter-update — coba refresh halaman ini.
        </p>
      )}

      <div className="flex gap-6">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() =>
              router.push(`/masukkan-pin?profile=${profile.id}`)
            }
            className="flex flex-col items-center gap-3 rounded-card-lg p-4 transition-transform active:scale-95"
          >
            <Avatar avatarKey={profile.avatar_key} name={profile.display_name} size="lg" />
            <span className="text-card-title text-ink">
              {profile.display_name}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
