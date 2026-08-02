import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { MOCK_QUIZ_QUESTIONS, MOCK_QUIZ_ANSWERS, MOCK_COUPLE } from "@/lib/mock-data";
import { resolveCoupleId } from "@/lib/data/auth";
import type { QuizQuestion, QuizAnswer } from "@/lib/supabase/types";

export async function listQuestions(): Promise<QuizQuestion[]> {
  if (!isSupabaseConfigured) {
    return MOCK_QUIZ_QUESTIONS.filter((q) => q.is_active);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function getQuestion(id: string): Promise<QuizQuestion | undefined> {
  if (!isSupabaseConfigured) {
    return MOCK_QUIZ_QUESTIONS.find((q) => q.id === id);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ?? undefined;
}

export async function listAnswers(
  questionId: string,
  coupleId?: string,
): Promise<QuizAnswer[]> {
  if (!isSupabaseConfigured) {
    return MOCK_QUIZ_ANSWERS.filter((a) => a.question_id === questionId);
  }

  const resolvedCoupleId = await resolveCoupleId(coupleId);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_answers")
    .select("*")
    .eq("question_id", questionId)
    .eq("couple_id", resolvedCoupleId);

  if (error) throw error;
  return data ?? [];
}

/** Every answer this couple has ever submitted, across all questions — used for the Home activity heatmap/streak. */
export async function listAllAnswers(coupleId?: string): Promise<QuizAnswer[]> {
  if (!isSupabaseConfigured) {
    return [...MOCK_QUIZ_ANSWERS];
  }

  const resolvedCoupleId = await resolveCoupleId(coupleId);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_answers")
    .select("*")
    .eq("couple_id", resolvedCoupleId);

  if (error) throw error;
  return data ?? [];
}

export interface SubmitAnswerInput {
  couple_id?: string;
  question_id: string;
  profile_id: string;
  answer_text: string;
}

export async function submitAnswer(input: SubmitAnswerInput): Promise<QuizAnswer> {
  const coupleId = isSupabaseConfigured
    ? await resolveCoupleId(input.couple_id)
    : (input.couple_id ?? MOCK_COUPLE.id);

  if (!isSupabaseConfigured) {
    const answer: QuizAnswer = {
      id: `answer-${Date.now()}`,
      couple_id: coupleId,
      question_id: input.question_id,
      profile_id: input.profile_id,
      answer_text: input.answer_text,
      created_at: new Date().toISOString(),
    };
    MOCK_QUIZ_ANSWERS.push(answer);
    return answer;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_answers")
    .upsert({ ...input, couple_id: coupleId }, { onConflict: "couple_id,question_id,profile_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
