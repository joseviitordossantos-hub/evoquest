import Link from "next/link";
import { prisma } from "@/lib/prisma";
import EmptyState from "@/components/EmptyState";

import BossHero from "@/components/BossHero";
import ProfileSummaryCard from "@/components/ProfileSummaryCard";
import AchievementMiniCard from "@/components/AchievementMiniCard";
import RewardMiniCard from "@/components/RewardMiniCard";
import MissionPanel from "@/components/MissionPanel";
import RoutineCard from "@/components/RoutineCard";
import LevelUpModal from "@/components/LevelUpModal";
import { ACHIEVEMENTS } from "@/lib/enums";
import { getRoutinePeriodStart } from "@/lib/routineHelpers";
import { getChildStats } from "@/lib/childStats";
import { getRankForLevel } from "@/lib/ranks";

export const dynamic = "force-dynamic";

export default async function JornadaCrianca({ params }: { params: Promise<{ id: string }> }) {
  const { id: childId } = await params;
  const start = new Date(); start.setHours(0, 0, 0, 0);

  const child = await prisma.child.findUniqueOrThrow({
    where: { id: childId },
    include: {
      streak: true,
      missions: {
        where: { active: true },
        include: { logs: { where: { markedAt: { gte: start } } } },
      },
    },
  });

  const [recentAchievements, rewards, stats] = await Promise.all([
    prisma.achievement.findMany({ where: { childId }, orderBy: { earnedAt: "desc" }, take: 8 }),
    prisma.reward.findMany({
      where: { active: true, forBoss: false },
      orderBy: [{ featured: "desc" }, { coinsCost: "asc" }],
      take: 5,
    }),
    getChildStats(childId),
  ]);

  // Level-up: modal celebrativo
  const levelsGained = stats.level - child.highestLevelClaimed;
  const showLevelUp = levelsGained > 0;
  let newlyUnlocked: { id: string; title: string; emoji: string; minLevel: number }[] = [];
  if (showLevelUp) {
    const unlockable = await prisma.reward.findMany({
      where: { active: true, minLevel: { gt: child.highestLevelClaimed, lte: stats.level } },
      orderBy: { minLevel: "asc" },
    });
    newlyUnlocked = unlockable.map((r) => ({ id: r.id, title: r.title, emoji: r.emoji, minLevel: r.minLevel }));
  }
  const newRank = getRankForLevel(stats.level);

  const routines = child.missions.filter((m) => m.isRoutine);
  const routineItems = routines.map((m) => {
    const periodStart = getRoutinePeriodStart(m.frequency);
    const doneThisPeriod = m.logs.some((l) => new Date(l.markedAt) >= periodStart);
    return { mission: m, doneThisPeriod };
  });
  const nonRoutineMissions = child.missions.filter((m) => !m.isRoutine);
  const missionItems = nonRoutineMissions.map((m) => ({ mission: m, log: m.logs[0] ?? null }));

  const sectionLink = (href: string) => (
    <Link href={href} className="font-body font-bold text-[14px] text-kid-text-muted hover:text-kid-violet transition-colors whitespace-nowrap">
      Ver todas →
    </Link>
  );

  return (
    <div className="flex-1 flex flex-col">
      {showLevelUp && (
        <LevelUpModal
          childId={childId}
          level={stats.level}
          levelsGained={levelsGained}
          coinBonus={levelsGained * 10}
          rankLabel={newRank.label}
          rankColor={newRank.color}
          rankBg={newRank.bgColor}
          unlocked={newlyUnlocked}
        />
      )}

      <div className="max-w-[1500px] mx-auto px-5 py-5 lg:px-8 lg:py-7">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_366px] gap-5 lg:gap-6 items-start xl:items-stretch">
          {/* Coluna esquerda/central */}
          <div className="min-w-0 space-y-5 lg:space-y-6">
            {/* Perfil + Boss */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] gap-5 lg:gap-6 items-stretch">
              <ProfileSummaryCard childId={childId} />
              <BossHero childId={childId} />
            </div>

            {/* Rotinas */}
            {routineItems.length > 0 && (
              <section>
                <header className="flex items-end justify-between mb-3 px-1">
                  <h2 className="font-heading font-extrabold text-[20px] text-kid-text-soft">Suas Rotinas</h2>
                </header>
                <div
                  className="-mx-5 px-5 lg:mx-0 lg:px-0 overflow-x-auto scrollbar-hide"
                  style={{
                    WebkitMaskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
                    maskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
                  }}
                >
                  <ul className="flex gap-3 pb-1 w-max">
                    {routineItems.map((item) => (
                      <li key={item.mission.id}>
                        <RoutineCard item={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Últimas conquistas */}
            {recentAchievements.length > 0 && (
              <section>
                <header className="flex items-end justify-between mb-3 px-1">
                  <h2 className="font-heading font-extrabold text-[20px] text-kid-text-soft">Últimas conquistas</h2>
                  {sectionLink(`/crianca/${childId}/conquistas`)}
                </header>
                <div
                  className="-mx-5 px-5 lg:mx-0 lg:px-0 overflow-x-auto scrollbar-hide"
                  style={{
                    WebkitMaskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
                    maskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
                  }}
                >
                  <ul className="flex gap-4 pb-1 w-max">
                    {recentAchievements.map((a) => (
                      <li key={a.id}>
                        <AchievementMiniCard
                          emoji={a.emoji}
                          title={ACHIEVEMENTS[a.code]?.title ?? a.title}
                          rarity={ACHIEVEMENTS[a.code]?.rarity}
                          description={ACHIEVEMENTS[a.code]?.description}
                          earnedAt={a.earnedAt.toISOString()}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Recompensas disponíveis — oculto no mobile */}
            {rewards.length > 0 && (
              <section className="hidden lg:block">
                <header className="flex items-end justify-between mb-3 px-1">
                  <h2 className="font-heading font-extrabold text-[20px] text-kid-text-soft">Recompensas disponíveis</h2>
                  {sectionLink(`/crianca/${childId}/recompensas`)}
                </header>
                <div className="overflow-x-auto xl:overflow-visible scrollbar-hide">
                  <ul className="flex xl:grid xl:grid-cols-5 gap-4 pb-1">
                    {rewards.map((r) => (
                      <li key={r.id} className="xl:min-w-0">
                        <RewardMiniCard
                          reward={r}
                          childId={childId}
                          availableCoins={stats.availableCoins}
                          childLevel={stats.level}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

          </div>

          {/* Coluna direita — missões (trava na altura da coluna esquerda, rola por dentro) */}
          <div className="min-w-0 xl:relative">
            <div className="xl:absolute xl:inset-0 xl:flex">
              {missionItems.length === 0 ? (
                <EmptyState
                  emoji="sprout"
                  title="Sem missões hoje"
                  body="Volte amanhã ou peça para seu responsável criar novas missões!"
                />
              ) : (
                <div className="w-full xl:min-h-0">
                  <MissionPanel items={missionItems} childId={childId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
