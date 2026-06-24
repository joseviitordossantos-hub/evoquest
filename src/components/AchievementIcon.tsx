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
  description?: string;
  earnedAt?: Date | string;
  rarity?: Rarity;
};

export default function AchievementIcon({ emoji, title, locked, hint, description, earnedAt, rarity }: CommonProps) {
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
        style={
          style && !locked
            ? {
                background: `linear-gradient(to bottom right, ${style.from}, ${style.to}) padding-box, linear-gradient(to top left, ${style.from}, ${style.to}) border-box`,
                border: "3px solid transparent",
              }
            : undefined
        }
        className={`relative rounded-kid-lg p-[18%] flex items-center justify-center aspect-square w-full overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 active:scale-95 kid-tappable ${
          style && !locked ? "" : "bg-white"
        } ${locked ? "grayscale brightness-50 opacity-40" : ""}`}
        aria-label={title}
      >
        {rarity === "LEGENDARY" && !locked && <span className="absolute inset-0 pattern-diagonal-stripes pointer-events-none" />}
        {rarity === "MYTHIC" && !locked && <span className="absolute inset-0 pattern-sunburst pointer-events-none" />}
        {locked && (
          <span
            className="absolute inset-0 animate-shimmer pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
          />
        )}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5 animate-fade-in"
          onClick={() => setOpen(false)}
          role="dialog"
        >
          <div
            className={`rounded-kid-xl p-[3px] max-w-[320px] w-full animate-bounce-in relative ${style && !locked ? "rarity-border" : ""}`}
            style={
              style && !locked
                ? ({ ["--rarity-color" as string]: style.to } as React.CSSProperties)
                : undefined
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white rounded-[calc(theme(borderRadius.kid-xl)-3px)] p-6 text-center relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-kid-sunk text-kid-text-muted font-extrabold flex items-center justify-center hover:bg-kid-tint-violet z-10"
                aria-label="Fechar"
              >
                ×
              </button>
              <div
                className={`mb-3 flex items-center justify-center ${locked ? "grayscale brightness-50 opacity-40" : "animate-pulse-soft"}`}
                style={{ transformOrigin: "center" }}
              >
                {iconName ? <AppIcon name={iconName} size={96} /> : <span className="text-[96px]">{emoji}</span>}
              </div>
              {style && !locked && (
                <span
                  className={`inline-block ${style.chip} ${style.chipText} font-body font-extrabold text-[10px] tracking-[0.14em] px-3 py-1 rounded-pill mb-2 animate-slide-up`}
                  style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
                >
                  {style.label}
                </span>
              )}
              <h3
                className="font-heading font-bold text-[20px] text-kid-text-strong leading-tight animate-slide-up"
                style={{ animationDelay: "220ms", animationFillMode: "backwards" }}
              >
                {locked ? "???" : title}
              </h3>
              {locked && hint && (
                <p
                  className="font-body text-[13px] text-kid-text-soft mt-2 leading-snug animate-slide-up"
                  style={{ animationDelay: "320ms", animationFillMode: "backwards" }}
                >
                  {hint}
                </p>
              )}
              {!locked && description && (
                <p
                  className="font-body text-[13px] text-kid-text-soft mt-2 leading-snug animate-slide-up"
                  style={{ animationDelay: "320ms", animationFillMode: "backwards" }}
                >
                  {description}
                </p>
              )}
              {!locked && formattedDate && (
                <p
                  className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] mt-3 text-kid-text-muted animate-slide-up"
                  style={{ animationDelay: "420ms", animationFillMode: "backwards" }}
                >
                  Conquistada em {formattedDate}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
