"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Logo } from "./logo";
import { useLocale } from "./locale";

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
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="shell flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" aria-label="Motion" className="shrink-0">
            <Logo className="h-11 w-auto text-motion-green sm:h-12" title="" />
          </Link>

          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label={t.menu.label}
          >
            {links.map((link, index) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors hover:text-motion-lime ${active ? "text-motion-lime" : "text-white"}`}
                >
                  <span className="mr-1 font-display text-[10px] tracking-[0.14em] text-motion-lime/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {t.nav[link.key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex rounded-full border border-white/15 p-0.5 text-xs font-bold tracking-[0.12em]">
              {(["ka", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded-full px-2.5 py-1 uppercase transition-colors ${locale === code ? "bg-motion-lime text-black" : "text-white"}`}
                  aria-pressed={locale === code}
                >
                  {code}
                </button>
              ))}
            </div>
            <Link
              href="/contact"
              className="hidden rounded-full bg-motion-lime px-4 py-2 text-sm font-medium text-black sm:inline-flex lg:hidden xl:inline-flex"
            >
              {t.nav.contact}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
              aria-expanded={open}
              aria-label={open ? t.menu.close : t.menu.open}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="flex w-4 flex-col gap-1.5">
                <span className="h-px w-full bg-white" />
                <span className="h-px w-full bg-white" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-black lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="shell flex h-[4.5rem] items-center justify-between">
              <Logo className="h-11 w-auto text-motion-green" title="" />
              <button
                type="button"
                className="rounded-full border border-white/20 px-4 py-2 text-sm"
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
                    className="flex items-baseline gap-4 border-b border-white/10 py-4"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-display text-sm tracking-[0.16em] text-motion-lime">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
