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
 * Fixed bottom navigation, mobile-only (matches the 375px screen constraint).
 * Tap targets are 44x44+ per the accessibility audit.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-screen -translate-x-1/2 border-t border-divider bg-white/95 backdrop-blur">
      <ul className="flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-3 py-1"
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  size={22}
                  className={active ? "text-rose" : "text-muted"}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-caption",
                    active ? "text-rose font-semibold" : "text-muted",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
