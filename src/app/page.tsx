"use client";

import { useRouter } from "next/navigation";
import { LoverrMark } from "@/components/ui/LoverrMark";
import { Sparkle } from "@/components/ui/Sparkle";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";

/**
 * Splash / Welcome screen — entry point of the app.
 * Matches Figma node 164:4 (GF App — App Design).
 *
 * This app is permanently seeded for exactly one couple (Mimo & Odyy), so
 * there's no registration link here — "Mulai" always leads to Pilih Profil.
 * The shared account is created/signed into silently in the background
 * (see SessionProvider); the button waits for that (`ready`) before
 * navigating so Pilih Profil never renders stale placeholder profiles.
 */
export default function SplashPage() {
  const router = useRouter();
  const { ready } = useSession();
  const t = useT();

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
          {t("splash.tagline")}
        </p>
      </div>

      {/* primary CTA */}
      <button
        onClick={() => ready && router.push("/pilih-profil")}
        disabled={!ready}
        className="absolute left-6 top-[634px] flex h-[60px] w-[327px] items-center justify-center rounded-pill bg-onyx shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)] disabled:opacity-70"
      >
        <span className="text-button text-white">
          {ready ? t("splash.cta.ready") : t("splash.cta.loading")}
        </span>
      </button>
    </main>
  );
}
