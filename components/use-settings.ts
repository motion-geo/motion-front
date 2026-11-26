"use client";

import { useEffect, useState } from "react";
import {
  fallbackSettings,
  loadSettings,
  type SiteSettingsView,
} from "@/lib/settings";
import { useLocale } from "./locale";

export function useSettings() {
  const { locale, t } = useLocale();
  const [settings, setSettings] = useState<SiteSettingsView>(() =>
    fallbackSettings(locale, t.terms),
  );
  const [loading, setLoading] = useState(true);
  const [activeLocale, setActiveLocale] = useState(locale);

  if (activeLocale !== locale) {
    setActiveLocale(locale);
    setLoading(true);
    setSettings(fallbackSettings(locale, t.terms));
  }

  useEffect(() => {
    let cancelled = false;
    loadSettings(locale, t.terms).then((row) => {
      if (cancelled) return;
      setSettings(row);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [locale, t.terms]);

  return { settings, loading };
}
