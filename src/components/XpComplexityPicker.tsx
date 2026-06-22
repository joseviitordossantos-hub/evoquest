"use client";

import { useState } from "react";
import { COMPLEXITY_META, RARITY_STYLE, type ComplexityT } from "@/lib/enums";
import AppIcon from "@/components/AppIcon";

const TIERS = Object.entries(COMPLEXITY_META) as [ComplexityT, (typeof COMPLEXITY_META)[ComplexityT]][];

export default function XpComplexityPicker() {
  const [baseXp, setBaseXp] = useState(15);
  const [complexity, setComplexity] = useState<ComplexityT>("COMMON");

  const meta = COMPLEXITY_META[complexity];
  const finalXp = Math.floor(baseXp * meta.multiplier);
  const coins = Math.floor(finalXp / 5);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
            XP Base
          </span>
          <input
            type="number"
            min={1}
            value={baseXp}
            onChange={(e) => setBaseXp(Math.max(1, Number(e.target.value) || 1))}
            className="kid-input"
          />
        </label>

        <div className="block">
          <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
            Complexidade
          </span>
          <div className="grid grid-cols-2 gap-2">
            {TIERS.map(([key, tier]) => {
              const style = RARITY_STYLE[key];
              const active = complexity === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setComplexity(key)}
                  className={`rounded-[12px] px-3 py-2.5 font-body font-extrabold text-[12px] uppercase tracking-[0.06em] transition-all ${
                    active
                      ? `${style.fill} text-white ring-2 ring-offset-2`
                      : "bg-kid-sunk text-kid-text-body hover:opacity-80"
                  }`}
                  style={active ? { "--tw-ring-color": style.to } as React.CSSProperties : undefined}
                >
                  {tier.label} · {tier.multiplier}x
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="rounded-[10px] p-3 flex items-center gap-3 flex-wrap"
        style={{ background: "#F5F0FF" }}
      >
        <span className="font-body font-extrabold text-[12px] text-kid-text-strong">
          {baseXp} XP × {meta.multiplier} =
        </span>
        <span className="font-heading font-bold text-[18px] text-kid-violet-deep">
          {finalXp} XP
        </span>
        <span className="inline-flex items-center gap-1 font-heading font-bold text-[14px]" style={{ color: "#8B6914" }}>
          <AppIcon name="coin" size={18} /> ~{coins} coins
        </span>
      </div>

      <input type="hidden" name="xpReward" value={finalXp} />
      <input type="hidden" name="difficulty" value={complexity} />
    </div>
  );
}
