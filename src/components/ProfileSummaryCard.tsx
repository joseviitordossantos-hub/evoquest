import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getChildStats } from "@/lib/childStats";
import { getNextRank } from "@/lib/ranks";
import AvatarRing from "@/components/AvatarRing";
import AppIcon from "@/components/AppIcon";
import BarFill from "@/components/BarFill";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default async function ProfileSummaryCard({ childId }: { childId: string }) {
  const [stats, achievementsCount, fam] = await Promise.all([
    getChildStats(childId),
    prisma.achievement.count({ where: { childId } }),
    prisma.child.findUniqueOrThrow({ where: { id: childId }, select: { family: { select: { name: true } } } }),
  ]);
  const { child, level, xpInLevel, availableCoins, rank } = stats;
  const avatarSrc = AVATAR_MAP[child.avatarSeed] ?? null;
  const nextRank = getNextRank(level) ?? rank;
  const progressPct = Math.max(4, xpInLevel);

  const surname = fam.family.name.trim().split(/\s+/).pop() ?? "";
  const fullName = surname && surname !== child.displayName ? `${child.displayName} ${surname}` : child.displayName;

  return (
    <section className="kid-card p-6 lg:p-8 flex flex-col gap-7 lg:justify-between relative">
      <Link
        href={`/crianca/${childId}/perfil`}
        aria-label="Ver perfil completo"
        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-kid-tint-violet text-kid-on-violet flex items-center justify-center transition-transform hover:-translate-y-0.5 kid-tappable"
      >
        <IconArrowUpRight className="w-[18px] h-[18px]" />
      </Link>

      {/* Cabeçalho: avatar + nome + rank atual */}
      <div className="flex items-center gap-4 lg:gap-5 pr-14">
        <div className="w-[86px] h-[86px] lg:w-auto lg:h-auto shrink-0">
          <div className="scale-[0.8] origin-top-left lg:scale-100">
            <AvatarRing
              src={avatarSrc}
              alt={fullName}
              fallback={child.displayName.charAt(0)}
              badge={rank.badge}
              gradFrom={rank.color}
              gradTo={rank.bgColor}
              size={108}
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-heading font-bold text-[24px] lg:text-[36px] leading-[1.05] text-kid-text-strong truncate">
            {fullName}
          </p>
          <span
            className="inline-flex mt-2 lg:mt-2.5 font-body font-extrabold text-[10px] lg:text-[13px] tracking-[0.06em] uppercase rounded-pill px-4 py-1.5 lg:px-5 lg:py-2"
            style={{ background: rank.bgColor, color: rank.color }}
          >
            {rank.label}
          </span>
        </div>
      </div>

      {/* XP */}
      <div>
        <div className="flex justify-between items-baseline mb-2.5 font-body font-extrabold text-[13px] tracking-[0.08em] text-kid-text-muted">
          <span>{xpInLevel}/100XP</span>
          <span>NÍVEL {level}</span>
        </div>
        <div className="h-[22px] bg-kid-sunk rounded-pill overflow-hidden">
          <BarFill pct={progressPct} className="grad-xp" />
        </div>
      </div>

      {/* Divisória + Stats (alinhados à largura) */}
      <div>
        <div className="kid-divider mb-6 lg:mb-7" />
        <div className="flex items-end justify-between gap-2.5">
          <div className="flex flex-col gap-2.5 lg:gap-3 min-w-0">
            <p className="font-body font-extrabold text-[10px] lg:text-[12px] tracking-[0.06em] text-kid-text-muted">COINS</p>
            <span className="inline-flex items-center gap-1.5 h-[40px] lg:h-[48px] pl-2 pr-4 lg:pl-2.5 lg:pr-5 rounded-pill font-heading font-extrabold text-[16px] lg:text-[19px]"
              style={{ background: "#FFE9B5", color: "#D35D1E" }}>
              <AppIcon name="coin" size={26} className="lg:!w-[31px] lg:!h-[31px]" />
              {availableCoins}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 lg:gap-3 min-w-0">
            <p className="font-body font-extrabold text-[10px] lg:text-[12px] tracking-[0.06em] text-kid-text-muted">CONQUISTAS</p>
            <span className="inline-flex items-center gap-1.5 h-[40px] lg:h-[48px] pl-2 pr-4 lg:pl-2.5 lg:pr-5 rounded-pill font-heading font-extrabold text-[16px] lg:text-[19px] text-white"
              style={{ background: "#FF7F00" }}>
              <AppIcon name="trophy" size={26} className="lg:!w-[31px] lg:!h-[31px]" />
              {achievementsCount}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 lg:gap-3 min-w-0">
            <p className="font-body font-extrabold text-[10px] lg:text-[12px] tracking-[0.06em] text-kid-text-muted whitespace-nowrap">PRÓXIMO RANK</p>
            <span className="inline-flex items-center justify-center gap-1.5 h-[40px] lg:h-[48px] px-4 lg:px-5 rounded-pill font-heading font-extrabold text-[16px] lg:text-[19px] text-white whitespace-nowrap"
              style={{ background: "linear-gradient(90deg, #B8792C, #BBAA83)" }}>
              <Image src={nextRank.badge} alt="" width={22} height={22} className="object-contain drop-shadow shrink-0 lg:!w-[26px] lg:!h-[26px]" />
              {nextRank.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
