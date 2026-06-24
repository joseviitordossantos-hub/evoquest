"use client";

import { useEffect, useState } from "react";

const STORAGE_PREFIX = "evoq:lastBossSeen:";

type Damage = { id: string; amount: number; createdAt: string };

export default function BossDamageFloat({
  bossId,
  childId,
  recentDamages,
}: {
  bossId: string;
  childId: string;
  recentDamages: Damage[];
}) {
  const [floats, setFloats] = useState<Damage[]>([]);

  useEffect(() => {
    const key = STORAGE_PREFIX + childId;
    const lastSeen = Number(localStorage.getItem(key) || 0);
    const fresh = recentDamages.filter((d) => new Date(d.createdAt).getTime() > lastSeen);
    if (fresh.length === 0) return;

    setFloats(fresh);
    localStorage.setItem(key, String(Date.now()));

    const t = setTimeout(() => setFloats([]), 2500);
    return () => clearTimeout(t);
  }, [bossId, childId, recentDamages]);

  if (floats.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-start pl-6">
      {floats.map((d, i) => (
        <span
          key={d.id}
          className="absolute font-heading font-bold text-[28px] text-[#FF6675] drop-shadow"
          style={{
            left: `${20 + i * 14}px`,
            top: "30%",
            animation: `dmgFloat 1800ms ease-out forwards`,
            animationDelay: `${i * 180}ms`,
            opacity: 0,
          }}
        >
          -{d.amount}
        </span>
      ))}
      <style jsx>{`
        @keyframes dmgFloat {
          0%   { opacity: 0; transform: translateY(0) scale(0.6); }
          15%  { opacity: 1; transform: translateY(-8px) scale(1.15); }
          100% { opacity: 0; transform: translateY(-60px) scale(1); }
        }
      `}</style>
    </div>
  );
}
