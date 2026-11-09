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
    <div className="relative bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-24 h-80 w-80 rounded-full bg-motion-green/30 blur-3xl"
      />
      <header className="shell relative py-14 md:py-20">
        <SectionLabel index="01">{t.services.label}</SectionLabel>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95]">
          {t.services.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
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
    <div className="bg-black text-white">
      <header className="shell py-14 md:py-20">
        <SectionLabel index="04">{t.partners.label}</SectionLabel>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95]">
          {t.partners.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
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
              <div className="flex items-start justify-between gap-2">
                <span className="font-display text-3xl sm:text-4xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
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
    <article className="bg-white text-motion-ink">
      <header className="shell py-14 md:py-20">
        <SectionLabel index="05" tone="green">
          {t.terms.label}
        </SectionLabel>
        <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[0.95]">
          {t.terms.title}
        </h1>
        <p className="mt-6 inline-flex rounded-full bg-motion-lime px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-black">
          {t.terms.draft}
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-motion-ink/75">
          {t.terms.lead}
        </p>
      </header>
      <ol className="shell max-w-3xl space-y-10 pb-20 md:pb-28">
        {t.terms.sections.map((section, index) => (
          <li key={section.title} className="border-t border-black/10 pt-8">
            <p className="font-display text-sm tracking-[0.18em] text-motion-green">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{section.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-motion-ink/80">
              {section.body}
            </p>
          </li>
        ))}
      </ol>
    </article>
  );
}
