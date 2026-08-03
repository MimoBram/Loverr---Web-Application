import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Supabase client for use in Client Components ("use client").
 * Reads the public URL/anon key from env — see .env.local.example.
 *
 * Memoized as a module-level singleton: every data-layer function
 * (entries.ts, notes.ts, quiz.ts, notifications.ts, auth.ts, session.tsx)
 * calls `createClient()` on every read/write, and constructing a fresh
 * `createBrowserClient` each time spins up its own GoTrueClient/auth
 * listener. Multiple concurrent instances (e.g. Home's four parallel
 * data-layer calls on mount) can race on refreshing the same session
 * token, occasionally leaving one instance holding a stale/expired
 * access token — which surfaces as "not logged in" errors on writes
 * (createEntry/createNote failing with a generic "Gagal menyimpan").
 * Reusing one client avoids that entirely.
 */
let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return browserClient;
}
