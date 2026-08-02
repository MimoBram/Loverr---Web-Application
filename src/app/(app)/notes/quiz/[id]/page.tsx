"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useSession } from "@/lib/session";
import { getQuestion, listQuestions, listAnswers, submitAnswer } from "@/lib/data/quiz";
import { QUIZ_CATEGORIES } from "@/lib/mock-data";
import { QuizMascot } from "@/components/ui/QuizMascot";
import { cn } from "@/lib/utils";
import type { QuizQuestion, QuizAnswer } from "@/lib/supabase/types";

/** Quiz Interaction — matches Figma node 171:32. */
export default function QuizQuestionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { activeProfileId } = useSession();

  const [question, setQuestion] = useState<QuizQuestion | null | undefined>(undefined);
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const [q, all] = await Promise.all([getQuestion(params.id), listQuestions()]);
    setQuestion(q ?? null);
    setAllQuestions(all);
    if (q) {
      const a = await listAnswers(q.id);
      setAnswers(a);
    }
  }, [params.id]);

  useEffect(() => {
    let cancelled = false;
    load().catch(() => {
      if (!cancelled) setQuestion(null);
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const questionIndex = useMemo(
    () => allQuestions.findIndex((q) => q.id === params.id),
    [allQuestions, params.id],
  );
  const total = allQuestions.length;
  const progressPct = total > 0 ? Math.round(((questionIndex + 1) / total) * 100) : 0;

  useEffect(() => {
    const myAnswer = answers.find((a) => a.profile_id === activeProfileId);
    if (myAnswer && answers.length >= 2) {
      router.replace(`/notes/quiz/${params.id}/result`);
    }
  }, [answers, activeProfileId, params.id, router]);

  if (question === undefined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">Memuat pertanyaan…</p>
      </main>
    );
  }

  if (!question || !activeProfileId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">Pertanyaan tidak ditemukan.</p>
        <button onClick={() => router.push("/notes/quiz")} className="text-label text-rose">
          Kembali ke Quiz
        </button>
      </main>
    );
  }

  const myAnswer = answers.find((a) => a.profile_id === activeProfileId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answerText.trim() || !activeProfileId) return;

    setError(null);
    setSubmitting(true);
    try {
      await submitAnswer({
        question_id: question!.id,
        profile_id: activeProfileId,
        answer_text: answerText.trim(),
      });
      await load();
    } catch {
      setError("Gagal mengirim jawaban. Coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-quiz-accent px-5 pb-10 pt-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/notes/quiz")}
          aria-label="Kembali"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-squircle bg-white shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]"
        >
          <ChevronLeft size={22} className="text-ink" />
        </button>
        <div className="flex h-[52px] items-center justify-center rounded-pill bg-white px-6 shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
          <p className="text-[13.5px] font-extrabold text-ink">
            Soal {questionIndex >= 0 ? questionIndex + 1 : 1}/{total || 1}
          </p>
        </div>
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-squircle bg-white shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
          <div className="flex gap-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-bold text-ink">Progress</p>
          <p className="text-[14px] font-bold text-ink">{progressPct}%</p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-ink" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="flex justify-center py-2">
        <QuizMascot size={180} />
      </div>

      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
        {QUIZ_CATEGORIES.map((c) => (
          <span
            key={c}
            className={cn(
              "shrink-0 rounded-pill px-4 py-2 text-[13px] font-bold capitalize",
              c === question.category
                ? "bg-ink text-white"
                : "bg-white text-ink shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]",
            )}
          >
            {c}
          </span>
        ))}
      </div>

      <h2 className="text-[21px] font-extrabold leading-[27px] text-ink">
        {question.question_text}
      </h2>

      {!myAnswer ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              autoFocus
              type="text"
              placeholder="Tulis jawabanmu..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="h-[58px] w-full rounded-pill bg-white pl-6 pr-16 text-body text-ink placeholder:text-subtle shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)] focus:outline-none"
            />
            <span className="absolute right-[15px] top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[9.8px] bg-coral shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
              <Info size={14} className="text-white" />
            </span>
          </div>

          {error && <p className="text-caption text-error">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/notes/quiz")}
              className="flex h-[58px] flex-1 items-center justify-center gap-1 rounded-pill bg-white text-[13.5px] font-bold text-ink shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]"
            >
              Lewati
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex h-[58px] flex-1 items-center justify-center gap-1 rounded-pill bg-ink text-[13.5px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)] disabled:opacity-60"
            >
              {submitting ? "Mengirim…" : "Kirim"}
              {!submitting && <ChevronRight size={16} />}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-card-lg bg-white p-6 text-center shadow-sm">
          <p className="text-card-title text-ink">Jawabanmu terkirim!</p>
          <p className="text-body-medium text-muted">
            Menunggu pasanganmu menjawab juga — hasilnya akan muncul di sini.
          </p>
        </div>
      )}
    </main>
  );
}
