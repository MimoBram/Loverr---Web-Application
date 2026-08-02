"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useSession } from "@/lib/session";
import { getQuestion, listAnswers, submitAnswer } from "@/lib/data/quiz";
import type { QuizQuestion, QuizAnswer } from "@/lib/supabase/types";

/** Quiz Interaction + Quiz Result, combined per-question. */
export default function QuizQuestionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { activeProfileId, profiles } = useSession();

  const [question, setQuestion] = useState<QuizQuestion | null | undefined>(undefined);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const q = await getQuestion(params.id);
    setQuestion(q ?? null);
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
  const other = profiles.find((p) => p.id !== activeProfileId);
  const otherAnswer = other ? answers.find((a) => a.profile_id === other.id) : undefined;
  const me = profiles.find((p) => p.id === activeProfileId);

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
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/notes/quiz")}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-heading text-ink">Quiz</h1>
      </div>

      <div className="flex items-start gap-3 rounded-card-lg bg-violet p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25">
          <Sparkles size={18} className="text-white" />
        </div>
        <p className="text-card-title text-white">{question.question_text}</p>
      </div>

      {!myAnswer && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            autoFocus
            rows={4}
            placeholder="Tulis jawabanmu..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full rounded-card-lg border-2 border-input-stroke bg-white px-4 py-3 text-body-medium text-ink placeholder:text-muted focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
          />
          {error && <p className="text-caption text-error">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Mengirim…" : "Kirim Jawaban"}
          </Button>
        </form>
      )}

      {myAnswer && !otherAnswer && (
        <div className="flex flex-col items-center gap-2 rounded-card-lg bg-white p-6 text-center shadow-sm">
          <p className="text-card-title text-ink">Jawabanmu terkirim!</p>
          <p className="text-body-medium text-muted">
            Menunggu {other?.display_name ?? "pasanganmu"} menjawab juga —
            hasilnya akan muncul di sini.
          </p>
        </div>
      )}

      {myAnswer && otherAnswer && (
        <div className="flex flex-col gap-3">
          <p className="text-section-title text-ink">Jawaban Kalian</p>
          <div className="flex flex-col gap-2 rounded-card-lg bg-coral p-4">
            <div className="flex items-center gap-2">
              {me && <Avatar avatarKey={me.avatar_key} name={me.display_name} size="sm" />}
              <p className="text-label text-white">{me?.display_name}</p>
            </div>
            <p className="text-body-medium text-ink">{myAnswer.answer_text}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-card-lg bg-periwinkle p-4">
            <div className="flex items-center gap-2">
              {other && (
                <Avatar avatarKey={other.avatar_key} name={other.display_name} size="sm" />
              )}
              <p className="text-label text-white">{other?.display_name}</p>
            </div>
            <p className="text-body-medium text-ink">{otherAnswer.answer_text}</p>
          </div>
        </div>
      )}
    </main>
  );
}
