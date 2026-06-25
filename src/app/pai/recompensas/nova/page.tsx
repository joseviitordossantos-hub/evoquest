import PaiNav from "@/components/PaiNav";

import { createReward } from "../actions";

export const dynamic = "force-dynamic";

export default function NovaRecompensa() {
  return (
    <>
      <PaiNav active="recompensas" />
      <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-2xl mx-auto">
        <span className="kid-chip kid-chip-pink">NOVA RECOMPENSA</span>
        <h1 className="font-heading font-bold text-4xl text-kid-text-strong leading-tight mt-3 mb-8">
          O que vale a pena conquistar?
        </h1>

        <form
          action={createReward}
          className="bg-white rounded-kid-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-[80px,1fr] gap-3">
            <Field label="Emoji">
              <input
                name="emoji"
                defaultValue="🎁"
                className="kid-input text-center text-2xl"
              />
            </Field>
            <Field label="Título">
              <input
                name="title"
                required
                className="kid-input"
                placeholder="Ex: Robux R$ 15"
              />
            </Field>
          </div>
          <Field label="Descrição (opcional)">
            <input
              name="description"
              className="kid-input"
              placeholder="100 Robux para Roblox"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tipo">
              <select
                name="kind"
                className="kid-input"
                defaultValue="PRIVILEGE"
              >
                <option value="DIGITAL_CODE">Digital (gift card)</option>
                <option value="PHYSICAL">Físico</option>
                <option value="EXPERIENCE">Experiência</option>
                <option value="PRIVILEGE">Privilégio</option>
              </select>
            </Field>
            <Field label="Provedor (opcional)">
              <input
                name="provider"
                className="kid-input"
                placeholder="Roblox, Steam…"
              />
            </Field>
            <Field label="Custo em coins (criança paga)">
              <input
                type="number"
                name="coinsCost"
                defaultValue={10}
                min={1}
                className="kid-input"
              />
            </Field>
            <Field label="Custo R$ (você paga)">
              <input
                type="number"
                name="costReais"
                defaultValue={0}
                step="0.01"
                min={0}
                className="kid-input"
              />
            </Field>
            <Field label="Nível mínimo (0 = sem trava)">
              <input
                type="number"
                name="minLevel"
                defaultValue={0}
                min={0}
                max={50}
                className="kid-input"
              />
              <span className="font-body text-[11px] text-kid-text-muted mt-1 block">
                Use para criar metas aspiracionais — a criança vê trancada até alcançar o nível.
              </span>
            </Field>
          </div>

          <label className="flex items-center gap-2 font-body font-extrabold text-[13px] text-kid-text-strong">
            <input type="checkbox" name="featured" className="w-5 h-5 accent-[#7B5CFF]" />
            Destacar no catálogo da criança
          </label>

          <div className="flex gap-3 pt-2 flex-wrap">
            <button className="kid-btn">Criar recompensa</button>
            <a href="/pai/recompensas" className="kid-btn kid-btn-secondary">Cancelar</a>
          </div>
        </form>

        <aside className="mt-8 kid-stat kid-stat-gold relative overflow-hidden">
          <div className="pattern-dots-light absolute inset-0" />
          <div className="relative">
            <span className="kid-chip bg-white/60 text-kid-on-gold">DICA</span>
            <p className="font-body text-[14px] text-kid-text-body mt-3 leading-relaxed">
              Mantenha equilíbrio: ofereça privilégios e experiências (sem custo R$) tanto quanto recompensas digitais.
              Recompensas só digitais alimentam o ciclo "tarefa → prêmio".
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
