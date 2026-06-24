"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import { RARITY_STYLE, type Rarity } from "@/lib/enums";

const RARITY_PT: Record<Rarity, { label: string; badge: string; border: string }> = {
  COMMON:    { label: "COMUM",    badge: "#BEB4CB", border: "#AEA3BD" },
  RARE:      { label: "RARO",     badge: "#007ECF", border: "#0086D5" },
  EPIC:      { label: "ÉPICO",    badge: "#5234CC", border: "#5234CC" },
  LEGENDARY: { label: "LENDÁRIO", badge: "#E17E00", border: "#C97300" },
  MYTHIC:    { label: "MÍTICO",   badge: "#C9002B", border: "#D00732" },
};

export default function AchievementMiniCard({
  emoji,
  title,
  rarity = "COMMON",
  description,
  earnedAt,
}: {
  emoji: string;
  title: string;
  rarity?: Rarity;
  description?: string;
  earnedAt?: string;
}) {
  const [open, setOpen] = useState(false);
  const iconName = emojiToIconName(emoji);
  const style = RARITY_STYLE[rarity];
  const meta = RARITY_PT[rarity];

  return (
    <>
      <article
        className="kid-card p-4 flex items-center gap-4 w-[240px] lg:w-[300px] xl:w-[340px] shrink-0 cursor-pointer kid-tappable transition-transform hover:-translate-y-0.5"
        onClick={() => setOpen(true)}
      >
        <div
          className="w-[88px] h-[88px] rounded-[16px] shrink-0 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(134deg, ${style.from} 8%, ${style.to} 94%)`,
            border: `3px solid ${meta.border}`,
          }}
        >
          {rarity === "MYTHIC" && <span className="absolute inset-0 pattern-sunburst pointer-events-none" />}
          {rarity === "LEGENDARY" && <span className="absolute inset-0 pattern-diagonal-stripes pointer-events-none" />}
          {iconName ? (
            <AppIcon name={iconName} size={64} className="relative drop-shadow" />
          ) : (
            <span className="relative text-[46px] leading-none">{emoji}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-heading font-extrabold text-[18px] leading-[1.05] text-kid-text-strong line-clamp-2">
            {title}
          </p>
          <span
            className="inline-flex mt-2.5 font-body font-extrabold text-[11px] tracking-[0.14em] text-white rounded-pill px-3 py-1"
            style={{ background: meta.badge }}
          >
            {meta.label}
          </span>
        </div>
      </article>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-5 animate-fade-in"
            role="dialog"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <div
              className="rarity-border rounded-kid-xl p-[3px] max-w-[380px] w-full animate-bounce-in"
              style={{ ["--rarity-color" as string]: meta.border } as React.CSSProperties}
            >
              <div className="bg-white rounded-[calc(theme(borderRadius.kid-xl)-3px)] px-6 pt-8 pb-8 text-center relative overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-kid-sunk text-kid-text-muted flex items-center justify-center hover:bg-kid-tint-violet transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="M6 6l12 12" />
                  </svg>
                </button>

                <div className="mt-2 flex items-center justify-center">
                  {iconName ? (
                    <AppIcon name={iconName} size={120} className="drop-shadow animate-pulse-soft" />
                  ) : (
                    <span className="text-[80px] leading-none animate-pulse-soft">{emoji}</span>
                  )}
                </div>

                <span
                  className="inline-block mt-5 font-body font-extrabold text-[10px] tracking-[0.16em] uppercase rounded-pill px-3 py-1"
                  style={{ background: meta.badge, color: "#FFFFFF" }}
                >
                  {meta.label}
                </span>

                <h2 className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-4">
                  {title}
                </h2>

                {description && (
                  <p className="font-body font-bold text-[14px] text-kid-text-muted mt-2">
                    {description}
                  </p>
                )}

                {earnedAt && (
                  <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-kid-text-muted mt-3">
                    Conquistada em {new Date(earnedAt).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
