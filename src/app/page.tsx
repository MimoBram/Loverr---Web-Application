"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/session";

/** Splash / Welcome screen — entry point of the app. */
export default function SplashPage() {
  const router = useRouter();
  const { hasCompletedSetup } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-cream px-6 pb-10 pt-20">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-squircle bg-rose shadow-lg">
          <Heart size={44} className="fill-white text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-display text-ink">Loverr</h1>
          <p className="text-body-medium text-muted">
            Scrapbook &amp; ruang kenangan pribadi untuk kalian berdua.
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-[335px] flex-col gap-3">
        {hasCompletedSetup ? (
          <Button onClick={() => router.push("/pilih-profil")}>
            Masuk
          </Button>
        ) : (
          <>
            <Button onClick={() => router.push("/setup-awal")}>
              Mulai Sekarang
            </Button>
            <p className="text-caption text-muted">
              Untuk kamu dan pasanganmu — cukup dibuat sekali di awal.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
