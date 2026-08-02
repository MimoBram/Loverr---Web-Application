import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardColor = "coral" | "violet" | "periwinkle" | "surface" | "white";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  color?: CardColor;
}

const colorClasses: Record<CardColor, string> = {
  coral: "bg-coral",
  violet: "bg-violet",
  periwinkle: "bg-periwinkle",
  surface: "bg-surface",
  white: "bg-white",
};

/**
 * Bright accent card (Coral / Violet / Periwinkle / Surface / White).
 *
 * Accessibility rule locked in from the WCAG audit — do NOT deviate:
 * on the three bright colors, only large/bold titles (`CardTitle`) may be
 * white. All secondary/meta text (`CardMeta`) must render in Ink, not
 * white — that combination previously failed contrast and was fixed by
 * an ink-swap, not by adding scrim/overlay elements. Never add a scrim
 * chip behind card text as a "fix" for this.
 */
export function Card({ color = "surface", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card-lg p-5 shadow-sm",
        colorClasses[color],
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-card-title text-white", className)}
      {...props}
    />
  );
}

/** Secondary/meta text on a bright card — always Ink, never white. */
export function CardMeta({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-caption text-ink", className)} {...props} />;
}

/** Body copy on a neutral (surface/white) card — Ink by default. */
export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-body-medium text-ink", className)} {...props} />
  );
}
