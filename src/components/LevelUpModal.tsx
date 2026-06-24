"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import { claimLevelUp } from "@/app/crianca/[id]/actions";

type UnlockedReward = {
  id: string;
  title: string;
  emoji: string;
  minLevel: number;
};

type Props = {
  childId: string;
  level: number;
  levelsGained: number;
  coinBonus: number;
  rankLabel: string;
  rankColor: string;
  rankBg: string;
  unlocked: UnlockedReward[];
};

export default function LevelUpModal({
  childId,
  level,
  levelsGained,
  coinBonus,
  rankLabel,
  rankColor,
  rankBg,
  unlocked,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleClaim = async () => {
    setSubmitting(true);
    const fd = new FormData();
    fd.set("childId", childId);
    await claimLevelUp(fd);
    setOpen(false);
  };

  if (!open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-5 animate-fade-in"
      role="dialog"
    >
      <div
        className="rarity-border rounded-kid-xl p-[3px] max-w-[420px] w-full animate-bounce-in relative"
        style={{ ["--rarity-color" as string]: rankBg } as React.CSSProperties}
      >
        <div className="bg-white rounded-[calc(theme(borderRadius.kid-xl)-3px)] p-6 text-center relative overflow-hidden">
          <span
            className="inline-block font-body font-extrabold text-[10px] tracking-[0.16em] uppercase rounded-pill px-3 py-1 animate-slide-up"
            style={{
              background: "#FFD15C",
              color: "#5A3000",
              animationDelay: "100ms",
              animationFillMode: "backwards",
            }}
          >
            PARABÉNS!
          </span>

          <div
            className="mt-4 flex items-center justify-center animate-pulse-soft"
            style={{ transformOrigin: "center" }}
          >
            <AppIcon name="star" size={108} />
          </div>

          <h2
            className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-3 animate-slide-up"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            Você subiu para{" "}
            <span
              className="inline-block rounded-pill px-3 py-1 text-[20px]"
              style={{ background: rankBg, color: rankColor }}
            >
              {rankLabel}
            </span>
          </h2>

          <p
            className="font-body font-extrabold text-[13px] text-kid-text-muted uppercase tracking-[0.1em] mt-2 animate-slide-up"
            style={{ animationDelay: "320ms", animationFillMode: "backwards" }}
          >
            Nível {level}
            {levelsGained > 1 && ` · +${levelsGained} níveis`}
          </p>

          {coinBonus > 0 && (
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-pill px-4 py-2 animate-slide-up"
              style={{
                background: "#FCEABB",
                color: "#8B6914",
                animationDelay: "440ms",
                animationFillMode: "backwards",
              }}
            >
              <AppIcon name="coin" size={28} />
              <span className="font-heading font-bold text-[18px]">
                +{coinBonus} coins de bônus
              </span>
            </div>
          )}

          {unlocked.length > 0 && (
            <div
              className="mt-5 animate-slide-up"
              style={{ animationDelay: "560ms", animationFillMode: "backwards" }}
            >
              <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-kid-text-muted">
                Recompensas destravadas
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {unlocked.slice(0, 6).map((r) => {
                  const iconName = emojiToIconName(r.emoji);
                  return (
                    <div
                      key={r.id}
                      className="bg-kid-base rounded-[12px] p-2 flex flex-col items-center gap-1 relative"
                    >
                      <span className="absolute top-1 right-1 inline-block font-body font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded text-white" style={{ background: "#11A892" }}>
                        ✓
                      </span>
                      {iconName ? (
                        <AppIcon name={iconName} size={36} />
                      ) : (
                        <span className="text-[28px] leading-none">{r.emoji}</span>
                      )}
                      <p className="font-body font-bold text-[10px] text-kid-text-strong leading-tight text-center line-clamp-2">
                        {r.title}
                      </p>
                    </div>
                  );
                })}
              </div>
              {unlocked.length > 6 && (
                <p className="font-body font-bold text-[10px] text-kid-text-muted mt-1">
                  +{unlocked.length - 6} mais destravadas
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleClaim}
            disabled={submitting}
            className="kid-btn w-full mt-6 animate-slide-up"
            style={{ animationDelay: "700ms", animationFillMode: "backwards" }}
          >
            {submitting
              ? "Resgatando..."
              : coinBonus > 0
              ? "Resgatar bônus"
              : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
