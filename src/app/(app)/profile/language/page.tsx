"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, useT, type Language } from "@/lib/i18n";

/** Bahasa — matches Figma node 250:28. Both languages are fully live. */
export default function LanguageSettingsPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = useT();

  const LANGUAGES: { key: Language; label: string }[] = [
    { key: "id", label: t("langSettings.id") },
    { key: "en", label: t("langSettings.en") },
  ];

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          aria-label={t("common.back")}
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[19px] font-extrabold text-ink">{t("langSettings.title")}</h1>
      </div>

      <div className="overflow-hidden rounded-[24px] bg-card shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
        {LANGUAGES.map(({ key, label }, i) => (
          <button
            key={key}
            type="button"
            onClick={() => setLang(key)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-4 text-left",
              i > 0 && "border-t border-divider",
            )}
          >
            <div className="flex-1">
              <p className="text-[14px] font-bold text-ink">{label}</p>
            </div>
            {lang === key && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-onyx">
                <Check size={14} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </main>
  );
}
