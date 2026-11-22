"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import type { Plan } from "@/content/types";
import { periodChipLabel } from "@/lib/plan-periods";
import { useLocale } from "./locale";
import { SampleBadge } from "./section-label";

export function PlanCard({ plan, chooseLabel }: { plan: Plan; chooseLabel: string }) {
  const { locale, t } = useLocale();
  const pricing = plan.pricing?.length
    ? plan.pricing
    : [{ unit: "month" as const, quantity: 1, price: plan.price, period: plan.period }];
  const [active, setActive] = useState(0);
  const selected = pricing[Math.min(active, pricing.length - 1)] ?? pricing[0];

  return (
    <article
      className={`flex h-full flex-col rounded-[1.7rem] border p-6 sm:p-7 ${
        plan.featured
          ? "border-accent bg-accent text-accent-fg"
          : "border-line bg-soft text-page-fg"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{plan.name}</h2>
          <p
            className={`mt-2 text-sm leading-relaxed ${
              plan.featured ? "text-accent-fg/75" : "text-fg-muted"
            }`}
          >
            {plan.summary}
          </p>
        </div>
        <SampleBadge label={t.sample} />
      </div>

      {pricing.length > 1 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {pricing.map((tier, index) => {
            const selectedTier = index === active;
            return (
              <button
                key={`${tier.unit}-${tier.quantity}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedTier
                    ? plan.featured
                      ? "bg-page text-page-fg"
                      : "bg-accent text-accent-fg"
                    : plan.featured
                      ? "bg-accent-fg/15 text-accent-fg"
                      : "bg-page text-fg-muted"
                }`}
              >
                {periodChipLabel(tier.unit, tier.quantity, locale)}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-6 flex items-end gap-2 sm:mt-8">
        <span className="text-4xl font-bold tracking-tight">{selected.price}</span>
        <span
          className={`pb-1 text-sm ${
            plan.featured ? "text-accent-fg/70" : "text-fg-muted"
          }`}
        >
          {selected.period}
        </span>
      </div>

      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-snug">
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                plan.featured ? "text-accent-fg" : "text-accent"
              }`}
              strokeWidth={2.5}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-transform hover:scale-[1.02] ${
          plan.featured
            ? "bg-page text-page-fg"
            : "bg-accent text-accent-fg"
        }`}
      >
        {chooseLabel}
      </Link>
    </article>
  );
}
