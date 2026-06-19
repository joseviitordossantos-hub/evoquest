import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import PaiNav from "@/components/PaiNav";
import Footer from "@/components/Footer";
import { fmtBRL } from "@/lib/enums";
import AppIcon from "@/components/AppIcon";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

export default async function PaiDashboard() {
  const family = await prisma.family.findFirst({
    include: {
      children: {
        include: {
          streak: true,
          missions: { where: { active: true } },
          logs: { where: { status: "PENDING" }, take: 5, orderBy: { markedAt: "desc" }, include: { mission: true } },
          xpEvents: true,
          achievements: true,
        },
      },
    },
  });

  if (!family) return <p className="p-8">Sem família seed. Rode <code>npm run db:seed</code>.</p>;

  const pendingRedemptions = await prisma.redemption.count({ where: { status: "REQUESTED" } });

  return (
    <main className="min-h-screen bg-kid-base pattern-dots-violet font-body">
      <PaiNav active="painel" />

      <div className="px-4 py-6 max-w-6xl mx-auto">
        <span className="kid-chip kid-chip-pink">PAINEL DO RESPONSÁVEL</span>
        <h1 className="font-heading font-bold text-4xl leading-tight text-kid-text-strong mt-2">
          Olá, {family.name.replace(/^Família /, "")}.
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <StatCard label="CARTEIRA" value={fmtBRL(family.balanceCents)} href="/pai/carteira" bg="kid-stat-teal" />
          <StatCard label="RESGATES AGUARDANDO" value={String(pendingRedemptions)} href="/pai/resgates" bg="kid-stat-gold" />
          <StatCard label="CRIANÇAS" value={String(family.children.length)} bg="kid-stat-pink" />
        </div>

        {family.children.map((child) => {
          const totalXp = child.xpEvents.reduce((s, e) => s + e.amount, 0);
          const level = Math.floor(totalXp / 100) + 1;

          return (
            <section
              key={child.id}
              className="mt-5 p-5 sm:p-6 rounded-kid-xl bg-white"
            >
              <div className="mb-4">
                <div className="flex items-center gap-5">
                  {AVATAR_MAP[child.avatarSeed] ? (
                    <Image
                      src={AVATAR_MAP[child.avatarSeed]}
                      alt={child.displayName}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover ring-3 ring-kid-sunk shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full grad-primary flex items-center justify-center font-heading font-bold text-3xl text-white shrink-0">
                      {child.displayName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-bold text-3xl text-kid-text-strong">{child.displayName}</h2>
                      <span className="grad-xp text-white font-body font-extrabold text-[11px] uppercase tracking-[0.08em] rounded-pill px-3 py-1">
                        Nível {level}
                      </span>
                    </div>
                    <Link
                      href={`/crianca/${child.id}`}
                      className="font-body font-bold text-[13px] text-kid-primary mt-1 inline-block"
                    >
                      Ver como criança →
                    </Link>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-4">
                  <span className="kid-chip bg-kid-tint-orange text-kid-on-orange">{totalXp} XP</span>
                  <span className="kid-chip kid-chip-orange inline-flex items-center gap-1"><AppIcon name="fire" size={14} /> {child.streak?.currentDays ?? 0} DIAS</span>
                  <span className="kid-chip kid-chip-pink inline-flex items-center gap-1"><AppIcon name="trophy" size={14} /> {child.achievements.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="kid-label mb-3">
                    MISSÕES ATIVAS ({child.missions.length})
                  </p>
                  <ul className="space-y-2">
                    {child.missions.map((m) => (
                      <li
                        key={m.id}
                        className="flex justify-between items-center border-b border-kid-sunk py-2 text-sm font-bold"
                      >
                        <span className="text-kid-text-strong">{m.title}</span>
                        <span className="font-body font-extrabold text-[11px] text-kid-text-muted">{m.xpReward} XP · {m.difficulty}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/pai/missao/nova?childId=${child.id}`}
                    className="kid-btn kid-btn-sm mt-4 inline-flex"
                  >
                    + Nova missão
                  </Link>
                </div>

                <div>
                  <p className="kid-label mb-3">
                    AGUARDANDO APROVAÇÃO ({child.logs.length})
                  </p>
                  {child.logs.length === 0 ? (
                    <p className="text-kid-text-muted font-bold">Nada pendente.</p>
                  ) : (
                    <ul className="space-y-2">
                      {child.logs.map((log) => (
                        <li
                          key={log.id}
                          className="text-sm font-bold border-b border-kid-sunk py-2 flex justify-between"
                        >
                          <span className="text-kid-text-strong">{log.mission.title}</span>
                          <span className="font-body font-extrabold text-[11px] text-kid-text-muted">
                            {new Date(log.markedAt).toLocaleDateString("pt-BR")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {child.logs.length > 0 && (
                    <Link
                      href={`/pai/aprovar?childId=${child.id}`}
                      className="kid-btn kid-btn-sm kid-btn-gold mt-4 inline-flex"
                    >
                      Aprovar em lote →
                    </Link>
                  )}
                </div>
              </div>
            </section>
          );
        })}
        <Footer />
      </div>
    </main>
  );
}

function StatCard({ label, value, href, bg }: { label: string; value: string; href?: string; bg: string }) {
  const inner = (
    <div className={`kid-stat ${bg}`}>
      <p className="kid-label">{label}</p>
      <p className="font-heading font-bold text-3xl mt-1 text-kid-text-strong">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
