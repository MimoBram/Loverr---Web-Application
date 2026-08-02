"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { listQuestions, listAnswers } from "@/lib/data/quiz";
import { QUIZ_CATEGORIES } from "@/lib/mock-data";
import { useT } from "@/lib/i18n";
import type { QuizQuestion, QuizAnswer } from "@/lib/supabase/types";

type Status = "loading" | "ready" | "error";

export default function QuizListPage() {
  const router = useRouter();
  const { activeProfileId } = useSession();
  const t = useT();
  const [category, setCategory] = useState<string>(QUIZ_CATEGORIES[0]);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answersByQuestion, setAnswersByQuestion] = useState<Record<string, QuizAnswer[]>>({});
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    listQuestions()
      .then(async (qs) => {
        if (cancelled) return;
        setQuestions(qs);

        const entries = await Promise.all(
          qs.map(async (q) => [q.id, await listAnswers(q.id)] as const),
        );
        if (cancelled) return;
        setAnswersByQuestion(Object.fromEntries(entries));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => questions.filter((q) => q.category === category),
    [questions, category],
  );

  function questionStatus(questionId: string) {
    const answers = answersByQuestion[questionId] ?? [];
    const mine = answers.find((a) => a.profile_id === activeProfileId);
    if (answers.length >= 2) return "done" as const;
    if (mine) return "waiting" as const;
    return "unanswered" as const;
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label={t("common.back")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-heading text-ink">{t("quizHub.title")}</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {QUIZ_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-pill px-4 py-2 text-label capitalize transition-colors",
              category === c
                ? "bg-rose text-white"
                : "bg-card text-muted",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <p className="text-caption text-muted">{t("quizHub.loading")}</p>
      )}
      {status === "error" && (
        <p className="text-caption text-error">
          {t("quizHub.error")}
        </p>
      )}
      {status === "ready" && filtered.length === 0 && (
        <p className="text-caption text-muted">
          {t("quizHub.emptyCategory")}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((q) => {
          const status = questionStatus(q.id);
          return (
            <Link
              key={q.id}
              href={`/notes/quiz/${q.id}`}
              className="flex items-center justify-between gap-3 rounded-card-lg bg-card p-4 shadow-sm"
            >
              <p className="text-body-medium text-ink">{q.question_text}</p>
              {status === "done" && (
                <span className="flex shrink-0 items-center gap-1 rounded-pill bg-surface px-2.5 py-1 text-caption text-ink">
                  <Check size={12} /> {t("quizHub.resultReady")}
                </span>
              )}
              {status === "waiting" && (
                <span className="flex shrink-0 items-center gap-1 rounded-pill bg-surface px-2.5 py-1 text-caption text-muted">
                  <Clock size={12} /> {t("quizHub.waiting")}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
