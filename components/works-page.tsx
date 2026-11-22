"use client";

import { useMemo, useState } from "react";
import { useLocale, usePageTitle } from "./locale";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";
import { useServices } from "./use-services";
import { VideoLightbox, type LightboxWork } from "./video-lightbox";
import { WorkCard } from "./work-card";

export function WorksPage() {
  const { t } = useLocale();
  const { items: services } = useServices();
  usePageTitle(`${t.nav.works} · Motion`);
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<LightboxWork | null>(null);

  const filters = useMemo(() => {
    const used = new Set(t.works.items.map((item) => item.serviceId));
    return services.filter((item) => used.has(item.id));
  }, [t.works.items, services]);

  const visible =
    filter === "all"
      ? t.works.items
      : t.works.items.filter((item) => item.serviceId === filter);

  return (
    <div className="bg-page text-page-fg">
      <div className="shell py-14 md:py-20">
        <header>
          <SectionLabel tone="brand">{t.works.label}</SectionLabel>
          <h1 className="mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[0.95]">
            {t.works.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
            {t.works.lead}
          </p>
        </header>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
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

        <div className="mt-8 grid gap-4 pb-8 sm:grid-cols-2 md:pb-16 xl:grid-cols-3">
          {visible.map((item) => {
            const service = services.find(
              (entry) => entry.id === item.serviceId,
            );
            return (
              <Reveal key={item.id}>
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
      className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-line bg-transparent text-page-fg hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
