"use client";

import { Logo } from "./logo";
import { useSettings } from "./use-settings";

export function BrandLogo({
  className,
  title = "Motion",
}: {
  className?: string;
  title?: string;
}) {
  const { settings } = useSettings();
  return <Logo className={className} title={title} src={settings.logoUrl} />;
}
