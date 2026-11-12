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

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9A3.7 3.7 0 0 0 7.5 20.2h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9ZM12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 1.8A3 3 0 1 0 15 12a3 3 0 0 0-3-3Zm5.35-3.55a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z" />
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <path d="M14.2 22v-8.2h2.75l.41-3.2H14.2V8.55c0-.93.26-1.56 1.6-1.56H17.5V4.14A22.2 22.2 0 0 0 14.9 4c-2.58 0-4.35 1.57-4.35 4.46v2.49H7.9v3.2h2.65V22h3.65Z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <path d="M6.2 9.1H2.9V21h3.3V9.1ZM4.55 3A1.9 1.9 0 1 0 4.56 6.8 1.9 1.9 0 0 0 4.55 3ZM21 21h-3.28v-6.4c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.39V21H9.84V9.1h3.15v1.62h.04c.44-.83 1.51-1.7 3.11-1.7 3.33 0 3.94 2.19 3.94 5.04V21Z" />
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <path d="M22.5 7.7a2.8 2.8 0 0 0-2-2C18.7 5.3 12 5.3 12 5.3s-6.7 0-8.5.4a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 1.1 12a29.4 29.4 0 0 0 .4 4.3 2.8 2.8 0 0 0 2 2c1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4a2.8 2.8 0 0 0 2-2 29.4 29.4 0 0 0 .4-4.3 29.4 29.4 0 0 0-.4-4.3ZM9.9 15.1V8.9L15.6 12 9.9 15.1Z" />
    ),
  },
] as const;

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-line bg-page text-page-fg">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.2fr_1fr] md:py-16">
        <div>
          <Logo className="h-16 w-auto text-brand sm:h-20" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-fg-muted">
            {t.footer.prototype}
          </p>
          <div className="mt-7 flex items-center gap-2.5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-page-fg transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-3 self-end text-sm sm:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-accent"
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>
      </div>
      <div className="shell flex flex-col gap-2 border-t border-line py-5 text-xs tracking-[0.14em] text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footer.rights}</p>
        <p className="font-display text-accent">VISION IN ACTION</p>
      </div>
    </footer>
  );
}
