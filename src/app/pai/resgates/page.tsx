import { prisma } from "@/lib/prisma";
import PaiNav from "@/components/PaiNav";

export const dynamic = "force-dynamic";
import { fmtBRL, redemptionStatusLabel } from "@/lib/enums";
import { approveRedemption, deliverRedemption, rejectRedemption } from "./actions";

import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";

export default async function Resgates() {
  const all = await prisma.redemption.findMany({
    include: { reward: true, child: true },
    orderBy: [{ status: "asc" }, { requestedAt: "desc" }],
  });

  const requested = all.filter((r) => r.status === "REQUESTED");
  const approved = all.filter((r) => r.status === "APPROVED");
  const history = all.filter((r) => r.status === "DELIVERED" || r.status === "REJECTED");
  const family = await prisma.family.findFirstOrThrow();

  return (
    <>
      <PaiNav active="resgates" />
      <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-5xl mx-auto">
        <span className="kid-chip kid-chip-gold">RESGATES</span>
        <h1 className="font-heading font-bold text-5xl text-kid-text-strong leading-tight mt-3">
          Aprovar e entregar
        </h1>

        <section className="mt-10">
          <h2 className="font-heading font-bold text-2xl text-kid-text-strong mb-4">
            Aguardando aprovação ({requested.length})
          </h2>
          {requested.length === 0 ? (
            <p className="text-kid-text-muted font-bold">Nada para aprovar agora.</p>
          ) : (
            <ul className="space-y-3">
              {requested.map((r) => (
                <li
                  key={r.id}
                  className="bg-white rounded-kid-xl p-5 flex justify-between items-center flex-wrap gap-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{emojiToIconName(r.reward.emoji) ? <AppIcon name={emojiToIconName(r.reward.emoji)!} size={40} /> : r.reward.emoji}</span>
                    <div>
                      <p className="font-heading font-semibold text-[18px] text-kid-text-strong">{r.reward.title}</p>
                      <p className="font-body text-[13px] text-kid-text-soft mt-1">
                        {r.child.displayName} · {r.coinsSpent} coins{r.reward.costCents > 0 ? ` · custa ${fmtBRL(r.reward.costCents)}` : " · sem custo R$"}
                      </p>
                      <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.1em] text-kid-text-muted mt-1">
                        PEDIDO {new Date(r.requestedAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {r.reward.costCents > family.balanceCents ? (
                      <span className="kid-chip kid-chip-pink">SALDO INSUFICIENTE</span>
                    ) : (
                      <form action={approveRedemption}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="kid-btn kid-btn-sm">Aprovar</button>
                      </form>
                    )}
                    <form action={rejectRedemption}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="kid-btn kid-btn-sm kid-btn-secondary">Rejeitar</button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-heading font-bold text-2xl text-kid-text-strong mb-4">
            Aprovados — pronto para entregar ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <p className="text-kid-text-muted font-bold">Nenhum aprovado pendente.</p>
          ) : (
            <ul className="space-y-3">
              {approved.map((r) => (
                <li key={r.id} className="bg-kid-tint-gold rounded-kid-xl p-5 relative overflow-hidden">
                  <div className="pattern-dots-light absolute inset-0" />
                  <div className="relative">
                    <div className="flex items-start gap-4 mb-4 flex-wrap">
                      <span className="text-4xl">{emojiToIconName(r.reward.emoji) ? <AppIcon name={emojiToIconName(r.reward.emoji)!} size={40} /> : r.reward.emoji}</span>
                      <div>
                        <p className="font-heading font-semibold text-[18px] text-kid-text-strong">{r.reward.title}</p>
                        <p className="font-body text-[13px] text-kid-text-body mt-1">
                          {r.child.displayName} ·{" "}
                          {r.reward.kind === "DIGITAL_CODE"
                            ? "Comprar código e colar abaixo"
                            : r.reward.kind === "PHYSICAL" || r.reward.kind === "EXPERIENCE"
                              ? "Combinar entrega presencial"
                              : "Conceder o privilégio"}
                        </p>
                      </div>
                    </div>
                    <form action={deliverRedemption} className="flex gap-2 flex-wrap">
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        name="deliveryCode"
                        placeholder={r.reward.kind === "DIGITAL_CODE" ? "Cole o código aqui" : "Como/quando entregou"}
                        className="flex-1 min-w-[200px] p-3 bg-white rounded-[6px] font-bold text-sm text-kid-text-strong outline-none focus:ring-2 focus:ring-kid-violet/30"
                      />
                      <button className="kid-btn kid-btn-sm">Marcar entregue</button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-heading font-bold text-2xl text-kid-text-strong mb-4">Histórico</h2>
          {history.length === 0 ? (
            <p className="text-kid-text-muted font-bold">Sem histórico ainda.</p>
          ) : (
            <ul className="bg-white rounded-kid-xl overflow-hidden">
              {history.map((r, i) => (
                <li
                  key={r.id}
                  className={`px-5 py-4 flex justify-between items-center text-sm font-bold ${
                    i > 0 ? "border-t border-kid-sunk" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{emojiToIconName(r.reward.emoji) ? <AppIcon name={emojiToIconName(r.reward.emoji)!} size={28} /> : <span className="text-2xl">{r.reward.emoji}</span>}</span>
                    <div>
                      <p className="text-kid-text-strong">
                        <strong>{r.child.displayName}</strong> resgatou <strong>{r.reward.title}</strong>
                      </p>
                      <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.1em] text-kid-text-muted mt-1">
                        {redemptionStatusLabel[r.status]} ·{" "}
                        {r.deliveredAt
                          ? new Date(r.deliveredAt).toLocaleDateString("pt-BR")
                          : new Date(r.requestedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span className="kid-chip bg-kid-tint-gold text-kid-on-gold">
                    <AppIcon name="coin" size={14} /> {r.coinsSpent} coins{r.costCentsPaid > 0 ? ` · ${fmtBRL(r.costCentsPaid)}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </>
  );
}
