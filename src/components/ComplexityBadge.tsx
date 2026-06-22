import { COMPLEXITY_META, RARITY_STYLE, type ComplexityT } from "@/lib/enums";

export default function ComplexityBadge({ complexity }: { complexity: string }) {
  const key = (complexity as ComplexityT) in COMPLEXITY_META ? (complexity as ComplexityT) : "COMMON";
  const meta = COMPLEXITY_META[key];
  const style = RARITY_STYLE[key];

  return (
    <span className={`${style.chip} ${style.chipText} rounded-pill px-2.5 py-1 font-body font-extrabold text-[10px] uppercase tracking-[0.08em] inline-flex items-center gap-1`}>
      {meta.label} · {meta.multiplier}x
    </span>
  );
}
