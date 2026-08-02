"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface ConfirmSheetProps {
  open: boolean;
  icon: LucideIcon;
  iconBg: string;
  title: string;
  description: string;
  confirmLabel: string;
  /** Shown on the confirm button while `confirming` is true. Defaults to `confirmLabel`. */
  confirmingLabel?: string;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Bottom confirm sheet — matches Figma "Konfirmasi Hapus" (278:12): a
 * centered icon, title + body copy, and a stacked pair of full-width
 * buttons (neutral Batal, destructive confirm). Generic on the icon/copy
 * so it can be reused anywhere a destructive action needs confirmation.
 */
export function ConfirmSheet({
  open,
  icon: Icon,
  iconBg,
  title,
  description,
  confirmLabel,
  confirmingLabel,
  confirming,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const t = useT();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t("quiz.cancel")}
        onClick={onCancel}
        className="absolute inset-0 bg-onyx/55"
      />
      <div className="absolute bottom-0 left-0 w-full rounded-t-card-lg bg-card px-6 pb-8 pt-3 shadow-[0px_-6px_24px_0px_rgba(26,23,28,0.18)]">
        <div className="mx-auto mb-5 h-[5px] w-11 rounded-[3px] bg-input-stroke" />

        <div className="flex flex-col items-center gap-4 text-center">
          <span
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              iconBg,
            )}
          >
            <Icon size={28} className="text-white" />
          </span>
          <div>
            <p className="text-[19px] font-extrabold text-ink">{title}</p>
            <p className="mt-2 text-[13.5px] leading-[20px] text-muted">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-14 w-full items-center justify-center rounded-pill bg-surface text-[15px] font-bold text-ink"
          >
            {t("quiz.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="flex h-14 w-full items-center justify-center rounded-pill bg-error text-[15px] font-bold text-white disabled:opacity-60"
          >
            {confirming ? (confirmingLabel ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
