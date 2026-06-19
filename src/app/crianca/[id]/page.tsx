import { prisma } from "@/lib/prisma";
import CriancaHeader from "@/components/CriancaHeader";
import CriancaTabBar from "@/components/CriancaTabBar";
import StreakIndicator from "@/components/StreakIndicator";
import MissionCard from "@/components/MissionCard";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";

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

  return (
    <main className="min-h-screen bg-kid-base font-body pb-28">
      <div className="max-w-[480px] mx-auto px-5 pt-5 space-y-4">
        <CriancaHeader childId={childId} />
        <StreakIndicator
          currentDays={child.streak?.currentDays ?? 0}
          freezesAvailable={child.streak?.freezesAvailable ?? 0}
        />

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
