export const workFaces: Record<string, { bg: string; fg: string }> = {
  identity: { bg: "#015F3A", fg: "#FFFFFF" },
  rhythm: { bg: "#C8F902", fg: "#000000" },
  search: { bg: "#004B70", fg: "#FFFFFF" },
  film: { bg: "#FF0000", fg: "#FFFFFF" },
  moving: { bg: "#FF8500", fg: "#141414" },
  report: { bg: "#820099", fg: "#FFFFFF" },
};

export type WorkMedia =
  | { type: "photo" }
  | { type: "video"; src: string };

/** Sample media mix: some works are video, others stay as photo covers. */
export const workMedia: Record<string, WorkMedia> = {
  identity: { type: "photo" },
  rhythm: { type: "video", src: "/brand/secondary.mp4" },
  search: { type: "photo" },
  film: { type: "video", src: "/brand/primary.mp4" },
  moving: { type: "video", src: "/brand/secondary.mp4" },
  report: { type: "photo" },
};

export const partnerFaces: Record<string, { bg: string; fg: string }> = {
  nordica: { bg: "#E8E8E8", fg: "#015F3A" },
  pulse: { bg: "#C8F902", fg: "#000000" },
  atelier: { bg: "#000000", fg: "#FFFFFF" },
  grove: { bg: "#015F3A", fg: "#C8F902" },
  orbit: { bg: "#004B70", fg: "#FFFFFF" },
  cinder: { bg: "#FE725B", fg: "#141414" },
  harbor: { bg: "#FF8500", fg: "#141414" },
  violet: { bg: "#820099", fg: "#FFFFFF" },
};
