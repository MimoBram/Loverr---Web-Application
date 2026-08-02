"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  UserPen,
  Bell,
  Palette,
  Globe,
  Info,
  LogOut,
} from "lucide-react";
import { useSession } from "@/lib/session";

const AVATAR_COLORS: Record<string, string> = {
  "avatar-1": "bg-coral",
  "avatar-2": "bg-periwinkle",
  "avatar-3": "bg-violet",
  "avatar-4": "bg-rose",
};

function formatSince(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const SECTIONS: {
  label: string;
  items: { href: string; label: string; icon: typeof UserPen; color: string; action?: "logout" }[];
}[] = [
  {
    label: "AKUN",
    items: [
      { href: "/profile/edit", label: "Edit Profil", icon: UserPen, color: "bg-coral" },
      { href: "/profile/notifications", label: "Notifikasi", icon: Bell, color: "bg-coral" },
    ],
  },
  {
    label: "APLIKASI",
    items: [
      { href: "/profile/theme", label: "Tema Tampilan", icon: Palette, color: "bg-periwinkle" },
      { href: "/profile/language", label: "Bahasa", icon: Globe, color: "bg-periwinkle" },
    ],
  },
  {
    label: "LAINNYA",
    items: [
      { href: "/profile/about", label: "Tentang Aplikasi", icon: Info, color: "bg-[#bc831e]" },
      { href: "/", label: "Keluar", icon: LogOut, color: "bg-[#bc831e]", action: "logout" },
    ],
  },
];

/** Profile & Settings — matches Figma node 173:3. */
export default function ProfilePage() {
  const router = useRouter();
  const { coupleName, profiles, logoutProfile } = useSession();
  const oldestCreated = profiles.reduce<string | null>(
    (min, p) => (min === null || p.created_at < min ? p.created_at : min),
    null,
  );

  function handleLogout() {
    logoutProfile();
    router.push("/");
  }

  return (
    <main className="flex flex-col gap-6 px-5 pt-5 pb-6">
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => router.push("/home")}
          aria-label="Kembali"
          className="absolute left-0 flex h-11 w-11 items-center justify-center text-ink"
        >
          <ChevronLeft size={26} />
        </button>
        <h1 className="text-[19px] font-extrabold text-ink">
          Profil &amp; Pengaturan
        </h1>
      </div>

      <div className="relative h-[168px] w-full overflow-hidden rounded-card-lg bg-coral">
        <div className="absolute -right-9 -top-5 h-[150px] w-[150px] rounded-full bg-white/10" />
        <div className="absolute left-1/2 top-6 flex -translate-x-1/2 items-center">
          {profiles.slice(0, 2).map((p, i) => (
            <div
              key={p.id}
              className={`flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-coral font-extrabold text-white ${
                AVATAR_COLORS[p.avatar_key] ?? "bg-rose"
              } ${i > 0 ? "-ml-5" : ""}`}
            >
              {p.display_name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        <p className="absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[18px] font-extrabold text-white">
          {coupleName}
        </p>
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[12.5px] font-medium text-ink/85">
          {oldestCreated ? `Bersama sejak ${formatSince(oldestCreated)}` : ""}
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.label} className="flex flex-col gap-3">
          <p className="text-[13.5px] font-bold text-subtle">{section.label}</p>
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0px_6px_18px_0px_rgba(77,51,77,0.1)]">
            {section.items.map(({ href, label, icon: Icon, color, action }, i) => {
              const content = (
                <>
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)] ${color}`}
                  >
                    <Icon size={17} className="text-white" />
                  </div>
                  <span className="flex-1 text-[14px] font-bold text-ink">
                    {label}
                  </span>
                  <ChevronRight size={17} className="text-subtle" />
                </>
              );

              if (action === "logout") {
                return (
                  <button
                    key={href}
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-3 px-4 py-4 ${
                      i > 0 ? "border-t border-divider" : ""
                    }`}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-4 ${
                    i > 0 ? "border-t border-divider" : ""
                  }`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </main>
  );
}
