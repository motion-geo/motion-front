import type { Locale, Plan, PlanPricingTier } from "@/content/types";
import {
  apiFetchPlans,
  apiFetchPlansForMe,
  type ApiPlan,
} from "./api";
import { periodLabel } from "./plan-periods";

function mapPricing(item: ApiPlan, locale: Locale): PlanPricingTier[] {
  const tiers = item.pricing?.length
    ? item.pricing
    : [{ unit: "month" as const, quantity: 1, price: "—" }];

  return tiers.map((tier) => ({
    unit: tier.unit,
    quantity: tier.quantity,
    price: tier.price,
    period: periodLabel(tier.unit, tier.quantity, locale),
  }));
}

export function mapApiPlan(item: ApiPlan, locale: Locale): Plan {
  const pricing = mapPricing(item, locale);
  const primary = pricing[0];
  return {
    id: item.slug,
    name: locale === "ka" ? item.nameKa : item.nameEn,
    summary: locale === "ka" ? item.summaryKa : item.summaryEn,
    price: primary.price,
    period: primary.period,
    pricing,
    features: locale === "ka" ? item.featuresKa : item.featuresEn,
    featured: item.featured,
  };
}

function withPricingFallback(plans: Plan[]): Plan[] {
  return plans.map((plan) => {
    if (plan.pricing?.length) return plan;
    return {
      ...plan,
      pricing: [
        {
          unit: "month",
          quantity: 1,
          price: plan.price,
          period: plan.period,
        },
      ],
    };
  });
}

export async function loadPlans(
  locale: Locale,
  token?: string | null,
): Promise<Plan[]> {
  try {
    const rows = token
      ? await apiFetchPlansForMe(token)
      : await apiFetchPlans();
    return rows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => mapApiPlan(item, locale));
  } catch {
    return [];
  }
}

export function normalizePlans(plans: Plan[]): Plan[] {
  return withPricingFallback(plans);
}
