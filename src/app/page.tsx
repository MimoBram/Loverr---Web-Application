"use client";

import { useRouter } from "next/navigation";
import { LoverrMark } from "@/components/ui/LoverrMark";
import { Sparkle } from "@/components/ui/Sparkle";
import { useSession } from "@/lib/session";

/**
 * Splash / Welcome screen — entry point of the app.
 * Matches Figma node 164:4 (GF App — App Design).
 */
export default function SplashPage() {
  const router = useRouter();
  const { hasCompletedSetup } = useSession();

  const primaryHref = hasCompletedSetup ? "/pilih-profil" : "/setup-awal";

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-rose">
      {/* decorative blobs */}
      <div className="absolute -left-20 top-[480px] h-[260px] w-[260px] rounded-full bg-black/10" />
      <div className="absolute left-[240px] -top-[60px] h-[220px] w-[220px] rounded-full bg-white/15" />

      {/* scattered sparkles */}
      <Sparkle className="absolute left-[50px] top-[120px] text-white/80" size={20} />
      <Sparkle className="absolute left-[306px] top-[186px] text-white/70" size={28} />
      <Sparkle className="absolute left-[290px] top-[610px] text-white/80" size={20} />
      <Sparkle className="absolute left-[42px] top-[552px] text-white/60" size={16} />

      {/* logo mark */}
      <div className="absolute left-1/2 top-[225px] flex h-[190px] w-[190px] -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-lg">
        <LoverrMark className="h-20 w-20 text-soft-pink" size={80} />
      </div>

      {/* wordmark + tagline */}
      <div className="absolute left-1/2 top-[460px] w-full -translate-x-1/2 text-center">
        <h1 className="text-display text-white">Loverr</h1>
        <p className="mt-1 text-body-medium text-white">
          Ruang kenangan berdua, tiap hari
        </p>
      </div>

      {/* primary CTA */}
      <button
        onClick={() => router.push(primaryHref)}
        className="absolute left-6 top-[634px] flex h-[60px] w-[327px] items-center justify-center rounded-pill bg-ink shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
      >
        <span className="text-button text-white">Mulai</span>
      </button>

      {hasCompletedSetup && (
        <button
          onClick={() => router.push("/setup-awal")}
          className="absolute left-1/2 top-[712px] -translate-x-1/2 whitespace-nowrap text-[13.5px] text-white"
        >
          Baru pertama kali?{" "}
          <span className="font-bold">Setup Awal</span>
        </button>
      )}
    </main>
  );
}
