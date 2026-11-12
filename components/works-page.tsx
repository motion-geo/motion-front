"use client";

import { useMemo, useState } from "react";
import { useLocale, usePageTitle } from "./locale";
import { Mark } from "./logo";
import { Reveal } from "./reveal";
import { SampleBadge, SectionLabel } from "./section-label";
import { workFaces } from "./work-styles";

export function WorksPage() {
  const { t } = useLocale();
  usePageTitle(`${t.nav.works} · Motion`);
  const [filter, setFilter] = useState("all");

  const filters = useMemo(() => {
    const used = new Set(t.works.items.map((item) => item.serviceId));
    return t.services.items.filter((item) => used.has(item.id));
  }, [t]);

  const visible =
    filter === "all"
      ? t.works.items
      : t.works.items.filter((item) => item.serviceId === filter);

  return (
    <div className="bg-muted text-muted-fg">
      <header className="shell py-14 md:py-20">
        <SectionLabel tone="brand">{t.works.label}</SectionLabel>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95]">
          {t.works.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-fg/75">
          {t.works.lead}
        </p>
      </header>

      <div className="shell pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            {t.works.all}
          </FilterButton>
          {filters.map((item) => (
            <FilterButton
              key={item.id}
              active={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.name}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="shell grid gap-4 pb-20 sm:grid-cols-2 md:pb-28 xl:grid-cols-3">
        {visible.map((item) => {
          const face = workFaces[item.id];
          const service = t.services.items.find(
            (entry) => entry.id === item.serviceId,
          );
          return (
            <Reveal key={item.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-[1.7rem] bg-card text-card-fg">
                <div
                  className="relative aspect-[4/3] p-5"
                  style={{ background: face.bg, color: face.fg }}
                >
                  <div className="flex items-start justify-end gap-3">
                    <SampleBadge label={t.sample} />
                  </div>
                  <Mark className="absolute bottom-4 right-4 h-14 w-16" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                    {service?.name}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold leading-tight">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-card-fg/75">
                    {item.summary}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${active ? "border-page-fg bg-page-fg text-page" : "border-line bg-card text-card-fg"}`}
    >
      {children}
    </button>
  );
}
