"use client";

import { useMemo, useState } from "react";
import { workMatchesService, workServiceLabels } from "@/lib/works";
import { useLocale, usePageTitle } from "./locale";
import { Reveal } from "./reveal";
import { SectionLabel } from "./section-label";
import { useServices } from "./use-services";
import { useWorks } from "./use-works";
import { VideoLightbox, type LightboxWork } from "./video-lightbox";
import { WorkCard } from "./work-card";

export function WorksPage() {
  const { t } = useLocale();
  const { items: services } = useServices();
  const { items: works } = useWorks();
  usePageTitle(`${t.nav.works} · Motion`);
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<LightboxWork | null>(null);

  const filters = useMemo(() => {
    const used = new Set<string>();
    for (const item of works) {
      if (item.serviceSlugs?.length) {
        item.serviceSlugs.forEach((slug) => used.add(slug));
      } else if (item.serviceId) {
        used.add(item.serviceId);
      }
    }
    return services.filter((item) => used.has(item.id));
  }, [works, services]);

  const visible =
    filter === "all"
      ? works
      : works.filter((item) => workMatchesService(item, filter));

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
          {visible.map((item) => (
            <Reveal key={item.id}>
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
      </div>

      <VideoLightbox
        work={active}
        onClose={() => setActive(null)}
        closeLabel={t.works.closePlayer}
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
