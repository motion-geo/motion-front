import {
  BarChart3,
  BriefcaseBusiness,
  Clapperboard,
  Hash,
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

export const serviceIcons: Record<string, LucideIcon> = {
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

export function ServiceIcon({
  id,
  className,
  strokeWidth = 1.75,
}: {
  id: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = serviceIcons[id] ?? Sparkles;
  return <Icon className={className} strokeWidth={strokeWidth} aria-hidden />;
}
