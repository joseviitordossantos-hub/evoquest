import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PaiNav from "@/components/PaiNav";
import { fmtBRL, rewardKindLabel } from "@/lib/enums";
import { toggleRewardActive } from "./actions";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";

const KIND_ORDER = ["DIGITAL_CODE", "EXPERIENCE", "PHYSICAL", "PRIVILEGE"];
const KIND_CHIP: Record<string, string> = {
  DIGITAL_CODE: "kid-chip-violet",
  EXPERIENCE: "kid-chip-pink",
  PHYSICAL: "kid-chip-teal",
  PRIVILEGE: "kid-chip-gold",
};

export default async function Recompensas() {
  const rewards = await prisma.reward.findMany({
    orderBy: [{ active: "desc" }, { featured: "desc" }, { xpCost: "asc" }],
  });

  const grouped = KIND_ORDER.map((k) => ({
    kind: k,
    items: rewards.filter((r) => r.kind === k),
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
              Você define o que existe e o custo em XP. Digitais usam a carteira; experiências e privilégios são grátis.
            </p>
          </div>
          <Link href="/pai/recompensas/nova" className="kid-btn">
            + Nova recompensa
          </Link>
        </div>

        {grouped.map((g) => (
          <section key={g.kind} className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`kid-chip ${KIND_CHIP[g.kind]}`}>{rewardKindLabel[g.kind]}</span>
              <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.08em] text-kid-text-muted">
                {g.items.length} itens
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {g.items.map((r) => (
                <div
                  key={r.id}
                  className={`bg-white rounded-kid-xl p-5 hover:-translate-y-1 transition-all ${
                    r.active ? "" : "opacity-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="leading-none">{emojiToIconName(r.emoji) ? <AppIcon name={emojiToIconName(r.emoji)!} size={40} /> : <span className="text-4xl">{r.emoji}</span>}</span>
                    {r.featured && (
                      <span className="kid-chip kid-chip-pink -rotate-3 inline-flex items-center gap-1"><AppIcon name="star" size={12} /> TOP</span>
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
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-kid-sunk">
                    <span className="kid-chip bg-kid-tint-orange text-kid-on-orange">
                      <AppIcon name="bolt" size={14} /> {r.xpCost} XP{r.costCents > 0 ? ` · ${fmtBRL(r.costCents)}` : ""}
                    </span>
                    <form action={toggleRewardActive}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-text-muted hover:text-kid-violet-deep underline underline-offset-4 transition-colors">
                        {r.active ? "Desativar" : "Ativar"}
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <Footer />
      </div>
    </main>
  );
}
