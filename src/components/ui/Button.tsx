import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/**
 * Loverr primary Button.
 * Spec (Design System > Buttons): 335x64, radius 32, label 16/24 bold.
 * `fullWidth` (default true) matches the mobile-only 335px screen width;
 * pass `fullWidth={false}` for inline/icon-adjacent buttons.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = true,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-card-lg text-button transition-colors duration-150 active:scale-[0.98]",
          size === "md" ? "h-16 px-6" : "h-12 px-5",
          fullWidth && "w-full",
          variant === "primary" &&
            "bg-rose text-white hover:bg-rose-deep disabled:bg-disabled disabled:text-white",
          variant === "secondary" &&
            "border-2 border-rose bg-white text-rose hover:bg-cream disabled:border-disabled disabled:text-disabled",
          variant === "ghost" &&
            "bg-transparent text-rose hover:bg-cream disabled:text-disabled",
          variant === "danger" &&
            "bg-error text-white hover:opacity-90 disabled:bg-disabled",
          disabled && "cursor-not-allowed",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
