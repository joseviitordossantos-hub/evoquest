"use client";

import { useState } from "react";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import { RARITY_STYLE, type Rarity } from "@/lib/enums";

type CommonProps = {
  emoji: string;
  title: string;
  locked?: boolean;
  hint?: string;
  earnedAt?: Date | string;
  rarity?: Rarity;
};

export default function AchievementIcon({ emoji, title, locked, hint, earnedAt, rarity }: CommonProps) {
  const style = rarity ? RARITY_STYLE[rarity] : null;
  const [open, setOpen] = useState(false);
  const iconName = emojiToIconName(emoji);

  const formattedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString("pt-BR")
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={style && !locked ? { boxShadow: style.shadow } : undefined}
        className={`relative rounded-kid-lg p-[18%] flex items-center justify-center aspect-square w-full overflow-hidden transition-all duration-150 hover:-translate-y-0.5 active:translate-y-1 ${
          style && !locked ? style.fill : "bg-white"
        } ${locked ? "grayscale brightness-50 opacity-40" : ""}`}
        aria-label={title}
      >
        {rarity === "LEGENDARY" && !locked && <span className="absolute inset-0 pattern-diagonal-stripes pointer-events-none" />}
        <span className="block w-full aspect-square relative overflow-hidden" style={{ containerType: "inline-size" }}>
          {iconName ? (
            <AppIcon name={iconName} size={128} className="absolute inset-0 !w-full !h-full object-contain" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center leading-none" style={{ fontSize: "75cqw" }}>{emoji}</span>
          )}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5"
          onClick={() => setOpen(false)}
          role="dialog"
        >
          <div
            className="bg-white rounded-kid-xl p-6 max-w-[320px] w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-kid-sunk text-kid-text-muted font-extrabold flex items-center justify-center hover:bg-kid-tint-violet"
              aria-label="Fechar"
            >
              ×
            </button>
            <div className={`mb-3 flex items-center justify-center ${locked ? "grayscale brightness-50 opacity-40" : ""}`}>
              {iconName ? <AppIcon name={iconName} size={96} /> : <span className="text-[96px]">{emoji}</span>}
            </div>
            {style && !locked && (
              <span className={`inline-block ${style.chip} ${style.chipText} font-body font-extrabold text-[10px] tracking-[0.14em] px-3 py-1 rounded-pill mb-2`}>
                {style.label}
              </span>
            )}
            <h3 className="font-heading font-bold text-[20px] text-kid-text-strong leading-tight">
              {locked ? "???" : title}
            </h3>
            {locked && hint && (
              <p className="font-body text-[13px] text-kid-text-soft mt-2 leading-snug">{hint}</p>
            )}
            {!locked && formattedDate && (
              <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] mt-3 text-kid-text-muted">
                Conquistada em {formattedDate}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
