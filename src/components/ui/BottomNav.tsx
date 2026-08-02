"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookHeart, MessageCircleHeart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/timeline", label: "Scrapbook", icon: BookHeart },
  { href: "/notes", label: "Notes", icon: MessageCircleHeart },
  { href: "/profile", label: "Profil", icon: User },
] as const;

/**
 * Floating icon-only bottom nav — matches the Figma "black pill" nav bar
 * used across the core flow (Home, Timeline, Notes Hub, Profile).
 * Tap targets stay 44x44+ per the accessibility audit even though the
 * visible icon/badge is smaller.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-32px)] max-w-[343px] -translate-x-1/2">
      <ul className="flex h-[76px] items-center justify-around rounded-[38px] bg-ink px-3 shadow-[0px_8px_20px_0px_rgba(26,13,26,0.28)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="flex h-[48px] w-[56px] items-center justify-center"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-[19.2px] transition-colors",
                    active && "bg-white shadow-[0px_3px_6px_0px_rgba(38,20,31,0.22)]",
                  )}
                >
                  <Icon
                    size={22}
                    className={active ? "text-ink" : "text-white/60"}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
