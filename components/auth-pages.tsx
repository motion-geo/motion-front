"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { apiActivatePlan } from "@/lib/api";
import { useAuth } from "./auth";
import { BrandLogo } from "./brand-logo";
import { Mark } from "./logo";
import { useLocale, usePageTitle } from "./locale";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,15}$/;

type LoginErrors = {
  email?: string;
  password?: string;
};

type RegisterErrors = {
  email?: string;
  phone?: string;
  nameOrCompany?: string;
  password?: string;
  confirmPassword?: string;
};

function readPlanResume(params: URLSearchParams) {
  const plan = params.get("plan")?.trim() || "";
  const unit = params.get("unit")?.trim() || "";
  const quantity = Number(params.get("quantity") || "0");
  if (!plan || !unit || !Number.isFinite(quantity) || quantity < 1) {
    return null;
  }
  return { plan, unit, quantity };
}

export function LoginPage() {
  const { t } = useLocale();
  const { user, token, login, updateUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  usePageTitle(`${t.nav.login} · Motion`);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const resumeHandled = useRef(false);

  async function finishAfterAuth(accessToken: string) {
    if (resumeHandled.current) return;
    resumeHandled.current = true;
    const resume = readPlanResume(searchParams);
    const nextPath = searchParams.get("next")?.trim() || "/profile";
    if (resume) {
      try {
        const row = await apiActivatePlan(accessToken, resume.plan, {
          unit: resume.unit,
          quantity: resume.quantity,
        });
        updateUser({ planId: row.planSlug });
        router.push("/profile");
        return;
      } catch {
        router.push(nextPath.startsWith("/") ? nextPath : "/plans");
        return;
      }
    }
    router.push(nextPath.startsWith("/") ? nextPath : "/profile");
  }

  useEffect(() => {
    if (!user || !token) return;
    void finishAfterAuth(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const next: LoginErrors = {};

    if (!email) next.email = t.auth.required;
    else if (!EMAIL_RE.test(email)) next.email = t.auth.emailInvalid;
    if (!password) next.password = t.auth.required;
    else if (password.length < 6) next.password = t.auth.passwordShort;

    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await login({ email, password });
      // redirect handled by effect with token + query params
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : t.auth.formError,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      label={t.auth.loginLabel}
      title={t.auth.loginTitle}
      lead={t.auth.loginLead}
      switchHref="/register"
      switchLabel={t.auth.toRegister}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <Field
          label={t.auth.email}
          name="email"
          type="email"
          autoComplete="email"
          error={errors.email}
        />
        <Field
          label={t.auth.password}
          name="password"
          type="password"
          autoComplete="current-password"
          error={errors.password}
        />
        {formError ? (
          <p className="rounded-2xl border border-motion-red/40 bg-motion-red/10 px-4 py-3 text-sm text-motion-red">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-fg transition-transform hover:scale-[1.015] disabled:opacity-60"
        >
          {t.auth.loginSubmit}
        </button>
        <p className="text-center text-xs leading-relaxed text-fg-muted">
          {t.auth.note}
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { t } = useLocale();
  const { user, register } = useAuth();
  const router = useRouter();
  usePageTitle(`${t.nav.register} · Motion`);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/profile");
  }, [user, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const nameOrCompany = String(data.get("nameOrCompany") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    const next: RegisterErrors = {};

    if (!email) next.email = t.auth.required;
    else if (!EMAIL_RE.test(email)) next.email = t.auth.emailInvalid;
    if (!phone) next.phone = t.auth.required;
    else if (!PHONE_RE.test(phone)) next.phone = t.auth.phoneInvalid;
    if (!nameOrCompany) next.nameOrCompany = t.auth.required;
    if (!password) next.password = t.auth.required;
    else if (password.length < 6) next.password = t.auth.passwordShort;
    if (!confirmPassword) next.confirmPassword = t.auth.required;
    else if (password !== confirmPassword) {
      next.confirmPassword = t.auth.passwordMismatch;
    }

    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await register({ email, phone, nameOrCompany, password });
      router.push("/profile");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : t.auth.formError,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      label={t.auth.registerLabel}
      title={t.auth.registerTitle}
      lead={t.auth.registerLead}
      switchHref="/login"
      switchLabel={t.auth.toLogin}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          label={t.auth.nameOrCompany}
          name="nameOrCompany"
          autoComplete="organization"
          error={errors.nameOrCompany}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t.auth.email}
            name="email"
            type="email"
            autoComplete="email"
            error={errors.email}
          />
          <Field
            label={t.auth.phone}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            digitsOnly
            error={errors.phone}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t.auth.password}
            name="password"
            type="password"
            autoComplete="new-password"
            error={errors.password}
          />
          <Field
            label={t.auth.confirmPassword}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
        </div>
        {formError ? (
          <p className="rounded-2xl border border-motion-red/40 bg-motion-red/10 px-4 py-3 text-sm text-motion-red">
            {formError}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-fg transition-transform hover:scale-[1.015] disabled:opacity-60"
        >
          {t.auth.registerSubmit}
        </button>
        <p className="text-center text-xs leading-relaxed text-fg-muted">
          {t.auth.note}
        </p>
      </form>
    </AuthShell>
  );
}

function AuthShell({
  label,
  title,
  lead,
  switchHref,
  switchLabel,
  children,
}: {
  label: string;
  title: string;
  lead: string;
  switchHref: string;
  switchLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-page text-page-fg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[radial-gradient(ellipse_at_top,_rgba(200,249,2,0.16),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(1,95,58,0.35),_transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-24 hidden opacity-20 md:block"
      >
        <Mark className="h-64 w-72 text-accent" />
      </div>

      <div className="shell relative flex min-h-[calc(100svh-4rem)] items-center justify-center py-10 sm:min-h-[calc(100svh-4.5rem)] sm:py-14">
        <div className="w-full max-w-2xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <BrandLogo className="h-12 w-auto text-brand sm:h-14" title="" />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {label}
            </p>
            <h1 className="mt-3 font-display text-[clamp(1.85rem,5vw,2.6rem)] font-bold leading-[1.05]">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
              {lead}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-line bg-soft/60 p-6 backdrop-blur-sm sm:p-8 md:p-10">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-fg-muted">
            <Link
              href={switchHref}
              className="font-medium text-accent transition-colors hover:text-page-fg"
            >
              {switchLabel}
            </Link>
          </p>
        </div>
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
  inputMode,
  digitsOnly = false,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  digitsOnly?: boolean;
}) {
  return (
    <label className="block text-left">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onBeforeInput={
          digitsOnly
            ? (event) => {
                if (event.data && /\D/.test(event.data)) {
                  event.preventDefault();
                }
              }
            : undefined
        }
        onChange={
          digitsOnly
            ? (event) => {
                event.currentTarget.value = event.currentTarget.value.replace(
                  /\D/g,
                  "",
                );
              }
            : undefined
        }
        className="auth-input mt-2 w-full rounded-2xl border border-line px-4 py-3.5 text-base text-page-fg outline-none transition-[border-color,box-shadow] placeholder:text-fg-muted focus:border-accent focus:shadow-[0_0_0_3px_var(--soft)]"
      />
      {error ? (
        <span className="mt-1.5 block text-sm text-motion-red">{error}</span>
      ) : null}
    </label>
  );
}
