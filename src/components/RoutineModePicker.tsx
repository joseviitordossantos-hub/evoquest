"use client";

import { useState } from "react";
import AppIcon from "@/components/AppIcon";

type Reward = { id: string; title: string; emoji: string; coinsCost: number };

export default function RoutineModePicker({
  rewards,
}: {
  rewards: Reward[];
}) {
  const [frequency, setFrequency] = useState("DAILY");
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"FIXED" | "ACCUMULATE">("FIXED");
  const [coinsPerCompletion, setCoinsPerCompletion] = useState(5);
  const [goalCount, setGoalCount] = useState(5);
  const [goalRewardId, setGoalRewardId] = useState("");

  const isRecurring = frequency !== "ONCE";

  return (
    <div className="space-y-4">
      {/* Frequência */}
      <label className="block">
        <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
          Frequência
        </span>
        <select
          name="frequency"
          className="kid-input"
          value={frequency}
          onChange={(e) => {
            setFrequency(e.target.value);
            if (e.target.value === "ONCE") setEnabled(false);
          }}
        >
          <option value="DAILY">Diária</option>
          <option value="WEEKLY">Semanal</option>
          <option value="ONCE">Uma vez (meta)</option>
        </select>
      </label>

      {/* Toggle rotina */}
      {isRecurring && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-5 h-5 accent-[#7C3AED] rounded"
          />
          <span className="font-body font-extrabold text-[13px] text-kid-text-strong">
            Ativar como rotina recorrente
          </span>
        </label>
      )}

      {enabled && isRecurring && (
        <div className="bg-kid-base rounded-[14px] p-4 space-y-4">
          <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.12em] text-kid-text-muted">
            Modo de recompensa
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("FIXED")}
              className={`rounded-[14px] p-4 text-left transition-all ${
                mode === "FIXED"
                  ? "bg-white ring-2 ring-[#7C3AED] shadow-sm"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            >
              <AppIcon name="coin" size={28} />
              <p className="font-heading font-bold text-[14px] text-kid-text-strong mt-2">
                Recompensa fixa
              </p>
              <p className="font-body text-[12px] text-kid-text-muted mt-1">
                Ganha moedas toda vez que completar
              </p>
            </button>
            <button
              type="button"
              onClick={() => setMode("ACCUMULATE")}
              className={`rounded-[14px] p-4 text-left transition-all ${
                mode === "ACCUMULATE"
                  ? "bg-white ring-2 ring-[#7C3AED] shadow-sm"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            >
              <AppIcon name="trophy" size={28} />
              <p className="font-heading font-bold text-[14px] text-kid-text-strong mt-2">
                Acumular para prêmio
              </p>
              <p className="font-body text-[12px] text-kid-text-muted mt-1">
                Junta conclusões para um prêmio maior
              </p>
            </button>
          </div>

          {mode === "FIXED" && (
            <label className="block">
              <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
                Moedas por conclusão
              </span>
              <input
                type="number"
                min={1}
                value={coinsPerCompletion}
                onChange={(e) => setCoinsPerCompletion(Math.max(1, Number(e.target.value) || 1))}
                className="kid-input w-32"
              />
            </label>
          )}

          {mode === "ACCUMULATE" && (
            <div className="space-y-3">
              <label className="block">
                <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
                  Quantas vezes precisa completar?
                </span>
                <input
                  type="number"
                  min={2}
                  value={goalCount}
                  onChange={(e) => setGoalCount(Math.max(2, Number(e.target.value) || 2))}
                  className="kid-input w-32"
                />
              </label>
              <label className="block">
                <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
                  Prêmio ao atingir a meta
                </span>
                {rewards.length === 0 ? (
                  <p className="font-body text-[13px] text-kid-text-muted bg-white rounded-[10px] p-3">
                    Sem recompensas disponíveis.{" "}
                    <a href="/pai/recompensas" className="text-kid-violet font-extrabold underline">
                      Criar recompensa
                    </a>
                  </p>
                ) : (
                  <select
                    value={goalRewardId}
                    onChange={(e) => setGoalRewardId(e.target.value)}
                    className="kid-input"
                  >
                    <option value="">— Selecione —</option>
                    {rewards.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.emoji} {r.title} ({r.coinsCost} coins)
                      </option>
                    ))}
                  </select>
                )}
              </label>
            </div>
          )}

          <div
            className="rounded-[10px] p-3 flex items-center gap-2 flex-wrap"
            style={{ background: "#F0FFF4" }}
          >
            <AppIcon name="check" size={16} />
            <span className="font-body font-extrabold text-[12px] text-kid-text-strong">
              {mode === "FIXED"
                ? `+${coinsPerCompletion} coins a cada conclusão aprovada`
                : `${goalCount} conclusões → desbloqueia prêmio`}
            </span>
          </div>
        </div>
      )}

      <input type="hidden" name="isRoutine" value={enabled && isRecurring ? "true" : "false"} />
      <input type="hidden" name="routineMode" value={enabled && isRecurring ? mode : ""} />
      <input type="hidden" name="routineCoinsPerCompletion" value={enabled && isRecurring && mode === "FIXED" ? coinsPerCompletion : 0} />
      <input type="hidden" name="routineGoalCount" value={enabled && isRecurring && mode === "ACCUMULATE" ? goalCount : 0} />
      <input type="hidden" name="routineGoalRewardId" value={enabled && isRecurring && mode === "ACCUMULATE" ? goalRewardId : ""} />
    </div>
  );
}
