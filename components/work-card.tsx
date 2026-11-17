"use client";

import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { WorkItem } from "@/content/types";
import { Mark } from "./logo";
import { SampleBadge } from "./section-label";
import type { LightboxWork } from "./video-lightbox";
import { workFaces, workMedia } from "./work-styles";

export function WorkCard({
  item,
  serviceName,
  sampleLabel,
  playLabel,
  openLabel,
  videoLabel,
  photoLabel,
  onOpen,
  showSummary = true,
}: {
  item: WorkItem;
  serviceName?: string;
  sampleLabel: string;
  playLabel: string;
  openLabel: string;
  videoLabel: string;
  photoLabel: string;
  onOpen?: (work: LightboxWork) => void;
  showSummary?: boolean;
}) {
  const face = workFaces[item.id] ?? { bg: "#141414", fg: "#FFFFFF" };
  const media = workMedia[item.id] ?? { type: "photo" as const };
  const isVideo = media.type === "video";
  const reduce = useReducedMotion();
  const previewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = previewRef.current;
    if (!video || !isVideo) return;
    if (reduce) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);
  }, [isVideo, reduce]);

  function handleOpen() {
    if (!onOpen) return;
    onOpen({
      id: item.id,
      title: item.title,
      summary: item.summary,
      serviceName,
      media: isVideo ? { type: "video", src: media.src } : { type: "photo" },
    });
  }

  const mediaBlock = (
    <div
      className="relative aspect-[4/3] overflow-hidden"
      style={{ background: face.bg, color: face.fg }}
    >
      {isVideo ? (
        <video
          ref={previewRef}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          src={media.src}
          muted
          loop
          playsInline
          autoPlay={!reduce}
          preload="metadata"
          aria-hidden
        />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.28), transparent 45%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.35), transparent 50%)",
            }}
          />
          <Mark className="absolute bottom-4 right-4 h-14 w-16 transition-transform duration-300 group-hover:translate-x-1" />
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

      <div className="absolute left-4 top-4 right-4 z-10 flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
            isVideo
              ? "bg-black/45 text-white backdrop-blur-sm"
              : "border border-current/40 bg-black/10"
          }`}
        >
          {isVideo ? videoLabel : photoLabel}
        </span>
        <SampleBadge label={sampleLabel} />
      </div>

      {isVideo ? (
        <span className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#c8f902] text-black shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-current" strokeWidth={0} />
          </span>
        </span>
      ) : null}
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col p-5">
      {serviceName ? (
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
          {serviceName}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold leading-tight">{item.title}</h2>
      {showSummary ? (
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.summary}</p>
      ) : null}
    </div>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        aria-label={`${isVideo ? playLabel : openLabel}: ${item.title}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-[1.7rem] border border-line bg-soft text-left text-page-fg transition-[border-color,transform] duration-300 hover:border-accent"
      >
        {mediaBlock}
        {body}
      </button>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-line bg-soft text-page-fg">
      {mediaBlock}
      {body}
    </article>
  );
}
