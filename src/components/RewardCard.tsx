"use client";

import { useState } from "react";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import { requestRedemption } from "@/app/crianca/[id]/(dashboard)/recompensas/actions";

type Reward = {
  id: string;
  title: string;
  description: string | null;
  emoji: string;
  coinsCost: number;
  featured: boolean;
  provider: string | null;
  minLevel?: number;
};

export default function RewardCard({
  reward,
  childId,
  availableCoins,
  childLevel = 1,
}: {
  reward: Reward;
  childId: string;
  availableCoins: number;
  childLevel?: number;
}) {
  const minLevel = reward.minLevel ?? 0;
  const isLocked = minLevel > 0 && childLevel < minLevel;
  const affordable = availableCoins >= reward.coinsCost;
  const iconName = emojiToIconName(reward.emoji);
  const subtitle = reward.description ?? reward.provider;
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    if (shake) return;
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  return (
    <article
      onClick={isLocked || !affordable ? triggerShake : undefined}
      title={isLocked ? `Desbloqueia no Nível ${minLevel}` : undefined}
      className={`bg-white rounded-kid-xl p-3 flex flex-col gap-3 relative transition-transform hover:-translate-y-0.5 ${
        isLocked ? "opacity-70 cursor-pointer" : affordable ? "" : "opacity-80 cursor-pointer"
      } ${shake ? "animate-shake" : ""}`}
    >
      {/* Image area */}
      <div className={`aspect-square rounded-[14px] bg-kid-base flex items-center justify-center overflow-hidden relative ${isLocked ? "grayscale" : ""}`}>
        {iconName ? (
          <AppIcon name={iconName} size={96} />
        ) : (
          <span className="text-[72px] leading-none">{reward.emoji}</span>
        )}
        {isLocked && (
          <span className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center text-kid-text-strong">
            <AppIcon name="lock" size={18} />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-1">
        <p className="font-heading font-bold text-[17px] text-kid-text-strong leading-tight line-clamp-2">
          {reward.title}
        </p>
        {subtitle && (
          <p className="font-body text-[12px] text-kid-text-soft mt-0.5 leading-snug line-clamp-1">
            {subtitle}
          </p>
        )}

        {/* Action */}
        <div className="mt-auto pt-3">
          {isLocked ? (
            <span className="bg-kid-sunk text-kid-text-strong rounded-pill w-full h-11 font-heading font-extrabold text-[14px] inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
              <AppIcon name="lock" size={14} /> Nível {minLevel}
            </span>
          ) : affordable ? (
            <form action={requestRedemption}>
              <input type="hidden" name="rewardId" value={reward.id} />
              <input type="hidden" name="childId" value={childId} />
              <button
                type="submit"
                className="grad-primary text-white rounded-pill w-full h-11 font-heading font-extrabold text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 kid-tappable"
              >
                <AppIcon name="coin" size={22} /> {reward.coinsCost} coins
              </button>
            </form>
          ) : (
            <span className="bg-kid-sunk text-kid-text-muted rounded-pill w-full h-11 font-heading font-extrabold text-[14px] inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
              <AppIcon name="lock" size={14} /> Faltam {reward.coinsCost - availableCoins}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
