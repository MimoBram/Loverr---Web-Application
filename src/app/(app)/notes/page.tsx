"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenLine, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { listNotes } from "@/lib/data/notes";
import type { Note } from "@/lib/supabase/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotesHubPage() {
  const { activeProfileId, profiles } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    listNotes()
      .then((data) => {
        if (!cancelled) {
          setNotes(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex flex-col gap-6 px-5 pt-10">
      <header>
        <h1 className="text-heading text-ink">Notes &amp; Quiz</h1>
        <p className="text-body-medium text-muted">
          Ruang kecil buat saling ngobrol dan lebih kenal satu sama lain.
        </p>
      </header>

      <Link href="/notes/quiz">
        <Card color="violet" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={22} className="text-white" />
            <div>
              <p className="text-card-title text-white">Quiz Mingguan</p>
              <p className="text-caption text-ink">
                Jawab bareng, lihat hasilnya bareng.
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="shrink-0 text-white" />
        </Card>
      </Link>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-section-title text-ink">Notes</h2>
          <Link
            href="/notes/compose"
            className="flex items-center gap-1 text-label text-rose"
          >
            <PenLine size={14} />
            Tulis
          </Link>
        </div>

        {status === "loading" && (
          <p className="text-caption text-muted">Memuat catatan…</p>
        )}
        {status === "error" && (
          <p className="text-caption text-error">
            Gagal memuat catatan. Coba muat ulang halaman.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {status === "ready" && notes.length === 0 && (
            <Card color="surface">
              <CardBody>Belum ada catatan. Tulis yang pertama, yuk.</CardBody>
            </Card>
          )}

          {notes.map((note) => {
            const author = profiles.find((p) => p.id === note.author_profile_id);
            const isMine = note.author_profile_id === activeProfileId;
            return (
              <div
                key={note.id}
                className={cn("flex items-end gap-2", isMine && "flex-row-reverse")}
              >
                {author && (
                  <Avatar avatarKey={author.avatar_key} name={author.display_name} size="sm" />
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-card-lg px-4 py-3",
                    isMine ? "bg-rose text-white" : "bg-white text-ink shadow-sm",
                  )}
                >
                  <p className="text-body-medium">{note.content}</p>
                  <p
                    className={cn(
                      "mt-1 text-caption",
                      isMine ? "text-white/80" : "text-muted",
                    )}
                  >
                    {formatTime(note.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
