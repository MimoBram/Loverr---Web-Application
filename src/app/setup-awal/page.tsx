"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * This app is permanently seeded for exactly one couple (Mimo & Odyy) with
 * fixed PINs — there is no registration flow anymore. This route is kept
 * only so old links/bookmarks don't 404; it just bounces to Pilih Profil.
 */
export default function SetupAwalPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pilih-profil");
  }, [router]);

  return null;
}
