import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { evaluateAchievements } from "@/lib/achievements";
import { dealDamageFromMissionLog } from "@/lib/boss";
import PaiNav from "@/components/PaiNav";


export const dynamic = "force-dynamic";

async function approveBatch(formData: FormData) {
  "use server";
  const childId = String(formData.get("childId"));
  const approveIds = formData.getAll("approve").map(String);
  const rejectIds = formData.getAll("reject").map(String);

  const damages: number[] = [];
  let defeatedBoss: string | null = null;

  for (const id of approveIds) {
    const log = await prisma.missionLog.findUniqueOrThrow({ where: { id }, include: { mission: true } });
    await prisma.missionLog.update({
      where: { id },
      data: { status: "APPROVED", approvedAt: new Date(), xpAwarded: log.mission.xpReward },
    });
    await prisma.xpEvent.create({
      data: { childId: log.childId, amount: log.mission.xpReward, reason: `mission:${log.missionId}` },
    });
    const dmg = await dealDamageFromMissionLog({ ...log, mission: log.mission });
    if (dmg) {
      damages.push(dmg.damage);
      if (dmg.justDefeated) defeatedBoss = dmg.bossName;
    }

    if (log.mission.isRoutine) {
      const updated = await prisma.mission.update({
        where: { id: log.missionId },
        data: { currentProgress: { increment: 1 } },
      });

      if (log.mission.routineMode === "FIXED" && log.mission.routineCoinsPerCompletion > 0) {
        await prisma.child.update({
          where: { id: log.childId },
          data: { bonusCoins: { increment: log.mission.routineCoinsPerCompletion } },
        });
      }

      if (
        log.mission.routineMode === "ACCUMULATE" &&
        updated.currentProgress >= updated.routineGoalCount &&
        updated.routineGoalRewardId
      ) {
        await prisma.redemption.create({
          data: {
            childId: log.childId,
            rewardId: updated.routineGoalRewardId,
            status: "REQUESTED",
            coinsSpent: 0,
            parentNote: `Meta de rotina: ${updated.title}`,
          },
        });
        await prisma.mission.update({
          where: { id: log.missionId },
          data: { active: false },
        });
      }
    }
  }

  for (const id of rejectIds) {
    await prisma.missionLog.update({ where: { id }, data: { status: "REJECTED", approvedAt: new Date() } });
  }

  await evaluateAchievements(childId);

  const params = new URLSearchParams({
    approved: String(approveIds.length),
    rejected: String(rejectIds.length),
  });
  if (damages.length) params.set("bossDamage", damages.join(","));
  if (defeatedBoss) params.set("bossDefeated", defeatedBoss);

  redirect(`/pai?${params.toString()}`);
}

export default async function Aprovar({ searchParams }: { searchParams: Promise<{ childId?: string }> }) {
  const { childId } = await searchParams;
  if (!childId) return <p>childId obrigatório.</p>;

  const logs = await prisma.missionLog.findMany({
    where: { childId, status: "PENDING" },
    include: { mission: true },
    orderBy: { markedAt: "asc" },
  });

  return (
    <>
      <PaiNav active="painel" />
      <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-3xl mx-auto">
        <span className="kid-chip kid-chip-gold">REVISÃO SEMANAL</span>
        <h1 className="font-heading font-bold text-4xl text-kid-text-strong leading-tight mt-3 mb-8">
          Aprovar conquistas
        </h1>

        {logs.length === 0 ? (
          <p className="text-kid-text-muted font-bold">Nada pendente. Boa.</p>
        ) : (
          <form
            action={approveBatch}
            className="bg-white rounded-kid-xl p-4"
          >
            <input type="hidden" name="childId" value={childId} />
            <ul className="space-y-3">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="bg-kid-sunk rounded-[10px] p-5"
                >
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <p className="font-heading font-semibold text-[18px] text-kid-text-strong">{log.mission.title}</p>
                      <p className="font-body text-[13px] text-kid-text-soft mt-1">
                        Marcada {new Date(log.markedAt).toLocaleString("pt-BR")} · {log.mission.xpReward} XP
                        {log.mission.isRoutine && (
                          <>
                            {" · "}
                            <span className="font-extrabold text-kid-violet">ROTINA</span>
                            {log.mission.routineMode === "ACCUMULATE" && (
                              <> · {log.mission.currentProgress}/{log.mission.routineGoalCount}</>
                            )}
                          </>
                        )}
                      </p>
                      {log.childNote && (
                        <p className="mt-2 font-body font-bold text-[13px] text-kid-text-strong italic">
                          "{log.childNote}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 font-body font-extrabold text-[13px] text-kid-text-strong">
                        <input type="checkbox" name="approve" value={log.id} defaultChecked className="w-5 h-5 accent-[#11A892]" />
                        Aprovar
                      </label>
                      <label className="flex items-center gap-2 font-body font-extrabold text-[13px] text-kid-text-strong">
                        <input type="checkbox" name="reject" value={log.id} className="w-5 h-5 accent-[#E0306E]" />
                        Rejeitar
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="kid-btn mt-6">
              Salvar revisão ({logs.length} {logs.length === 1 ? "item" : "itens"})
            </button>
          </form>
        )}
      </div>
    </>
  );
}
