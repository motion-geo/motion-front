"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Logo } from "./logo";
import { useLocale } from "./locale";
import { ThemeSwitcher } from "./theme";

const links = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/works", key: "works" },
  { href: "/partners", key: "partners" },
  { href: "/terms", key: "terms" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, locale]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-header backdrop-blur-md">
        <div className="shell flex h-[4.5rem] items-center justify-between gap-3">
          <Link href="/" aria-label="Motion" className="shrink-0">
            <Logo className="h-11 w-auto text-brand sm:h-12" title="" />
          </Link>

          <nav
            className="hidden items-center gap-5 xl:gap-6 lg:flex"
            aria-label={t.menu.label}
          >
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base transition-colors hover:text-accent ${active ? "text-accent" : "text-page-fg"}`}
                >
                  {t.nav[link.key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <div className="flex rounded-full border border-line p-0.5 text-xs font-bold tracking-[0.12em]">
              {(["ka", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded-full px-2.5 py-1 uppercase transition-colors ${locale === code ? "bg-accent text-accent-fg" : "text-page-fg"}`}
                  aria-pressed={locale === code}
                >
                  {code}
                </button>
              ))}
            </div>
            <Link
              href="/contact"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg sm:inline-flex lg:hidden xl:inline-flex"
            >
              {t.nav.contact}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
              aria-expanded={open}
              aria-label={open ? t.menu.close : t.menu.open}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="flex w-4 flex-col gap-1.5">
                <span className="h-px w-full bg-page-fg" />
                <span className="h-px w-full bg-page-fg" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-page text-page-fg lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="shell flex h-[4.5rem] items-center justify-between">
              <Logo className="h-11 w-auto text-brand" title="" />
              <button
                type="button"
                className="rounded-full border border-line px-4 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                {t.menu.close}
              </button>
            </div>
            <nav
              className="shell flex flex-1 flex-col justify-center"
              aria-label={t.menu.label}
            >
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : 0.05 * index,
                    duration: 0.35,
                  }}
                >
                  <Link
                    href={link.href}
                    className="block border-b border-line py-4"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-4xl font-bold leading-none sm:text-5xl">
                      {t.nav[link.key]}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
