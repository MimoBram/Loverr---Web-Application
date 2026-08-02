import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { MOCK_ENTRIES, MOCK_COUPLE } from "@/lib/mock-data";
import type { ScrapbookEntry } from "@/lib/supabase/types";

/**
 * Data-access layer for scrapbook_entries. Every function checks
 * `isSupabaseConfigured` and either queries the real project or falls
 * back to the in-memory mock array — same shape either way, so screens
 * never need to know which backend answered.
 */

export async function listEntries(coupleId: string = MOCK_COUPLE.id): Promise<ScrapbookEntry[]> {
  if (!isSupabaseConfigured) {
    return [...MOCK_ENTRIES].sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1));
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("scrapbook_entries")
    .select("*")
    .eq("couple_id", coupleId)
    .order("entry_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getEntry(id: string): Promise<ScrapbookEntry | undefined> {
  if (!isSupabaseConfigured) {
    return MOCK_ENTRIES.find((e) => e.id === id);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("scrapbook_entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ?? undefined;
}

export interface CreateEntryInput {
  id?: string;
  couple_id?: string;
  author_profile_id: string;
  title: string;
  caption: string | null;
  photo_path: string | null;
  entry_date: string;
}

export async function createEntry(input: CreateEntryInput): Promise<ScrapbookEntry> {
  const coupleId = input.couple_id ?? MOCK_COUPLE.id;

  if (!isSupabaseConfigured) {
    const entry: ScrapbookEntry = {
      id: input.id ?? `entry-${Date.now()}`,
      couple_id: coupleId,
      author_profile_id: input.author_profile_id,
      title: input.title,
      caption: input.caption,
      photo_path: input.photo_path,
      entry_date: input.entry_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_ENTRIES.unshift(entry);
    return entry;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("scrapbook_entries")
    .insert({ ...input, couple_id: coupleId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Uploads a photo File to the `scrapbook` Storage bucket at
 * `${coupleId}/${entryId}.<ext>` (matches the RLS policy in
 * supabase/migrations/0001_init.sql) and returns its public URL.
 * In mock mode, returns a local blob: URL instead — good enough for an
 * in-session preview, but it will not survive a page reload.
 */
export async function uploadEntryPhoto(
  file: File,
  coupleId: string,
  entryId: string,
): Promise<string> {
  if (!isSupabaseConfigured) {
    return URL.createObjectURL(file);
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${coupleId}/${entryId}.${ext}`;

  const { error } = await supabase.storage.from("scrapbook").upload(path, file, {
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("scrapbook").getPublicUrl(path);
  return data.publicUrl;
}
