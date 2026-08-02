import { cn } from "@/lib/utils";

const AVATAR_COLORS: Record<string, string> = {
  "avatar-1": "bg-coral",
  "avatar-2": "bg-periwinkle",
  "avatar-3": "bg-violet",
  "avatar-4": "bg-rose",
};

export interface AvatarProps {
  avatarKey: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-body",
  md: "h-16 w-16 text-heading",
  lg: "h-24 w-24 text-display",
};

/** Simple initial-letter avatar until real photo uploads are wired up. */
export function Avatar({ avatarKey, name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-extrabold text-white",
        AVATAR_COLORS[avatarKey] ?? "bg-rose",
        sizeClasses[size],
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
