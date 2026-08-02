"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserPen, KeyRound, Info, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/lib/session";

const SETTINGS_ITEMS = [
  { href: "/profile/edit", label: "Edit Profil", icon: UserPen },
  { href: "/profile/pin", label: "Ganti PIN", icon: KeyRound },
  { href: "/profile/about", label: "Tentang Aplikasi", icon: Info },
] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { coupleName, profiles, activeProfileId, logoutProfile } = useSession();
  const me = profiles.find((p) => p.id === activeProfileId);

  function handleSwitchProfile() {
    logoutProfile();
    router.push("/pilih-profil");
  }

  return (
    <main className="flex flex-col gap-6 px-5 pt-10">
      <header className="flex flex-col items-center gap-3 text-center">
        {me && (
          <Avatar avatarKey={me.avatar_key} name={me.display_name} size="lg" />
        )}
        <div>
          <h1 className="text-heading text-ink">{me?.display_name}</h1>
          <p className="text-body text-muted">{coupleName}</p>
        </div>
      </header>

      <div className="flex flex-col overflow-hidden rounded-card-lg bg-white shadow-sm">
        {SETTINGS_ITEMS.map(({ href, label, icon: Icon }, i) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-4 ${
              i > 0 ? "border-t border-divider" : ""
            }`}
          >
            <Icon size={18} className="text-rose" />
            <span className="flex-1 text-body-medium text-ink">{label}</span>
            <ChevronRight size={16} className="text-muted" />
          </Link>
        ))}
      </div>

      <Button variant="secondary" onClick={handleSwitchProfile}>
        <LogOut size={18} className="mr-2" />
        Ganti Profil
      </Button>
    </main>
  );
}
