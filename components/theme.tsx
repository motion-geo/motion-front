"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Moon, Sun } from "lucide-react";
import { useLocale } from "./locale";

export const themes = [{ id: "noir" }, { id: "day" }] as const;

export type ThemeId = (typeof themes)[number]["id"];

const STORAGE_KEY = "motion-theme";
const DEFAULT_THEME: ThemeId = "noir";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
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

function getThemeSnapshot(): ThemeId {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isThemeId(saved) ? saved : DEFAULT_THEME;
}

function getServerSnapshot(): ThemeId {
  return DEFAULT_THEME;
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
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerSnapshot,
  );

  const setTheme = useCallback((next: ThemeId) => {
    applyTheme(next);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme],
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

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();
  const isDay = theme === "day";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDay}
      aria-label={t.theme.label}
      title={isDay ? t.theme.names.day : t.theme.names.noir}
      onClick={() => setTheme(isDay ? "noir" : "day")}
      className={`relative inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full border border-line bg-soft p-0.5 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <span
        aria-hidden
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-transform duration-300 ease-out ${
          isDay
            ? "translate-x-6 bg-page-fg text-page"
            : "translate-x-0 bg-accent text-accent-fg"
        }`}
      >
        {isDay ? (
          <Sun className="h-3.5 w-3.5" strokeWidth={2.5} />
        ) : (
          <Moon className="h-3.5 w-3.5" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );
}

/** Prevents a flash of the wrong theme before hydration. */
export const themeInitScript = `
(function(){
  try {
    var key = '${STORAGE_KEY}';
    var saved = localStorage.getItem(key);
    var allowed = ${JSON.stringify(themes.map((theme) => theme.id))};
    var theme = allowed.indexOf(saved) >= 0 ? saved : '${DEFAULT_THEME}';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', '${DEFAULT_THEME}');
  }
})();
`;
