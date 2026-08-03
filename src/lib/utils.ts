import { type ClassValue, clsx } from "clsx";

/**
 * Lightweight className combiner. We intentionally skip tailwind-merge
 * (not installed) — keep className overrides additive, not conflicting.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Local-calendar-day key ("YYYY-MM-DD") for a Date or ISO/date string.
 * Deliberately uses local date components (not `.toISOString().slice(0,10)`,
 * which is UTC) so a note sent at 23:xx local time counts for that day, not
 * the next one — matters for streaks/heatmaps to feel right for the user.
 */
export function toLocalDateKey(input: Date | string): string {
  // Plain "YYYY-MM-DD" columns (e.g. scrapbook_entries.entry_date) have no
  // time/timezone component to begin with — pass them through as-is rather
  // than round-tripping through `new Date()`, which would parse them as UTC
  // midnight and could shift the calendar day in some timezones.
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input;
  }
  const d = typeof input === "string" ? new Date(input) : input;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Extracts a human-readable message from anything a `catch` block might
 * receive. Supabase's `PostgrestError`/`AuthError` are plain objects with a
 * `.message` string — NOT instances of the native `Error` class — so a bare
 * `err instanceof Error` check silently misses them and drops the real
 * reason on the floor. This checks for a `.message` string on any object
 * before falling back to `String(err)`, so real backend errors ("row
 * violates row-level security policy", "JWT expired", etc.) always surface.
 */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }
  return String(err);
}
