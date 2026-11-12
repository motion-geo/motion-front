"use client";

import { useLocale, usePageTitle } from "./locale";
import { Mark } from "./logo";
import { Reveal } from "./reveal";
import { SampleBadge, SectionLabel } from "./section-label";
import { ServiceGrid } from "./service-grid";
import { partnerFaces } from "./work-styles";

export function ServicesPage() {
  const { t } = useLocale();
  usePageTitle(`${t.nav.services} · Motion`);

  return (
    <div className="relative bg-page text-page-fg">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl"
      />
      <header className="shell relative py-14 md:py-20">
        <SectionLabel>{t.services.label}</SectionLabel>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95]">
          {t.services.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
          {t.services.lead}
        </p>
      </header>
      <div className="shell relative pb-20 md:pb-28">
        <ServiceGrid items={t.services.items} detailed />
      </div>
    </div>
  );
}

export function PartnersPage() {
  const { t } = useLocale();
  usePageTitle(`${t.nav.partners} · Motion`);

  return (
    <div className="bg-page text-page-fg">
      <header className="shell py-14 md:py-20">
        <SectionLabel>{t.partners.label}</SectionLabel>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95]">
          {t.partners.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
          {t.partners.lead}
        </p>
      </header>
      <div className="shell grid grid-cols-2 gap-3 pb-20 sm:grid-cols-3 md:pb-28 lg:grid-cols-4">
        {partnerFaces.map((face, index) => (
          <Reveal key={face.bg + index}>
            <article
              className="flex aspect-[4/3] flex-col justify-between rounded-[1.5rem] p-4 sm:p-5"
              style={{ background: face.bg, color: face.fg }}
            >
              <div className="flex items-start justify-end gap-2">
                <SampleBadge label={t.sample} />
              </div>
              <div className="flex items-end justify-between gap-3">
                <p className="text-xs font-medium leading-snug">
                  {t.partners.slot}
                </p>
                <Mark className="h-10 w-12 shrink-0 sm:h-12 sm:w-14" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function TermsPage() {
  const { t } = useLocale();
  usePageTitle(`${t.nav.terms} · Motion`);

  return (
    <article className="bg-page text-page-fg">
      <div className="shell max-w-3xl py-14 md:py-20">
        <header>
          <SectionLabel tone="brand">{t.terms.label}</SectionLabel>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[0.95]">
            {t.terms.title}
          </h1>
          <p className="mt-6 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-fg">
            {t.terms.draft}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted">
            {t.terms.lead}
          </p>
        </header>
        <ol className="mt-12 space-y-10 pb-8 md:pb-16">
          {t.terms.sections.map((section) => (
            <li key={section.title} className="border-t border-line pt-8">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">
                {section.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
