import type { Locale, Partner, Service } from "@/content/types";
import { apiFetchPartner, apiFetchPartners, type ApiPartner } from "./api";

export function mapApiPartner(
  item: ApiPartner,
  locale: Locale,
  services: Service[] = [],
): Partner {
  const focus = item.serviceSlugs
    .map((slug) => services.find((service) => service.id === slug)?.name)
    .filter((name): name is string => Boolean(name));

  return {
    id: item.slug,
    name: locale === "ka" ? item.nameKa : item.nameEn,
    role: locale === "ka" ? item.roleKa : item.roleEn,
    summary: locale === "ka" ? item.summaryKa : item.summaryEn,
    about: locale === "ka" ? item.aboutKa : item.aboutEn,
    focus: focus.length ? focus : item.serviceSlugs,
    serviceSlugs: item.serviceSlugs,
    workIds: [],
    since: item.since,
    colorBg: item.colorBg,
    colorFg: item.colorFg,
  };
}

export async function loadPartners(
  locale: Locale,
  services: Service[] = [],
): Promise<Partner[]> {
  try {
    const rows = await apiFetchPartners();
    return rows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => mapApiPartner(item, locale, services));
  } catch {
    return [];
  }
}

export async function loadPartner(
  slug: string,
  locale: Locale,
  services: Service[] = [],
): Promise<Partner | null> {
  try {
    const item = await apiFetchPartner(slug);
    return mapApiPartner(item, locale, services);
  } catch {
    return null;
  }
}
