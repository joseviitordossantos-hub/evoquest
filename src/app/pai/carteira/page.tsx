import { prisma } from "@/lib/prisma";
import PaiNav from "@/components/PaiNav";

export const dynamic = "force-dynamic";
import { fmtBRL } from "@/lib/enums";
import { addFunds } from "./actions";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";

export default async function Carteira() {
  const family = await prisma.family.findFirstOrThrow({
    include: { transactions: { orderBy: { createdAt: "desc" }, take: 50 } },
  });

  const monthDebit = family.transactions
    .filter((t) => t.amountCents < 0 && t.createdAt > new Date(Date.now() - 30 * 24 * 3600 * 1000))
    .reduce((s, t) => s + Math.abs(t.amountCents), 0);

  return (
    <main className="min-h-screen bg-kid-base pattern-dots-violet font-body">
      <PaiNav active="carteira" />
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <span className="kid-chip kid-chip-teal">CARTEIRA</span>
        <h1 className="font-heading font-bold text-5xl text-kid-text-strong leading-tight mt-3">
          Seu dinheiro no app
        </h1>
        <p className="font-body text-kid-text-body mt-3 max-w-2xl">
          Você adiciona saldo aqui. Quando seu filho resgatar uma recompensa digital (Robux, gift card),
          o valor sai daqui — você nunca precisa entregar dados de pagamento para a criança.
        </p>

        {/* Saldo */}
        <section className="mt-10 grad-teal rounded-kid-xl p-8 relative overflow-hidden">
          <div className="pattern-dots-light absolute inset-0 rounded-kid-xl" />
          <div className="relative">
            <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-white/70">
              SALDO DISPONÍVEL
            </p>
            <p className="font-heading font-bold text-7xl text-white leading-none mt-2">{fmtBRL(family.balanceCents)}</p>
            <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.08em] text-white/60 mt-4">
              ÚLTIMOS 30 DIAS — RECOMPENSAS PAGAS: {fmtBRL(monthDebit)}
            </p>
          </div>
        </section>

        {/* Quick add buttons */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[2500, 5000, 10000].map((cents, idx) => {
            const bgs = ["kid-stat-gold", "kid-stat-pink", "kid-stat-violet"];
            return (
              <form key={cents} action={addFunds}>
                <input type="hidden" name="amountCents" value={cents} />
                <input type="hidden" name="method" value="Pix" />
                <button
                  className={`w-full kid-stat ${bgs[idx]} text-left`}
                >
                  <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-kid-text-soft">ADICIONAR</p>
                  <p className="font-heading font-bold text-3xl mt-1 text-kid-text-strong">{fmtBRL(cents)}</p>
                  <p className="font-body text-[12px] mt-1.5 text-kid-text-body">via Pix</p>
                </button>
              </form>
            );
          })}
        </section>

        <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <form
            action={addFunds}
            className="bg-white rounded-kid-xl p-5"
          >
            <input type="hidden" name="method" value="Cartão" />
            <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong mb-2">
              VALOR PERSONALIZADO (R$)
            </p>
            <div className="flex gap-2 flex-wrap">
              <input
                type="number"
                name="amountReais"
                step="1"
                min="10"
                placeholder="50"
                className="kid-input flex-1 min-w-[100px]"
              />
              <button className="kid-btn kid-btn-sm whitespace-nowrap">
                Cartão
              </button>
            </div>
          </form>
          <div className="kid-stat kid-stat-gold">
            <span className="kid-chip bg-white/60 text-kid-on-gold inline-flex items-center gap-1"><AppIcon name="warning" size={14} /> V0 MOCK</span>
            <p className="font-body text-[13px] text-kid-text-body mt-3">
              Botões não cobram de verdade. Em produção entraria gateway (Stripe/Pagar.me) com PIX e cartão.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-heading font-bold text-2xl text-kid-text-strong mb-4">Extrato</h2>
          {family.transactions.length === 0 ? (
            <p className="text-kid-text-muted font-bold">Sem transações.</p>
          ) : (
            <ul className="bg-white rounded-kid-xl overflow-hidden">
              {family.transactions.map((tx, i) => (
                <li
                  key={tx.id}
                  className={`px-5 py-4 flex justify-between items-center text-sm font-bold ${
                    i > 0 ? "border-t border-kid-sunk" : ""
                  }`}
                >
                  <div>
                    <p className="text-kid-text-strong">{tx.description}</p>
                    <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.08em] text-kid-text-muted mt-1">
                      {tx.type} · {new Date(tx.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`kid-chip ${tx.amountCents < 0 ? "kid-chip-pink" : "kid-chip-teal"}`}
                  >
                    {tx.amountCents > 0 ? "+" : ""}
                    {fmtBRL(tx.amountCents)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}
