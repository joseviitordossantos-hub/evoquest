"use client";

import AppIcon from "@/components/AppIcon";
import BarFill from "@/components/BarFill";

const CATEGORY_ICON: Record<string, string> = {
  leitura: "cat-reading",
  estudo: "cat-study",
  idioma: "cat-language",
  esporte: "cat-sport",
  rotina: "cat-routine",
  outro: "cat-other",
};

type RoutineItem = {
  mission: {
    id: string;
    title: string;
    category: string;
    frequency: string;
    routineMode: string | null;
    routineCoinsPerCompletion: number;
    routineGoalCount: number;
    currentProgress: number;
  };
  doneThisPeriod: boolean;
};

export default function RoutineCard({ item }: { item: RoutineItem }) {
  const { mission, doneThisPeriod } = item;
  const iconName = CATEGORY_ICON[mission.category] ?? "cat-other";
  const isAccumulate = mission.routineMode === "ACCUMULATE";
  const pct = isAccumulate && mission.routineGoalCount > 0
    ? Math.min(100, Math.round((mission.currentProgress / mission.routineGoalCount) * 100))
    : 0;

  return (
    <div
      className="w-[148px] shrink-0 rounded-[18px] p-4 flex flex-col items-center gap-2 transition-all"
      style={{ background: doneThisPeriod ? "#DDF3E4" : "#F5F0FF" }}
    >
      <div className="relative">
        <div
          className="w-[52px] h-[52px] rounded-[12px] flex items-center justify-center"
          style={{ background: doneThisPeriod ? "#B8EDE3" : "#E8DDF7" }}
        >
          <AppIcon name={iconName} size={36} />
        </div>
        {doneThisPeriod && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center ring-2 ring-white">
            <AppIcon name="check" size={13} />
          </span>
        )}
      </div>

      <p className="font-heading font-bold text-[13px] text-kid-text-strong text-center leading-tight line-clamp-2 min-h-[32px]">
        {mission.title}
      </p>

      <span
        className="font-body font-extrabold text-[9px] uppercase tracking-[0.1em] rounded-pill px-2 py-0.5"
        style={{ background: "#E8DDF7", color: "#6B4FA0" }}
      >
        {mission.frequency === "DAILY" ? "DIÁRIA" : "SEMANAL"}
      </span>

      {isAccumulate ? (
        <div className="w-full space-y-1">
          <div className="h-[8px] rounded-pill overflow-hidden relative" style={{ background: "#E8DDF7" }}>
            <BarFill pct={pct} className="grad-xp" />
          </div>
          <p className="font-body font-extrabold text-[10px] text-kid-text-muted text-center">
            {mission.currentProgress}/{mission.routineGoalCount}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <AppIcon name="coin" size={14} />
          <span className="font-body font-extrabold text-[12px] text-kid-text-strong">
            +{mission.routineCoinsPerCompletion}
          </span>
        </div>
      )}
    </div>
  );
}
