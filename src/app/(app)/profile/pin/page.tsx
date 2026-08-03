"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";

export default function ChangePinPage() {
  const router = useRouter();
  const { activeProfileId, updatePin } = useSession();
  const t = useT();

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
      setError(t("changePin.errorLength"));
      return;
    }
    if (newPin !== confirmPin) {
      setError(t("changePin.errorMismatch"));
      return;
    }

    let ok: boolean;
    try {
      ok = await updatePin(activeProfileId, oldPin, newPin);
    } catch (err) {
      console.error("updatePin failed:", err);
      const detail = err instanceof Error ? ` (${err.message})` : "";
      setError(t("changePin.errorGeneric") + detail);
      return;
    }
    if (!ok) {
      setError(t("changePin.errorCurrent"));
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
          aria-label={t("common.back")}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-sm"
        >
          <ArrowLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-heading text-ink">{t("changePin.title")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={t("changePin.currentLabel")}
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={oldPin}
          onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
        />
        <Input
          label={t("changePin.newLabel")}
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={newPin}
          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
        />
        <Input
          label={t("changePin.confirmLabel")}
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
        />

        {error && <p className="text-caption text-error">{error}</p>}
        {saved && <p className="text-caption text-ink">{t("changePin.saved")}</p>}

        <Button type="submit">{t("changePin.save")}</Button>
      </form>
    </main>
  );
}
