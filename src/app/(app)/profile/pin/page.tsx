"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";

export default function ChangePinPage() {
  const router = useRouter();
  const { activeProfileId, updatePin } = useSession();

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function isValidPin(pin: string) {
    return /^\d{6}$/.test(pin);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!activeProfileId) return;
    if (!isValidPin(newPin)) {
      setError("PIN baru harus 6 digit angka.");
      return;
    }
    if (newPin !== confirmPin) {
      setError("Konfirmasi PIN tidak cocok.");
      return;
    }

    let ok: boolean;
    try {
      ok = await updatePin(activeProfileId, oldPin, newPin);
    } catch {
      setError("Gagal mengganti PIN. Coba lagi.");
      return;
    }
    if (!ok) {
      setError("PIN lama salah.");
      return;
    }

    setSaved(true);
    setTimeout(() => router.push("/profile"), 600);
  }

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
        <h1 className="text-heading text-ink">Ganti PIN</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="PIN Lama"
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={oldPin}
          onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
        />
        <Input
          label="PIN Baru (6 digit)"
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={newPin}
          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
        />
        <Input
          label="Konfirmasi PIN Baru"
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
        />

        {error && <p className="text-caption text-error">{error}</p>}
        {saved && <p className="text-caption text-ink">PIN berhasil diganti!</p>}

        <Button type="submit">Simpan PIN Baru</Button>
      </form>
    </main>
  );
}
