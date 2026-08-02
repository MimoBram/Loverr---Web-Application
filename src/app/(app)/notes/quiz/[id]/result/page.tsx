"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Check, Heart } from "lucide-react";
import { useSession } from "@/lib/session";
import { getQuestion, listAnswers, listQuestions } from "@/lib/data/quiz";
import { useT } from "@/lib/i18n";
import type { QuizQuestion, QuizAnswer } from "@/lib/supabase/types";

/** Quiz Result — matches Figma node 172:3. */
export default function QuizResultPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { activeProfileId } = useSession();
  const t = useT();

  const [question, setQuestion] = useState<QuizQuestion | null | undefined>(undefined);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [nextQuestionId, setNextQuestionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getQuestion(params.id), listAnswers(params.id), listQuestions()])
      .then(([q, a, all]) => {
        if (cancelled) return;
        setQuestion(q ?? null);
        setAnswers(a);
        const idx = all.findIndex((item) => item.id === params.id);
        setNextQuestionId(idx >= 0 && idx + 1 < all.length ? all[idx + 1].id : null);
      })
      .catch(() => {
        if (!cancelled) setQuestion(null);
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (question === undefined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">{t("quizResult.loading")}</p>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">{t("quizResult.notFound")}</p>
        <button onClick={() => router.push("/notes/quiz")} className="text-label text-rose">
          {t("quizResult.backToQuiz")}
        </button>
      </main>
    );
  }

  const myAnswer = answers.find((a) => a.profile_id === activeProfileId);
  const partnerAnswer = answers.find((a) => a.profile_id !== activeProfileId);
  const isMatch =
    !!myAnswer &&
    !!partnerAnswer &&
    myAnswer.answer_text.trim().toLowerCase() === partnerAnswer.answer_text.trim().toLowerCase();

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-5">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.push("/notes/quiz")}
          aria-label={t("common.back")}
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[19px] font-extrabold text-ink">{t("quizResult.title")}</h1>
      </div>

      <p className="text-center text-[14px] font-semibold text-muted">
        {question.question_text}
      </p>

      <div className="flex justify-center pt-2">
        <div
          className={`flex h-[120px] w-[120px] items-center justify-center rounded-[36px] shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)] ${
            isMatch ? "bg-violet" : "bg-coral"
          }`}
        >
          {isMatch ? (
            <Check size={44} className="text-white" strokeWidth={3} />
          ) : (
            <Heart size={40} className="fill-white text-white" />
          )}
        </div>
      </div>

      <h2 className="text-center text-[21px] font-extrabold text-ink">
        {isMatch ? t("quizResult.match") : t("quizResult.noMatch")}
      </h2>

      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-[24px] bg-coral p-5">
          <div className="absolute -right-8 -top-8 h-[120px] w-[120px] rounded-full bg-white/10" />
          <p className="text-[12.5px] font-bold text-onyx/85">{t("quizResult.yourAnswer")}</p>
          <p className="mt-1 text-[16px] font-extrabold text-white">
            {myAnswer?.answer_text ?? "—"}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-[24px] bg-periwinkle p-5">
          <div className="absolute -right-8 -top-8 h-[120px] w-[120px] rounded-full bg-white/10" />
          <p className="text-[12.5px] font-bold text-onyx/85">{t("quizResult.partnerAnswer")}</p>
          <p className="mt-1 text-[16px] font-extrabold text-white">
            {partnerAnswer?.answer_text ?? "—"}
          </p>
        </div>
      </div>

      {nextQuestionId ? (
        <button
          onClick={() => router.push(`/notes/quiz/${nextQuestionId}`)}
          className="flex h-16 w-full items-center justify-center rounded-[32px] bg-onyx text-[14.5px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
        >
          {t("quizResult.nextQuestion")}
        </button>
      ) : (
        <button
          onClick={() => router.push("/notes/quiz")}
          className="flex h-16 w-full items-center justify-center rounded-[32px] bg-onyx text-[14.5px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
        >
          {t("quizResult.finish")}
        </button>
      )}

      <button
        onClick={() => router.push("/notes")}
        className="text-center text-[13px] font-bold text-rose"
      >
        {t("quizResult.backToNotes")}
      </button>
    </main>
  );
}
