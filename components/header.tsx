"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAuth } from "./auth";
import { BrandLogo } from "./brand-logo";
import { useLocale } from "./locale";
import { ThemeSwitcher } from "./theme";

const links = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/works", key: "works" },
  { href: "/partners", key: "partners" },
  { href: "/plans", key: "plans" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale } = useLocale();
  const { user, logout } = useAuth();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [menuRoute, setMenuRoute] = useState({ pathname, locale });

  if (menuRoute.pathname !== pathname || menuRoute.locale !== locale) {
    setMenuRoute({ pathname, locale });
    if (open) setOpen(false);
  }

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

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
        <div className="shell flex h-16 items-center justify-between gap-2 sm:h-[4.5rem] sm:gap-3">
          <Link href="/" aria-label="Motion" className="min-w-0 shrink">
            <BrandLogo className="h-9 w-auto max-w-[7.5rem] text-brand sm:h-12 sm:max-w-none" title="" />
          </Link>

          <nav
            className="hidden items-center gap-4 text-sm 2xl:gap-6 2xl:text-base xl:flex"
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
                  className={`whitespace-nowrap transition-colors hover:text-accent ${active ? "text-accent" : "text-page-fg"}`}
                >
                  {t.nav[link.key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeSwitcher className="hidden sm:inline-flex" />
            <div className="hidden rounded-full border border-line p-0.5 text-xs font-bold tracking-[0.12em] sm:flex">
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
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-page-fg transition-colors hover:border-accent hover:text-accent sm:h-10 sm:w-auto sm:gap-2 sm:px-3.5"
                  aria-label={t.nav.profile}
                >
                  <UserRound className="h-4 w-4" strokeWidth={2} />
                  <span className="hidden max-w-[8rem] truncate xl:inline">
                    {t.nav.profile}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden h-9 w-9 items-center justify-center rounded-full border border-line text-page-fg transition-colors hover:border-accent hover:text-accent xl:inline-flex sm:h-10 sm:w-10"
                  aria-label={t.nav.logout}
                >
                  <LogOut className="h-4 w-4" strokeWidth={2} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/login"
                  className="whitespace-nowrap text-sm text-page-fg transition-colors hover:text-accent"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex rounded-full bg-accent px-3 py-2 text-sm font-medium text-accent-fg"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line sm:h-10 sm:w-10 xl:hidden"
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
            className="fixed inset-0 z-50 flex flex-col bg-page text-page-fg xl:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="shell flex h-16 items-center justify-between sm:h-[4.5rem]">
              <BrandLogo className="h-9 w-auto text-brand sm:h-11" title="" />
              <button
                type="button"
                className="rounded-full border border-line px-4 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                {t.menu.close}
              </button>
            </div>
            <div className="shell flex items-center justify-between gap-3 border-b border-line py-3 sm:hidden">
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-fg-muted">
                  {t.theme.label}
                </p>
                <ThemeSwitcher />
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-fg-muted">
                  {t.menu.language}
                </p>
                <div className="flex rounded-full border border-line p-0.5 text-xs font-bold tracking-[0.12em]">
                  {(["ka", "en"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLocale(code)}
                      className={`rounded-full px-3 py-1.5 uppercase transition-colors ${locale === code ? "bg-accent text-accent-fg" : "text-page-fg"}`}
                      aria-pressed={locale === code}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <nav
              className="shell flex flex-1 flex-col justify-center overflow-y-auto pb-10"
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
                    <span className="text-[2rem] font-bold leading-none sm:text-5xl">
                      {t.nav[link.key]}
                    </span>
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-medium"
                  >
                    {t.nav.profile}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-fg"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2} />
                    {t.nav.logout}
                  </button>
                </div>
              ) : null}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
