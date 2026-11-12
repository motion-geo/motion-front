"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { HexColorPicker } from "react-colorful";
import { Moon, Palette, RotateCcw, Sun, X } from "lucide-react";
import { useLocale } from "./locale";

const COLOR_PRESETS = [
  "#000000",
  "#ffffff",
  "#141414",
  "#e8e8e8",
  "#015f3a",
  "#c8f902",
  "#fe725b",
  "#ff8500",
  "#004b70",
  "#820099",
  "#ff0000",
  "#003554",
] as const;

export const themes = [
  { id: "noir" },
  { id: "day" },
  { id: "custom" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

export type CustomPalette = {
  page: string;
  pageFg: string;
  panel: string;
  panelFg: string;
  muted: string;
  mutedFg: string;
  band: string;
  bandFg: string;
  accent: string;
  accentFg: string;
  brand: string;
  card: string;
  cardFg: string;
  line: string;
  fgMuted: string;
  icon: string;
};

export const DEFAULT_CUSTOM: CustomPalette = {
  page: "#000000",
  pageFg: "#ffffff",
  panel: "#ffffff",
  panelFg: "#141414",
  muted: "#e8e8e8",
  mutedFg: "#141414",
  band: "#c8f902",
  bandFg: "#000000",
  accent: "#c8f902",
  accentFg: "#000000",
  brand: "#015f3a",
  card: "#ffffff",
  cardFg: "#141414",
  line: "#ffffff",
  fgMuted: "#b3b3b3",
  icon: "#c8f902",
};

const STORAGE_KEY = "motion-theme";
const CUSTOM_STORAGE_KEY = "motion-custom-theme";
const DEFAULT_THEME: ThemeId = "noir";

const CSS_KEYS = [
  "--page",
  "--page-fg",
  "--panel",
  "--panel-fg",
  "--muted",
  "--muted-fg",
  "--band",
  "--band-fg",
  "--accent",
  "--accent-fg",
  "--brand",
  "--line",
  "--header",
  "--soft",
  "--fg-muted",
  "--selection",
  "--selection-fg",
  "--card",
  "--card-fg",
  "--service-1",
  "--service-2",
  "--service-3",
  "--service-4",
  "--service-5",
  "--service-6",
] as const;

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  custom: CustomPalette;
  setCustom: (next: CustomPalette) => void;
  updateCustom: (key: keyof CustomPalette, value: string) => void;
  resetCustom: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const listeners = new Set<() => void>();

function isThemeId(value: string | null): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function parseHex(hex: string) {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw.slice(0, 6);
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeHex(value: string, fallback: string) {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return (
      "#" +
      trimmed
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")
    ).toLowerCase();
  }
  return fallback;
}

let cachedCustom: CustomPalette = DEFAULT_CUSTOM;
let cachedCustomRaw: string | null = null;

function parseCustomPalette(raw: string | null): CustomPalette {
  if (!raw) return DEFAULT_CUSTOM;
  try {
    const parsed = JSON.parse(raw) as Partial<CustomPalette> & {
      service1?: string;
    };
    const next = { ...DEFAULT_CUSTOM };
    (Object.keys(DEFAULT_CUSTOM) as (keyof CustomPalette)[]).forEach((key) => {
      if (typeof parsed[key] === "string") {
        next[key] = normalizeHex(parsed[key]!, DEFAULT_CUSTOM[key]);
      }
    });
    if (!parsed.icon && typeof parsed.service1 === "string") {
      next.icon = normalizeHex(parsed.service1, DEFAULT_CUSTOM.icon);
    }
    return next;
  } catch {
    return DEFAULT_CUSTOM;
  }
}

export function readCustomPalette(): CustomPalette {
  const raw = window.localStorage.getItem(CUSTOM_STORAGE_KEY);
  if (raw === cachedCustomRaw) return cachedCustom;
  cachedCustomRaw = raw;
  cachedCustom = parseCustomPalette(raw);
  return cachedCustom;
}

export function applyCustomPalette(palette: CustomPalette) {
  const root = document.documentElement;
  root.style.setProperty("--page", palette.page);
  root.style.setProperty("--page-fg", palette.pageFg);
  root.style.setProperty("--panel", palette.panel);
  root.style.setProperty("--panel-fg", palette.panelFg);
  root.style.setProperty("--muted", palette.muted);
  root.style.setProperty("--muted-fg", palette.mutedFg);
  root.style.setProperty("--band", palette.band);
  root.style.setProperty("--band-fg", palette.bandFg);
  root.style.setProperty("--accent", palette.accent);
  root.style.setProperty("--accent-fg", palette.accentFg);
  root.style.setProperty("--brand", palette.brand);
  root.style.setProperty("--card", palette.card);
  root.style.setProperty("--card-fg", palette.cardFg);
  root.style.setProperty("--line", withAlpha(palette.line, 0.18));
  root.style.setProperty("--header", withAlpha(palette.page, 0.9));
  root.style.setProperty("--soft", withAlpha(palette.pageFg, 0.06));
  root.style.setProperty("--fg-muted", palette.fgMuted);
  root.style.setProperty("--selection", palette.accent);
  root.style.setProperty("--selection-fg", palette.accentFg);
  root.style.setProperty("--service-1", palette.icon);
  root.style.setProperty("--service-2", palette.icon);
  root.style.setProperty("--service-3", palette.icon);
  root.style.setProperty("--service-4", palette.icon);
  root.style.setProperty("--service-5", palette.icon);
  root.style.setProperty("--service-6", palette.icon);
}

export function clearCustomPaletteStyles() {
  const root = document.documentElement;
  CSS_KEYS.forEach((key) => root.style.removeProperty(key));
}

function getThemeSnapshot(): ThemeId {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isThemeId(saved) ? saved : DEFAULT_THEME;
}

function getServerSnapshot(): ThemeId {
  return DEFAULT_THEME;
}

function getCustomSnapshot(): CustomPalette {
  return readCustomPalette();
}

function getCustomServerSnapshot(): CustomPalette {
  return DEFAULT_CUSTOM;
}

function cacheCustomPalette(palette: CustomPalette) {
  cachedCustom = palette;
  cachedCustomRaw = JSON.stringify(palette);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function withThemeTransition(update: () => void) {
  const root = document.documentElement;

  const finish = () => {
    update();
    emit();
  };

  if (prefersReducedMotion()) {
    finish();
    return;
  }

  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => unknown;
  };

  if (typeof doc.startViewTransition === "function") {
    doc.startViewTransition(() => {
      finish();
    });
    return;
  }

  root.classList.add("theme-animating");
  window.setTimeout(() => {
    root.classList.remove("theme-animating");
  }, 700);
  finish();
}

function applyTheme(theme: ThemeId) {
  withThemeTransition(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
    if (theme === "custom") {
      applyCustomPalette(readCustomPalette());
    } else {
      clearCustomPaletteStyles();
    }
  });
}

function saveCustom(palette: CustomPalette) {
  cacheCustomPalette(palette);
  window.localStorage.setItem(CUSTOM_STORAGE_KEY, cachedCustomRaw!);
  if (document.documentElement.dataset.theme === "custom") {
    applyCustomPalette(palette);
  }
  emit();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerSnapshot,
  );
  const custom = useSyncExternalStore(
    subscribe,
    getCustomSnapshot,
    getCustomServerSnapshot,
  );

  const setTheme = useCallback((next: ThemeId) => {
    applyTheme(next);
  }, []);

  const setCustom = useCallback((next: CustomPalette) => {
    saveCustom(next);
  }, []);

  const updateCustom = useCallback(
    (key: keyof CustomPalette, value: string) => {
      const current = readCustomPalette();
      saveCustom({
        ...current,
        [key]: normalizeHex(value, current[key]),
      });
    },
    [],
  );

  const resetCustom = useCallback(() => {
    saveCustom({ ...DEFAULT_CUSTOM });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      custom,
      setCustom,
      updateCustom,
      resetCustom,
    }),
    [theme, setTheme, custom, setCustom, updateCustom, resetCustom],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}

