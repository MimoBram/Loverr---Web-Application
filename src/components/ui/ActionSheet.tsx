"use client";

import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export interface ActionSheetItem {
  key: string;
  label: string;
  icon: LucideIcon;
  iconBg: string;
  labelClassName?: string;
  onClick: () => void;
}

interface ActionSheetProps {
  open: boolean;
  title: string;
  items: ActionSheetItem[];
  onClose: () => void;
}

/**
 * Bottom action sheet — matches Figma "Opsi Momen" (252:2) / "Opsi Kuis"
 * (252:31): scrim, rounded-top white sheet with a drag handle, a row per
 * action, and a "Batal" pill to dismiss. Shared so every kebab menu in the
 * app looks and behaves the same way.
 */
export function ActionSheet({ open, title, items, onClose }: ActionSheetProps) {
  const t = useT();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t("quiz.cancel")}
        onClick={onClose}
        className="absolute inset-0 bg-onyx/55"
      />
      <div className="absolute bottom-0 left-0 w-full rounded-t-card-lg bg-card pb-6 pt-3 shadow-[0px_-6px_24px_0px_rgba(26,23,28,0.18)]">
        <div className="mx-auto mb-4 h-[5px] w-11 rounded-[3px] bg-input-stroke" />

        <div className="relative flex items-center justify-center px-5 pb-3">
          <p className="text-[17px] font-bold text-ink">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("quiz.cancel")}
            className="absolute right-5 flex h-8 w-8 items-center justify-center rounded-[16px] bg-surface"
          >
            <X size={16} className="text-ink" />
          </button>
        </div>

        <div className="border-t border-input-stroke">
          {items.map((item, i) => (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              className={cn(
                "flex w-full items-center gap-3 px-6 py-4 text-left",
                i > 0 && "border-t border-input-stroke",
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]",
                  item.iconBg,
                )}
              >
                <item.icon size={18} className="text-white" />
              </span>
              <span
                className={cn(
                  "text-[15px] font-bold",
                  item.labelClassName ?? "text-ink",
                )}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-14 w-full items-center justify-center rounded-pill bg-surface text-[15px] font-bold text-ink"
          >
            {t("quiz.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
