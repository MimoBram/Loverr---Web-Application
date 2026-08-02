"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";

/**
 * Masuk — login screen for the second partner's device to join an
 * already-created couple account (shared Supabase Auth email + password).
 */
export default function MasukPage() {
  const router = useRouter();
  const { signIn } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      await signIn(email.trim(), password);
      router.push("/pilih-profil");
    } catch (err) {
      setError(
        err instanceof Error
          ? "Email atau password salah. Coba lagi."
          : "Gagal masuk. Coba lagi.",
      );
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 bg-cream px-6 pb-10 pt-10">
      <button
        onClick={() => router.back()}
        aria-label="Kembali"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
      >
        <ArrowLeft size={20} className="text-ink" />
      </button>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-squircle bg-rose shadow-lg">
          <Heart size={28} className="fill-white text-white" />
        </div>
        <h1 className="text-heading text-ink">Masuk</h1>
        <p className="text-body-medium text-muted">
          Gabung ke ruang kenangan yang sudah dibuat pasanganmu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="kalian@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-caption text-error">{error}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Masuk…" : "Masuk"}
        </Button>
      </form>
    </main>
  );
}
