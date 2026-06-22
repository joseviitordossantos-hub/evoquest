import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PaiNav from "@/components/PaiNav";

export const dynamic = "force-dynamic";
import { fmtBRL, rewardKindLabel } from "@/lib/enums";
import { toggleRewardActive, buyRewardStock } from "./actions";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import BuyRewardButton from "@/components/BuyRewardButton";

function isPaidDigital(r: { kind: string; costCents: number }) {
  return r.kind === "DIGITAL_CODE" && r.costCents > 0;
}

const KIND_ORDER = ["DIGITAL_CODE", "EXPERIENCE", "PHYSICAL", "PRIVILEGE"];
const KIND_CHIP: Record<string, string> = {
  DIGITAL_CODE: "kid-chip-violet",
  EXPERIENCE: "kid-chip-pink",
  PHYSICAL: "kid-chip-teal",
  PRIVILEGE: "kid-chip-gold",
};

type RewardRow = Awaited<ReturnType<typeof prisma.reward.findMany>>[number] & {
  _assignedCount?: number;
};

function RewardCard({
  r,
  inStock,
  assignedCount = 0,
}: {
  r: RewardRow;
  inStock: boolean;
  assignedCount?: number;
}) {
  const iconName = emojiToIconName(r.emoji);
  return (
    <div
      className={`bg-white rounded-kid-xl p-5 hover:-translate-y-1 transition-all relative ${
        r.active ? "" : "opacity-50"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="leading-none">
          {iconName ? <AppIcon name={iconName} size={52} /> : <span className="text-5xl">{r.emoji}</span>}
        </span>
        {inStock && isPaidDigital(r) && (
          <span className="kid-chip kid-chip-teal !text-[11px] inline-flex items-center gap-1 font-extrabold">
            ×{r.stock}
          </span>
        )}
        {inStock && !isPaidDigital(r) && (
          <span className="kid-chip kid-chip-teal !text-[10px] inline-flex items-center gap-1 font-extrabold">
            SEMPRE DISPONÍVEL
          </span>
        )}
      </div>
      <p className="font-heading font-semibold text-[18px] text-kid-text-strong">{r.title}</p>
      {r.description && (
        <p className="font-body text-[12px] text-kid-text-soft mt-1">{r.description}</p>
      )}
      {r.provider && (
        <p className="font-body font-extrabold text-[9px] uppercase tracking-[0.12em] text-kid-text-muted mt-2">
          {r.provider}
        </p>
      )}
      {assignedCount > 0 && (
        <p className="font-body font-bold text-[11px] text-kid-violet mt-2">
          Vinculada a {assignedCount} missão{assignedCount > 1 ? "s" : ""}
        </p>
      )}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-kid-sunk gap-3 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 rounded-pill pl-1 pr-3 h-8 font-heading font-extrabold text-[13px] leading-none"
          style={{ background: "#FCEABB", color: "#8B6914" }}
        >
          <AppIcon name="coin" size={20} /> {r.coinsCost} coins
          {r.costCents > 0 ? ` · ${fmtBRL(r.costCents)}` : ""}
        </span>
        <div className="flex gap-2 items-center">
          {isPaidDigital(r) && (
            <BuyRewardButton
              rewardId={r.id}
              title={r.title}
              costCents={r.costCents}
              action={buyRewardStock}
            />
          )}
          <form action={toggleRewardActive}>
            <input type="hidden" name="id" value={r.id} />
            <button className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-text-muted hover:text-kid-violet-deep underline underline-offset-4 transition-colors">
              {r.active ? "Desativar" : "Ativar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default async function Recompensas() {
  const [rewards, missions] = await Promise.all([
    prisma.reward.findMany({
      orderBy: [{ active: "desc" }, { featured: "desc" }, { coinsCost: "asc" }],
    }),
    prisma.mission.findMany({ where: { rewardId: { not: null }, active: true } }),
  ]);

  const assignedCount = new Map<string, number>();
  for (const m of missions) {
    if (m.rewardId) assignedCount.set(m.rewardId, (assignedCount.get(m.rewardId) ?? 0) + 1);
  }

  const inStock = rewards.filter((r) => !isPaidDigital(r) || r.stock > 0);
  const catalog = rewards.filter((r) => isPaidDigital(r) && r.stock === 0);

  const groupedCatalog = KIND_ORDER.map((k) => ({
    kind: k,
    items: catalog.filter((r) => r.kind === k),
  }));

  return (
    <main className="min-h-screen bg-kid-base pattern-dots-violet font-body">
      <PaiNav active="recompensas" />

      <div className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-baseline flex-wrap gap-4">
          <div>
            <span className="kid-chip kid-chip-gold">CATÁLOGO</span>
            <h1 className="font-heading font-bold text-5xl leading-tight text-kid-text-strong mt-3">
              O que dá pra conquistar
            </h1>
            <p className="font-body text-kid-text-body mt-3 max-w-2xl">
              Recompensas em estoque aparecem na criação de missão para vincular como prêmio.
              Digitais usam a carteira; experiências e privilégios são grátis.
            </p>
          </div>
          <Link href="/pai/recompensas/nova" className="kid-btn">
            + Nova recompensa
          </Link>
        </div>

        <section className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="kid-chip kid-chip-teal">EM ESTOQUE</span>
            <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.08em] text-kid-text-muted">
              {inStock.length} {inStock.length === 1 ? "item" : "itens"} prontos para vincular
            </span>
          </div>
          {inStock.length === 0 ? (
            <p className="font-body text-kid-text-muted bg-white/60 rounded-kid-xl p-5">
              Nada em estoque ainda. Privilégios, experiências e produtos físicos ficam disponíveis automaticamente.
              Para códigos digitais pagos, use o botão <strong>Comprar</strong> abaixo.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inStock.map((r) => (
                <RewardCard key={r.id} r={r} inStock assignedCount={assignedCount.get(r.id) ?? 0} />
              ))}
            </div>
          )}
        </section>

        <div className="mt-12 flex items-baseline gap-3">
          <span className="kid-chip kid-chip-violet">PARA COMPRAR</span>
          <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.08em] text-kid-text-muted">
            catálogo disponível
          </span>
        </div>

        {groupedCatalog.map((g) =>
          g.items.length === 0 ? null : (
            <section key={g.kind} className="mt-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`kid-chip ${KIND_CHIP[g.kind]}`}>{rewardKindLabel[g.kind]}</span>
                <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.08em] text-kid-text-muted">
                  {g.items.length} itens
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.items.map((r) => (
                  <RewardCard key={r.id} r={r} inStock={false} />
                ))}
              </div>
            </section>
          )
        )}

        <Footer />
      </div>
    </main>
  );
}
