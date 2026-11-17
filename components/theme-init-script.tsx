"use client";

import { useSyncExternalStore } from "react";

/** Renders the FOUC script only during SSR/hydration — avoids React 19 client script warning. */
export function ThemeInitScript({ html }: { html: string }) {
  const renderScript = useSyncExternalStore(
    () => () => {},
    () => false,
    () => true,
  );

  if (!renderScript) return null;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
