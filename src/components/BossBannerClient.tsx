"use client";
import { useState } from "react";
import Image from "next/image";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

type Reward = { id: string; title: string; coinsCost: number };
type Child = { id: string; displayName: string };

type Props = {
  pendingChildren: Child[];
  template: { name: string; iconName: string; defaultMaxHp: number; month: number; year: number };
  rewards: Reward[];
  action: (formData: FormData) => Promise<void>;
};

export default function BossBannerClient({ pendingChildren, template, rewards, action }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    pendingChildren.map((c) => c.id)
  );

  const toggleChild = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-kid-xl hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
        aria-label={`Ativar boss do mês: ${template.name}`}
      >
        <Image
          src="/Boss desktop.png"
          alt={`${template.name} — novo boss mensal`}
          width={1600}
          height={400}
          className="hidden sm:block w-full h-auto"
          priority
        />
        <div className="block sm:hidden w-full max-h-[620px] overflow-hidden">
          <Image
            src="/Boss mobile.png"
            alt={`${template.name} — novo boss mensal`}
            width={800}
            height={1000}
            className="w-full h-auto object-cover"
            style={{ objectPosition: "center 30%" }}
            priority
          />
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-kid-xl p-5 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.12em] text-kid-text-muted">
              Ativar boss mensal
            </p>
            <h2 className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-1">
              {template.name}
            </h2>
            <p className="font-body text-[13px] text-kid-text-soft mt-1">
              {MONTHS[template.month - 1]}/{template.year} · {template.defaultMaxHp} HP
            </p>

            <div className="mt-4 p-3 rounded-kid-md bg-kid-tint-violet">
              <p className="font-body text-[13px] text-kid-text-body leading-snug">
                <strong className="font-extrabold text-kid-text-strong">Como funciona:</strong> o boss
                mensal é um desafio coletivo que dura o mês todo. Cada missão concluída pelas crianças
                causa dano de acordo com o XP da missão. Se elas zerarem o HP antes do fim do mês, a
                recompensa escolhida abaixo é desbloqueada como prêmio especial. Se o tempo acabar
                antes, o boss foge.
              </p>
            </div>

            <form action={action} className="space-y-4 mt-4">
              <div>
                <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong mb-2">
                  Ativar para qual{pendingChildren.length > 1 ? "is" : ""} filho
                  {pendingChildren.length > 1 ? "s" : ""}?
                </p>
                <div className="space-y-2">
                  {pendingChildren.map((c) => {
                    const checked = selectedIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-3 p-3 rounded-kid-md cursor-pointer transition-colors ${
                          checked ? "bg-kid-tint-violet ring-2 ring-kid-violet" : "bg-kid-base"
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="childIds"
                          value={c.id}
                          checked={checked}
                          onChange={() => toggleChild(c.id)}
                          className="w-5 h-5 accent-kid-violet"
                        />
                        <span className="font-body font-bold text-[15px] text-kid-text-strong">
                          {c.displayName}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
                  Recompensa especial ao derrotar
                </span>
                <select name="rewardId" defaultValue="" className="kid-input">
                  <option value="">Nenhuma — só glória</option>
                  {rewards.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.coinsCost} coins)
                    </option>
                  ))}
                </select>
                <span className="font-body text-[11px] text-kid-text-muted block mt-1.5">
                  Drops de boss são maiores que recompensas normais e custam menos coins por reais.
                </span>
              </label>

              <div className="flex gap-3 flex-wrap pt-1">
                <button
                  type="submit"
                  disabled={selectedIds.length === 0}
                  className="kid-btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedIds.length === 0
                    ? "Escolha ao menos 1 filho"
                    : `Ativar para ${selectedIds.length} ${selectedIds.length === 1 ? "filho" : "filhos"}`}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="kid-btn kid-btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
