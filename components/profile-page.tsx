"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { WorkItem } from "@/content/types";
import {
  apiCancelMyPlan,
  apiFetchMyActivations,
  type ApiPlanActivation,
} from "@/lib/api";
import { periodChipLabel } from "@/lib/plan-periods";
import { loadWorksForMe, workServiceLabels } from "@/lib/works";
import { useAuth } from "./auth";
import { useLocale, usePageTitle } from "./locale";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";
import { VideoLightbox, type LightboxWork } from "./video-lightbox";
import { usePlans } from "./use-plans";
import { useServices } from "./use-services";
import { WorkCard } from "./work-card";

export function ProfilePage() {
  const { locale, t } = useLocale();
  const { user, token, updateUser } = useAuth();
  const { items: services } = useServices();
  const { items: plans } = usePlans();
  const router = useRouter();
  const [active, setActive] = useState<LightboxWork | null>(null);
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [activations, setActivations] = useState<ApiPlanActivation[]>([]);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  usePageTitle(`${t.nav.profile} · Motion`);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    if (token) {
      loadWorksForMe(token, locale).then((rows) => {
        if (cancelled) return;
        if (rows.length) {
          setWorks(rows);
          return;
        }
        setWorks(
          t.works.items.filter((item) => user.workIds.includes(item.id)),
        );
      });
      apiFetchMyActivations(token)
        .then((rows) => {
          if (!cancelled) setActivations(rows);
        })
        .catch(() => {
          if (!cancelled) setActivations([]);
        });
    } else {
      setWorks(
        t.works.items.filter((item) => user.workIds.includes(item.id)),
      );
    }

    return () => {
      cancelled = true;
    };
  }, [user, token, locale, t.works.items]);

  const plan = useMemo(
    () => plans.find((item) => item.id === user?.planId) ?? null,
    [plans, user?.planId],
  );

  async function onCancelPlan() {
    if (!token || !user?.planId) return;
    const confirmed = window.confirm(t.profile.cancelPlanConfirm);
    if (!confirmed) return;
    setCancelling(true);
    setCancelMessage("");
    try {
      await apiCancelMyPlan(token);
      updateUser({ planId: "" });
      const rows = await apiFetchMyActivations(token);
      setActivations(rows);
      setCancelMessage(t.profile.cancelPlanDone);
    } catch (err) {
      setCancelMessage(
        err instanceof Error ? err.message : t.auth.formError,
      );
    } finally {
      setCancelling(false);
    }
  }

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
              <h2 className="text-xl font-bold sm:text-2xl">
                {t.profile.personal}
              </h2>
              <dl className="mt-8 space-y-5">
                <InfoRow label={t.auth.nameOrCompany} value={user.nameOrCompany} />
                <InfoRow label={t.auth.email} value={user.email} />
                <InfoRow label={t.auth.phone} value={user.phone} />
              </dl>
            </section>
          </Reveal>

          <Reveal delay={0.05}>
            <section className="flex h-full flex-col rounded-[1.7rem] border border-line bg-soft p-6 sm:p-8">
              <h2 className="text-xl font-bold sm:text-2xl">
                {t.profile.plan}
              </h2>
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
              {cancelMessage ? (
                <p className="mt-4 text-sm text-fg-muted">{cancelMessage}</p>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
                <Link
                  href="/plans"
                  className="text-sm font-medium text-accent transition-colors hover:text-page-fg"
                >
                  {t.profile.viewPlans}
                </Link>
                {user.planId ? (
                  <button
                    type="button"
                    onClick={() => void onCancelPlan()}
                    disabled={cancelling}
                    className="rounded-full border border-line px-4 py-2 text-sm font-medium text-fg-muted transition hover:border-page-fg hover:text-page-fg disabled:opacity-50"
                  >
                    {cancelling
                      ? t.profile.cancellingPlan
                      : t.profile.cancelPlan}
                  </button>
                ) : null}
              </div>
            </section>
          </Reveal>
        </div>

        <section className="mt-12 md:mt-16">
          <SectionLabel tone="brand">{t.profile.payments}</SectionLabel>
          <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight">
            {t.profile.paymentsTitle}
          </h2>
          {activations.length > 0 ? (
            <div className="mt-8 grid gap-3">
              {activations.map((row) => (
                <article
                  key={row.id}
                  className="rounded-[1.4rem] border border-line bg-soft px-5 py-4 sm:px-6"
                >
                  <div>
                    <p className="text-lg font-bold">
                      {locale === "ka" ? row.planNameKa : row.planNameEn}
                    </p>
                    <p className="mt-1 text-sm text-fg-muted">
                      {new Date(row.createdAt).toLocaleDateString(
                        locale === "ka" ? "ka-GE" : "en-GB",
                      )}
                    </p>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted">
                        {t.profile.paymentAmount}
                      </dt>
                      <dd className="mt-1 font-medium">{row.priceLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted">
                        {t.profile.paymentPeriod}
                      </dt>
                      <dd className="mt-1 font-medium">
                        {periodChipLabel(
                          row.periodUnit,
                          row.periodQuantity,
                          locale,
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted">
                        {t.profile.paymentActiveUntil}
                      </dt>
                      <dd className="mt-1 font-medium">
                        {new Date(row.endsAt).toLocaleDateString(
                          locale === "ka" ? "ka-GE" : "en-GB",
                        )}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-fg-muted">{t.profile.paymentsEmpty}</p>
          )}
        </section>

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
              {works.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.04}>
                  <WorkCard
                    item={item}
                    serviceName={workServiceLabels(item, services)}
                    playLabel={t.works.play}
                    openLabel={t.works.open}
                    onOpen={setActive}
                  />
                </Reveal>
              ))}
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
