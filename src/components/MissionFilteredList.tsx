"use client";

import { useState } from "react";
import MissionCard from "@/components/MissionCard";

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

type MissionWithLog = {
  mission: Mission;
  log: { status: string } | null;
};

type Filter = "all" | "todo" | "progress" | "pending" | "done";

const FILTERS: { key: Filter; label: string; bg: string; bgActive: string; text: string }[] = [
  { key: "all", label: "Todas", bg: "bg-white", bgActive: "bg-kid-text-strong", text: "text-white" },
  { key: "todo", label: "A fazer", bg: "bg-[#DBEAFE]", bgActive: "bg-[#3B82F6]", text: "text-white" },
  { key: "progress", label: "Em andamento", bg: "bg-[#FFF3CD]", bgActive: "bg-[#D4A017]", text: "text-white" },
  { key: "pending", label: "Esperando", bg: "bg-[#FFF3CD]", bgActive: "bg-[#B8860B]", text: "text-white" },
  { key: "done", label: "Concluídas", bg: "bg-[#D4EDDA]", bgActive: "bg-[#28A745]", text: "text-white" },
];

function getStatus(m: MissionWithLog): Filter {
  if (m.log?.status === "APPROVED") return "done";
  if (m.log?.status === "PENDING") return "pending";
  if (m.log?.status === "REJECTED") return "todo";
  return m.mission.currentProgress > 0 ? "progress" : "todo";
}

export default function MissionFilteredList({
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
    <>
      <div className="flex gap-2 flex-wrap mt-3">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const count = counts[f.key];
          if (f.key !== "all" && count === 0) return null;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-pill px-3 py-1.5 font-body font-extrabold text-[11px] uppercase tracking-[0.06em] transition-all ${
                active ? `${f.bgActive} ${f.text}` : `${f.bg} text-kid-text-body`
              }`}
            >
              {f.label} · {count}
            </button>
          );
        })}
      </div>

      <ul className="space-y-3 mt-4">
        {filtered.map((item) => (
          <li key={item.mission.id}>
            <MissionCard mission={item.mission} childId={childId} log={item.log} />
          </li>
        ))}
      </ul>
    </>
  );
}
