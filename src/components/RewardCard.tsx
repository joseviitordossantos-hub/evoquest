"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const triggerShake = () => {
    if (shake) return;
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  return (
    <>
      <article
        onClick={isLocked || !affordable ? triggerShake : undefined}
        title={isLocked ? `Desbloqueia no Nível ${minLevel}` : undefined}
        className={`bg-white rounded-kid-xl p-3 flex flex-col gap-3 relative transition-transform hover:-translate-y-0.5 ${
          isLocked ? "opacity-70 cursor-pointer" : affordable ? "" : "opacity-80 cursor-pointer"
        } ${shake ? "animate-shake" : ""}`}
      >
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

        <div className="flex flex-col flex-1 px-1">
          <p className="font-heading font-bold text-[17px] text-kid-text-strong leading-tight truncate lg:whitespace-normal lg:line-clamp-2">
            {reward.title}
          </p>
          {subtitle && (
            <p className="font-body text-[12px] text-kid-text-soft mt-0.5 leading-snug line-clamp-1">
              {subtitle}
            </p>
          )}

          <div className="mt-auto pt-3">
            {isLocked ? (
              <span className="bg-kid-sunk text-kid-text-strong rounded-pill w-full h-11 font-heading font-extrabold text-[14px] inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                <AppIcon name="lock" size={14} /> Nível {minLevel}
              </span>
            ) : affordable ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                className="grad-primary text-white rounded-pill w-full h-11 font-heading font-extrabold text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 kid-tappable"
              >
                <AppIcon name="coin" size={22} /> {reward.coinsCost} coins
              </button>
            ) : (
              <span className="bg-kid-sunk text-kid-text-muted rounded-pill w-full h-11 font-heading font-extrabold text-[14px] inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                <AppIcon name="lock" size={14} /> Faltam {reward.coinsCost - availableCoins}
              </span>
            )}
          </div>
        </div>
      </article>

      {showConfirm && mounted && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5"
          onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}
        >
          <div className="bg-white rounded-[28px] w-full max-w-[340px] p-6 flex flex-col items-center gap-5 animate-pop relative">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-kid-sunk flex items-center justify-center text-kid-text-muted hover:text-kid-text-strong transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M18 6 6 18" /><path d="M6 6l12 12" />
              </svg>
            </button>

            <div className="w-[100px] h-[100px] rounded-[18px] bg-kid-base flex items-center justify-center">
              {iconName ? (
                <AppIcon name={iconName} size={72} />
              ) : (
                <span className="text-[56px] leading-none">{reward.emoji}</span>
              )}
            </div>

            <div className="text-center">
              <p className="font-heading font-extrabold text-[20px] text-kid-text-strong leading-tight">
                {reward.title}
              </p>
              {subtitle && (
                <p className="font-body font-bold text-[14px] text-kid-text-soft mt-1">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="kid-divider w-full" />

            <div className="text-center">
              <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.08em] text-kid-text-muted">
                Custo
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <AppIcon name="coin" size={28} />
                <span className="font-heading font-extrabold text-[28px] text-kid-text-strong">
                  {reward.coinsCost}
                </span>
                <span className="font-body font-bold text-[16px] text-kid-text-soft">
                  coins
                </span>
              </div>
              <p className="font-body font-bold text-[13px] text-kid-text-muted mt-1">
                Saldo restante: {availableCoins - reward.coinsCost} coins
              </p>
            </div>

            <div className="flex gap-3 w-full mt-1">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-12 rounded-pill bg-kid-sunk font-heading font-extrabold text-[15px] text-kid-text-strong transition-transform hover:-translate-y-0.5 kid-tappable"
              >
                Cancelar
              </button>
              <form action={requestRedemption} className="flex-1" onSubmit={() => setShowConfirm(false)}>
                <input type="hidden" name="rewardId" value={reward.id} />
                <input type="hidden" name="childId" value={childId} />
                <button
                  type="submit"
                  className="w-full h-12 rounded-pill grad-primary text-white font-heading font-extrabold text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 kid-tappable"
                >
                  Confirmar
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
