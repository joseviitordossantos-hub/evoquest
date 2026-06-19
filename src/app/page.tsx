import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import EvoQuestLogo from "@/components/EvoQuestLogo";
import Footer from "@/components/Footer";
import AppIcon from "@/components/AppIcon";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

export default async function Home() {
  const family = await prisma.family.findFirst({ include: { children: true } });

  return (
    <main className="min-h-screen bg-kid-base font-body relative overflow-hidden">
      <nav className="bg-white/80 backdrop-blur-lg relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <EvoQuestLogo height={36} />
          <Link
            href="/pai"
            className="kid-btn kid-btn-sm !text-[13px]"
          >
            <span className="hidden sm:inline">Entrar como responsável</span>
            <span className="sm:hidden">Entrar</span>
            {" →"}
          </Link>
        </div>
      </nav>

      <section className="px-4 pt-10 pb-8 max-w-3xl mx-auto relative z-10">
        <span className="kid-chip kid-chip-pink inline-flex items-center gap-1"><AppIcon name="star" size={14} /> PROTÓTIPO V0</span>
        <h1 className="font-heading font-black text-[68px] leading-[1.02] tracking-[-0.02em] text-kid-text-strong mt-3">
          Transforme<br />
          <span className="kid-gradient-text">esforço</span>
          {" "}em conquista.
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed font-body font-bold text-kid-text-body max-w-md">
          Um app para pais incentivarem hábitos saudáveis nos filhos — não pelo prêmio,
          mas pelo orgulho de conquistar.
        </p>
      </section>

      <section className="px-4 pb-16 max-w-3xl mx-auto relative z-10">
        <div className="grad-section rounded-kid-xl p-5 relative overflow-hidden">
          <div className="pattern-dots-light absolute inset-0 rounded-kid-xl" />
          <div className="relative">
            <span className="kid-chip bg-white/20 text-white">DEMO INTERATIVA</span>
            <h2 className="font-heading font-bold text-3xl mt-4 leading-tight text-white">Família Silva — entre pelos dois lados</h2>
            <p className="font-body text-white/70 mt-3 mb-6">
              Veja o app pelos olhos do responsável (gestão, carteira, aprovação)
              ou da criança (missões, loja, troféus).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/pai"
                className="block bg-white rounded-[6px] p-4 hover:-translate-y-1 transition-all"
              >
                <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-kid-text-muted">RESPONSÁVEL</p>
                <p className="font-heading font-bold text-xl mt-2 text-kid-text-strong">Marcos Silva</p>
                <p className="font-body text-[12px] text-kid-text-soft mt-1">Painel · Recompensas · Carteira</p>
              </Link>
              {family?.children.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/crianca/${c.id}`}
                  className={`block kid-stat !rounded-[6px] !p-4 ${i % 2 === 0 ? "kid-stat-gold" : "kid-stat-pink"} hover:-translate-y-1 transition-all`}
                >
                  <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-kid-text-muted">CRIANÇA</p>
                  <div className="flex items-center gap-3 mt-2">
                    {AVATAR_MAP[c.avatarSeed] ? (
                      <Image
                        src={AVATAR_MAP[c.avatarSeed]}
                        alt={c.displayName}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white/50"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full grad-primary flex items-center justify-center font-heading font-bold text-lg text-white">
                        {c.displayName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-heading font-bold text-xl text-kid-text-strong">{c.displayName}</p>
                      <p className="font-body text-[12px] text-kid-text-soft">Hoje · Loja · Troféus</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <Footer />
      </div>
    </main>
  );
}
