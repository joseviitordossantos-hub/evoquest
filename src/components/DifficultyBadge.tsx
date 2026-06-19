import AppIcon from "@/components/AppIcon";

const MAP = {
  EASY: { label: "FÁCIL", chip: "kid-chip-teal" },
  MEDIUM: { label: "MÉDIO", chip: "kid-chip-gold" },
  HARD: { label: "DIFÍCIL", chip: "kid-chip-pink" },
  BOSS: { label: "BOSS", chip: "kid-chip-violet", icon: "dragon" },
} as const;

export default function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const m = MAP[difficulty as keyof typeof MAP] ?? MAP.EASY;
  return (
    <span className={`kid-chip ${m.chip} !text-[11px] !px-3 !py-1 inline-flex items-center gap-1`}>
      {"icon" in m && <AppIcon name={m.icon} size={14} />}
      {m.label}
    </span>
  );
}
