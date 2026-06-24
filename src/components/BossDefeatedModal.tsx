"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppIcon from "@/components/AppIcon";

const STORAGE_PREFIX = "evoq:bossDefeatedSeen:";

export default function BossDefeatedModal({
  childId,
  bossId,
  bossName,
  iconName,
  rewardTitle,
}: {
  childId: string;
  bossId: string;
  bossName: string;
  iconName: string;
  rewardTitle: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = STORAGE_PREFIX + bossId;
    if (localStorage.getItem(key)) return;
    setOpen(true);
  }, [bossId]);

  const close = () => {
    localStorage.setItem(STORAGE_PREFIX + bossId, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5 animate-fade-in"
      onClick={close}
    >
      <div
        className="rounded-kid-xl p-[3px] max-w-[340px] w-full animate-bounce-in relative rarity-border"
        style={{ ["--rarity-color" as string]: "#FFC25C" } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-[calc(theme(borderRadius.kid-xl)-3px)] p-6 text-center relative overflow-hidden">
          <button
            type="button"
            onClick={close}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-kid-sunk text-kid-text-muted font-extrabold flex items-center justify-center hover:bg-kid-tint-violet z-10"
            aria-label="Fechar"
          >
            ×
          </button>

          <div className="mb-3 flex items-center justify-center animate-pulse-soft grayscale">
            <AppIcon name={iconName} size={96} />
          </div>

          <span
            className="inline-block bg-[#B82332] text-white font-body font-extrabold text-[10px] tracking-[0.14em] px-3 py-1 rounded-pill mb-2 animate-slide-up"
            style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
          >
            BOSS DERROTADO
          </span>

          <h3
            className="font-heading font-bold text-[22px] text-kid-text-strong leading-tight animate-slide-up"
            style={{ animationDelay: "220ms", animationFillMode: "backwards" }}
          >
            Você venceu {bossName}!
          </h3>

          {rewardTitle && (
            <p
              className="font-body text-[13px] text-kid-text-soft mt-2 leading-snug animate-slide-up"
              style={{ animationDelay: "320ms", animationFillMode: "backwards" }}
            >
              Recompensa liberada: <strong className="text-kid-text-strong">{rewardTitle}</strong>
            </p>
          )}

          <Link
            href={`/crianca/${childId}/recompensas`}
            onClick={close}
            className="kid-btn kid-btn-gold w-full mt-5 animate-slide-up"
            style={{ animationDelay: "420ms", animationFillMode: "backwards" }}
          >
            Ver minhas recompensas
          </Link>
        </div>
      </div>
    </div>
  );
}
