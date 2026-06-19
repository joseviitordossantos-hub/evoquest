import { prisma } from "@/lib/prisma";
import CriancaHeader from "@/components/CriancaHeader";
import CriancaTabBar from "@/components/CriancaTabBar";
import StreakIndicator from "@/components/StreakIndicator";
import MissionCard from "@/components/MissionCard";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import AchievementIcon from "@/components/AchievementIcon";
import { ACHIEVEMENTS } from "@/lib/enums";

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

  return (
    <main className="min-h-screen bg-kid-base font-body pb-28">
      <div className="max-w-[480px] mx-auto px-5 pt-5 space-y-4">
        <CriancaHeader childId={childId} />
        <StreakIndicator
          currentDays={child.streak?.currentDays ?? 0}
          freezesAvailable={child.streak?.freezesAvailable ?? 0}
        />

        {recentAchievements.length > 0 && (
          <section className="mt-6">
            <header className="px-1 mb-3">
              <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
                Últimas conquistas
              </p>
              <h2 className="font-heading font-bold text-[18px] text-kid-text-strong leading-tight mt-1">
                Seus troféus recentes
              </h2>
            </header>
            <div className="-mx-5 px-5 overflow-x-auto scrollbar-hide">
              <ul className="flex gap-3 pb-3 pt-1 w-max">
                {recentAchievements.map((a) => (
                  <li key={a.id} className="shrink-0 w-[68px]">
                    <AchievementIcon
                      emoji={a.emoji}
                      title={a.title}
                      earnedAt={a.earnedAt}
                      rarity={ACHIEVEMENTS[a.code]?.rarity}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <header className="mt-6 px-1">
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
          <ul className="space-y-3">
            {child.missions.map((m) => (
              <li key={m.id}>
                <MissionCard mission={m} childId={childId} log={m.logs[0] ?? null} />
              </li>
            ))}
          </ul>
        )}
        <Footer />
      </div>

      <CriancaTabBar childId={childId} active="home" />
    </main>
  );
}
