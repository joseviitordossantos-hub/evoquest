import AppIcon from "@/components/AppIcon";
import BossDamageFloat from "@/components/BossDamageFloat";
import BossDefeatedModal from "@/components/BossDefeatedModal";
import { getCurrentBoss, daysRemainingInMonth } from "@/lib/boss";
import { prisma } from "@/lib/prisma";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default async function BossCard({ childId }: { childId: string }) {
  const boss = await getCurrentBoss(childId);
  if (!boss || !boss.active) return null;
  const reward = boss.rewardId
    ? await prisma.reward.findUnique({ where: { id: boss.rewardId } })
    : null;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentDamages = await prisma.bossDamage.findMany({
    where: { bossId: boss.id, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const pct = (boss.currentHp / boss.maxHp) * 100;
  const daysLeft = daysRemainingInMonth();
  const urgent = daysLeft <= 5 && !boss.defeatedAt;
  const defeated = !!boss.defeatedAt;

  const baseBg = defeated
    ? "linear-gradient(135deg, #4F4668 0%, #281C44 100%)"
    : urgent
    ? "linear-gradient(135deg, #B82332 0%, #7A1A24 100%)"
    : "linear-gradient(135deg, #5B3CC7 0%, #281C44 100%)";

  return (
    <section
      className="relative rounded-kid-xl p-4 overflow-hidden"
      style={{ background: baseBg }}
    >
      <div className="pattern-dots-light absolute inset-0 opacity-50" />

      <div className="relative flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 88, height: 88 }}>
          <div className={defeated ? "grayscale animate-pulse-soft" : "animate-float-sm"}>
            <AppIcon name={boss.iconName} size={88} />
          </div>
          <BossDamageFloat
            bossId={boss.id}
            childId={childId}
            recentDamages={recentDamages.map((d) => ({
              id: d.id,
              amount: d.amount,
              createdAt: d.createdAt.toISOString(),
            }))}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="font-heading font-bold text-[20px] text-white leading-tight">
              {boss.name}
            </p>
            <span className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-white/60">
              {MONTHS[boss.month - 1]} · {boss.year}
            </span>
          </div>

          {defeated ? (
            <div className="mt-2">
              <span className="kid-chip bg-kid-tint-teal text-kid-on-teal !text-[10px] inline-flex items-center gap-1">
                <AppIcon name="trophy" size={14} /> Derrotado!
              </span>
              {reward && (
                <p className="font-body font-bold text-[12px] text-white/80 mt-2">
                  Recompensa liberada: <strong className="text-white">{reward.title}</strong>
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="mt-2 h-[18px] bg-black/30 rounded-pill overflow-hidden relative">
                <div
                  className="h-full rounded-pill transition-[width] duration-700 ease-kid-standard"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #FF6675, #B82332)",
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-body font-extrabold text-[11px] text-white drop-shadow">
                  {boss.currentHp} / {boss.maxHp} HP
                </span>
              </div>
              <p
                className={`font-body font-extrabold text-[11px] uppercase tracking-[0.08em] mt-2 ${
                  urgent ? "text-[#FFC25C] animate-shake" : "text-white/70"
                }`}
              >
                {urgent ? (
                  <>⚠ Boss está fugindo! {daysLeft} {daysLeft === 1 ? "dia" : "dias"} restantes</>
                ) : (
                  <>{daysLeft} {daysLeft === 1 ? "dia" : "dias"} para derrotar</>
                )}
              </p>
            </>
          )}
        </div>
      </div>

      {defeated && (
        <BossDefeatedModal
          childId={childId}
          bossId={boss.id}
          bossName={boss.name}
          iconName={boss.iconName}
          rewardTitle={reward?.title ?? null}
        />
      )}
    </section>
  );
}
