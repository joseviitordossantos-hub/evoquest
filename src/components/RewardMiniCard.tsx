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
  provider: string | null;
  minLevel?: number;
};

export default function RewardMiniCard({
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
  const [fav, setFav] = useState(false);
  const [shake, setShake] = useState(false);

  const blocked = isLocked || !affordable;
  const triggerShake = () => {
    if (shake) return;
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  return (
    <article
      className={`bg-white rounded-[21px] p-2 w-[190px] xl:w-full shrink-0 overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5 ${shake ? "animate-shake" : ""}`}
    >
      {/* Imagem */}
      <div className={`relative rounded-[16px] bg-kid-tint-violet/70 h-[150px] flex items-center justify-center ${isLocked ? "grayscale" : ""}`}>
        {iconName ? (
          <AppIcon name={iconName} size={108} />
        ) : (
          <span className="text-[80px] leading-none">{reward.emoji}</span>
        )}
        <button
          type="button"
          onClick={() => setFav((v) => !v)}
          aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
          className="absolute top-3 right-3 w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center shadow-sm transition-transform active:scale-90"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill={fav ? "#FF5FA2" : "none"} stroke={fav ? "#FF5FA2" : "#B7AEC9"} strokeWidth={2.4}>
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </button>
        {isLocked && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 bg-white/95 rounded-pill px-2 py-0.5 text-[10px] font-extrabold text-kid-text-strong">
            <AppIcon name="lock" size={12} /> Nv {minLevel}
          </span>
        )}
      </div>

      {/* Corpo */}
      <div className="px-2 pt-2.5 pb-2 flex flex-col flex-1">
        <p className="font-heading font-extrabold text-[16px] leading-tight text-kid-text-strong line-clamp-1">
          {reward.title}
        </p>
        {subtitle && (
          <p className="font-body font-bold text-[12px] text-kid-text-soft leading-snug line-clamp-1 mt-0.5">
            {subtitle}
          </p>
        )}

        <div className="mt-auto pt-3">
          {blocked ? (
            <button
              type="button"
              onClick={triggerShake}
              className="w-full h-[32px] rounded-pill bg-kid-sunk text-kid-text-muted font-body font-extrabold text-[12px] inline-flex items-center justify-center gap-1"
            >
              <AppIcon name="lock" size={14} />
              {isLocked ? `Nível ${minLevel}` : `Faltam ${reward.coinsCost - availableCoins}`}
            </button>
          ) : (
            <form action={requestRedemption}>
              <input type="hidden" name="rewardId" value={reward.id} />
              <input type="hidden" name="childId" value={childId} />
              <button
                type="submit"
                className="w-full h-[32px] rounded-pill text-white font-body font-extrabold text-[13px] inline-flex items-center justify-center gap-1.5 transition-transform active:translate-y-px"
                style={{ background: "#4A66FD" }}
              >
                <AppIcon name="coin" size={18} /> {reward.coinsCost} Coins
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
