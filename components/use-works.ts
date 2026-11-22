"use client";

import { useEffect, useState } from "react";
import type { WorkItem } from "@/content/types";
import { loadWorks } from "@/lib/works";
import { useLocale } from "./locale";

export function useWorks() {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<WorkItem[]>(t.works.items);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadWorks(locale).then((rows) => {
      if (cancelled) return;
      setItems(rows.length ? rows : t.works.items);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [locale, t.works.items]);

  return { items, loading };
}
