import Link from "next/link";
import AppIcon from "@/components/AppIcon";

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

function EmojiBox({ category, badge }: { category: string; badge?: "check" | "clock" | "retry" }) {
  const iconName = CATEGORY_ICON[category] ?? "cat-other";
  const grad = CATEGORY_GRAD[category] ?? "grad-kids";
  const badgeIcon: Record<string, string> = { check: "check", clock: "hourglass", retry: "retry" };

  return (
    <div className={`w-20 h-20 rounded-[14px] ${grad} flex items-center justify-center shrink-0 relative`}>
      <AppIcon name={iconName} size={56} />
      {badge && (
        <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center ring-2 ring-white">
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

  if (done) {
    return (
      <article className="kid-stat kid-stat-teal flex items-center gap-4 !p-4">
        <EmojiBox category={mission.category} badge="check" />
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-[16px] text-kid-on-teal">{mission.title}</p>
          <p className="font-body font-extrabold text-[13px] text-kid-on-teal mt-1 flex items-center gap-1">
            +{mission.xpReward} XP conquistados <AppIcon name="party" size={16} />
          </p>
        </div>
      </article>
    );
  }

  if (pending) {
    return (
      <Link href={`/crianca/${childId}/aula/${mission.id}`} className="block">
        <article className="kid-stat kid-stat-gold flex items-center gap-4 !p-4">
          <EmojiBox category={mission.category} badge="clock" />
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-[16px] text-kid-text-strong">{mission.title}</p>
            <ProgressBar current={mission.targetCount} target={mission.targetCount} />
            <p className="kid-chip bg-white/60 text-kid-text-soft mt-2 !text-[10px] !px-3 !py-1">
              Esperando
            </p>
          </div>
        </article>
      </Link>
    );
  }

  if (rejected) {
    return (
      <Link href={`/crianca/${childId}/aula/${mission.id}`} className="block">
        <article className="relative bg-white rounded-kid-xl p-4 flex items-center gap-4">
          <XpBadge xp={mission.xpReward} />
          <EmojiBox category={mission.category} badge="retry" />
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-[16px] text-kid-text-strong">{mission.title}</p>
            <ProgressBar current={mission.currentProgress} target={mission.targetCount} />
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/crianca/${childId}/aula/${mission.id}`} className="block">
      <article className="relative bg-white rounded-kid-xl p-4 flex items-center gap-4">
        <XpBadge xp={mission.xpReward} />
        <EmojiBox category={mission.category} />
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-[16px] text-kid-text-strong">{mission.title}</p>
          <ProgressBar current={mission.currentProgress} target={mission.targetCount} />
        </div>
      </article>
    </Link>
  );
}

function XpBadge({ xp }: { xp: number }) {
  return (
    <span
      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-kid-orange/15 flex items-center justify-center"
      title={`+${xp} XP`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-kid-orange">
        <path d="M7.8 1L3 8h3.2L5.2 13 11 6H7.8L8.8 1z" />
      </svg>
    </span>
  );
}

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  return (
    <div className="mt-2">
      <div className="h-[15px] bg-kid-sunk rounded-pill overflow-hidden relative">
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
