import type { Locale, PlanPricingTier } from "@/content/types";

export function periodLabel(
  unit: PlanPricingTier["unit"],
  quantity: number,
  locale: Locale,
): string {
  if (locale === "ka") {
    if (unit === "month") {
      return quantity === 1 ? "/ თვე" : `/ ${quantity} თვე`;
    }
    if (unit === "year") {
      return quantity === 1 ? "/ წელი" : `/ ${quantity} წელი`;
    }
    if (unit === "week") {
      return quantity === 1 ? "/ კვირა" : `/ ${quantity} კვირა`;
    }
    return quantity === 1 ? "/ დღე" : `/ ${quantity} დღე`;
  }

  if (unit === "month") {
    return quantity === 1 ? "/ month" : `/ ${quantity} months`;
  }
  if (unit === "year") {
    return quantity === 1 ? "/ year" : `/ ${quantity} years`;
  }
  if (unit === "week") {
    return quantity === 1 ? "/ week" : `/ ${quantity} weeks`;
  }
  return quantity === 1 ? "/ day" : `/ ${quantity} days`;
}

export function periodChipLabel(
  unit: PlanPricingTier["unit"],
  quantity: number,
  locale: Locale,
): string {
  return periodLabel(unit, quantity, locale).replace(/^\//, "").trim();
}
