"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Service } from "@/content/types";
import { ServiceIcon } from "./service-icons";

const accents = [
  "var(--service-1)",
  "var(--service-2)",
  "var(--service-3)",
  "var(--service-4)",
  "var(--service-5)",
  "var(--service-6)",
] as const;

/** Lime disappears on white — use a darker lime, not brand green. */
function accentOnLight(color: string) {
  return color.toLowerCase() === "#c8f902" ? "#6B8A00" : color;
}

export function ServiceGrid({
  items,
  detailed = false,
}: {
  items: Service[];
  detailed?: boolean;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];
  const accent = accentOnLight(accents[active % accents.length]);

  if (!detailed) {
    return (
      <ul className="space-y-2 sm:space-y-3">
        {items.map((item, index) => {
          const color = accents[index % accents.length];

          return (
            <li key={item.id} id={item.id} className="scroll-mt-28">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.55,
                  delay: reduce ? 0 : Math.min(index * 0.05, 0.35),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/services#${item.id}`}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-[1.5rem] border border-line bg-soft px-5 py-5 transition-[border-color,background-color] duration-300 hover:border-transparent sm:gap-6 sm:px-7 sm:py-6"
                >
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-accent transition-[width] duration-500 ease-out group-hover:w-full"
                    aria-hidden
                  />
                  <span
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-soft transition-[border-color,background-color,color] duration-300 group-hover:border-accent-fg/20 group-hover:bg-accent-fg/5 group-hover:!text-accent-fg sm:h-14 sm:w-14"
                    style={{ color }}
                  >
                    <ServiceIcon
                      id={item.id}
                      className="h-6 w-6 sm:h-7 sm:w-7"
                    />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block text-xl font-bold leading-tight text-page-fg transition-colors duration-300 group-hover:text-accent-fg sm:text-2xl lg:text-[1.7rem]">
                      {item.name}
                    </span>
                    <span className="mt-1.5 block max-w-xl text-sm leading-relaxed text-fg-muted transition-colors duration-300 group-hover:text-accent-fg sm:text-[0.95rem]">
                      {item.summary}
                    </span>
                  </span>
                  <span
                    className="relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-lg text-page-fg transition-all duration-300 group-hover:border-accent-fg group-hover:bg-accent-fg group-hover:text-accent sm:inline-flex"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
      <aside className="relative hidden min-h-full lg:block">
        <div className="sticky top-24 z-[5] rounded-[2rem] bg-card p-8 text-card-fg shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[22rem] flex-col"
            >
              <span
                className="flex h-20 w-20 items-center justify-center rounded-[1.4rem]"
                style={{ background: `${accent}22`, color: accent }}
              >
                <ServiceIcon id={current.id} className="h-10 w-10" />
              </span>
              <h2 className="mt-6 max-w-md text-3xl font-bold leading-[1.05] xl:text-4xl">
                {current.name}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-card-fg/70 xl:text-lg">
                {current.summary}
              </p>
              <div className="mt-auto pt-8">
                <div
                  className="h-1.5 w-24 rounded-full"
                  style={{ background: accent }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </aside>

      <ul className="space-y-2">
        {items.map((item, index) => {
          const color = accents[index % accents.length];
          const isActive = active === index;
          const lightColor = accentOnLight(color);

          return (
            <li key={item.id} id={item.id} className="scroll-mt-28">
              <motion.button
                type="button"
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={`group relative w-full overflow-hidden rounded-[1.35rem] border px-5 py-4 text-left transition-[background-color,border-color,color] duration-300 sm:px-6 sm:py-5 ${
                  isActive
                    ? "border-transparent bg-card text-card-fg"
                    : "border-line bg-soft text-page-fg hover:border-accent/30"
                }`}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: reduce ? 0 : Math.min(index * 0.035, 0.28),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span
                  className="absolute inset-y-0 left-0 w-1.5"
                  style={{
                    backgroundColor: isActive ? lightColor : color,
                  }}
                />
                <span className="flex items-start gap-4 sm:gap-5">
                  <span
                    className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border sm:h-12 sm:w-12 ${
                      isActive
                        ? "border-line bg-soft"
                        : "border-line bg-soft"
                    }`}
                    style={{ color: isActive ? lightColor : color }}
                  >
                    <ServiceIcon
                      id={item.id}
                      className="h-5 w-5 sm:h-6 sm:w-6"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl font-bold leading-tight sm:text-2xl">
                      {item.name}
                    </span>
                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.span
                          key="summary"
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          className="mt-2 block overflow-hidden text-sm leading-relaxed text-card-fg/65 lg:hidden"
                        >
                          {item.summary}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </span>
                  <span
                    aria-hidden
                    className={`mt-1 hidden sm:inline ${isActive ? "text-card-fg" : "text-accent/50"}`}
                  >
                    →
                  </span>
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
