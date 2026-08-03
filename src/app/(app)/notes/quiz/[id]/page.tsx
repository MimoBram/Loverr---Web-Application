"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Info, RotateCcw, Flag, LogOut } from "lucide-react";
import { useSession } from "@/lib/session";
import { getQuestion, listQuestions, listAnswers, submitAnswer } from "@/lib/data/quiz";
import { createNotification } from "@/lib/data/notifications";
import { QUIZ_CATEGORIES } from "@/lib/mock-data";
import { QuizMascot } from "@/components/ui/QuizMascot";
import { ActionSheet, type ActionSheetItem } from "@/components/ui/ActionSheet";
import { cn, errorMessage } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import type { QuizQuestion, QuizAnswer } from "@/lib/supabase/types";

// This screen keeps its warm peach accent background in both light and dark
// mode by design (see `quiz-accent` in tailwind.config.ts) — it's a deliberate
// full-bleed "mood" moment, not a surface that should fade to the app's dark
// cream. Because of that, every color on this page must be a *static* token
// (onyx / white / brand hues), never the theme-reactive `ink`/`muted`/`subtle`
// tokens — those flip to near-white in dark mode and become invisible against
// this page's always-light backgrounds.
const CATEGORY_STYLES: Record<string, { pillBg: string; pillText: string; dot: string }> = {
  umum: { pillBg: "bg-coral", pillText: "text-coral", dot: "bg-coral" },
  kenangan: { pillBg: "bg-violet", pillText: "text-violet", dot: "bg-violet" },
  "masa depan": { pillBg: "bg-periwinkle", pillText: "text-periwinkle", dot: "bg-periwinkle" },
  random: { pillBg: "bg-rose-deep", pillText: "text-rose-deep", dot: "bg-rose-deep" },
};
const DEFAULT_CATEGORY_STYLE = { pillBg: "bg-onyx", pillText: "text-onyx", dot: "bg-onyx" };

// Fades the category-pill scroller's edges instead of hard-cutting the last
// visible pill — signals "there's more, scroll me" instead of looking broken.
const EDGE_FADE =
  "linear-gradient(to right, transparent 0, black 20px, black calc(100% - 20px), transparent 100%)";

