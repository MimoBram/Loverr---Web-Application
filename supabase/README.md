# Loverr — Supabase setup

1. Create a project at [supabase.com](https://supabase.com) (free tier is enough).
2. In the SQL editor, run `migrations/0001_init.sql`, then `migrations/0002_seed_quiz_questions.sql`.
3. In Project Settings → API, copy the **Project URL** and **anon public key**.
4. Copy `.env.local.example` to `.env.local` in the project root and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

## How auth maps to the app's login flow

Loverr uses **one Supabase Auth account per couple** (created once during
"Setup Awal" with a shared email/password), not one account per person.
The two partners are rows in `profiles`, distinguished by `avatar_key` and
protected individually by a 4–6 digit PIN (bcrypt-hashed, checked in a
Server Action via `src/lib/pin.ts` — never compared client-side).

Flow: Splash → Pilih Profil (pick which partner) → Masukkan PIN (unlock
that profile) → Home. The Supabase session itself covers "is this couple's
device," and the PIN is a lightweight per-person gate on top of it.

## Storage

Scrapbook photos go in the `scrapbook` bucket (created by the migration),
uploaded to path `${coupleId}/${entryId}.jpg` — the RLS policy on
`storage.objects` checks that the first path segment matches `auth.uid()`.

## Schema summary

- `couples` — 1 row per Supabase Auth user (`id` = `auth.uid()`).
- `profiles` — 2 rows per couple (the two partners), PIN-protected.
- `scrapbook_entries` — Timeline cards (title, caption, photo, date).
- `notes` — short notes left for each other.
- `quiz_questions` — shared, read-only question bank (seeded).
- `quiz_answers` — each partner's answer per question, compared on the
  Quiz Result screen.
- `notifications` — in-app notification feed.

All couple-scoped tables are RLS-protected so a couple can only ever read
or write their own rows (`auth.uid() = couple_id`).
