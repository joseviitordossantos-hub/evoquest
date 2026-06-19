import KidButton from "./ui/KidButton";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import { requestRedemption } from "@/app/crianca/[id]/recompensas/actions";

type Reward = {
  id: string;
  title: string;
  description: string | null;
  emoji: string;
  xpCost: number;
  featured: boolean;
  provider: string | null;
};

export default function RewardCard({
  reward,
  childId,
  availableXp,
}: {
  reward: Reward;
  childId: string;
  availableXp: number;
}) {
  const affordable = availableXp >= reward.xpCost;
  const missing = reward.xpCost - availableXp;
  const iconName = emojiToIconName(reward.emoji);

  return (
    <article
      className={`bg-white rounded-kid-xl p-4 flex flex-col relative hover:-translate-y-1 transition-transform ${
        affordable ? "" : "opacity-80"
      }`}
    >
      {reward.featured && (
        <span className="absolute -top-2 -right-2 kid-chip kid-chip-pink !text-[9px] !px-2.5 !py-1 rotate-6 inline-flex items-center gap-1">
          <AppIcon name="star" size={12} /> Top
        </span>
      )}

      <div className="leading-none">
        {iconName ? <AppIcon name={iconName} size={48} /> : <span className="text-[48px]">{reward.emoji}</span>}
      </div>

      <p className="font-heading font-semibold text-[15px] text-kid-text-strong mt-2 leading-tight">
        {reward.title}
      </p>
      {reward.description && (
        <p className="font-body text-[12px] text-kid-text-soft mt-1 flex-1 leading-snug">
          {reward.description}
        </p>
      )}

      <div className="mt-3 kid-chip bg-kid-tint-orange text-kid-on-orange w-fit !text-[12px] inline-flex items-center gap-1">
        <AppIcon name="bolt" size={14} /> {reward.xpCost} XP
      </div>

      {affordable ? (
        <form action={requestRedemption} className="mt-3">
          <input type="hidden" name="rewardId" value={reward.id} />
          <input type="hidden" name="childId" value={childId} />
          <KidButton size="sm" fullWidth>Trocar</KidButton>
        </form>
      ) : (
        <div className="mt-3 flex items-center justify-center gap-2 bg-kid-sunk rounded-pill px-3 py-2 font-body font-extrabold text-[11px] text-kid-text-muted">
          <AppIcon name="lock" size={14} /> Faltam {missing} XP
        </div>
      )}
    </article>
  );
}
