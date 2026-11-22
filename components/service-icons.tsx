import {
  BarChart3,
  BriefcaseBusiness,
  Clapperboard,
  Hash,
  icons,
  Layers,
  LineChart,
  Megaphone,
  PenTool,
  Search,
  Share2,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

const lucideMap = icons as Record<string, LucideIcon>;

/** Legacy slug → icon fallbacks for older static content. */
const iconsBySlug: Record<string, LucideIcon> = {
  branding: Sparkles,
  strategy: Target,
  social: Share2,
  meta: Megaphone,
  google: Search,
  linkedin: BriefcaseBusiness,
  graphic: PenTool,
  video: Clapperboard,
  motion: Layers,
  performance: BarChart3,
  analytics: LineChart,
  xads: Hash,
};

function resolveLucide(id: string, icon?: string): LucideIcon {
  if (icon && lucideMap[icon]) return lucideMap[icon];
  if (iconsBySlug[id]) return iconsBySlug[id];
  if (lucideMap[id]) return lucideMap[id];
  return Sparkles;
}

export function ServiceIcon({
  id,
  icon,
  iconSvg,
  className,
  strokeWidth = 1.75,
}: {
  id: string;
  icon?: string;
  iconSvg?: string | null;
  className?: string;
  strokeWidth?: number;
}) {
  const custom = iconSvg?.trim();
  if (custom) {
    if (custom.startsWith("data:image/")) {
      return (
        <span
          className={className}
          style={{
            display: "inline-block",
            backgroundColor: "currentColor",
            WebkitMaskImage: `url("${custom}")`,
            maskImage: `url("${custom}")`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
          aria-hidden
        />
      );
    }

    return (
      <span
        className={`inline-flex items-center justify-center [&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current [&_svg_[fill]:not([fill=none])]:!fill-current [&_svg_[stroke]:not([stroke=none])]:!stroke-current ${className ?? ""}`}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: custom }}
      />
    );
  }

  const Icon = resolveLucide(id, icon);
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
