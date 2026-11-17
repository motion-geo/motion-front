"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocale, usePageTitle } from "./locale";
import { Mark } from "./logo";
import { Reveal } from "./reveal";
import { SampleBadge, SectionLabel } from "./section-label";
import { VideoLightbox, type LightboxWork } from "./video-lightbox";
import { WorkCard } from "./work-card";
import { partnerFaces } from "./work-styles";

export function PartnerDetailPage({ partnerId }: { partnerId: string }) {
  const { t } = useLocale();
  const partner = t.partners.items.find((item) => item.id === partnerId);
  const [active, setActive] = useState<LightboxWork | null>(null);

  const works = useMemo(() => {
    if (!partner) return [];
    return partner.workIds
      .map((id) => t.works.items.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [partner, t.works.items]);

  usePageTitle(
    partner
      ? `${partner.name} · ${t.nav.partners} · Motion`
      : `${t.partners.notFound} · Motion`,
  );

  if (!partner) {
    return (
      <div className="bg-page text-page-fg">
        <div className="shell py-20 md:py-28">
          <p className="text-2xl font-bold">{t.partners.notFound}</p>
          <Link
            href="/partners"
            className="mt-8 inline-flex items-center gap-2 text-sm text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.partners.back}
          </Link>
        </div>
      </div>
    );
  }

  const face = partnerFaces[partner.id] ?? { bg: "#141414", fg: "#FFFFFF" };

  return (
    <div className="bg-page text-page-fg">
      <div className="shell py-10 sm:py-14 md:py-20">
        <Link
          href="/partners"
          className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.partners.back}
        </Link>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <Reveal>
            <div
              className="relative flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-[1.8rem] p-6 sm:min-h-[22rem] sm:p-8"
              style={{ background: face.bg, color: face.fg }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-80">
                  {partner.role}
                </p>
                <SampleBadge label={t.sample} />
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1 className="text-[clamp(2.2rem,6vw,4rem)] font-bold leading-[0.95]">
                    {partner.name}
                  </h1>
                  <p className="mt-3 max-w-md text-sm leading-relaxed opacity-80 sm:text-base">
                    {partner.summary}
                  </p>
                </div>
                <Mark className="h-16 w-20 shrink-0 sm:h-20 sm:w-24" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex h-full flex-col justify-between rounded-[1.8rem] border border-line bg-soft p-6 sm:p-8">
              <div>
                <SectionLabel>{t.partners.aboutLabel}</SectionLabel>
                <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
                  {partner.about}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted">
                    {t.partners.sinceLabel}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{partner.since}</p>
                </div>
                <Link
                  href="/contact"
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg"
                >
                  {t.cta.contact}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        <section className="mt-12 md:mt-16">
          <SectionLabel>{t.partners.focusLabel}</SectionLabel>
          <div className="mt-5 flex flex-wrap gap-2">
            {partner.focus.map((item) => (
              <span
                key={item}
                className="rounded-full border border-line px-4 py-2 text-sm text-page-fg"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12 pb-8 md:mt-16 md:pb-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <SectionLabel tone="brand">{t.partners.worksLabel}</SectionLabel>
            <Link
              href="/works"
              className="text-sm text-fg-muted transition-colors hover:text-accent"
            >
              {t.cta.works} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {works.map((item, index) => {
              const service = t.services.items.find(
                (entry) => entry.id === item.serviceId,
              );
              return (
                <Reveal key={item.id} delay={index * 0.05}>
                  <WorkCard
                    item={item}
                    serviceName={service?.name}
                    sampleLabel={t.sample}
                    playLabel={t.works.play}
                    openLabel={t.works.open}
                    videoLabel={t.works.video}
                    photoLabel={t.works.photo}
                    onOpen={setActive}
                  />
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>

      <VideoLightbox
        work={active}
        onClose={() => setActive(null)}
        closeLabel={t.works.closePlayer}
        photoLabel={t.works.photo}
      />
    </div>
  );
}