const FIELD_GROUPS: {
  titleKey: "surfaces" | "text" | "accents";
  fields: (keyof CustomPalette)[];
}[] = [
  {
    titleKey: "surfaces",
    fields: ["page", "panel", "muted", "band", "card"],
  },
  {
    titleKey: "text",
    fields: ["pageFg", "panelFg", "mutedFg", "bandFg", "cardFg", "fgMuted"],
  },
  {
    titleKey: "accents",
    fields: ["accent", "accentFg", "brand", "icon", "line"],
  },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      setOpen(false);
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center justify-between gap-3 rounded-xl border border-line bg-soft px-3 py-2"
    >
      <span className="min-w-0 flex-1 truncate text-xs text-page-fg">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-line shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] transition-transform hover:scale-105"
          style={{ background: value }}
        />
        <input
          type="text"
          value={editing ? draft : value}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            if (/^#[0-9a-fA-F]{6}$/.test(next.trim())) {
              onChange(next.trim().toLowerCase());
            }
          }}
          onFocus={() => {
            setDraft(value);
            setEditing(true);
            setOpen(true);
          }}
          onBlur={() => setEditing(false)}
          spellCheck={false}
          className="w-[5.6rem] rounded-lg border border-line bg-page px-2 py-1.5 font-mono text-[11px] uppercase text-page-fg outline-none focus:border-accent"
        />
      </div>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.45rem)] z-[70] w-[13.5rem] rounded-2xl border border-line bg-page p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          <HexColorPicker
            color={value}
            onChange={(next) => onChange(next.toLowerCase())}
            className="!h-[8.5rem] !w-full"
          />
          <div className="mt-3 grid grid-cols-6 gap-1.5">
            {COLOR_PRESETS.map((preset) => {
              const active = value.toLowerCase() === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  aria-label={preset}
                  title={preset}
                  onClick={() => onChange(preset)}
                  className={`h-6 w-full rounded-md border transition-transform hover:scale-105 ${
                    active ? "border-accent ring-1 ring-accent" : "border-line"
                  }`}
                  style={{ background: preset }}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-soft px-2.5 py-2">
            <span
              className="h-5 w-5 shrink-0 rounded-full border border-line"
              style={{ background: value }}
              aria-hidden
            />
            <span className="font-mono text-[11px] uppercase tracking-wide text-page-fg">
              {value}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CustomThemePanel({ onClose }: { onClose: () => void }) {
  const { custom, updateCustom, resetCustom, t } = useThemeWithLocale();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-label={t.theme.customTitle}
      className="absolute right-0 top-[calc(100%+0.65rem)] z-[60] w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-line bg-page text-page-fg shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{t.theme.customTitle}</p>
          <p className="mt-0.5 text-xs text-fg-muted">{t.theme.customHint}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetCustom}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-page-fg transition-colors hover:border-accent hover:text-accent"
            title={t.theme.reset}
            aria-label={t.theme.reset}
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-page-fg transition-colors hover:border-accent hover:text-accent"
            aria-label={t.theme.close}
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div className="max-h-[min(28rem,70vh)] space-y-5 overflow-y-auto p-4">
        {FIELD_GROUPS.map((group) => (
          <div key={group.titleKey}>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted">
              {t.theme.groups[group.titleKey]}
            </p>
            <div className="space-y-2">
              {group.fields.map((field) => (
                <ColorField
                  key={field}
                  label={t.theme.fields[field]}
                  value={custom[field]}
                  onChange={(value) => updateCustom(field, value)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function useThemeWithLocale() {
  const theme = useTheme();
  const { t } = useLocale();
  return { ...theme, t };
}

export function ThemeSwitcher() {
  const { theme, setTheme, t } = useThemeWithLocale();
  const [open, setOpen] = useState(false);

  const options = [
    { id: "noir" as const, label: t.theme.names.noir, icon: Moon },
    { id: "day" as const, label: t.theme.names.day, icon: Sun },
    { id: "custom" as const, label: t.theme.names.custom, icon: Palette },
  ];

  return (
    <div className="relative">
      <div
        className="flex items-center gap-0.5 rounded-full border border-line bg-soft p-0.5"
        role="group"
        aria-label={t.theme.label}
      >
        {options.map(({ id, label, icon: Icon }) => {
          const active = theme === id;
          return (
            <button
              key={id}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={active}
              onClick={() => {
                if (id === "custom") {
                  setTheme("custom");
                  setOpen((prev) => (theme === "custom" ? !prev : true));
                  return;
                }
                setTheme(id);
                setOpen(false);
              }}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
                active
                  ? "bg-accent text-accent-fg"
                  : "text-page-fg hover:text-accent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
            </button>
          );
        })}
      </div>
      {theme === "custom" && open ? (
        <CustomThemePanel onClose={() => setOpen(false)} />
      ) : null}
    </div>
  );
}

/** Prevents a flash of the wrong theme before hydration. */
export const themeInitScript = `
(function(){
  try {
    var key = '${STORAGE_KEY}';
    var customKey = '${CUSTOM_STORAGE_KEY}';
    var saved = localStorage.getItem(key);
    var allowed = ${JSON.stringify(themes.map((theme) => theme.id))};
    var theme = allowed.indexOf(saved) >= 0 ? saved : '${DEFAULT_THEME}';
    document.documentElement.setAttribute('data-theme', theme);
    var defaults = ${JSON.stringify(DEFAULT_CUSTOM)};
    function parseHex(hex){
      var raw = String(hex || '').replace('#','').trim();
      var full = raw.length === 3 ? raw.split('').map(function(c){return c+c;}).join('') : raw.slice(0,6);
      var n = parseInt(full, 16);
      if (isNaN(n) || full.length !== 6) return {r:0,g:0,b:0};
      return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};
    }
    function withAlpha(hex, alpha){
      var c = parseHex(hex);
      return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')';
    }
    function normalize(value, fallback){
      var v = String(value || '').trim();
      if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toLowerCase();
      if (/^#[0-9a-fA-F]{3}$/.test(v)) {
        return ('#' + v.slice(1).split('').map(function(c){return c+c;}).join('')).toLowerCase();
      }
      return fallback;
    }
    function apply(p){
      var root = document.documentElement.style;
      root.setProperty('--page', p.page);
      root.setProperty('--page-fg', p.pageFg);
      root.setProperty('--panel', p.panel);
      root.setProperty('--panel-fg', p.panelFg);
      root.setProperty('--muted', p.muted);
      root.setProperty('--muted-fg', p.mutedFg);
      root.setProperty('--band', p.band);
      root.setProperty('--band-fg', p.bandFg);
      root.setProperty('--accent', p.accent);
      root.setProperty('--accent-fg', p.accentFg);
      root.setProperty('--brand', p.brand);
      root.setProperty('--card', p.card);
      root.setProperty('--card-fg', p.cardFg);
      root.setProperty('--line', withAlpha(p.line, 0.18));
      root.setProperty('--header', withAlpha(p.page, 0.9));
      root.setProperty('--soft', withAlpha(p.pageFg, 0.06));
      root.setProperty('--fg-muted', p.fgMuted);
      root.setProperty('--selection', p.accent);
      root.setProperty('--selection-fg', p.accentFg);
      root.setProperty('--service-1', p.icon);
      root.setProperty('--service-2', p.icon);
      root.setProperty('--service-3', p.icon);
      root.setProperty('--service-4', p.icon);
      root.setProperty('--service-5', p.icon);
      root.setProperty('--service-6', p.icon);
    }
    if (theme === 'custom') {
      var palette = Object.assign({}, defaults);
      try {
        var raw = localStorage.getItem(customKey);
        if (raw) {
          var parsed = JSON.parse(raw);
          Object.keys(defaults).forEach(function(k){
            if (typeof parsed[k] === 'string') palette[k] = normalize(parsed[k], defaults[k]);
          });
          if (!parsed.icon && typeof parsed.service1 === 'string') {
            palette.icon = normalize(parsed.service1, defaults.icon);
          }
        }
      } catch (e) {}
      apply(palette);
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', '${DEFAULT_THEME}');
  }
})();
`;
