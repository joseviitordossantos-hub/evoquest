import { prisma } from "@/lib/prisma";
import ProfileSummaryCard from "@/components/ProfileSummaryCard";
import RewardsBanner from "@/components/RewardsBanner";
import RewardCard from "@/components/RewardCard";
import RedeemStatusPill from "@/components/RedeemStatusPill";
import EmptyState from "@/components/EmptyState";
import { getChildStats } from "@/lib/childStats";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import { rewardKindLabel, rewardKindIconName } from "@/lib/enums";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const KIND_ORDER = ["DIGITAL_CODE", "EXPERIENCE", "PHYSICAL", "PRIVILEGE"];

export default async function Loja({ params }: { params: Promise<{ id: string }> }) {
  const { id: childId } = await params;
  const { availableCoins, level: childLevel } = await getChildStats(childId);

  const [rewards, myRedemptions] = await Promise.all([
    prisma.reward.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { coinsCost: "asc" }],
    }),
    prisma.redemption.findMany({
      where: { childId },
      include: { reward: true },
      orderBy: { requestedAt: "desc" },
      take: 5,
    }),
  ]);

  const allRewards = rewards.sort((a, b) => {
    const aLocked = (a.minLevel ?? 0) > childLevel ? 1 : 0;
    const bLocked = (b.minLevel ?? 0) > childLevel ? 1 : 0;
    return aLocked - bLocked;
  });

  return (
    <div className="max-w-[480px] mx-auto px-5 pt-5 space-y-4 lg:max-w-none lg:mx-0 lg:px-10 lg:pt-8 lg:space-y-6">
      {/* Desktop: two-column top — ProfileCard + Banner */}
      <div className="lg:grid lg:grid-cols-[466px_1fr] lg:gap-6 lg:items-stretch">
        <ProfileSummaryCard childId={childId} />
        <RewardsBanner />
      </div>

      {/* Mobile header */}
      <header className="mt-6 px-1 lg:hidden">
        <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
          Loja
        </p>
        <h1 className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-1">
          Troque suas coins por prêmios
        </h1>
      </header>

      {myRedemptions.length > 0 && (
        <section>
          <p className="font-heading font-semibold text-[16px] text-kid-text-strong px-1 mb-2">
            Meus pedidos
          </p>
          <ul className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
            {myRedemptions.map((r) => (
              <li
                key={r.id}
                className="bg-white rounded-kid-lg p-3 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span>{emojiToIconName(r.reward.emoji) ? <AppIcon name={emojiToIconName(r.reward.emoji)!} size={24} /> : <span className="text-xl">{r.reward.emoji}</span>}</span>
                  <span className="font-body font-bold text-[14px] text-kid-text-strong">
                    {r.reward.title}
                  </span>
                </div>
                <RedeemStatusPill status={r.status} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Desktop: flat "Recompensas disponíveis" section */}
      <section className="hidden lg:block">
        <div className="flex items-baseline justify-between px-1 mb-4">
          <h2 className="font-heading font-extrabold text-[41px] text-kid-text-soft leading-tight">
            Recompensas disponíveis
          </h2>
        </div>
        <ul className="grid grid-cols-5 gap-4">
          {allRewards.map((r) => (
            <li key={r.id}>
              <RewardCard reward={r} childId={childId} availableCoins={availableCoins} childLevel={childLevel} />
            </li>
          ))}
        </ul>
      </section>

      {/* Mobile: grouped by kind */}
      <div className="lg:hidden">
        {KIND_ORDER.map((k) => {
          const items = rewards
            .filter((r) => r.kind === k)
            .sort((a, b) => {
              const aLocked = (a.minLevel ?? 0) > childLevel ? 1 : 0;
              const bLocked = (b.minLevel ?? 0) > childLevel ? 1 : 0;
              return aLocked - bLocked;
            });
          if (items.length === 0) return null;
          return (
            <section key={k} className="mt-2">
              <p className="font-heading font-semibold text-[16px] text-kid-text-strong px-1 mb-2 flex items-center gap-2">
                <AppIcon name={rewardKindIconName[k]} size={22} />
                <span>{rewardKindLabel[k]}</span>
              </p>
              <ul className="grid grid-cols-2 gap-3">
                {items.map((r) => (
                  <li key={r.id}>
                    <RewardCard reward={r} childId={childId} availableCoins={availableCoins} childLevel={childLevel} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {rewards.length === 0 && (
        <EmptyState emoji="gift" title="Loja vazia" body="Seu responsável vai adicionar prêmios em breve." />
      )}
      <Footer />
    </div>
  );
}
