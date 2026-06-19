import { prisma } from "@/lib/prisma";
import CriancaHeader from "@/components/CriancaHeader";
import CriancaTabBar from "@/components/CriancaTabBar";
import { UnlockedAchievement, LockedAchievement } from "@/components/AchievementCard";
import EmptyState from "@/components/EmptyState";
import { ACHIEVEMENTS } from "@/lib/enums";
import Footer from "@/components/Footer";

export default async function Conquistas({ params }: { params: Promise<{ id: string }> }) {
  const { id: childId } = await params;
  const earned = await prisma.achievement.findMany({
    where: { childId },
    orderBy: { earnedAt: "desc" },
  });
  const earnedCodes = new Set(earned.map((a) => a.code));
  const locked = Object.keys(ACHIEVEMENTS).filter((c) => !earnedCodes.has(c));

  return (
    <main className="min-h-screen bg-kid-base font-body pb-28">
      <div className="max-w-[480px] mx-auto px-5 pt-5 space-y-4">
        <CriancaHeader childId={childId} />

        <header className="mt-6 px-1">
          <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
            Troféus
          </p>
          <h1 className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-1">
            Suas conquistas
          </h1>
        </header>

        <section>
          <p className="font-heading font-semibold text-[16px] text-kid-text-strong px-1 mb-2">
            Conquistadas ({earned.length})
          </p>
          {earned.length === 0 ? (
            <EmptyState
              emoji="trophy"
              title="Nenhuma ainda"
              body="Complete missões para ganhar seus primeiros troféus!"
            />
          ) : (
            <ul className="grid grid-cols-3 gap-3">
              {earned.map((a) => (
                <li key={a.id}>
                  <UnlockedAchievement emoji={a.emoji} title={a.title} earnedAt={a.earnedAt} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {locked.length > 0 && (
          <section className="mt-2">
            <p className="font-heading font-semibold text-[16px] text-kid-text-strong px-1 mb-2">
              A descobrir ({locked.length})
            </p>
            <ul className="grid grid-cols-3 gap-3">
              {locked.map((code) => {
                const meta = ACHIEVEMENTS[code];
                return (
                  <li key={code}>
                    <LockedAchievement emoji={meta.emoji} hint={meta.description} />
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        <Footer />
      </div>

      <CriancaTabBar childId={childId} active="conquistas" />
    </main>
  );
}
