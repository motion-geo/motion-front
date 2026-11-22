"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./auth";
import { useLocale, usePageTitle } from "./locale";
import { Reveal } from "./reveal";
import { SampleBadge, SectionLabel } from "./section-label";
import { VideoLightbox, type LightboxWork } from "./video-lightbox";
import { usePlans } from "./use-plans";
import { useServices } from "./use-services";
import { WorkCard } from "./work-card";

export function ProfilePage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const { items: services } = useServices();
  const { items: plans } = usePlans();
  const router = useRouter();
  const [active, setActive] = useState<LightboxWork | null>(null);

  usePageTitle(`${t.nav.profile} · Motion`);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const plan = useMemo(
    () => plans.find((item) => item.id === user?.planId) ?? null,
    [plans, user?.planId],
  );

  const works = useMemo(() => {
    if (!user) return [];
    return t.works.items.filter((item) => user.workIds.includes(item.id));
  }, [t.works.items, user]);

  if (!user) {
    return (
      <div className="bg-page text-page-fg">
        <div className="shell py-20 text-fg-muted">{t.profile.redirecting}</div>
      </div>
    );
  }

  return (
    <div className="bg-page text-page-fg">
      <div className="shell py-14 md:py-20">
        <header className="max-w-3xl">
          <SectionLabel>{t.profile.label}</SectionLabel>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[0.95]">
            {t.profile.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted">
            {t.profile.lead}
          </p>
        </header>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <section className="rounded-[1.7rem] border border-line bg-soft p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold sm:text-2xl">
                  {t.profile.personal}
                </h2>
                <SampleBadge label={t.sample} />
              </div>
              <dl className="mt-8 space-y-5">
                <InfoRow label={t.auth.nameOrCompany} value={user.nameOrCompany} />
                <InfoRow label={t.auth.email} value={user.email} />
                <InfoRow label={t.auth.phone} value={user.phone} />
              </dl>
            </section>
          </Reveal>

          <Reveal delay={0.05}>
            <section className="flex h-full flex-col rounded-[1.7rem] border border-line bg-soft p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold sm:text-2xl">
                  {t.profile.plan}
                </h2>
                <SampleBadge label={t.sample} />
              </div>
              {plan ? (
                <>
                  <p className="mt-6 text-3xl font-bold tracking-tight">
                    {plan.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                    {plan.summary}
                  </p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="pb-0.5 text-sm text-fg-muted">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="mt-6 space-y-2 text-sm text-fg-muted">
                    {plan.features.slice(0, 3).map((feature) => (
                      <li key={feature}>· {feature}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-6 text-sm text-fg-muted">
                  {t.profile.noPlan}
                </p>
              )}
              <Link
                href="/plans"
                className="mt-auto inline-flex pt-8 text-sm font-medium text-accent transition-colors hover:text-page-fg"
              >
                {t.profile.viewPlans}
              </Link>
            </section>
          </Reveal>
        </div>

        <section className="mt-12 md:mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel tone="brand">{t.profile.works}</SectionLabel>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight">
                {t.profile.worksTitle}
              </h2>
            </div>
            <Link
              href="/works"
              className="text-sm font-medium text-accent transition-colors hover:text-page-fg"
            >
              {t.profile.allWorks}
            </Link>
          </div>

          {works.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {works.map((item, index) => {
                const service = services.find(
                  (entry) => entry.id === item.serviceId,
                );
                return (
                  <Reveal key={item.id} delay={index * 0.04}>
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
          ) : (
            <p className="mt-8 text-fg-muted">{t.profile.noWorks}</p>
          )}
        </section>
      </div>

      <VideoLightbox
        work={active}
        closeLabel={t.works.closePlayer}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted">
        {label}
      </dt>
      <dd className="mt-1.5 text-base font-medium sm:text-lg">{value}</dd>
    </div>
  );
}
