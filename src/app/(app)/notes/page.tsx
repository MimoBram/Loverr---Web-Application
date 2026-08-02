"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useSession } from "@/lib/session";
import { listNotes } from "@/lib/data/notes";
import { listQuestions, listAnswers } from "@/lib/data/quiz";
import { useT } from "@/lib/i18n";
import type { Note, QuizQuestion, QuizAnswer } from "@/lib/supabase/types";

type Status = "loading" | "ready" | "error";

/** Notes & Quiz Hub — matches Figma node 170:3. */
export default function NotesHubPage() {
  const { activeProfileId } = useSession();
  const t = useT();

  function timeAgo(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diffMs / 3_600_000);
    if (hours < 1) return t("common.justNow");
    if (hours < 24) return t("common.hoursAgo", { hours });
    const days = Math.floor(hours / 24);
    if (days === 1) return t("common.yesterday");
    return t("common.daysAgo", { days });
  }

  const [notes, setNotes] = useState<Note[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answersByQuestion, setAnswersByQuestion] = useState<Record<string, QuizAnswer[]>>({});
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    Promise.all([listNotes(), listQuestions()])
      .then(async ([noteData, questionData]) => {
        if (cancelled) return;
        setNotes(noteData);

        const preview = questionData.slice(0, 2);
        setQuestions(preview);
        const entries = await Promise.all(
          preview.map(async (q) => [q.id, await listAnswers(q.id)] as const),
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

  const fromPartner = notes.find((n) => n.author_profile_id !== activeProfileId);
  const myReply = notes.find((n) => n.author_profile_id === activeProfileId);

  function isAnswered(questionId: string) {
    const answers = answersByQuestion[questionId] ?? [];
    return answers.some((a) => a.profile_id === activeProfileId);
  }

  const cardColors = ["bg-periwinkle", "bg-violet"] as const;

  return (
    <main className="flex flex-col gap-6 px-5 pt-7">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold leading-none text-ink">
            {t("notesHub.title")}
          </h1>
          <p className="mt-2 text-[12.5px] font-medium text-muted">
            {t("notesHub.subtitle")}
          </p>
        </div>
        <Link
          href="/notes/compose"
          aria-label={t("notesHub.composeAria")}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-squircle bg-onyx shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]"
        >
          <Plus size={22} className="text-white" />
        </Link>
      </header>

      {status === "loading" && (
        <p className="text-caption text-muted">{t("notesHub.loading")}</p>
      )}
      {status === "error" && (
        <p className="text-caption text-error">
          {t("notesHub.error")}
        </p>
      )}

      {status === "ready" && (
        <>
          <section className="flex flex-col gap-3">
            <p className="text-[13.5px] font-bold text-subtle">{t("notesHub.todayLabel")}</p>

            {fromPartner ? (
              <Link
                href="/notes/compose"
                className="relative block h-[100px] w-full overflow-hidden rounded-[26px] bg-coral p-4"
              >
                <div className="absolute -right-8 -top-8 h-[120px] w-[120px] rounded-full bg-white/10" />
                <p className="text-[14px] font-extrabold text-white">
                  {t("notesHub.fromPartner")}
                </p>
                <p className="mt-1 truncate text-[12.5px] font-medium text-ink/90">
                  {fromPartner.content}
                </p>
                <p className="mt-1 text-[12.5px] text-ink/80">
                  {timeAgo(fromPartner.created_at)}
                </p>
              </Link>
            ) : (
              <Link
                href="/notes/compose"
                className="flex h-[100px] w-full items-center justify-center rounded-[26px] border-[1.5px] border-dashed border-divider bg-card"
              >
                <p className="text-body-medium text-muted">
                  {t("notesHub.noMessageToday")}
                </p>
              </Link>
            )}

            {myReply && (
              <div className="h-[100px] w-full rounded-[26px] border-[1.5px] border-divider bg-card p-4 shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
                <p className="text-[14px] font-bold text-ink">{t("notesHub.yourReply")}</p>
                <p className="mt-1 truncate text-[12.5px] font-medium text-muted">
                  {myReply.content}
                </p>
                <p className="mt-1 text-[12.5px] text-subtle">
                  {timeAgo(myReply.created_at)}
                </p>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-bold text-subtle">{t("notesHub.quizLabel")}</p>
              <Link href="/notes/quiz" className="text-label text-rose">
                {t("notesHub.viewAll")}
              </Link>
            </div>

            {questions.length === 0 && (
              <p className="text-caption text-muted">
                {t("notesHub.noQuestions")}
              </p>
            )}

            {questions.map((q, i) => {
              const answered = isAnswered(q.id);
              return (
                <Link
                  key={q.id}
                  href={`/notes/quiz/${q.id}`}
                  className={`relative block h-[116px] w-full overflow-hidden rounded-[26px] p-4 ${cardColors[i % cardColors.length]}`}
                >
                  <div className="absolute -right-8 -top-8 h-[130px] w-[130px] rounded-full bg-white/10" />
                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11.9px] bg-white shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]">
                    {answered ? (
                      <Check size={16} className="text-onyx" />
                    ) : (
                      <span className="text-[15px] font-bold text-onyx">?</span>
                    )}
                  </div>
                  <p className="mt-3 text-[14px] font-extrabold leading-[19px] text-white">
                    {q.question_text}
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-onyx/85">
                    {answered ? t("notesHub.answered") : t("notesHub.tapToAnswer")}
                  </p>
                </Link>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}
