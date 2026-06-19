import AppIcon from "@/components/AppIcon";

export default function StreakIndicator({
  currentDays,
  freezesAvailable,
}: {
  currentDays: number;
  freezesAvailable: number;
}) {
  return (
    <div className="grad-streak rounded-kid-lg p-3 px-4 flex items-center justify-between relative overflow-hidden">
      <div className="pattern-dots-light absolute inset-0" />
      <div className="flex items-center gap-3 relative">
        <AppIcon name="fire" size={36} />
        <div className="leading-tight">
          <p className="font-heading font-bold text-[28px] text-white leading-none">{currentDays}</p>
          <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-white/70 mt-0.5">
            dias seguidos
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 relative">
        <span className="inline-flex items-center gap-1 bg-white/20 rounded-pill px-3 py-1.5 text-white font-body font-extrabold text-[13px] backdrop-blur-sm">
          <AppIcon name="snowflake" size={16} /> ×{freezesAvailable}
        </span>
      </div>
    </div>
  );
}
