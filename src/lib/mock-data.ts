import type {
  PublicProfile,
  ScrapbookEntry,
  Note,
  QuizQuestion,
  QuizAnswer,
  AppNotification,
} from "@/lib/supabase/types";

/**
 * Temporary in-memory mock data so the core flow screens are fully
 * click-through-able before a real Supabase project is connected.
 * Shapes match src/lib/supabase/types.ts exactly — swapping these
 * `getMock*` calls for real `supabase.from(...)` queries later is a
 * drop-in replacement, not a rewrite.
 */

export const MOCK_COUPLE = {
  id: "mock-couple-1",
  couple_name: "Mimo & Odyy",
  anniversary_date: "2023-07-03",
  created_at: "2023-07-03T00:00:00.000Z",
};

export const MOCK_PROFILES: PublicProfile[] = [
  {
    id: "profile-1",
    couple_id: MOCK_COUPLE.id,
    display_name: "Mimo",
    avatar_key: "avatar-1",
    sort_order: 0,
    created_at: MOCK_COUPLE.created_at,
  },
  {
    id: "profile-2",
    couple_id: MOCK_COUPLE.id,
    display_name: "Odyy",
    avatar_key: "avatar-2",
    sort_order: 1,
    created_at: MOCK_COUPLE.created_at,
  },
];

// Demo PIN for every mock profile — replace with real bcrypt-hashed PINs
// (src/lib/pin.ts) once profiles are created through Setup Awal for real.
export const MOCK_PIN = "1234";

export const MOCK_ENTRIES: ScrapbookEntry[] = [
  {
    id: "entry-1",
    couple_id: MOCK_COUPLE.id,
    author_profile_id: "profile-1",
    title: "Piknik di Taman",
    caption: "Cuaca cerah, bawa bekal sandwich kesukaan kita berdua.",
    photo_path: null,
    entry_date: "2026-07-28",
    created_at: "2026-07-28T10:00:00.000Z",
    updated_at: "2026-07-28T10:00:00.000Z",
  },
  {
    id: "entry-2",
    couple_id: MOCK_COUPLE.id,
    author_profile_id: "profile-2",
    title: "Nonton Bareng",
    caption: "Marathon film favorit sampai ketiduran di sofa.",
    photo_path: null,
    entry_date: "2026-07-24",
    created_at: "2026-07-24T20:00:00.000Z",
    updated_at: "2026-07-24T20:00:00.000Z",
  },
  {
    id: "entry-3",
    couple_id: MOCK_COUPLE.id,
    author_profile_id: "profile-1",
    title: "Masak Bareng",
    caption: "Percobaan pertama bikin pasta carbonara, lumayan enak!",
    photo_path: null,
    entry_date: "2026-07-18",
    created_at: "2026-07-18T18:30:00.000Z",
    updated_at: "2026-07-18T18:30:00.000Z",
  },
];

export const MOCK_NOTES: Note[] = [
  {
    id: "note-1",
    couple_id: MOCK_COUPLE.id,
    author_profile_id: "profile-2",
    content: "Makasih ya udah nemenin aku hari ini, love you!",
    created_at: "2026-07-30T21:00:00.000Z",
    read_at: null,
  },
  {
    id: "note-2",
    couple_id: MOCK_COUPLE.id,
    author_profile_id: "profile-1",
    content: "Jangan lupa minum vitamin sebelum tidur ya~",
    created_at: "2026-07-29T22:15:00.000Z",
    read_at: "2026-07-29T22:20:00.000Z",
  },
];

export const QUIZ_CATEGORIES = ["umum", "kenangan", "masa depan", "random"] as const;

export const MOCK_QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: "q-1", category: "umum", question_text: "Apa warna favorit pasanganmu?", sort_order: 1, is_active: true },
  { id: "q-2", category: "umum", question_text: "Apa makanan favorit pasanganmu?", sort_order: 2, is_active: true },
  { id: "q-3", category: "kenangan", question_text: "Kapan pertama kali kalian bertemu?", sort_order: 1, is_active: true },
  { id: "q-4", category: "kenangan", question_text: "Apa kencan pertama kalian?", sort_order: 2, is_active: true },
  { id: "q-5", category: "masa depan", question_text: "Kemana kalian ingin liburan bersama tahun depan?", sort_order: 1, is_active: true },
  { id: "q-6", category: "random", question_text: "Kalau jadi hewan, pasanganmu jadi hewan apa?", sort_order: 1, is_active: true },
];

// One partner has already answered q-1 to demo the "menunggu pasangan"
// and "hasil siap" states without needing a second device.
export const MOCK_QUIZ_ANSWERS: QuizAnswer[] = [
  {
    id: "answer-1",
    couple_id: MOCK_COUPLE.id,
    question_id: "q-1",
    profile_id: "profile-2",
    answer_text: "Merah, soalnya dia selalu pilih itu buat baju kencan.",
    created_at: "2026-07-29T12:00:00.000Z",
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    couple_id: MOCK_COUPLE.id,
    profile_id: null,
    type: "new_entry",
    title: "Kenangan baru ditambahkan",
    body: "Mimo menambahkan \"Piknik di Taman\" ke Scrapbook.",
    related_entry_id: "entry-1",
    is_read: false,
    created_at: "2026-07-28T10:05:00.000Z",
  },
  {
    id: "notif-2",
    couple_id: MOCK_COUPLE.id,
    profile_id: null,
    type: "quiz_reminder",
    title: "Quiz mingguan menunggu",
    body: "Yuk jawab quiz minggu ini bareng pasanganmu.",
    related_entry_id: null,
    is_read: true,
    created_at: "2026-07-27T09:00:00.000Z",
  },
];

export function getProfileById(id: string): PublicProfile | undefined {
  return MOCK_PROFILES.find((p) => p.id === id);
}

export function getEntryById(id: string): ScrapbookEntry | undefined {
  return MOCK_ENTRIES.find((e) => e.id === id);
}

export function getQuestionById(id: string): QuizQuestion | undefined {
  return MOCK_QUIZ_QUESTIONS.find((q) => q.id === id);
}

export function getAnswersForQuestion(questionId: string): QuizAnswer[] {
  return MOCK_QUIZ_ANSWERS.filter((a) => a.question_id === questionId);
}

export function getAnswer(
  questionId: string,
  profileId: string,
): QuizAnswer | undefined {
  return MOCK_QUIZ_ANSWERS.find(
    (a) => a.question_id === questionId && a.profile_id === profileId,
  );
}

export function getOtherProfile(
  profiles: PublicProfile[],
  profileId: string,
): PublicProfile | undefined {
  return profiles.find((p) => p.id !== profileId);
}
