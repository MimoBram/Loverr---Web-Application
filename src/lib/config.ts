/**
 * Feature-detects whether a real Supabase project is connected.
 *
 * Until `.env.local` is filled in (see .env.local.example / supabase/README.md),
 * these are unset or still the placeholder values from the example file, and
 * the app runs entirely on the local mock backend (src/lib/mock-data.ts +
 * src/lib/session.tsx). Once real values are present, src/lib/data/* switch
 * over to real Supabase queries automatically — no other code changes needed.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-supabase-project-url"),
);
