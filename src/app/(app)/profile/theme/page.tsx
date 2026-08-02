"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES: { key: string; label: string; desc: string; disabled?: boolean }[] = [
  { key: "light", label: "Terang", desc: "Tampilan cerah default Loverr" },
  { key: "dark", label: "Gelap", desc: "Segera hadir", disabled: true },
];

/** Tema Tampilan — matches Figma node 250:2. */
export default function ThemeSettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<string>("light");

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[19px] font-extrabold text-ink">Tema Tampilan</h1>
      </div>

      <div className="overflow-hidden rounded-[24px] bg-white shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
        {THEMES.map(({ key, label, desc, disabled }, i) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => setTheme(key)}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-4 text-left",
              i > 0 && "border-t border-divider",
              disabled && "opacity-50",
            )}
          >
            <div className="flex-1">
              <p className="text-[14px] font-bold text-ink">{label}</p>
              <p className="text-caption text-muted">{desc}</p>
            </div>
            {theme === key && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ink">
                <Check size={14} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </main>
  );
}
