"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { en } from "@/content/en";
import { ka } from "@/content/ka";
import type { Dictionary, Locale } from "@/content/types";

const STORAGE_KEY = "motion-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ka");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ka") setLocale(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, ready]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: locale === "ka" ? ka : en,
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return value;
}

export function usePageTitle(title: string) {
  useEffect(() => {
    const apply = () => {
      document.title = title;
    };
    apply();
    const id = window.setTimeout(apply, 0);
    return () => window.clearTimeout(id);
  }, [title]);
}
