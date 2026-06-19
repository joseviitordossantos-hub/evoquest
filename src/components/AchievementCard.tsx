import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";

export function UnlockedAchievement({
  emoji,
  title,
  earnedAt,
}: {
  emoji: string;
  title: string;
  earnedAt: Date;
}) {
  const iconName = emojiToIconName(emoji);
  return (
    <article className="bg-white rounded-kid-xl p-4 aspect-square flex flex-col items-center justify-center relative overflow-hidden hover:-translate-y-1 transition-transform">
      <div className="mb-1 leading-none flex items-center justify-center">
        {iconName ? <AppIcon name={iconName} size={48} /> : <span className="text-5xl">{emoji}</span>}
      </div>
      <p className="font-heading font-semibold text-[13px] leading-tight text-center px-1 text-kid-text-strong">{title}</p>
      <p className="font-body font-extrabold text-[9px] uppercase tracking-[0.1em] mt-1 text-kid-text-muted">
        {new Date(earnedAt).toLocaleDateString("pt-BR")}
      </p>
    </article>
  );
}

export function LockedAchievement({ emoji, hint }: { emoji: string; hint: string }) {
  const iconName = emojiToIconName(emoji);
  return (
    <article className="bg-kid-sunk rounded-kid-xl p-4 aspect-square flex flex-col items-center justify-center">
      <div className="mb-1 leading-none grayscale brightness-50 opacity-40 flex items-center justify-center">
        {iconName ? <AppIcon name={iconName} size={48} /> : <span className="text-5xl">{emoji}</span>}
      </div>
      <p className="font-heading font-semibold text-[14px] text-kid-text-muted">???</p>
      <p className="font-body text-[10px] text-kid-text-muted mt-1 leading-tight text-center px-1">
        {hint}
      </p>
    </article>
  );
}
