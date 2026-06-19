import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { evaluateAchievements } from "@/lib/achievements";
import PaiNav from "@/components/PaiNav";
import Footer from "@/components/Footer";

async function approveBatch(formData: FormData) {
  "use server";
  const childId = String(formData.get("childId"));
  const approveIds = formData.getAll("approve").map(String);
  const rejectIds = formData.getAll("reject").map(String);

  for (const id of approveIds) {
    const log = await prisma.missionLog.findUniqueOrThrow({ where: { id }, include: { mission: true } });
    await prisma.missionLog.update({
      where: { id },
      data: { status: "APPROVED", approvedAt: new Date(), xpAwarded: log.mission.xpReward },
    });
    await prisma.xpEvent.create({
      data: { childId: log.childId, amount: log.mission.xpReward, reason: `mission:${log.missionId}` },
    });
  }

  for (const id of rejectIds) {
    await prisma.missionLog.update({ where: { id }, data: { status: "REJECTED", approvedAt: new Date() } });
  }

  await evaluateAchievements(childId);

  redirect(`/pai?approved=${approveIds.length}&rejected=${rejectIds.length}`);
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
    <main className="min-h-screen bg-kid-base pattern-dots-violet font-body">
      <PaiNav active="painel" />
      <div className="px-6 py-10 max-w-3xl mx-auto">
        <span className="kid-chip kid-chip-gold">REVISÃO SEMANAL</span>
        <h1 className="font-heading font-bold text-4xl text-kid-text-strong leading-tight mt-3 mb-8">
          Aprovar conquistas
        </h1>

        {logs.length === 0 ? (
          <p className="text-kid-text-muted font-bold">Nada pendente. Boa.</p>
        ) : (
          <form
            action={approveBatch}
            className="bg-white rounded-kid-xl p-6"
          >
            <input type="hidden" name="childId" value={childId} />
            <ul className="space-y-3">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="bg-kid-sunk rounded-kid-lg p-5"
                >
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <p className="font-heading font-semibold text-[18px] text-kid-text-strong">{log.mission.title}</p>
                      <p className="font-body text-[13px] text-kid-text-soft mt-1">
                        Marcada {new Date(log.markedAt).toLocaleString("pt-BR")} · {log.mission.xpReward} XP
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
        <Footer />
      </div>
    </main>
  );
}
