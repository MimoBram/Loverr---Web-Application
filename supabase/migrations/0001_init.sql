-- Loverr — initial schema
-- Model: ONE Supabase Auth user per couple (shared login created during
-- "Setup Awal"). `couples.id` == `auth.users.id`. The two people in the
-- relationship are represented as two rows in `profiles`, switched between
-- via the "Pilih Profil" screen + a per-profile PIN (not Supabase Auth —
-- see src/lib/pin.ts, hashed with bcrypt and checked in a Server Action).
--
-- Run this in the Supabase SQL editor, or via `supabase db push` if you're
-- using the CLI with this repo's `supabase/` folder linked to your project.

-- ============================================================
-- couples
-- ============================================================
create table if not exists public.couples (
  id uuid primary key references auth.users (id) on delete cascade,
  couple_name text not null default 'Kami Berdua',
  anniversary_date date,
  created_at timestamptz not null default now()
);

alter table public.couples enable row level security;

create policy "couples: owner can select" on public.couples
  for select using (auth.uid() = id);
create policy "couples: owner can insert" on public.couples
  for insert with check (auth.uid() = id);
create policy "couples: owner can update" on public.couples
  for update using (auth.uid() = id);

-- ============================================================
-- profiles — exactly 2 per couple (the two partners)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  display_name text not null,
  avatar_key text not null default 'avatar-1',
  pin_hash text not null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  unique (couple_id, sort_order)
);

alter table public.profiles enable row level security;

create policy "profiles: couple can select" on public.profiles
  for select using (auth.uid() = couple_id);
create policy "profiles: couple can insert" on public.profiles
  for insert with check (auth.uid() = couple_id);
create policy "profiles: couple can update" on public.profiles
  for update using (auth.uid() = couple_id);
create policy "profiles: couple can delete" on public.profiles
  for delete using (auth.uid() = couple_id);

-- ============================================================
-- scrapbook_entries — the daily photo/journal cards on the Timeline
-- ============================================================
create table if not exists public.scrapbook_entries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  author_profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  caption text,
  photo_path text, -- Supabase Storage object path in the `scrapbook` bucket
  entry_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists scrapbook_entries_couple_date_idx
  on public.scrapbook_entries (couple_id, entry_date desc);

alter table public.scrapbook_entries enable row level security;

create policy "entries: couple can select" on public.scrapbook_entries
  for select using (auth.uid() = couple_id);
create policy "entries: couple can insert" on public.scrapbook_entries
  for insert with check (auth.uid() = couple_id);
create policy "entries: couple can update" on public.scrapbook_entries
  for update using (auth.uid() = couple_id);
create policy "entries: couple can delete" on public.scrapbook_entries
  for delete using (auth.uid() = couple_id);

-- ============================================================
-- notes — short love-notes left for each other (Notes & Quiz Hub)
-- ============================================================
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  author_profile_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists notes_couple_created_idx
  on public.notes (couple_id, created_at desc);

alter table public.notes enable row level security;

create policy "notes: couple can select" on public.notes
  for select using (auth.uid() = couple_id);
create policy "notes: couple can insert" on public.notes
  for insert with check (auth.uid() = couple_id);
create policy "notes: couple can update" on public.notes
  for update using (auth.uid() = couple_id);
create policy "notes: couple can delete" on public.notes
  for delete using (auth.uid() = couple_id);

-- ============================================================
-- quiz_questions — shared question bank (global, read-only to app users)
-- ============================================================
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'umum',
  question_text text not null,
  sort_order smallint not null default 0,
  is_active boolean not null default true
);

alter table public.quiz_questions enable row level security;

create policy "quiz_questions: any authenticated user can select"
  on public.quiz_questions for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- quiz_answers — each partner's answer to a question
-- ============================================================
create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  question_id uuid not null references public.quiz_questions (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  answer_text text not null,
  created_at timestamptz not null default now(),
  unique (couple_id, question_id, profile_id)
);

alter table public.quiz_answers enable row level security;

create policy "quiz_answers: couple can select" on public.quiz_answers
  for select using (auth.uid() = couple_id);
create policy "quiz_answers: couple can insert" on public.quiz_answers
  for insert with check (auth.uid() = couple_id);
create policy "quiz_answers: couple can update" on public.quiz_answers
  for update using (auth.uid() = couple_id);

-- ============================================================
-- notifications
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  profile_id uuid references public.profiles (id) on delete cascade, -- null = both partners
  type text not null, -- 'new_entry' | 'new_note' | 'quiz_reminder' | 'quiz_result_ready' | 'system'
  title text not null,
  body text,
  related_entry_id uuid references public.scrapbook_entries (id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_couple_created_idx
  on public.notifications (couple_id, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications: couple can select" on public.notifications
  for select using (auth.uid() = couple_id);
create policy "notifications: couple can insert" on public.notifications
  for insert with check (auth.uid() = couple_id);
create policy "notifications: couple can update" on public.notifications
  for update using (auth.uid() = couple_id);

-- ============================================================
-- Storage: scrapbook photo bucket
-- ============================================================
insert into storage.buckets (id, name, public)
values ('scrapbook', 'scrapbook', true)
on conflict (id) do nothing;

create policy "scrapbook bucket: owner can read"
  on storage.objects for select
  using (bucket_id = 'scrapbook' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "scrapbook bucket: owner can insert"
  on storage.objects for insert
  with check (bucket_id = 'scrapbook' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "scrapbook bucket: owner can delete"
  on storage.objects for delete
  using (bucket_id = 'scrapbook' and auth.uid()::text = (storage.foldername(name))[1]);

-- Note: upload photos to path `${coupleId}/${entryId}.jpg` so the
-- `storage.foldername(name))[1]` check above matches auth.uid().
