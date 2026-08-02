"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/config";

const AVATAR_OPTIONS = ["avatar-1", "avatar-2", "avatar-3", "avatar-4"];

interface PartnerForm {
  name: string;
  avatarKey: string;
  pin: string;
}

function emptyPartner(defaultAvatar: string): PartnerForm {
  return { name: "", avatarKey: defaultAvatar, pin: "" };
}

/** Setup Awal — first-run flow to create the couple + the two profiles. */
export default function SetupAwalPage() {
  const router = useRouter();
  const { completeSetup } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [partner1, setPartner1] = useState<PartnerForm>(
    emptyPartner("avatar-1"),
  );
  const [partner2, setPartner2] = useState<PartnerForm>(
    emptyPartner("avatar-2"),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function isValidPin(pin: string) {
    return /^\d{4,6}$/.test(pin);
  }

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
    if (!coupleName.trim()) {
      setError("Nama panggilan kalian berdua wajib diisi.");
      return;
    }
    if (!partner1.name.trim() || !partner2.name.trim()) {
      setError("Nama kedua partner wajib diisi.");
      return;
    }
    if (!isValidPin(partner1.pin) || !isValidPin(partner2.pin)) {
      setError("PIN harus 4–6 digit angka untuk masing-masing partner.");
      return;
    }

    setSaving(true);
    try {
      await completeSetup({
        email: email.trim(),
        password,
        coupleName: coupleName.trim(),
        profiles: [
          { display_name: partner1.name.trim(), avatar_key: partner1.avatarKey, pin: partner1.pin },
          { display_name: partner2.name.trim(), avatar_key: partner2.avatarKey, pin: partner2.pin },
        ],
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
          Buat ruang kenangan kalian berdua. Cukup sekali di awal.
        </p>
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

        <Input
          label="Nama panggilan kalian berdua"
          placeholder="cth. Mimo & Odyy"
          value={coupleName}
          onChange={(e) => setCoupleName(e.target.value)}
        />

        <PartnerSection
          title="Partner 1"
          value={partner1}
          onChange={setPartner1}
        />
        <PartnerSection
          title="Partner 2"
          value={partner2}
          onChange={setPartner2}
        />

        {error && <p className="text-caption text-error">{error}</p>}

        <Button type="submit" disabled={saving}>
          {saving ? "Membuat ruang kenangan…" : "Lanjutkan"}
        </Button>

        {isSupabaseConfigured && (
          <Link
            href="/masuk"
            className="text-center text-label text-rose"
          >
            Pasanganmu sudah setup duluan? Masuk di sini
          </Link>
        )}
      </form>
    </main>
  );
}

function PartnerSection({
  title,
  value,
  onChange,
}: {
  title: string;
  value: PartnerForm;
  onChange: (v: PartnerForm) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-card-lg border border-divider bg-white p-4">
      <p className="text-label text-ink">{title}</p>

      <div className="flex items-center gap-3">
        {AVATAR_OPTIONS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange({ ...value, avatarKey: key })}
            className={cn(
              "rounded-full transition-transform",
              value.avatarKey === key && "scale-110 ring-2 ring-rose ring-offset-2",
            )}
            aria-label={`Pilih avatar ${key}`}
          >
            <Avatar avatarKey={key} name={value.name || "?"} size="sm" />
          </button>
        ))}
      </div>

      <Input
        label="Nama"
        placeholder="Nama panggilan"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <Input
        label="PIN (4–6 digit)"
        placeholder="••••"
        inputMode="numeric"
        maxLength={6}
        value={value.pin}
        onChange={(e) =>
          onChange({ ...value, pin: e.target.value.replace(/\D/g, "") })
        }
      />
    </div>
  );
}
