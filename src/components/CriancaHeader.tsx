import Image from "next/image";
import { getChildStats } from "@/lib/childStats";
import AppIcon from "@/components/AppIcon";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

const RING_SIZE = 76;
const STROKE = 5.5;
const GAP = 3;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const AVATAR_SIZE = RING_SIZE - STROKE * 2 - GAP * 2;

function AvatarRing({
  src,
  alt,
  fallback,
  level,
  progress,
}: {
  src: string | null;
  alt: string;
  fallback: string;
  level: number;
  progress: number;
}) {
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={STROKE}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#xp-grad)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
        <defs>
          <linearGradient id="xp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFC23C" />
            <stop offset="60%" stopColor="#FF8A3D" />
            <stop offset="100%" stopColor="#FF5FA2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={56}
            height={56}
            className="rounded-full object-cover"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          />
        ) : (
          <div
            className="rounded-full bg-white/20 text-white flex items-center justify-center font-heading font-bold text-2xl"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          >
            {fallback}
          </div>
        )}
      </div>

      <span className="absolute -bottom-0.5 -right-0.5 w-5.5 h-5.5 rounded-full grad-xp flex items-center justify-center font-heading font-bold text-[10px] text-white ring-[1.5px] ring-[#7B5CFF]" style={{ width: 22, height: 22 }}>
        {level}
      </span>
    </div>
  );
}

export default async function CriancaHeader({ childId }: { childId: string }) {
  const { child, totalXp, availableCoins, level, xpInLevel } = await getChildStats(childId);
  const avatarSrc = AVATAR_MAP[child.avatarSeed] ?? null;

  return (
    <div className="grad-header rounded-kid-xl p-4 relative overflow-hidden">
      <div className="pattern-dots-light absolute inset-0 rounded-kid-xl opacity-60" />
      <div className="flex items-start justify-between relative">
        <div className="flex items-center gap-3">
          <AvatarRing
            src={avatarSrc}
            alt={child.displayName}
            fallback={child.displayName.charAt(0)}
            level={level}
            progress={Math.max(4, xpInLevel)}
          />
          <div>
            <p className="font-body font-extrabold text-[11px] tracking-[0.12em] uppercase text-white/80">
              Aventureiro
            </p>
            <p className="font-heading font-bold text-[22px] leading-tight text-white">{child.displayName}</p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-2 px-4 h-11 rounded-pill bg-kid-gold text-kid-text-on-warm font-heading font-bold text-[18px] leading-none ring-2 ring-white/40"
          style={{ boxShadow: "0 3px 0 0 rgba(120,70,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.35)" }}
          aria-label={`${availableCoins} moedas`}
        >
          <AppIcon name="coin" size={22} />
          {availableCoins}
        </span>
      </div>

      <div className="mt-4 relative">
        <div className="flex justify-between items-baseline mb-1.5">
          <p className="font-body font-extrabold text-[13px] tracking-[0.04em]">
            <span className="text-white">{xpInLevel}</span>
            <span className="text-white/70"> / 100 XP</span>
          </p>
          <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-white/60">
            Nível {level}
          </p>
        </div>
        <div className="h-[12px] bg-white/15 rounded-pill overflow-hidden">
          <div
            className="h-full grad-xp rounded-pill transition-[width] duration-700 ease-kid-standard"
            style={{ width: `${Math.max(4, xpInLevel)}%` }}
          />
        </div>
        <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.08em] text-white/60 mt-1.5">
          Total acumulado: {totalXp} XP
        </p>
      </div>
    </div>
  );
}
