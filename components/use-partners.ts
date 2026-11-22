"use client";

import { useEffect, useState } from "react";
import type { Partner } from "@/content/types";
import { loadPartners } from "@/lib/partners";
import { useLocale } from "./locale";
import { useServices } from "./use-services";

export function usePartners() {
  const { locale, t } = useLocale();
  const { items: services } = useServices();
  const [items, setItems] = useState<Partner[]>(t.partners.items);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPartners(locale, services).then((rows) => {
      if (cancelled) return;
      setItems(rows.length ? rows : t.partners.items);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [locale, services, t.partners.items]);

  return { items, loading };
}
