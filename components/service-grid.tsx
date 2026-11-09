"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Service } from "@/content/types";

const accents = [
  "#C8F902",
  "#015F3A",
  "#FE725B",
  "#FF8500",
  "#004B70",
  "#820099",
  "#FF0000",
  "#FF8500",
  "#004B70",
  "#FE725B",
  "#820099",
  "#015F3A",
] as const;

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
  const accent = accents[active % accents.length];

  if (!detailed) {
    return (
      <ul className="space-y-2 sm:space-y-3">
        {items.map((item, index) => {
          const number = String(index + 1).padStart(2, "0");
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
                  className="group relative flex items-center gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent px-5 py-5 transition-[border-color,background-color] duration-300 hover:border-transparent sm:gap-6 sm:px-7 sm:py-6"
                >
                  <span
                    className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-motion-lime transition-[width] duration-500 ease-out group-hover:w-full"
                    aria-hidden
                  />
                  <span
                    className="relative font-display text-[clamp(2rem,5vw,3.4rem)] leading-none tracking-tight opacity-80 transition-[color,opacity] duration-300 group-hover:!text-black group-hover:opacity-100"
                    style={{ color }}
                  >
                    {number}
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block text-xl font-bold leading-tight text-white transition-colors duration-300 group-hover:text-black sm:text-2xl lg:text-[1.7rem]">
                      {item.name}
                    </span>
                    <span className="mt-1.5 block max-w-xl text-sm leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-black/65 sm:text-[0.95rem]">
                      {item.summary}
                    </span>
                  </span>
                  <span
                    className="relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-lg text-white transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-motion-lime sm:inline-flex"
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
        <div className="sticky top-24 z-[5] rounded-[2rem] bg-white p-8 text-black shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
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
                className="font-display text-[clamp(4.5rem,10vw,8rem)] leading-none tracking-tight"
                style={{ color: accent }}
              >
                {String(active + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-5 max-w-md text-3xl font-bold leading-[1.05] xl:text-4xl">
                {current.name}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-black/70 xl:text-lg">
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
          const number = String(index + 1).padStart(2, "0");
          const color = accents[index % accents.length];
          const isActive = active === index;

          return (
            <li key={item.id} id={item.id} className="scroll-mt-28">
              <motion.button
                type="button"
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={`group relative w-full overflow-hidden rounded-[1.35rem] border px-5 py-4 text-left transition-[background-color,border-color,color] duration-300 sm:px-6 sm:py-5 ${
                  isActive
                    ? "border-transparent bg-white text-black"
                    : "border-white/15 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/[0.07]"
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
                    backgroundColor: isActive ? color : "rgba(200,249,2,0.35)",
                  }}
                />
                <span className="flex items-start gap-4 sm:gap-5">
                  <span
                    className="font-display text-sm tracking-[0.18em] sm:text-base"
                    style={{ color: isActive ? color : "#C8F902" }}
                  >
                    {number}
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
                          className="mt-2 block overflow-hidden text-sm leading-relaxed text-black/65 lg:hidden"
                        >
                          {item.summary}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </span>
                  <span
                    aria-hidden
                    className={`mt-1 hidden sm:inline ${isActive ? "text-black" : "text-motion-lime/50"}`}
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
