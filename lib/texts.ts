import type { Dictionary, Locale } from "@/content/types";
import { apiFetchTexts, type ApiSiteText } from "./api";

function deepCloneDictionary(base: Dictionary): Dictionary {
  return JSON.parse(JSON.stringify(base)) as Dictionary;
}

function setLeafByPath(target: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".").filter(Boolean);
  if (parts.length === 0) return;

  let cursor: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    const next = cursor[part];
    if (next == null || typeof next !== "object" || Array.isArray(next)) {
      const created: Record<string, unknown> = {};
      cursor[part] = created;
      cursor = created;
    } else {
      cursor = next as Record<string, unknown>;
    }
  }

  cursor[parts[parts.length - 1]] = value;
}

export function mergeTextsIntoDictionary(
  base: Dictionary,
  rows: ApiSiteText[],
  locale: Locale,
): Dictionary {
  const merged = deepCloneDictionary(base);
  for (const row of rows) {
    const value = locale === "ka" ? row.valueKa : row.valueEn;
    setLeafByPath(merged as unknown as Record<string, unknown>, row.key, value);
  }
  return merged;
}

export async function loadMergedDictionary(
  base: Dictionary,
  locale: Locale,
): Promise<Dictionary> {
  try {
    const rows = await apiFetchTexts();
    return mergeTextsIntoDictionary(base, rows, locale);
  } catch {
    return base;
  }
}
