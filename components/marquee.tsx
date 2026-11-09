"use client";

import { useReducedMotion } from "motion/react";
import { useLocale } from "./locale";

export function Marquee() {
  const { t } = useLocale();
  const reduce = useReducedMotion();
  const names = t.services.items.map((item) => item.name);
  const loop = reduce ? names : [...names, ...names];

  return (
    <div className="overflow-hidden border-y border-motion-lime/50 bg-black">
      <div
        className={`flex items-center gap-8 py-4 sm:gap-12 ${reduce ? "flex-wrap px-5" : "marquee-track w-max"}`}
      >
        {loop.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.16em] text-motion-lime sm:gap-12 sm:text-base"
          >
            {name}
            <span aria-hidden="true" className="text-motion-green">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
