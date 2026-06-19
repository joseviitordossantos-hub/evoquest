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
        <div className="flex items-start gap-2">
          <p className="font-heading font-bold text-[16px] text-kid-text-strong leading-tight flex-1 min-w-0 pr-1">
            {reward.title}
          </p>
          <span
            className={`shrink-0 rounded-pill px-2.5 py-1 font-body font-extrabold text-[10px] tracking-[0.04em] inline-flex items-center gap-1 ${
              affordable
                ? "bg-[#D8F4DE] text-[#15803D]"
                : "bg-[#FFEDD3] text-[#A56514]"
            }`}
          >
            <AppIcon name="coin" size={11} /> {reward.coinsCost}
          </span>
        </div>

        {reward.description && (
          <p className="font-body text-[12px] text-kid-text-soft mt-0.5 leading-snug line-clamp-2">
            {reward.description}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-end justify-between">
          <p className="font-heading font-extrabold text-[18px] text-kid-violet-deep leading-none inline-flex items-baseline gap-1">
            {reward.coinsCost}
            <span className="font-body font-extrabold text-[11px] text-kid-text-muted uppercase tracking-[0.08em]">
              moedas
            </span>
          </p>
          {affordable ? (
            <form action={requestRedemption}>
              <input type="hidden" name="rewardId" value={reward.id} />
              <input type="hidden" name="childId" value={childId} />
              <button
                type="submit"
                className="w-10 h-10 rounded-full grad-primary text-white flex items-center justify-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
                aria-label="Trocar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18l-2 13H5L3 6z" />
                  <path d="M9 11v4" />
                  <path d="M15 11v4" />
                  <path d="M9 3h6" />
                </svg>
              </button>
            </form>
          ) : (
            <span
              className="w-10 h-10 rounded-full bg-kid-sunk text-kid-text-muted flex items-center justify-center"
              aria-label="Bloqueado"
            >
              <AppIcon name="lock" size={16} />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
