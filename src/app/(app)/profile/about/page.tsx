"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col gap-6 px-5 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-heading text-ink">Tentang Aplikasi</h1>
      </div>

      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-squircle bg-rose">
          <Heart size={28} className="fill-white text-white" />
        </div>
        <p className="text-card-title text-ink">Loverr</p>
        <p className="text-caption text-muted">Versi 0.1.0 (Core Flow)</p>
      </div>

      <div className="flex flex-col gap-3 rounded-card-lg bg-white p-4 text-body-medium text-ink shadow-sm">
        <p>
          Loverr adalah scrapbook &amp; ruang kenangan pribadi untuk kamu dan
          pasanganmu — simpan momen sehari-hari, tulis catatan kecil, dan
          jawab quiz mingguan bareng.
        </p>
        <p className="text-caption text-muted">
          Dibangun dengan Next.js, Tailwind CSS, dan Supabase.
        </p>
      </div>
    </main>
  );
}
