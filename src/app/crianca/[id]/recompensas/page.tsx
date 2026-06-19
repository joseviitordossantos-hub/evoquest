import { prisma } from "@/lib/prisma";
import CriancaHeader from "@/components/CriancaHeader";
import CriancaTabBar from "@/components/CriancaTabBar";
import RewardCard from "@/components/RewardCard";
import RedeemStatusPill from "@/components/RedeemStatusPill";
import EmptyState from "@/components/EmptyState";
import { getChildStats } from "@/lib/childStats";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import { rewardKindLabel, rewardKindIconName } from "@/lib/enums";
import Footer from "@/components/Footer";

const KIND_ORDER = ["DIGITAL_CODE", "EXPERIENCE", "PHYSICAL", "PRIVILEGE"];

export default async function Loja({ params }: { params: Promise<{ id: string }> }) {
  const { id: childId } = await params;
  const { availableCoins } = await getChildStats(childId);

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

  return (
    <main className="min-h-screen bg-kid-base font-body pb-28">
      <div className="max-w-[480px] mx-auto px-5 pt-5 space-y-4">
        <CriancaHeader childId={childId} />

        <header className="mt-6 px-1">
          <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
            Loja
          </p>
          <h1 className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-1">
            Troque suas moedas por prêmios
          </h1>
        </header>

        {myRedemptions.length > 0 && (
          <section>
            <p className="font-heading font-semibold text-[16px] text-kid-text-strong px-1 mb-2">
              Meus pedidos
            </p>
            <ul className="space-y-2">
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

        {KIND_ORDER.map((k) => {
          const items = rewards.filter((r) => r.kind === k);
          if (items.length === 0) return null;
          return (
            <section key={k} className="mt-2">
              <p className="font-heading font-semibold text-[16px] text-kid-text-strong px-1 mb-2 flex items-center gap-2">
                <AppIcon name={rewardKindIconName[k]} size={22} />
                <span>{rewardKindLabel[k]}</span>
              </p>
              <ul className="grid grid-cols-1 gap-3">
                {items.map((r) => (
                  <li key={r.id}>
                    <RewardCard reward={r} childId={childId} availableCoins={availableCoins} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {rewards.length === 0 && (
          <EmptyState emoji="gift" title="Loja vazia" body="Seu responsável vai adicionar prêmios em breve." />
        )}
        <Footer />
      </div>

      <CriancaTabBar childId={childId} active="recompensas" />
    </main>
  );
}
