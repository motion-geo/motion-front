"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Mark } from "./logo";
import { workFaces } from "./work-styles";

export type LightboxWork = {
  id: string;
  title: string;
  summary: string;
  serviceName?: string;
  coverUrl?: string | null;
  youtubeEmbedUrl?: string | null;
};

export function VideoLightbox({
  work,
  onClose,
  closeLabel,
}: {
  work: LightboxWork | null;
  onClose: () => void;
  closeLabel: string;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!work) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [work, onClose]);

  if (typeof document === "undefined") return null;

  const face = work
    ? (workFaces[work.id] ?? { bg: "#141414", fg: "#FFFFFF" })
    : null;

  return createPortal(
    <AnimatePresence>
      {work ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <button
            type="button"
            aria-label={closeLabel}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={work.title}
            className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0a0a0a] text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:rounded-[2rem]"
            initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3.5 sm:px-6 sm:py-4">
              <div className="min-w-0">
                {work.serviceName ? (
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#c8f902]">
                    {work.serviceName}
                  </p>
                ) : null}
                <h2 className="mt-1 truncate text-lg font-bold sm:text-2xl">
                  {work.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-[#c8f902] hover:bg-[#c8f902] hover:text-black"
                aria-label={closeLabel}
              >
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            <div className="relative bg-black">
              {work.youtubeEmbedUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    key={work.id}
                    src={`${work.youtubeEmbedUrl}?autoplay=1`}
                    title={work.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : work.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={work.coverUrl}
                  alt=""
                  className="aspect-[4/3] w-full object-cover sm:aspect-video"
                />
              ) : (
                <div
                  className="relative flex aspect-[4/3] w-full items-end justify-end p-6 sm:aspect-video sm:p-8"
                  style={{ background: face?.bg, color: face?.fg }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.28), transparent 45%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.35), transparent 50%)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                  <Mark className="relative z-10 h-16 w-20 sm:h-20 sm:w-24" />
                </div>
              )}
            </div>

            <p className="px-4 py-4 text-sm leading-relaxed text-white/70 sm:px-6 sm:py-5 sm:text-base">
              {work.summary}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
