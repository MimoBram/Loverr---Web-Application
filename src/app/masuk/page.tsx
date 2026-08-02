"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * This app is permanently seeded for exactly one couple (Mimo & Odyy) —
 * every device signs into the same shared account silently in the
 * background (see SessionProvider), so there's no "Masuk" login form
 * anymore. This route is kept only so old links/bookmarks don't 404.
 */
export default function MasukPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pilih-profil");
  }, [router]);

  return null;
}
