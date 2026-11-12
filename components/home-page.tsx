"use client";

import Link from "next/link";
import { BrandVideo } from "./brand-video";
import { useLocale, usePageTitle } from "./locale";
import { Mark } from "./logo";
import { Marquee } from "./marquee";
import { Reveal } from "./reveal";
import { SampleBadge, SectionLabel } from "./section-label";
import { ServiceGrid } from "./service-grid";
import { partnerFaces, workFaces } from "./work-styles";

export function HomePage() {
  const { t } = useLocale();
  usePageTitle(t.meta.title);
  const preview = t.works.items.slice(0, 3);

  return (
    <>
      <section className="bg-page text-page-fg">
        <div className="shell grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-12 lg:grid-cols-[1.12fr_0.88fr] lg:py-16">
          <Reveal>
            <SectionLabel>Motion</SectionLabel>
            <h1 className="mt-5 max-w-4xl text-[clamp(2.35rem,6.2vw,5.5rem)] font-bold leading-[0.94] tracking-tight">
              {t.hero.title}
            </h1>
            <div className="mt-6 h-0.5 w-24 bg-page-fg" />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
              {t.hero.lead}
            </p>
            <p className="mt-6 font-display text-sm tracking-[0.22em] text-brand">
              {t.hero.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg"
              >
                {t.cta.services}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium"
              >
                {t.cta.contact}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="overflow-hidden rounded-[1.8rem] border border-line bg-panel">
                <BrandVideo
                  src="/brand/primary.mp4"
                  className="aspect-video w-full object-contain"
                />
              </div>
              <Mark className="pointer-events-none absolute -left-3 -top-5 hidden h-14 w-16 text-accent md:block" />
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee />

      <section className="bg-panel text-panel-fg">
        <div className="shell grid items-center gap-10 py-20 md:py-28 lg:grid-cols-[1.4fr_0.6fr]">
          <Reveal>
            <SectionLabel tone="brand">{t.who.label}</SectionLabel>
            <p className="mt-6 text-[clamp(1.45rem,2.6vw,2.35rem)] font-medium leading-snug">
              {t.who.body}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="lg:justify-self-end">
            <Mark className="h-28 w-32 text-brand sm:h-36 sm:w-40" />
          </Reveal>
        </div>
      </section>

      <section className="bg-page text-page-fg">
        <div className="shell py-20 md:py-28">
          <div className="grid gap-4 lg:grid-cols-2">
            <Reveal>
              <article className="flex h-full flex-col rounded-[1.8rem] bg-card p-6 text-card-fg sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold text-brand sm:text-3xl">
                    {t.mission.label}
                  </h2>
                  <TargetIcon />
                </div>
                <p className="mt-6 text-lg leading-relaxed">{t.mission.body}</p>
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className="flex h-full flex-col rounded-[1.8rem] bg-card p-6 text-card-fg sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold text-brand sm:text-3xl">
                    {t.vision.label}
                  </h2>
                  <BulbIcon />
                </div>
                <p className="mt-6 text-lg leading-relaxed">{t.vision.body}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-page pb-20 text-page-fg md:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="shell relative">
          <Reveal className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>{t.services.label}</SectionLabel>
              <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[0.98]">
                {t.services.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted">
                {t.services.lead}
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-accent-fg sm:text-sm"
            >
              {t.cta.services}
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <ServiceGrid items={t.services.items} />
        </div>
      </section>

      <section className="bg-muted text-muted-fg">
        <div className="shell py-20 md:py-28">
          <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel tone="brand">{t.works.label}</SectionLabel>
              <h2 className="mt-4 max-w-xl text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[0.98]">
                {t.works.title}
              </h2>
            </div>
            <Link
              href="/works"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/50 px-4 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand hover:text-page sm:text-sm"
            >
              {t.cta.works}
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {preview.map((item, index) => {
              const face = workFaces[item.id];
              const service = t.services.items.find(
                (entry) => entry.id === item.serviceId,
              );
              return (
                <Reveal key={item.id} delay={index * 0.06}>
                  <Link
                    href="/works"
                    className="group flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-card text-card-fg"
                  >
                    <div
                      className="relative aspect-[4/3] p-5"
                      style={{ background: face.bg, color: face.fg }}
                    >
                      <div className="flex items-start justify-end">
                        <SampleBadge label={t.sample} />
                      </div>
                      <Mark className="absolute bottom-4 right-4 h-14 w-16 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                        {service?.name}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold leading-tight">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-band text-band-fg">
        <div className="shell grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <Reveal>
            <SectionLabel tone="band">{t.reel.label}</SectionLabel>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[0.98]">
              {t.reel.title}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed opacity-85">
              {t.reel.body}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-[1.8rem] bg-page">
              <BrandVideo
                src="/brand/secondary.mp4"
                className="aspect-video w-full object-contain"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-page text-page-fg">
        <div className="shell py-16 md:py-24">
          <Reveal className="mb-8 flex items-end justify-between gap-4">
            <SectionLabel>{t.partners.label}</SectionLabel>
            <Link
              href="/partners"
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-accent-fg sm:text-sm"
            >
              {t.cta.partners}
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {partnerFaces.slice(0, 4).map((face) => (
              <div
                key={face.bg}
                className="flex aspect-[1.7/1] items-center justify-center rounded-2xl"
                style={{ background: face.bg, color: face.fg }}
              >
                <Mark className="h-12 w-14" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-page text-page-fg">
        <div className="shell py-20 md:py-28">
          <Reveal>
            <h2 className="max-w-3xl text-[clamp(2.1rem,5vw,4.4rem)] font-bold leading-[0.96]">
              {t.ctaBand.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg text-fg-muted">{t.ctaBand.body}</p>
            <Link
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-fg"
            >
              {t.cta.contact}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16 shrink-0" aria-hidden="true">
      <circle
        cx="32"
        cy="36"
        r="18"
        fill="none"
        stroke="#141414"
        strokeWidth="2"
      />
      <circle
        cx="32"
        cy="36"
        r="11"
        fill="none"
        stroke="#141414"
        strokeWidth="2"
      />
      <circle cx="32" cy="36" r="4.5" fill="#FE725B" />
      <path d="M44 24 L62 8" stroke="#141414" strokeWidth="2" />
      <path d="M52 8 H62 V18" fill="none" stroke="#141414" strokeWidth="2" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16 shrink-0" aria-hidden="true">
      <path
        d="M36 10c-10 0-18 8-18 18 0 7 4 12 8 15v5h20v-5c4-3 8-8 8-15 0-10-8-18-18-18z"
        fill="#FE725B"
      />
      <path
        d="M30 52h12M32 58h8"
        stroke="#141414"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M36 4v4M16 18l3 3M56 18l-3 3M12 34h5M55 34h5"
        stroke="#141414"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
