"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/config";
import { FIXED_PROFILES } from "@/lib/mock-data";

const COUPLE_NAME = "Mimo & Odyy";

/**
 * Setup Awal — first-run flow.
 * This build of Loverr is permanently seeded for exactly one couple
 * (Mimo & Odyy, matching the Figma design), so there's no generic
 * "type your names/PINs" form — just the shared account credentials
 * needed to create the Supabase Auth login for this couple.
 */
export default function SetupAwalPage() {
  const router = useRouter();
  const { completeSetup } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isSupabaseConfigured) {
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        setError("Email akun bersama wajib diisi dengan format yang benar.");
        return;
      }
      if (password.length < 6) {
        setError("Password akun bersama minimal 6 karakter.");
        return;
      }
    }

    setSaving(true);
    try {
      await completeSetup({
        email: email.trim(),
        password,
        coupleName: COUPLE_NAME,
        profiles: FIXED_PROFILES.map((p) => ({
          display_name: p.display_name,
          avatar_key: p.avatar_key,
          pin: p.pin,
        })),
      });
      router.push("/setup-selesai");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat akun. Coba lagi.");
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-cream px-5 pb-12 pt-10">
      <div>
        <h1 className="text-heading text-ink">Setup Awal</h1>
        <p className="text-body-medium text-muted">
          Ruang kenangan untuk {COUPLE_NAME}. Cukup dibuat sekali di awal.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-card-lg bg-white p-4 shadow-sm">
        <div className="flex -space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-coral font-extrabold text-white">
            M
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-periwinkle font-extrabold text-white">
            O
          </div>
        </div>
        <div>
          <p className="text-card-title text-ink">{COUPLE_NAME}</p>
          <p className="text-caption text-muted">PIN masing-masing sudah diset</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {isSupabaseConfigured && (
          <div className="flex flex-col gap-3 rounded-card-lg border border-divider bg-white p-4">
            <p className="text-label text-ink">Akun Bersama</p>
            <p className="text-caption text-muted">
              Dipakai pasanganmu untuk gabung dari HP-nya sendiri lewat halaman Masuk.
            </p>
            <Input
              label="Email"
              type="email"
              placeholder="kalian@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password (min. 6 karakter)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {error && <p className="text-caption text-error">{error}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Membuat ruang kenangan…" : "Lanjutkan"}
        </Button>

        {isSupabaseConfigured && (
          <Link href="/masuk" className="text-center text-label text-rose">
            Pasanganmu sudah setup duluan? Masuk di sini
          </Link>
        )}
      </form>
    </main>
  );
}
