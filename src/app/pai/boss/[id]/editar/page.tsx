import { prisma } from "@/lib/prisma";
import PaiNav from "@/components/PaiNav";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";
import { updateBoss } from "./actions";

export const dynamic = "force-dynamic";

export default async function EditarBoss({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const boss = await prisma.monthlyBoss.findUniqueOrThrow({
    where: { id },
    include: { child: true, reward: true },
  });

  const family = await prisma.family.findFirstOrThrow();
  const rewards = await prisma.reward.findMany({
    where: { familyId: family.id, active: true },
    orderBy: { title: "asc" },
  });

  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return (
    <main className="min-h-screen bg-kid-base pattern-dots-violet font-body">
      <PaiNav />
      <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-2xl mx-auto">
        <span className="kid-chip kid-chip-pink">EDITAR BOSS</span>
        <h1 className="font-heading font-bold text-4xl text-kid-text-strong leading-tight mt-3 mb-2">
          {boss.name}
        </h1>
        <p className="font-body text-[14px] text-kid-text-soft mb-8">
          Boss de {monthNames[boss.month - 1]}/{boss.year} — {boss.child.displayName}
        </p>

        <form action={updateBoss} className="bg-white rounded-kid-xl p-6 space-y-4">
          <input type="hidden" name="id" value={boss.id} />

          <div className="flex items-center gap-4 bg-kid-base rounded-kid-md p-4">
            <AppIcon name={boss.iconName} size={56} />
            <div>
              <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.12em] text-kid-text-muted">
                Boss do mês (definido pelo sistema)
              </p>
              <p className="font-heading font-bold text-[20px] text-kid-text-strong leading-tight">
                {boss.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="HP máximo">
              <input
                type="number"
                name="maxHp"
                required
                defaultValue={boss.maxHp}
                min={100}
                max={9999}
                step={50}
                className="kid-input"
              />
            </Field>
            <div>
              <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
                HP atual
              </span>
              <div className="kid-input bg-kid-sunk text-kid-text-muted cursor-not-allowed">
                {boss.currentHp} / {boss.maxHp}
              </div>
            </div>
          </div>

          <Field label="Recompensa ao derrotar (opcional)">
            <select name="rewardId" defaultValue={boss.rewardId ?? ""} className="kid-input">
              <option value="">Nenhuma — só glória</option>
              {rewards.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.coinsCost} coins)
                </option>
              ))}
            </select>
          </Field>

          {boss.defeatedAt && (
            <div className="kid-stat kid-stat-teal">
              <p className="font-body font-extrabold text-[13px] text-kid-on-teal flex items-center gap-2">
                <AppIcon name="trophy" size={16} />
                Boss derrotado em {new Date(boss.defeatedAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2 flex-wrap">
            <button type="submit" className="kid-btn">Salvar</button>
            <a href="/pai" className="kid-btn kid-btn-secondary">Cancelar</a>
          </div>
        </form>
        <Footer />
      </div>
    </main>
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
