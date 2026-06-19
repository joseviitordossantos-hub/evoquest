import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import { requestRedemption } from "@/app/crianca/[id]/recompensas/actions";

type Reward = {
  id: string;
  title: string;
  description: string | null;
  emoji: string;
  coinsCost: number;
  featured: boolean;
  provider: string | null;
};

export default function RewardCard({
  reward,
  childId,
  availableCoins,
}: {
  reward: Reward;
  childId: string;
  availableCoins: number;
}) {
  const affordable = availableCoins >= reward.coinsCost;
  const iconName = emojiToIconName(reward.emoji);

  return (
    <article
      className={`bg-white rounded-[14px] p-3 flex items-stretch gap-3 relative transition-transform hover:-translate-y-0.5 ${
        affordable ? "" : "opacity-80"
      }`}
    >
      {reward.featured && (
        <span className="absolute -top-1.5 -left-1.5 kid-chip kid-chip-pink !text-[9px] !px-2 !py-0.5 -rotate-6 inline-flex items-center gap-1 z-10">
          <AppIcon name="star" size={10} /> TOP
        </span>
      )}

      <div className="w-[88px] h-[88px] rounded-[8px] bg-kid-base flex items-center justify-center shrink-0 overflow-hidden">
        {iconName ? (
          <AppIcon name={iconName} size={64} />
        ) : (
          <span className="text-[52px] leading-none">{reward.emoji}</span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <p className="font-heading font-bold text-[16px] text-kid-text-strong leading-tight pr-1">
          {reward.title}
        </p>

        {reward.description && (
          <p className="font-body text-[12px] text-kid-text-soft mt-0.5 leading-snug line-clamp-2">
            {reward.description}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 bg-kid-tint-gold text-kid-on-gold rounded-pill px-3 py-1.5 font-heading font-extrabold text-[14px] leading-none">
            <AppIcon name="coin" size={16} /> {reward.coinsCost}
            <span className="font-body font-extrabold text-[10px] uppercase tracking-[0.08em] ml-0.5">moedas</span>
          </span>
          {affordable ? (
            <form action={requestRedemption}>
              <input type="hidden" name="rewardId" value={reward.id} />
              <input type="hidden" name="childId" value={childId} />
              <button
                type="submit"
                className="grad-primary text-white rounded-pill px-3 h-7 font-body font-extrabold text-[10px] tracking-[0.06em] uppercase inline-flex items-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Trocar
              </button>
            </form>
          ) : (
            <span className="bg-kid-sunk text-kid-text-muted rounded-pill px-3 h-7 font-body font-extrabold text-[10px] tracking-[0.06em] uppercase inline-flex items-center gap-1">
              <AppIcon name="lock" size={11} /> Faltam {reward.coinsCost - availableCoins}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
