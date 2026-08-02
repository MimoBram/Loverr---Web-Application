import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Spec (Design System > Form): 335x52, radius 22, stroke #e5e0e5.
 * Tap target already meets the 44px minimum from the accessibility audit.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "h-[52px] w-full rounded-input border-2 border-input-stroke bg-white px-4 text-body-medium text-ink placeholder:text-muted",
            "focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20",
            error && "border-error focus:border-error focus:ring-error/20",
            props.disabled && "bg-surface text-disabled",
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-caption text-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
