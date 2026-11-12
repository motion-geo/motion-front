"use client";

import { FormEvent, useState } from "react";
import { useLocale, usePageTitle } from "./locale";
import { SectionLabel } from "./section-label";

type Errors = {
  name?: string;
  email?: string;
  message?: string;
};

export function ContactPage() {
  const { t } = useLocale();
  usePageTitle(`${t.nav.contact} · Motion`);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = t.contact.required;
    if (!message) next.message = t.contact.required;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = t.contact.emailInvalid;
    }
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  return (
    <div className="bg-page text-page-fg">
      <div className="shell grid gap-8 py-10 sm:gap-12 sm:py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <header>
          <SectionLabel>{t.contact.label}</SectionLabel>
          <h1 className="mt-4 text-[clamp(2.1rem,9vw,4.8rem)] font-bold leading-[0.95]">
            {t.contact.title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-fg-muted sm:mt-6 sm:text-lg">
            {t.contact.lead}
          </p>
          <p className="mt-5 max-w-md border-l-2 border-accent pl-4 text-sm leading-relaxed text-fg-muted sm:mt-6">
            {t.contact.note}
          </p>
        </header>

        {sent ? (
          <div className="rounded-[1.5rem] bg-accent p-6 text-accent-fg sm:rounded-[1.8rem] sm:p-10">
            <h2 className="text-2xl font-bold leading-tight sm:text-4xl">
              {t.contact.successTitle}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed">
              {t.contact.successBody}
            </p>
            <button
              type="button"
              className="mt-8 rounded-full bg-page px-5 py-3 text-sm font-medium text-page-fg"
              onClick={() => setSent(false)}
            >
              {t.contact.again}
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="min-w-0 rounded-[1.5rem] border border-line bg-soft p-4 sm:rounded-[1.8rem] sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <Field
                label={t.contact.name}
                name="name"
                error={errors.name}
                autoComplete="name"
              />
              <Field
                label={t.contact.company}
                name="company"
                autoComplete="organization"
              />
              <Field label={t.contact.phone} name="phone" autoComplete="tel" />
              <Field
                label={t.contact.email}
                name="email"
                type="email"
                error={errors.email}
                autoComplete="email"
              />
            </div>
            <label className="mt-5 block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-fg-muted">
                {t.contact.message}
              </span>
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full resize-y rounded-2xl border border-line bg-page px-4 py-3.5 text-base text-page-fg outline-none transition-[border-color,box-shadow] placeholder:text-fg-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--soft)]"
              />
              {errors.message ? (
                <span className="mt-1.5 block text-sm text-motion-red">
                  {errors.message}
                </span>
              ) : null}
            </label>
            <button
              type="submit"
              className="mt-7 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-fg transition-transform hover:scale-[1.02]"
            >
              {t.contact.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-fg-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-2xl border border-line bg-page px-4 py-3.5 text-base text-page-fg outline-none transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_3px_var(--soft)]"
      />
      {error ? (
        <span className="mt-1.5 block text-sm text-motion-red">{error}</span>
      ) : null}
    </label>
  );
}
