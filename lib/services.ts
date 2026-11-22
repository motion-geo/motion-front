import type { Locale, Service } from "@/content/types";
import { apiFetchServices, type ApiService } from "./api";

export function mapApiService(item: ApiService, locale: Locale): Service {
  return {
    id: item.slug,
    name: locale === "ka" ? item.nameKa : item.nameEn,
    summary: locale === "ka" ? item.summaryKa : item.summaryEn,
    icon: item.icon,
    iconSvg: item.iconSvg,
    color: item.color,
  };
}

export async function loadServices(locale: Locale): Promise<Service[]> {
  try {
    const rows = await apiFetchServices();
    return rows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => mapApiService(item, locale));
  } catch {
    return [];
  }
}
