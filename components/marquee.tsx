"use client";

import { useReducedMotion } from "motion/react";
import { useServices } from "./use-services";

export function Marquee() {
  const { items } = useServices();
  const reduce = useReducedMotion();
  const names = items.map((item) => item.name);
  const loop = reduce ? names : [...names, ...names];

  return (
    <div className="overflow-hidden border-y border-accent/40 bg-page">
      <div
        className={`flex items-center gap-8 py-4 sm:gap-12 ${reduce ? "flex-wrap px-5" : "marquee-track w-max"}`}
      >
        {loop.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.16em] text-accent sm:gap-12 sm:text-base"
          >
            {name}
            <span aria-hidden="true" className="text-brand">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
