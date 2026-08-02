-- Adds tag/mood/favorite support to scrapbook_entries. These were already
-- present as client-only UI state in the New Entry form (tags + mood
-- pickers) but never persisted, and "Tandai Favorit" in the new Opsi Momen
-- action sheet needs somewhere to live.
alter table public.scrapbook_entries
  add column if not exists tags text[] not null default '{}',
  add column if not exists mood text,
  add column if not exists is_favorite boolean not null default false;
