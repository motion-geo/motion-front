"use client";

import Link from "next/link";
import { useLocale, usePageTitle } from "./locale";
import { PlanCard } from "./plan-card";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";
import { usePlans } from "./use-plans";

export function PlansPage() {
  const { t } = useLocale();
  const { items: plans } = usePlans();
  usePageTitle(`${t.nav.plans} · Motion`);

  return (
    <div className="bg-page text-page-fg">
      <div className="shell py-14 md:py-20">
        <header className="max-w-3xl">
          <SectionLabel>{t.plans.label}</SectionLabel>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95]">
            {t.plans.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted">
            {t.plans.lead}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">
            {t.plans.note}
          </p>
        </header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 0.04}>
              <PlanCard plan={plan} chooseLabel={t.plans.choose} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 md:mt-14">
          <section className="relative overflow-hidden rounded-[2rem] border border-line bg-soft px-6 py-10 sm:px-10 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
            />
            <div className="relative max-w-2xl">
              <SectionLabel>{t.plans.custom.label}</SectionLabel>
              <h2 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-bold leading-[1.02]">
                {t.plans.custom.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                {t.plans.custom.body}
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-fg transition-transform hover:scale-[1.02]"
              >
                {t.plans.custom.cta}
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
