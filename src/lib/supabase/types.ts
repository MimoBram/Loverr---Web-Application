/**
 * Hand-authored types matching supabase/migrations/0001_init.sql.
 * If the schema changes, update this file to match (or generate with
 * `supabase gen types typescript` once the project is linked).
 *
 * IMPORTANT: these entity shapes must be `type` aliases, not `interface`.
 * TypeScript does not structurally match `interface` declarations against
 * index-signature types (e.g. `Record<string, unknown>`) unless the
 * interface declares its own index signature — but plain object `type`
 * literals are matched leniently. supabase-js's `GenericTable` constraint
 * requires `Row`/`Insert`/`Update` to satisfy `Record<string, unknown>`,
 * so an `interface` here silently breaks the whole `Database` generic and
 * collapses every `.from(...)` call's inferred type to `never` with no
 * clear error at the point of failure. Keep these as `type`.
 */

export type Couple = {
  id: string;
  couple_name: string;
  anniversary_date: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  couple_id: string;
  display_name: string;
  avatar_key: string;
  pin_hash: string;
  sort_order: number;
  created_at: string;
};

/** Profile shape safe to send to the client (never expose pin_hash). */
export type PublicProfile = Omit<Profile, "pin_hash">;

export type ScrapbookEntry = {
  id: string;
  couple_id: string;
  author_profile_id: string;
  title: string;
  caption: string | null;
  photo_path: string | null;
  entry_date: string;
  tags: string[];
  mood: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  couple_id: string;
  author_profile_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export type QuizQuestion = {
  id: string;
  category: string;
  question_text: string;
  sort_order: number;
  is_active: boolean;
};

export type QuizAnswer = {
  id: string;
  couple_id: string;
  question_id: string;
  profile_id: string;
  answer_text: string;
  created_at: string;
};

export type NotificationType =
  | "new_entry"
  | "new_note"
  | "quiz_reminder"
  | "quiz_result_ready"
  | "system";

export type AppNotification = {
  id: string;
  couple_id: string;
  profile_id: string | null;
  type: NotificationType;
  title: string;
  body: string | null;
  related_entry_id: string | null;
  is_read: boolean;
  created_at: string;
};

/**
 * Shape follows @supabase/supabase-js's `GenericSchema` constraint exactly
 * (Tables need Row/Insert/Update/Relationships; the schema needs Views/
 * Functions/Enums/CompositeTypes even when empty) — omitting any of these
 * makes the client's generic inference silently collapse to `never` on
 * every `.from(...)` call instead of erroring, which is worse.
 */
export type Database = {
  public: {
    Tables: {
      couples: {
        Row: Couple;
        Insert: Partial<Couple> & { id: string };
        Update: Partial<Couple>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { couple_id: string; display_name: string; pin_hash: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      scrapbook_entries: {
        Row: ScrapbookEntry;
        Insert: Partial<ScrapbookEntry> & { couple_id: string; author_profile_id: string; title: string };
        Update: Partial<ScrapbookEntry>;
        Relationships: [];
      };
      notes: {
        Row: Note;
        Insert: Partial<Note> & { couple_id: string; author_profile_id: string; content: string };
        Update: Partial<Note>;
        Relationships: [];
      };
      quiz_questions: {
        Row: QuizQuestion;
        Insert: Partial<QuizQuestion>;
        Update: Partial<QuizQuestion>;
        Relationships: [];
      };
      quiz_answers: {
        Row: QuizAnswer;
        Insert: Partial<QuizAnswer> & { couple_id: string; question_id: string; profile_id: string; answer_text: string };
        Update: Partial<QuizAnswer>;
        Relationships: [];
      };
      notifications: {
        Row: AppNotification;
        Insert: Partial<AppNotification> & { couple_id: string; type: NotificationType; title: string };
        Update: Partial<AppNotification>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
