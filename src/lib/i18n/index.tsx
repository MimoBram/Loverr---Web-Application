"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionary, type DictionaryKey } from "./dictionary";

export type Language = "id" | "en";

const KEY = "loverr:lang";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Persists the couple's preferred UI language (device-local). Defaults to
 * Indonesian since that's the app's native language — English is opt-in
 * via Profil > Bahasa.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "en" || stored === "id") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    window.localStorage.setItem(KEY, next);
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}

/**
 * `t("home.greeting")` looks up the active language's copy for that key.
 * Pass a second arg to interpolate `{placeholders}`, e.g.
 * `t("home.timeAgo.hours", { count: 3 })`.
 */
export function useT() {
  const { lang } = useLanguage();
  return useCallback(
    (key: DictionaryKey, vars?: Record<string, string | number>) => {
      const entry = dictionary[key];
      if (!entry) return key;
      return interpolate(entry[lang], vars);
    },
    [lang],
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
