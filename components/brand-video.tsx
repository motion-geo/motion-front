"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

export function BrandVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduce) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);
  }, [reduce]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      preload="metadata"
      aria-hidden="true"
    />
  );
}
