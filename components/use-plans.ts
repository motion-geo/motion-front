"use client";

import { useEffect, useState } from "react";
import type { Plan } from "@/content/types";
import { loadPlans, normalizePlans } from "@/lib/plans";
import { useAuth } from "./auth";
import { useLocale } from "./locale";

export function usePlans() {
  const { locale, t } = useLocale();
  const { token } = useAuth();
  const [items, setItems] = useState<Plan[]>(() =>
    normalizePlans(t.plans.items),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPlans(locale, token).then((rows) => {
      if (cancelled) return;
      setItems(rows.length ? rows : normalizePlans(t.plans.items));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [locale, token, t.plans.items]);

  return { items, loading };
}
