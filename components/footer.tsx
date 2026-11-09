"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { useLocale } from "./locale";

const links = [
  { href: "/services", key: "services" },
  { href: "/works", key: "works" },
  { href: "/partners", key: "partners" },
  { href: "/terms", key: "terms" },
  { href: "/contact", key: "contact" },
] as const;

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.2fr_1fr] md:py-16">
        <div>
          <Logo className="h-16 w-auto text-motion-green sm:h-20" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
            {t.footer.prototype}
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 self-end text-sm sm:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-motion-lime"
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>
      </div>
      <div className="shell flex flex-col gap-2 border-t border-white/10 py-5 text-xs tracking-[0.14em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footer.rights}</p>
        <p className="font-display text-motion-lime">VISION IN ACTION</p>
      </div>
    </footer>
  );
}
