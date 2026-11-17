"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useLocale, usePageTitle } from "./locale";
import { Reveal } from "./reveal";
import { SampleBadge, SectionLabel } from "./section-label";

export function PlansPage() {
  const { t } = useLocale();
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
          {t.plans.items.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 0.04}>
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

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span
                    className={`pb-1 text-sm ${
                      plan.featured ? "text-accent-fg/70" : "text-fg-muted"
                    }`}
                  >
                    {plan.period}
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
                  {t.plans.choose}
                </Link>
              </article>
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
