import {
  Calendar,
  Gift,
  Trophy,
  Star,
  Sparkles,
  CircleDot,
  BookOpen,
  Pencil,
  Globe,
  Circle,
  Brush,
  Coins,
  CircleCheck,
  Clock,
  RotateCcw,
  X,
  Video,
  BookText,
  Brain,
  Target,
  Dumbbell,
  Play,
  PartyPopper,
  ShieldAlert,
  Sprout,
  Flame,
  BarChart3,
  ArrowLeft,
  Lock,
  Snowflake,
  AlertTriangle,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

export type IconName =
  | "calendar"
  | "gift"
  | "trophy"
  | "star"
  | "sparkle"
  | "circle-dot"
  | "book"
  | "pencil"
  | "globe"
  | "soccer"
  | "broom"
  | "sparkles"
  | "coin"
  | "check"
  | "clock"
  | "retry"
  | "close"
  | "video"
  | "book-open"
  | "brain"
  | "target"
  | "muscle"
  | "play"
  | "party"
  | "dragon"
  | "sprout"
  | "fire"
  | "chart"
  | "arrow-left"
  | "lock"
  | "snowflake"
  | "warning";

const ICON_MAP: Record<IconName, ComponentType<LucideProps>> = {
  calendar: Calendar,
  gift: Gift,
  trophy: Trophy,
  star: Star,
  sparkle: Sparkles,
  "circle-dot": CircleDot,
  book: BookOpen,
  pencil: Pencil,
  globe: Globe,
  soccer: Circle,
  broom: Brush,
  sparkles: Sparkles,
  coin: Coins,
  check: CircleCheck,
  clock: Clock,
  retry: RotateCcw,
  close: X,
  video: Video,
  "book-open": BookText,
  brain: Brain,
  target: Target,
  muscle: Dumbbell,
  play: Play,
  party: PartyPopper,
  dragon: ShieldAlert,
  sprout: Sprout,
  fire: Flame,
  chart: BarChart3,
  "arrow-left": ArrowLeft,
  lock: Lock,
  snowflake: Snowflake,
  warning: AlertTriangle,
};

const FILL_MAP: Partial<Record<IconName, string>> = {
  calendar: "#FFC400",
  gift: "#FF9ECF",
  trophy: "#FFC400",
  star: "#FFC400",
  sparkle: "#7B5CFF",
  "circle-dot": "#FF4D2E",
  book: "#14C8B6",
  pencil: "#FFC400",
  globe: "#2E8BFF",
  soccer: "#14C8B6",
  broom: "#7B5CFF",
  sparkles: "#7B5CFF",
  coin: "#FFC400",
  check: "#14C8B6",
  clock: "#FFC400",
  retry: "#2E8BFF",
  close: "#FF4D2E",
  video: "#FF4D2E",
  "book-open": "#2E8BFF",
  brain: "#FF9ECF",
  target: "#FF4D2E",
  muscle: "#FF4D2E",
  play: "#FFC400",
  party: "#FF9ECF",
  dragon: "#7B5CFF",
  sprout: "#14C8B6",
  fire: "#FFC400",
  chart: "#2E8BFF",
  "arrow-left": "#16140F",
  lock: "#6B6459",
  snowflake: "#14C8B6",
  warning: "#FFC400",
};

const SOFT_FILL_MAP: Partial<Record<IconName, string>> = {
  book: "#0E9A8B",
  pencil: "#D4A300",
  globe: "#1A6AD4",
  soccer: "#0E9A8B",
  broom: "#5A3FD6",
  sparkles: "#5A3FD6",
  calendar: "#D4A300",
  gift: "#D45F94",
  trophy: "#D4A300",
  star: "#D4A300",
  sparkle: "#5A3FD6",
  check: "#0E9A8B",
  clock: "#D4A300",
  fire: "#D4A300",
  target: "#C7301A",
  brain: "#D45F94",
  video: "#C7301A",
  muscle: "#C7301A",
  play: "#D4A300",
  coin: "#D4A300",
  sprout: "#0E9A8B",
  dragon: "#5A3FD6",
  chart: "#1A6AD4",
  snowflake: "#0E9A8B",
};

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  fill?: string | false;
  soft?: boolean;
};

export { KidIcon as default };

export function KidIcon({ name, size = 24, className = "", fill, soft }: Props) {
  const Icon = ICON_MAP[name];
  if (soft) {
    const softFill = fill || SOFT_FILL_MAP[name] || FILL_MAP[name] || "currentColor";
    return (
      <Icon
        size={size}
        strokeWidth={0}
        stroke="none"
        fill={softFill}
        className={`inline-block shrink-0 ${className}`}
        aria-hidden="true"
      />
    );
  }
  const fillColor = fill === false ? "none" : (fill || FILL_MAP[name] || "none");
  return (
    <Icon
      size={size}
      strokeWidth={2.75}
      fill={fillColor}
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    />
  );
}
