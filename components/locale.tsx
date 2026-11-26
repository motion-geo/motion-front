"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { en } from "@/content/en";
import { ka } from "@/content/ka";
import type { Dictionary, Locale } from "@/content/types";
import { loadMergedDictionary } from "@/lib/texts";

const STORAGE_KEY = "motion-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function isLocale(value: string | null): value is Locale {
  return value === "ka" || value === "en";
}

function getLocaleSnapshot(): Locale {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(saved) ? saved : "ka";
}

function getServerLocaleSnapshot(): Locale {
  return "ka";
}

function applyLocale(locale: Locale) {
  window.localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
  emit();
}

function staticDictionary(locale: Locale): Dictionary {
  return locale === "ka" ? ka : en;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  const [t, setT] = useState<Dictionary>(() => staticDictionary(locale));
  const [activeLocale, setActiveLocale] = useState(locale);

  if (activeLocale !== locale) {
    setActiveLocale(locale);
    setT(staticDictionary(locale));
  }

  const setLocale = useCallback((next: Locale) => {
    applyLocale(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    const base = staticDictionary(locale);
    loadMergedDictionary(base, locale).then((merged) => {
      if (cancelled) return;
      setT(merged);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
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
