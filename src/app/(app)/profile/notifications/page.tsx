"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const TOGGLES = [
  { key: "entries", label: "Kenangan baru", desc: "Saat pasanganmu menambah kenangan baru" },
  { key: "notes", label: "Catatan baru", desc: "Saat pasanganmu mengirim catatan" },
  { key: "quiz", label: "Quiz mingguan", desc: "Pengingat untuk menjawab quiz" },
] as const;

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex h-7 w-12 items-center rounded-pill px-1 transition-colors",
        checked ? "bg-ink justify-end" : "bg-divider justify-start",
      )}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow" />
    </button>
  );
}

/** Pengaturan Notifikasi — matches Figma node 249:26. */
export default function NotificationSettingsPage() {
  const router = useRouter();
  const [state, setState] = useState<Record<string, boolean>>({
    entries: true,
    notes: true,
    quiz: true,
  });

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
        <h1 className="text-[19px] font-extrabold text-ink">Notifikasi</h1>
      </div>

      <div className="overflow-hidden rounded-[24px] bg-white shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
        {TOGGLES.map(({ key, label, desc }, i) => (
          <div
            key={key}
            className={cn(
              "flex items-center gap-3 px-4 py-4",
              i > 0 && "border-t border-divider",
            )}
          >
            <div className="flex-1">
              <p className="text-[14px] font-bold text-ink">{label}</p>
              <p className="text-caption text-muted">{desc}</p>
            </div>
            <Switch
              checked={state[key]}
              onChange={() => setState((s) => ({ ...s, [key]: !s[key] }))}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
