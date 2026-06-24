"use client";

import { useState } from "react";
import Link from "next/link";
import AppIcon from "@/components/AppIcon";
import BarFill from "@/components/BarFill";
import type { ComplexityT } from "@/lib/enums";

type Mission = {
  id: string;
  title: string;
  difficulty: string;
  xpReward: number;
  rewardText: string | null;
  category: string;
  targetCount: number;
  currentProgress: number;
};

type MissionWithLog = { mission: Mission; log: { status: string } | null };
type Filter = "all" | "todo" | "progress" | "pending" | "done";

const CATEGORY_ICON: Record<string, string> = {
  leitura: "cat-reading",
  estudo: "cat-study",
  idioma: "cat-language",
  esporte: "cat-sport",
  rotina: "cat-routine",
  outro: "cat-other",
};

const RARITY_ROW: Record<ComplexityT, { bg: string; from: string; to: string; badge: string; label: string }> = {
  COMMON:    { bg: "#EFE9F4", from: "#ECE6F3", to: "#AEA3BD", badge: "#BEB4CB", label: "COMUM" },
  RARE:      { bg: "#DCF2FF", from: "#45BFFC", to: "#0086D5", badge: "#007ECF", label: "RARO" },
  LEGENDARY: { bg: "#FFF5DE", from: "#FFBB3C", to: "#C97300", badge: "#E17E00", label: "LENDÁRIO" },
  MYTHIC:    { bg: "#FFE7EB", from: "#FF526C", to: "#D00732", badge: "#C9002B", label: "MÍTICO" },
};

function rarityOf(difficulty: string) {
  return RARITY_ROW[(difficulty as ComplexityT) in RARITY_ROW ? (difficulty as ComplexityT) : "COMMON"];
}

const FILTERS: { key: Filter; label: string; bg: string; text: string; bgActive: string }[] = [
  { key: "all", label: "TODAS", bg: "#2A1B47", text: "#FFFFFF", bgActive: "#2A1B47" },
  { key: "todo", label: "A FAZER", bg: "#D7ECFF", text: "#51476A", bgActive: "#007ECF" },
  { key: "progress", label: "EM ANDAMENTO", bg: "#FFF4C8", text: "#51476A", bgActive: "#E1A100" },
  { key: "pending", label: "ESPERANDO", bg: "#FFF4C8", text: "#51476A", bgActive: "#B8860B" },
  { key: "done", label: "CONCLUÍDAS", bg: "#CEEEDA", text: "#51476A", bgActive: "#28A745" },
];

function getStatus(m: MissionWithLog): Filter {
  if (m.log?.status === "APPROVED") return "done";
  if (m.log?.status === "PENDING") return "pending";
  if (m.log?.status === "REJECTED") return "todo";
  return m.mission.currentProgress > 0 ? "progress" : "todo";
}

function MissionRow({ item, childId }: { item: MissionWithLog; childId: string }) {
  const { mission, log } = item;
  const r = rarityOf(mission.difficulty);
  const status = getStatus(item);
  const done = status === "done";
  const iconName = CATEGORY_ICON[mission.category] ?? "cat-other";
  const showXp = mission.difficulty !== "COMMON";

  const current = done ? mission.targetCount : mission.currentProgress;
  const pct = mission.targetCount > 0 ? Math.min(100, Math.round((current / mission.targetCount) * 100)) : done ? 100 : 0;

  return (
    <Link
      href={`/crianca/${childId}/aula/${mission.id}`}
      className="block rounded-[17px] p-3 flex items-center gap-3.5 kid-tappable transition-transform hover:-translate-y-0.5"
      style={{ background: done ? "#DDF3E4" : r.bg }}
    >
      <div
        className="w-[68px] h-[68px] rounded-[10px] shrink-0 flex items-center justify-center relative"
        style={{ background: `linear-gradient(134deg, ${r.from} 8%, ${r.to} 94%)` }}
      >
        <AppIcon name={iconName} size={48} className="drop-shadow" />
        {done && (
          <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white flex items-center justify-center ring-2 ring-white">
            <AppIcon name="check" size={16} />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-heading font-extrabold text-[16px] leading-tight text-kid-text-soft truncate">
          {mission.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="font-body font-extrabold text-[10px] tracking-[0.14em] text-white rounded-pill px-2 py-0.5" style={{ background: r.badge }}>
            {r.label}
          </span>
          {showXp && (
            <span className="inline-flex items-center gap-0.5 font-body font-extrabold text-[10px] tracking-[0.1em] text-white rounded-pill px-1.5 py-0.5" style={{ background: "#4C327F" }}>
              <AppIcon name="bolt" size={11} /> +XP
            </span>
          )}
        </div>
        <div className="mt-2 h-[10px] rounded-pill overflow-hidden relative" style={{ background: "#E8DDF7" }}>
          <BarFill pct={pct} className="grad-xp" />
          <span className="absolute inset-0 flex items-center justify-center font-body font-extrabold text-[7.5px] text-white">
            {current}/{mission.targetCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function MissionPanel({
  items,
  childId,
}: {
  items: MissionWithLog[];
  childId: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = { all: items.length, todo: 0, progress: 0, pending: 0, done: 0 };
  for (const item of items) counts[getStatus(item)]++;

  const filtered = filter === "all" ? items : items.filter((i) => getStatus(i) === filter);

  return (
    <section className="kid-card p-5 lg:p-6 flex flex-col xl:h-full xl:overflow-hidden">
      <div className="flex items-start justify-between shrink-0">
        <div>
          <p className="font-body font-extrabold text-[12px] tracking-[0.12em] text-kid-text-muted uppercase">Hoje</p>
          <h2 className="font-heading font-bold text-[24px] text-kid-text-soft leading-tight mt-1">Suas missões</h2>
        </div>
        <Link
          href={`/crianca/${childId}`}
          aria-label="Atualizar missões"
          className="w-9 h-9 rounded-full bg-kid-tint-violet text-kid-on-violet flex items-center justify-center shrink-0 transition-transform hover:-translate-y-0.5 kid-tappable"
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7" /><path d="M8 7h9v9" />
          </svg>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 shrink-0">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const count = counts[f.key];
          if (f.key !== "all" && count === 0) return null;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className="rounded-pill px-3 py-1.5 font-body font-extrabold text-[10px] tracking-[0.04em] transition-all kid-tappable"
              style={{ background: active ? f.bgActive : f.bg, color: active || f.key === "all" ? "#FFFFFF" : f.text }}
            >
              {f.label}{f.key !== "all" || count > 0 ? ` • ${count}` : ""}
            </button>
          );
        })}
      </div>

      <div className="kid-divider mt-[24px] shrink-0" />

      {filtered.length === 0 ? (
        <p className="font-body font-bold text-[14px] text-kid-text-muted text-center py-10">
          Nenhuma missão aqui agora.
        </p>
      ) : (
        <ul key={filter} className="flex flex-col gap-3 mt-[24px] xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:pr-2 scrollbar-thin">
          {filtered.map((item, i) => (
            <li key={item.mission.id} className="animate-bounce-in" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}>
              <MissionRow item={item} childId={childId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
