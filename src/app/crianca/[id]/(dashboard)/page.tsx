import { prisma } from "@/lib/prisma";
import CriancaHeader from "@/components/CriancaHeader";

import EmptyState from "@/components/EmptyState";
import MissionFilteredList from "@/components/MissionFilteredList";
import Footer from "@/components/Footer";
import AchievementIcon from "@/components/AchievementIcon";
import BossCard from "@/components/BossCard";
import StreakIndicator from "@/components/StreakIndicator";
import LevelUpModal from "@/components/LevelUpModal";
import { ACHIEVEMENTS } from "@/lib/enums";
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

  const recentAchievements = await prisma.achievement.findMany({
    where: { childId },
    orderBy: { earnedAt: "desc" },
    take: 8,
  });

  // Detectar level-up para mostrar o modal celebrativo
  const stats = await getChildStats(childId);
  const levelsGained = stats.level - child.highestLevelClaimed;
  const showLevelUp = levelsGained > 0;

  let newlyUnlocked: { id: string; title: string; emoji: string; minLevel: number }[] = [];
  if (showLevelUp) {
    const rewards = await prisma.reward.findMany({
      where: {
        active: true,
        minLevel: { gt: child.highestLevelClaimed, lte: stats.level },
      },
      orderBy: { minLevel: "asc" },
    });
    newlyUnlocked = rewards.map((r) => ({
      id: r.id,
      title: r.title,
      emoji: r.emoji,
      minLevel: r.minLevel,
    }));
  }
  const newRank = getRankForLevel(stats.level);
  const streakDays = child.streak?.currentDays ?? 0;
  const freezes = child.streak?.freezesAvailable ?? 0;

  return (
    <>
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
      <div className="max-w-[480px] mx-auto px-5 pt-5 space-y-4 lg:max-w-5xl lg:px-8 lg:pt-8 xl:max-w-6xl xl:grid xl:grid-cols-[1fr_320px] xl:gap-6 xl:space-y-0 xl:items-start">
        {/* Coluna principal */}
        <div className="space-y-4 xl:space-y-6 min-w-0">
          <CriancaHeader childId={childId} />

          {/* Boss — coluna principal até xl, depois migra para o rail */}
          <div className="xl:hidden">
            <BossCard childId={childId} />
          </div>

          {/* Conquistas recentes — coluna principal até xl */}
          {recentAchievements.length > 0 && (
            <section className="mt-6 xl:hidden">
              <header className="px-1 mb-3">
                <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
                  Últimas conquistas
                </p>
                <h2 className="font-heading font-bold text-[18px] text-kid-text-strong leading-tight mt-1">
                  Seus troféus recentes
                </h2>
              </header>
              <div className="-mx-5 px-5 overflow-x-auto scrollbar-hide">
                <ul className="grid grid-flow-col gap-3 pb-3 pt-1 w-max auto-cols-[calc((100vw-40px-24px)/3.5)] [@media(min-width:480px)]:auto-cols-[calc((480px-40px-24px)/3.5)]">
                  {recentAchievements.map((a) => (
                    <li key={a.id}>
                      <AchievementIcon
                        emoji={a.emoji}
                        title={a.title}
                        description={ACHIEVEMENTS[a.code]?.description}
                        earnedAt={a.earnedAt}
                        rarity={ACHIEVEMENTS[a.code]?.rarity}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <header className="mt-6 xl:mt-0 px-1">
            <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
              Hoje
            </p>
            <h1 className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-1">
              Suas missões
            </h1>
          </header>

          {child.missions.length === 0 ? (
            <EmptyState
              emoji="sprout"
              title="Sem missões hoje"
              body="Volte amanhã ou peça para seu responsável criar novas missões!"
            />
          ) : (
            <MissionFilteredList
              items={child.missions.map((m) => ({ mission: m, log: m.logs[0] ?? null }))}
              childId={childId}
            />
          )}
          <div className="xl:hidden">
            <Footer />
          </div>
        </div>

        {/* Right rail — apenas em xl+ */}
        <aside className="hidden xl:flex xl:flex-col xl:gap-4 xl:sticky xl:top-8">
          <BossCard childId={childId} />

          {streakDays > 0 && (
            <StreakIndicator currentDays={streakDays} freezesAvailable={freezes} />
          )}

          {recentAchievements.length > 0 && (
            <section className="kid-card p-4">
              <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted mb-3">
                Últimas conquistas
              </p>
              <ul className="grid grid-cols-2 gap-3">
                {recentAchievements.slice(0, 6).map((a) => (
                  <li key={a.id} className="flex justify-center">
                    <AchievementIcon
                      emoji={a.emoji}
                      title={a.title}
                      description={ACHIEVEMENTS[a.code]?.description}
                      earnedAt={a.earnedAt}
                      rarity={ACHIEVEMENTS[a.code]?.rarity}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Footer />
        </aside>
      </div>
    </>
  );
}
