import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { MOCK_NOTES, MOCK_COUPLE } from "@/lib/mock-data";
import { resolveCoupleId } from "@/lib/data/auth";
import type { Note } from "@/lib/supabase/types";

export async function listNotes(coupleId?: string): Promise<Note[]> {
  if (!isSupabaseConfigured) {
    return [...MOCK_NOTES].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }

  const resolvedCoupleId = await resolveCoupleId(coupleId);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("couple_id", resolvedCoupleId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export interface CreateNoteInput {
  couple_id?: string;
  author_profile_id: string;
  content: string;
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const coupleId = isSupabaseConfigured
    ? await resolveCoupleId(input.couple_id)
    : (input.couple_id ?? MOCK_COUPLE.id);

  if (!isSupabaseConfigured) {
    const note: Note = {
      id: `note-${Date.now()}`,
      couple_id: coupleId,
      author_profile_id: input.author_profile_id,
      content: input.content,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    MOCK_NOTES.unshift(note);
    return note;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({ ...input, couple_id: coupleId })
    .select()
    .single();

  if (error) throw error;
  return data;
}