/** Quiz Interaction — matches Figma node 171:32. */
export default function QuizQuestionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { activeProfileId } = useSession();
  const t = useT();

  const [question, setQuestion] = useState<QuizQuestion | null | undefined>(undefined);
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);

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
    if (retrying) return;
    const myAnswer = answers.find((a) => a.profile_id === activeProfileId);
    if (myAnswer && answers.length >= 2) {
      router.replace(`/notes/quiz/${params.id}/result`);
    }
  }, [answers, activeProfileId, params.id, router, retrying]);

  if (question === undefined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">{t("quiz.loading")}</p>
      </main>
    );
  }

  if (!question || !activeProfileId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body-medium text-muted">{t("quiz.notFound")}</p>
        <button onClick={() => router.push("/notes/quiz")} className="text-label text-rose">
          {t("quiz.backToQuiz")}
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
      const partnerAlreadyAnswered = answers.some(
        (a) => a.profile_id !== activeProfileId,
      );

      await submitAnswer({
        question_id: question!.id,
        profile_id: activeProfileId,
        answer_text: answerText.trim(),
      });

      if (partnerAlreadyAnswered) {
        createNotification({
          type: "quiz_result_ready",
          title: t("quiz.resultReadyTitle"),
          body: t("quiz.resultReadyBody", { question: question!.question_text }),
        }).catch(() => {
          // Non-critical — the answer itself already saved successfully.
        });
      }

      setRetrying(false);
      await load();
    } catch (err) {
      console.error("submitAnswer failed:", err);
      setError(`${t("quiz.error")} (${errorMessage(err)})`);
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setOptionsOpen(false);
    setAnswerText(myAnswer?.answer_text ?? "");
    setError(null);
    setRetrying(true);
  }

  function handleReport() {
    setOptionsOpen(false);
    const subject = encodeURIComponent("Laporkan Soal Quiz");
    const body = encodeURIComponent(
      `Soal: "${question?.question_text}"\n\nCeritakan masalahnya di sini...`,
    );
    window.location.href = `mailto:bimoadi.bramantyo@gmail.com?subject=${subject}&body=${body}`;
  }

  const quizOptions: ActionSheetItem[] = [
    ...(myAnswer
      ? [
          {
            key: "retry",
            label: t("quiz.retry"),
            icon: RotateCcw,
            iconBg: "bg-coral",
            onClick: handleRetry,
          } as ActionSheetItem,
        ]
      : []),
    {
      key: "report",
      label: t("quiz.report"),
      icon: Flag,
      iconBg: "bg-ink",
      onClick: handleReport,
    },
    {
      key: "exit",
      label: t("quiz.exit"),
      icon: LogOut,
      iconBg: "bg-error",
      labelClassName: "text-error",
      onClick: () => {
        setOptionsOpen(false);
        router.push("/notes/quiz");
      },
    },
  ];

  const categoryStyle = CATEGORY_STYLES[question.category] ?? DEFAULT_CATEGORY_STYLE;

  return (
    <main className="flex min-h-screen flex-col gap-5 bg-quiz-accent px-5 pb-10 pt-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/notes/quiz")}
          aria-label={t("common.back")}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-squircle bg-white shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]"
        >
          <ChevronLeft size={22} className="text-onyx" />
        </button>
        <div className="flex h-[52px] items-center justify-center rounded-pill bg-white px-6 shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
          <p className="text-[13.5px] font-extrabold text-onyx">
            {t("quiz.soal", { current: questionIndex >= 0 ? questionIndex + 1 : 1, total: total || 1 })}
          </p>
        </div>
        <button
          type="button"
          aria-label={t("quiz.opsiKuis")}
          onClick={() => setOptionsOpen(true)}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-squircle bg-white shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]"
        >
          <div className="flex gap-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-onyx" />
            <span className="h-1.5 w-1.5 rounded-full bg-onyx" />
            <span className="h-1.5 w-1.5 rounded-full bg-onyx" />
          </div>
        </button>
      </div>

      {/* Progress: one slim bar only — the fraction is already in the "Soal"
          chip above, so a separate "Progress · 7%" text row was redundant
          clutter. */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/55"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-onyx transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="relative flex justify-center py-1">
        <div className="absolute h-[148px] w-[148px] rounded-full bg-white/20" aria-hidden="true" />
        <QuizMascot size={168} className="relative" />
      </div>

      <div
        className="flex items-center gap-2 overflow-x-auto pb-1"
        style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
      >
        {QUIZ_CATEGORIES.map((c) => {
          const style = CATEGORY_STYLES[c] ?? DEFAULT_CATEGORY_STYLE;
          const selected = c === question.category;
          return (
            <span
              key={c}
              className={cn(
                "shrink-0 rounded-pill px-3.5 py-2 text-[12.5px] font-bold capitalize",
                selected ? cn(style.pillBg, "text-white shadow-sm") : cn("bg-white/85", style.pillText),
              )}
            >
              {c}
            </span>
          );
        })}
      </div>

      {/* Everything below sits on a solid white card — guarantees legible,
          identical contrast in both light and dark mode, and gives the flat
          orange background some depth instead of text floating directly on it. */}
      <div className="flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-[0px_10px_28px_0px_rgba(77,51,77,0.14)]">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", categoryStyle.dot)} aria-hidden="true" />
          <p className={cn("text-[12px] font-bold uppercase tracking-wide", categoryStyle.pillText)}>
            {question.category}
          </p>
        </div>

        <h2 className="text-[20px] font-extrabold leading-[27px] text-onyx">
          {question.question_text}
        </h2>

        {!myAnswer || retrying ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {retrying && (
              <p className="text-caption text-onyx/55">
                {t("quiz.retryingNote")}
              </p>
            )}
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder={t("quiz.answerPlaceholder")}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="h-[56px] w-full rounded-pill border border-onyx/10 bg-[#f6f1ec] pl-6 pr-16 text-body text-onyx placeholder:text-onyx/40 focus:outline-none"
              />
              <span className="absolute right-[15px] top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[9.8px] bg-coral shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
                <Info size={14} className="text-white" />
              </span>
            </div>

            {error && <p className="text-caption text-error">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (retrying) {
                    setRetrying(false);
                    setError(null);
                  } else {
                    router.push("/notes/quiz");
                  }
                }}
                className="flex h-[54px] flex-1 items-center justify-center gap-1 rounded-pill bg-[#f6f1ec] text-[13.5px] font-bold text-onyx"
              >
                {retrying ? t("quiz.cancel") : t("quiz.skip")}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex h-[54px] flex-1 items-center justify-center gap-1 rounded-pill bg-onyx text-[13.5px] font-bold text-white shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)] disabled:opacity-60"
              >
                {submitting ? t("quiz.sending") : t("quiz.send")}
                {!submitting && <ChevronRight size={16} />}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-card-lg bg-[#f6f1ec] p-6 text-center">
            <p className="text-card-title text-onyx">{t("quiz.submitted")}</p>
            <p className="text-body-medium text-onyx/60">
              {t("quiz.waitingPartner")}
            </p>
          </div>
        )}
      </div>

      <ActionSheet
        open={optionsOpen}
        title={t("quiz.opsiKuis")}
        items={quizOptions}
        onClose={() => setOptionsOpen(false)}
      />
    </main>
  );
}
