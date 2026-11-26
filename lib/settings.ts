import type { Locale, TermSection } from "@/content/types";
import { apiFetchSettings, mediaUrl, type ApiSettings } from "./api";

export const DEFAULT_HERO_VIDEO = "/brand/primary.mp4";
export const DEFAULT_REEL_VIDEO = "/brand/secondary.mp4";

export type SiteSettingsView = {
  phone: string | null;
  email: string | null;
  address: string | null;
  socials: Array<{
    key: "instagram" | "facebook" | "linkedin" | "youtube";
    label: string;
    href: string;
  }>;
  heroVideoUrl: string;
  reelVideoUrl: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  ogImageUrl: string | null;
  termsTitle: string;
  termsLead: string;
  termsSections: TermSection[];
};

const SOCIAL_META = [
  { key: "instagram" as const, label: "Instagram", field: "instagramUrl" },
  { key: "facebook" as const, label: "Facebook", field: "facebookUrl" },
  { key: "linkedin" as const, label: "LinkedIn", field: "linkedinUrl" },
  { key: "youtube" as const, label: "YouTube", field: "youtubeUrl" },
] as const;

function resolveVideoPath(path: string | null | undefined, fallback: string) {
  const fromApi = mediaUrl(path);
  return fromApi || fallback;
}

export function mapApiSettings(
  item: ApiSettings,
  locale: Locale,
): SiteSettingsView {
  return {
    phone: item.phone,
    email: item.email,
    address: locale === "ka" ? item.addressKa : item.addressEn,
    socials: SOCIAL_META.flatMap((meta) => {
      const href = item[meta.field];
      if (!href) return [];
      return [{ key: meta.key, label: meta.label, href }];
    }),
    heroVideoUrl: resolveVideoPath(item.heroVideoPath, DEFAULT_HERO_VIDEO),
    reelVideoUrl: resolveVideoPath(item.reelVideoPath, DEFAULT_REEL_VIDEO),
    logoUrl: mediaUrl(item.logoPath),
    faviconUrl: mediaUrl(item.faviconPath),
    ogImageUrl: mediaUrl(item.ogImagePath),
    termsTitle: locale === "ka" ? item.termsTitleKa : item.termsTitleEn,
    termsLead: locale === "ka" ? item.termsLeadKa : item.termsLeadEn,
    termsSections: (item.termsSections ?? []).map((section) => ({
      title: locale === "ka" ? section.titleKa : section.titleEn,
      body: locale === "ka" ? section.bodyKa : section.bodyEn,
    })),
  };
}

export function fallbackSettings(
  locale: Locale,
  terms: {
    title: string;
    lead: string;
    sections: TermSection[];
  },
): SiteSettingsView {
  return {
    phone: null,
    email: null,
    address: null,
    socials: [],
    heroVideoUrl: DEFAULT_HERO_VIDEO,
    reelVideoUrl: DEFAULT_REEL_VIDEO,
    logoUrl: null,
    faviconUrl: null,
    ogImageUrl: null,
    termsTitle: terms.title,
    termsLead: terms.lead,
    termsSections: terms.sections,
  };
}

export async function loadSettings(
  locale: Locale,
  termsFallback: {
    title: string;
    lead: string;
    sections: TermSection[];
  },
): Promise<SiteSettingsView> {
  try {
    const data = await apiFetchSettings();
    return mapApiSettings(data, locale);
  } catch {
    return fallbackSettings(locale, termsFallback);
  }
}
