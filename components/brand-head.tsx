"use client";

import { useEffect } from "react";
import { useSettings } from "./use-settings";

/** Keeps favicon in sync with admin uploads after client navigation. */
export function BrandHead() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>("link[data-motion-favicon]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.setAttribute("data-motion-favicon", "1");
      document.head.appendChild(link);
    }
    link.href = settings.faviconUrl;
  }, [settings.faviconUrl]);

  return null;
}
