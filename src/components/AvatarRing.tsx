import Image from "next/image";

const RING_SIZE = 76;
const STROKE = 5.5;
const GAP = 3;
const RADIUS = (RING_SIZE - STROKE) / 2;
const AVATAR_SIZE = RING_SIZE - STROKE * 2 - GAP * 2;

export default function AvatarRing({
  src,
  alt,
  fallback,
  badge,
  gradFrom,
  gradTo,
}: {
  src: string | null;
  alt: string;
  fallback: string;
  badge: string;
  gradFrom: string;
  gradTo: string;
}) {
  return (
    <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="absolute inset-0"
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#rank-grad)"
          strokeWidth={STROKE}
        />
        <defs>
          <linearGradient id="rank-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={gradFrom} />
            <stop offset="100%" stopColor={gradTo} />
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

      <Image
        src={badge}
        alt=""
        width={26}
        height={26}
        className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 object-contain drop-shadow-md pointer-events-none"
        style={{ width: 24, height: 24 }}
      />
    </div>
  );
}
