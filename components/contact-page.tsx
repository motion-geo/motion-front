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
    <div className="bg-black text-white">
      <div className="shell grid gap-12 py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <header>
          <SectionLabel index="06">{t.contact.label}</SectionLabel>
          <h1 className="mt-4 text-[clamp(2.4rem,6vw,4.8rem)] font-bold leading-[0.95]">
            {t.contact.title}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
            {t.contact.lead}
          </p>
          <p className="mt-6 max-w-md rounded-2xl border border-motion-lime/40 px-4 py-4 text-sm leading-relaxed text-motion-lime">
            {t.contact.note}
          </p>
        </header>

        {sent ? (
          <div className="rounded-[1.8rem] bg-motion-lime p-8 text-black sm:p-10">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              {t.contact.successTitle}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed">
              {t.contact.successBody}
            </p>
            <button
              type="button"
              className="mt-8 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
              onClick={() => setSent(false)}
            >
              {t.contact.again}
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-[1.8rem] bg-white p-6 text-motion-ink sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
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
            <label className="mt-4 block text-sm font-medium">
              {t.contact.message}
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full resize-y rounded-2xl border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-motion-green"
              />
              {errors.message ? (
                <span className="mt-1 block text-sm text-motion-red">
                  {errors.message}
                </span>
              ) : null}
            </label>
            <button
              type="submit"
              className="mt-6 rounded-full bg-motion-lime px-6 py-3 text-sm font-medium text-black"
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
    <label className="block text-sm font-medium">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-motion-green"
      />
      {error ? (
        <span className="mt-1 block text-sm text-motion-red">{error}</span>
      ) : null}
    </label>
  );
}
