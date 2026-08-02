"use client";

import { useRouter } from "next/navigation";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/session";

/** Setup Selesai — confirmation screen after Setup Awal succeeds. */
export default function SetupSelesaiPage() {
  const router = useRouter();
  const { coupleName } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-cream px-6 pb-10 pt-20">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-squircle bg-violet shadow-lg">
          <PartyPopper size={44} className="text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-heading text-ink">Ruang kalian siap!</h1>
          <p className="text-body-medium text-muted">
            &ldquo;{coupleName}&rdquo; sudah dibuat. Yuk mulai simpan kenangan
            kalian berdua.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[335px]">
        <Button onClick={() => router.push("/pilih-profil")}>
          Pilih Profil
        </Button>
      </div>
    </main>
  );
}
