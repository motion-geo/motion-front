"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/content/types";
import { loadServices } from "@/lib/services";
import { useLocale } from "./locale";

export function useServices() {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<Service[]>(t.services.items);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadServices(locale).then((rows) => {
      if (cancelled) return;
      setItems(rows.length ? rows : t.services.items);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [locale, t.services.items]);

  return { items, loading };
}
