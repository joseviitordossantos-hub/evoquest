import Link from "next/link";
import AppIcon from "@/components/AppIcon";
import ComplexityBadge from "@/components/ComplexityBadge";
import type { ComplexityT } from "@/lib/enums";

type Mission = {
  id: string;
  title: string;
  difficulty: string;
  xpReward: number;
  rewardText: string | null;
  category: string;
  targetCount: number;
  currentProgress: number;
};

const CATEGORY_ICON: Record<string, string> = {
  leitura: "cat-reading",
  estudo: "cat-study",
  idioma: "cat-language",
  esporte: "cat-sport",
  rotina: "cat-routine",
  outro: "cat-other",
};

const CATEGORY_GRAD: Record<string, string> = {
  leitura: "grad-teal",
  estudo: "grad-gold",
  idioma: "grad-blue",
  esporte: "grad-teal",
  rotina: "grad-primary",
  outro: "grad-kids",
};

const RARITY_CARD: Record<ComplexityT, { bg: string; bgDone: string; text: string; textDone: string; iconFrom: string; iconTo: string }> = {
  COMMON:    { bg: "#EDE9F3", bgDone: "#D4EDDA", text: "#4F4668", textDone: "#1B5E2E", iconFrom: "#C4B8DB", iconTo: "#9F95B0" },
  RARE:      { bg: "#E0F0FF", bgDone: "#D4EDDA", text: "#1B4F7A", textDone: "#1B5E2E", iconFrom: "#6FC1FA", iconTo: "#1B7CC9" },
  LEGENDARY: { bg: "#FFF4E0", bgDone: "#D4EDDA", text: "#7A5200", textDone: "#1B5E2E", iconFrom: "#FFC25C", iconTo: "#D4831A" },
  MYTHIC:    { bg: "#FFE8EB", bgDone: "#D4EDDA", text: "#7A1A24", textDone: "#1B5E2E", iconFrom: "#FF6675", iconTo: "#B82332" },
};

function getRarityColors(difficulty: string) {
  return RARITY_CARD[(difficulty as ComplexityT) in RARITY_CARD ? (difficulty as ComplexityT) : "COMMON"];
}

function EmojiBox({ category, badge, iconFrom, iconTo }: { category: string; badge?: "check" | "clock" | "retry"; iconFrom: string; iconTo: string }) {
  const iconName = CATEGORY_ICON[category] ?? "cat-other";
  const badgeIcon: Record<string, string> = { check: "check", clock: "hourglass", retry: "retry" };

  return (
    <div
      className="w-20 h-20 rounded-[14px] flex items-center justify-center shrink-0 relative"
      style={{ background: `linear-gradient(135deg, ${iconFrom}, ${iconTo})` }}
    >
      <AppIcon name={iconName} size={56} />
      {badge && (
        <span className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center ring-2 ring-white ${badge === "check" ? "animate-bounce-in" : "animate-pop"}`}>
          <AppIcon name={badgeIcon[badge]} size={22} />
        </span>
      )}
    </div>
  );
}

export default function MissionCard({
  mission,
  childId,
  log,
}: {
  mission: Mission;
  childId: string;
  log?: { status: string } | null;
}) {
  const done = log?.status === "APPROVED";
  const pending = log?.status === "PENDING";
  const rejected = log?.status === "REJECTED";
  const r = getRarityColors(mission.difficulty);

  if (done) {
    return (
      <article
        className="rounded-kid-xl p-4 flex items-center gap-4"
        style={{ background: r.bgDone }}
      >
        <EmojiBox category={mission.category} badge="check" iconFrom={r.iconFrom} iconTo={r.iconTo} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-heading font-semibold text-[16px]" style={{ color: r.textDone }}>{mission.title}</p>
            <ComplexityBadge complexity={mission.difficulty} />
          </div>
          <p className="font-body font-extrabold text-[13px] mt-1 flex items-center gap-1" style={{ color: r.textDone }}>
            +{mission.xpReward} XP conquistados <AppIcon name="party" size={16} />
          </p>
        </div>
      </article>
    );
  }

  if (pending) {
    return (
      <Link href={`/crianca/${childId}/aula/${mission.id}`} className="block kid-tappable">
        <article
          className="rounded-kid-xl p-4 flex items-center gap-4"
          style={{ background: r.bg }}
        >
          <EmojiBox category={mission.category} badge="clock" iconFrom={r.iconFrom} iconTo={r.iconTo} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-heading font-semibold text-[16px]" style={{ color: r.text }}>{mission.title}</p>
              <ComplexityBadge complexity={mission.difficulty} />
            </div>
            <ProgressBar current={mission.targetCount} target={mission.targetCount} />
            <p className="kid-chip bg-white/60 mt-2 !text-[10px] !px-3 !py-1" style={{ color: r.text }}>
              Esperando
            </p>
          </div>
        </article>
      </Link>
    );
  }

  if (rejected) {
    return (
      <Link href={`/crianca/${childId}/aula/${mission.id}`} className="block kid-tappable">
        <article
          className="rounded-kid-xl p-4 flex items-center gap-4"
          style={{ background: r.bg }}
        >
          <EmojiBox category={mission.category} badge="retry" iconFrom={r.iconFrom} iconTo={r.iconTo} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-heading font-semibold text-[16px]" style={{ color: r.text }}>{mission.title}</p>
              <ComplexityBadge complexity={mission.difficulty} />
            </div>
            <ProgressBar current={mission.currentProgress} target={mission.targetCount} />
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/crianca/${childId}/aula/${mission.id}`} className="block">
      <article
        className="rounded-kid-xl p-4 flex items-center gap-4"
        style={{ background: r.bg }}
      >
        <EmojiBox category={mission.category} iconFrom={r.iconFrom} iconTo={r.iconTo} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-heading font-semibold text-[16px]" style={{ color: r.text }}>
              {mission.title}
            </p>
            <ComplexityBadge complexity={mission.difficulty} />
          </div>
          <ProgressBar current={mission.currentProgress} target={mission.targetCount} />
        </div>
      </article>
    </Link>
  );
}

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  const nearDone = pct >= 80 && pct < 100;
  return (
    <div className="mt-2">
      <div className={`h-[15px] bg-kid-sunk rounded-pill overflow-hidden relative ${nearDone ? "animate-pulse" : ""}`}>
        <div
          className="h-full grad-xp rounded-pill transition-[width] duration-500 ease-kid-standard"
          style={{ width: `${pct}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center font-body font-extrabold text-[11px] text-kid-text-strong">
          {current} / {target}
        </span>
      </div>
    </div>
  );
}
