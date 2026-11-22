import type { Locale, WorkItem } from "@/content/types";
import {
  apiFetchWorks,
  apiFetchWorksByPartner,
  apiFetchWorksForMe,
  mediaUrl,
  type ApiWork,
} from "./api";

export function mapApiWork(item: ApiWork, locale: Locale): WorkItem {
  const serviceSlugs = item.serviceSlugs ?? [];
  return {
    id: item.slug,
    serviceId: serviceSlugs[0] ?? "",
    serviceSlugs,
    title: locale === "ka" ? item.titleKa : item.titleEn,
    summary: locale === "ka" ? item.summaryKa : item.summaryEn,
    coverUrl: mediaUrl(item.coverPath),
    youtubeEmbedUrl: item.youtubeEmbedUrl,
  };
}

export async function loadWorks(locale: Locale): Promise<WorkItem[]> {
  try {
    const rows = await apiFetchWorks();
    return rows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => mapApiWork(item, locale));
  } catch {
    return [];
  }
}

export async function loadWorksByPartner(
  partnerId: string,
  locale: Locale,
): Promise<WorkItem[]> {
  try {
    const rows = await apiFetchWorksByPartner(partnerId);
    return rows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => mapApiWork(item, locale));
  } catch {
    return [];
  }
}

export async function loadWorksForMe(
  token: string,
  locale: Locale,
): Promise<WorkItem[]> {
  try {
    const rows = await apiFetchWorksForMe(token);
    return rows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => mapApiWork(item, locale));
  } catch {
    return [];
  }
}

export function workMatchesService(item: WorkItem, serviceId: string) {
  if (item.serviceSlugs?.length) {
    return item.serviceSlugs.includes(serviceId);
  }
  return item.serviceId === serviceId;
}

export function workServiceLabels(
  item: WorkItem,
  services: Array<{ id: string; name: string }>,
): string | undefined {
  const slugs = item.serviceSlugs?.length
    ? item.serviceSlugs
    : item.serviceId
      ? [item.serviceId]
      : [];
  const names = slugs
    .map((slug) => services.find((service) => service.id === slug)?.name)
    .filter((name): name is string => Boolean(name));
  return names.length ? names.join(" · ") : undefined;
}
