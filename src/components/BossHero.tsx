import AppIcon from "@/components/AppIcon";
import BarFill from "@/components/BarFill";
import BossDamageFloat from "@/components/BossDamageFloat";
import BossDefeatedModal from "@/components/BossDefeatedModal";
import { getCurrentBoss, daysRemainingInMonth } from "@/lib/boss";
import { prisma } from "@/lib/prisma";
import BossLockedCard from "@/components/BossLockedCard";

export default async function BossHero({ childId }: { childId: string }) {
  const boss = await getCurrentBoss(childId);
  if (!boss || !boss.active) return <BossLockedCard />;

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
    ? "linear-gradient(138deg, #4F4668 0%, #281C44 100%)"
    : urgent
    ? "linear-gradient(138deg, #B82332 0%, #5A1018 100%)"
    : "linear-gradient(138deg, #5C38C4 0%, #2D1D4E 100%)";

  return (
    <section
      className="relative rounded-[32px] overflow-hidden flex flex-row items-center px-5 py-5 lg:flex-col lg:items-center lg:text-center lg:px-6 lg:pt-8 lg:pb-7 lg:min-h-[394px] w-full max-w-[396px] mx-auto lg:max-w-none"
      style={{ background: baseBg }}
    >
      {/* raios girando lentamente — origem atrás da cabeça do boss */}
      <div className="absolute left-[90px] top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-1/2 lg:top-[30%] w-[240%] aspect-square pointer-events-none">
        <div className="w-full h-full boss-rays animate-[spin_70s_linear_infinite] motion-reduce:animate-none" />
      </div>
      <div className="absolute -top-10 left-[90px] -translate-x-1/2 lg:left-1/2 w-[260px] h-[260px] rounded-full bg-white/15 blur-3xl pointer-events-none" />

      {/* Orc */}
      <div className="relative shrink-0 w-[120px] h-[120px] lg:w-[200px] lg:h-[200px]">
        <div className={defeated ? "grayscale animate-pulse-soft" : "animate-float-sm"}>
          <AppIcon name={boss.iconName} size={200} className="drop-shadow-2xl w-full h-full" />
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

      <div className="relative ml-3 flex-1 min-w-0 lg:ml-0 lg:mt-2 lg:w-full lg:max-w-[360px]">
        {defeated ? (
          <>
            <p className="font-heading font-extrabold text-[14px] lg:text-[18px] text-kid-gold tracking-[0.12em] uppercase">
              Derrotado!
            </p>
            <h2 className="font-boss text-[32px] lg:text-[46px] leading-none text-white uppercase mt-1">
              {boss.name}
            </h2>
            {reward && (
              <p className="font-body font-bold text-[12px] lg:text-[13px] text-white/80 mt-3 lg:mt-4">
                Recompensa liberada: <strong className="text-white">{reward.title}</strong>
              </p>
            )}
          </>
        ) : (
          <>
            <p className="font-heading font-extrabold text-[16px] lg:text-[20px] tracking-[0.06em] uppercase" style={{ color: "#FF945A" }}>
              Derrote!
            </p>
            <h2 className="font-boss text-[32px] lg:text-[48px] leading-[0.95] text-white uppercase mt-1 break-words">
              {boss.name}
            </h2>

            <div className="mt-3 lg:mt-5 h-[22px] lg:h-[26px] rounded-pill overflow-hidden relative" style={{ background: "#261848" }}>
              <BarFill
                pct={pct}
                transitionDuration={700}
                style={{ background: "linear-gradient(90deg, #FF6675, #B82332)" }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-body font-extrabold text-[11px] lg:text-[13px] text-white">
                {boss.currentHp}/{boss.maxHp}HP
              </span>
            </div>

            <p className={`hidden lg:block font-body font-extrabold text-[11px] uppercase tracking-[0.08em] mt-3 ${urgent ? "text-kid-gold animate-shake" : "text-white/70"}`}>
              {urgent ? (
                <>⚠ Boss está fugindo! {daysLeft} {daysLeft === 1 ? "dia" : "dias"} restantes</>
              ) : (
                <>{daysLeft} {daysLeft === 1 ? "dia" : "dias"} para derrotar</>
              )}
            </p>
          </>
        )}
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
