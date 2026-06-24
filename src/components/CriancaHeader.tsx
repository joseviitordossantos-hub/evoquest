import { getChildStats } from "@/lib/childStats";
import { prisma } from "@/lib/prisma";
import CoinPill from "@/components/CoinPill";
import AvatarRing from "@/components/AvatarRing";
import XpBarFill from "@/components/XpBarFill";
import AppIcon from "@/components/AppIcon";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

export default async function CriancaHeader({ childId }: { childId: string }) {
  const [stats, streak] = await Promise.all([
    getChildStats(childId),
    prisma.streak.findUnique({ where: { childId } }),
  ]);
  const { child, totalXp, availableCoins, level, xpInLevel, rank } = stats;
  const avatarSrc = AVATAR_MAP[child.avatarSeed] ?? null;
  const progressPct = Math.max(4, xpInLevel);
  const streakDays = streak?.currentDays ?? 0;

  return (
    <div className="grad-header rounded-kid-xl p-4 relative overflow-hidden">
      <div className="pattern-dots-light absolute inset-0 rounded-kid-xl opacity-60" />
      <div className="flex items-start justify-between relative gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <AvatarRing
            src={avatarSrc}
            alt={child.displayName}
            fallback={child.displayName.charAt(0)}
            badge={rank.badge}
            gradFrom={rank.color}
            gradTo={rank.bgColor}
          />
          <div className="min-w-0 flex-1">
            <span
              className="inline-block font-body font-extrabold text-[10px] tracking-[0.1em] uppercase rounded-pill px-2 py-0.5"
              style={{ background: rank.bgColor, color: rank.color }}
            >
              {rank.label}
            </span>
            <p className="font-heading font-bold text-[22px] leading-tight text-white truncate">{child.displayName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {streakDays > 0 && (
            <span
              className="inline-flex items-center gap-0.5 pl-0.5 pr-2 h-9 sm:h-11 rounded-pill font-heading font-bold text-[15px] sm:text-[18px] leading-none"
              style={{ background: "#FF5FA2", color: "#FFFFFF" }}
            >
              <AppIcon name="fire" size={24} />
              {streakDays}
            </span>
          )}
          <CoinPill childId={childId} amount={availableCoins} />
        </div>
      </div>

      <div className="mt-4 relative">
        <div className="flex justify-between items-baseline mb-1.5">
          <p className="font-body font-extrabold text-[13px] tracking-[0.04em]">
            <span className="text-white">{xpInLevel}</span>
            <span className="text-white/70"> / 100 XP</span>
          </p>
          <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-white/60">
            Nível {level}
          </p>
        </div>
        <div className="h-[12px] bg-white/15 rounded-pill overflow-hidden">
          <XpBarFill pct={progressPct} />
        </div>
        <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.08em] text-white/60 mt-1.5">
          Total acumulado: {totalXp} XP
        </p>
      </div>
    </div>
  );
}
