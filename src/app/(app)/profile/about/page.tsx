"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function AboutPage() {
  const router = useRouter();
  const t = useT();

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
        <h1 className="text-heading text-ink">{t("about.title")}</h1>
      </div>

      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-squircle bg-rose">
          <Heart size={28} className="fill-white text-white" />
        </div>
        <p className="text-card-title text-ink">{t("about.appName")}</p>
        <p className="text-caption text-muted">{t("about.version")}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-card-lg bg-card p-4 text-body-medium text-ink shadow-sm">
        <p>
          {t("about.description")}
        </p>
        <p className="text-caption text-muted">
          {t("about.builtWith")}
        </p>
      </div>
    </main>
  );
}
