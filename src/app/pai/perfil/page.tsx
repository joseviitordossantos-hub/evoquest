import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/enums";
import { getCurrentParent } from "@/lib/auth";
import PaiNav from "@/components/PaiNav";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";
import ProfilePhotoUploader from "@/components/ProfilePhotoUploader";
import PaymentCardItem from "@/components/PaymentCardItem";
import PaymentCardForm from "@/components/PaymentCardForm";
import UpdateProfileForm from "@/app/pai/perfil/UpdateProfileForm";
import { logoutAction, addFunds } from "./actions";

export const dynamic = "force-dynamic";

const TX_LABEL: Record<string, string> = {
  CREDIT: "Recarga",
  DEBIT_REDEMPTION: "Resgate",
  REFUND: "Estorno",
};

export default async function PerfilPai() {
  const parent = await getCurrentParent();
  if (!parent) redirect("/login");

  const transactions = parent.familyId
    ? await prisma.walletTransaction.findMany({
        where: { familyId: parent.familyId },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  const balance = parent.family?.balanceCents ?? 0;
  const monthDebit = transactions
    .filter((t) => t.amountCents < 0 && t.createdAt > new Date(Date.now() - 30 * 24 * 3600 * 1000))
    .reduce((s, t) => s + Math.abs(t.amountCents), 0);

  return (
    <main className="min-h-screen bg-kid-base pattern-dots-violet font-body">
      <PaiNav active="perfil" />

      <div className="px-4 sm:px-6 py-6 sm:py-10 max-w-3xl mx-auto space-y-6">
        {/* Hero */}
        <section className="grad-header rounded-kid-xl p-6 relative overflow-hidden">
          <div className="pattern-dots-light absolute inset-0 opacity-50" />
          <div className="relative flex flex-col items-center text-center gap-3">
            <ProfilePhotoUploader photoPath={parent.photoPath} name={parent.name} />
            <span className="kid-chip bg-white/20 text-white !text-[10px] !px-3 !py-1">
              RESPONSÁVEL
            </span>
            <h1 className="font-heading font-bold text-[28px] sm:text-[32px] text-white leading-tight">
              {parent.name}
            </h1>
            {parent.family && (
              <p className="font-body font-bold text-[13px] text-white/80">
                {parent.family.name}
              </p>
            )}
          </div>
        </section>

        {/* Dados pessoais */}
        <section className="bg-white rounded-kid-xl p-5 sm:p-6">
          <h2 className="font-heading font-bold text-[20px] text-kid-text-strong mb-1">
            Dados pessoais
          </h2>
          <p className="font-body text-[13px] text-kid-text-muted mb-5">
            Atualize seus dados de contato e nome da família.
          </p>
          <UpdateProfileForm
            name={parent.name}
            email={parent.email}
            phone={parent.phone}
            familyName={parent.family?.name ?? ""}
          />
        </section>

        {/* Cartões */}
        <section className="bg-white rounded-kid-xl p-5 sm:p-6">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-5">
            <div>
              <h2 className="font-heading font-bold text-[20px] text-kid-text-strong">
                Cartões cadastrados
              </h2>
              <p className="font-body text-[13px] text-kid-text-muted mt-0.5">
                {parent.cards.length === 0
                  ? "Nenhum cartão ainda."
                  : `${parent.cards.length} ${parent.cards.length === 1 ? "cartão" : "cartões"}`}
              </p>
            </div>
          </div>

          {parent.cards.length === 0 ? (
            <div className="bg-kid-base rounded-kid-xl p-6 text-center">
              <p className="font-body font-bold text-[13px] text-kid-text-soft">
                Adicione um cartão para liberar compras digitais (Robux, Steam…).
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {parent.cards.map((c) => (
                <li key={c.id}>
                  <PaymentCardItem card={c} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4">
            <PaymentCardForm />
          </div>
        </section>

        {/* Carteira — saldo + recarga */}
        <section className="grad-teal rounded-kid-xl p-6 sm:p-8 relative overflow-hidden">
          <div className="pattern-dots-light absolute inset-0 rounded-kid-xl" />
          <div className="relative">
            <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-white/70">
              Saldo disponível
            </p>
            <p className="font-heading font-bold text-[44px] sm:text-[56px] text-white leading-none mt-2">
              {fmtBRL(balance)}
            </p>
            <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-white/60 mt-3">
              Últimos 30 dias — recompensas pagas: {fmtBRL(monthDebit)}
            </p>
          </div>
        </section>

        {/* Recarga */}
        <section className="bg-white rounded-kid-xl p-5 sm:p-6">
          <h2 className="font-heading font-bold text-[20px] text-kid-text-strong mb-1">
            Adicionar saldo
          </h2>
          <p className="font-body text-[13px] text-kid-text-muted mb-4">
            Seu saldo é debitado quando seu filho resgata recompensas digitais.
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[2500, 5000, 10000].map((cents) => (
              <form key={cents} action={addFunds}>
                <input type="hidden" name="amountCents" value={cents} />
                <input type="hidden" name="method" value="Pix" />
                <button
                  className="w-full rounded-kid-md py-3 bg-kid-base hover:bg-kid-tint-violet transition-colors text-center"
                >
                  <p className="font-heading font-bold text-[18px] text-kid-text-strong leading-none">
                    {fmtBRL(cents)}
                  </p>
                  <p className="font-body font-extrabold text-[9px] uppercase tracking-[0.08em] text-kid-text-muted mt-1">
                    via Pix
                  </p>
                </button>
              </form>
            ))}
          </div>

          <form action={addFunds} className="mt-4 flex gap-2 flex-wrap">
            <input type="hidden" name="method" value="Cartão" />
            <input
              type="number"
              name="amountReais"
              step="1"
              min="10"
              placeholder="Valor R$ personalizado"
              className="kid-input flex-1 min-w-[140px]"
            />
            <button className="kid-btn kid-btn-sm whitespace-nowrap">
              Cartão
            </button>
          </form>

          <p className="font-body text-[11px] text-kid-text-muted mt-3 inline-flex items-center gap-1">
            <AppIcon name="warning" size={12} /> Mock — em produção integraria com Stripe/Pagar.me.
          </p>
        </section>

        {/* Extrato completo */}
        <section className="bg-white rounded-kid-xl p-5 sm:p-6">
          <h2 className="font-heading font-bold text-[20px] text-kid-text-strong mb-3">
            Extrato
          </h2>

          {transactions.length === 0 ? (
            <p className="font-body text-kid-text-muted">Sem movimentações ainda.</p>
          ) : (
            <ul className="divide-y divide-kid-sunk">
              {transactions.map((t) => {
                const isCredit = t.amountCents > 0;
                return (
                  <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-body font-bold text-[14px] text-kid-text-strong leading-tight truncate">
                        {t.description}
                      </p>
                      <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.08em] text-kid-text-muted mt-1">
                        {TX_LABEL[t.type] ?? t.type} ·{" "}
                        {new Date(t.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <span
                      className={`font-heading font-extrabold text-[15px] shrink-0 ${
                        isCredit ? "text-kid-success" : "text-kid-danger"
                      }`}
                    >
                      {isCredit ? "+" : ""}
                      {fmtBRL(t.amountCents)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Sair */}
        <section className="bg-white rounded-kid-xl p-5 sm:p-6">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 font-body font-extrabold text-[14px] uppercase tracking-[0.06em] text-kid-danger hover:bg-kid-tint-pink rounded-kid-md py-3 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </button>
          </form>
        </section>

        <Footer />
      </div>
    </main>
  );
}
