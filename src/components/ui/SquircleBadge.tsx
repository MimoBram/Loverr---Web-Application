import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeColor = "rose" | "coral" | "violet" | "periwinkle" | "cream" | "white";

export interface SquircleBadgeProps extends HTMLAttributes<HTMLDivElement> {
  color?: BadgeColor;
}

const colorClasses: Record<BadgeColor, string> = {
  rose: "bg-rose text-white",
  coral: "bg-coral text-white",
  violet: "bg-violet text-white",
  periwinkle: "bg-periwinkle text-white",
  cream: "bg-cream text-ink",
  white: "bg-white text-ink",
};

/**
 * Spec (Design System > Assets): 52x52, radius 16.64 (32% squircle).
 * Used for icon badges throughout Home, Notes Hub, and Settings.
 */
export function SquircleBadge({
  color = "rose",
  className,
  ...props
}: SquircleBadgeProps) {
  return (
    <div
      className={cn(
        "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-squircle shadow-sm",
        colorClasses[color],
        className,
      )}
      {...props}
    />
  );
}
