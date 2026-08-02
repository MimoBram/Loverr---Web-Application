import { type ClassValue, clsx } from "clsx";

/**
 * Lightweight className combiner. We intentionally skip tailwind-merge
 * (not installed) — keep className overrides additive, not conflicting.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
