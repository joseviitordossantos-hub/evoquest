import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getChildStats } from "@/lib/childStats";
import CriancaTabBar from "@/components/CriancaTabBar";
import AppIcon from "@/components/AppIcon";
import Footer from "@/components/Footer";

const HERO: Record<string, string> = {
  lila: "/HERO-GIRL-USER.jpg",
  theo: "/HERO-BOY-USER.jpg",
};

const HERO_BG: Record<string, string> = {
  lila: "bg-[#FCD9DC]",
  theo: "bg-[#CFE6F5]",
};

const LEAGUE_BY_LEVEL = (level: number) => {
  if (level >= 10) return "Diamante";
  if (level >= 7) return "Esmeralda";
  if (level >= 5) return "Safira";
  if (level >= 3) return "Prata";
  return "Bronze";
};

export default async function Perfil({ params }: { params: Promise<{ id: string }> }) {
  const { id: childId } = await params;
  const { child, totalXp, level } = await getChildStats(childId);
  const seed = child.avatarSeed ?? "lila";
  const heroSrc = HERO[seed] ?? HERO.lila;
  const heroBg = HERO_BG[seed] ?? HERO_BG.lila;

  const [activeMissions, achievementCount, family, streakRow] = await Promise.all([
    prisma.mission.count({ where: { childId, active: true } }),
    prisma.achievement.count({ where: { childId } }),
    prisma.family.findUnique({
      where: { id: child.familyId },
      include: { children: { where: { id: { not: childId } } }, parents: true },
    }),
    prisma.streak.findUnique({ where: { childId } }),
  ]);

  const username = `@${child.displayName.toLowerCase().replace(/\s+/g, "")}`;
  const joinedYear = new Date(child.createdAt).getFullYear();
  const league = LEAGUE_BY_LEVEL(level);
  const streakDays = streakRow?.currentDays ?? 0;
  const family_children = family?.children ?? [];

  return (
    <main className="min-h-screen bg-kid-base font-body pb-28">
      <div className="max-w-[480px] mx-auto">
        <section className="relative h-[360px]">
          <Image
            src={heroSrc}
            alt={child.displayName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10" />
          <div className="relative flex items-start justify-between p-5">
            <h1 className="font-heading font-bold text-[28px] text-white drop-shadow leading-tight">
              {child.displayName}
            </h1>
            <Link
              href={`/crianca/${childId}`}
              className="w-10 h-10 rounded-full bg-white/85 flex items-center justify-center text-kid-text-strong hover:bg-white"
              aria-label="Configurações"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </Link>
          </div>
          <span className="absolute top-20 right-5 bg-black text-white font-heading font-extrabold text-[12px] tracking-[0.16em] px-2.5 py-1 rounded-md">
            EVO
          </span>
        </section>

        <div className="px-5 pt-5 space-y-6 bg-kid-base">
          <div>
            <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
              {username} · INGRESSOU {joinedYear}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-1">
                  <span className="font-heading font-bold text-[20px] text-kid-text-strong">{activeMissions}</span>
                </div>
                <span className="font-body text-[13px] text-kid-text-muted">Missões</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-heading font-bold text-[20px] text-kid-text-strong">{family_children.length}</span>
                <span className="font-body text-[13px] text-kid-text-muted">Seguindo</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-heading font-bold text-[20px] text-kid-text-strong">{achievementCount}</span>
                <span className="font-body text-[13px] text-kid-text-muted">Seguidores</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-kid-sunk rounded-pill py-3 font-body font-extrabold text-[14px] tracking-[0.08em] text-kid-text-strong hover:border-kid-violet transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 11h-6" />
                <path d="M19 8v6" />
              </svg>
              ADICIONAR
            </button>
            <button className="w-14 bg-white border-2 border-kid-sunk rounded-2xl flex items-center justify-center text-kid-text-strong hover:border-kid-violet transition-colors" aria-label="QR Code">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path d="M14 14h3v3h-3z" />
                <path d="M20 14v3" />
                <path d="M17 20v1" />
                <path d="M20 20h1" />
              </svg>
            </button>
          </div>

          <section>
            <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted mb-3">
              Visão geral
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-kid-tint-orange text-kid-on-orange rounded-pill px-3 py-1.5 font-body font-extrabold text-[12px]">
                <AppIcon name="fire" size={14} /> {streakDays} DIAS
              </span>
              <span className="inline-flex items-center gap-1.5 bg-kid-tint-gold text-kid-on-gold rounded-pill px-3 py-1.5 font-body font-extrabold text-[12px]">
                <AppIcon name="bolt" size={14} /> {totalXp} XP
              </span>
              <span className="inline-flex items-center gap-1.5 bg-kid-tint-teal text-kid-on-teal rounded-pill px-3 py-1.5 font-body font-extrabold text-[12px]">
                <AppIcon name="trophy" size={14} /> {league.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-kid-tint-violet text-kid-on-violet rounded-pill px-3 py-1.5 font-body font-extrabold text-[12px]">
                <AppIcon name="crown" size={14} /> NÍVEL {level}
              </span>
            </div>
          </section>

          {family_children.length > 0 && (
            <section>
              <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted mb-3">
                Streaks com amigos
              </p>
              <div className="-mx-5 px-5 overflow-x-auto scrollbar-hide">
                <ul className="flex gap-3 w-max">
                  {family_children.map((c) => (
                    <li key={c.id} className="flex flex-col items-center w-[72px] shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-kid-sunk">
                        <Image
                          src={c.avatarSeed === "theo" ? "/avatar-boy.png" : "/avatar-girl.png"}
                          alt={c.displayName}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <span className="mt-2 inline-flex items-center gap-1 font-body font-extrabold text-[12px] text-kid-orange">
                        <AppIcon name="fire" size={14} /> {Math.floor(Math.random() * 300) + 50}
                      </span>
                    </li>
                  ))}
                  <li className="flex flex-col items-center w-[72px] shrink-0">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-kid-text-muted flex items-center justify-center text-kid-text-muted text-2xl">
                      +
                    </div>
                    <span className="mt-2 font-body text-[10px] text-kid-text-muted">Adicionar</span>
                  </li>
                </ul>
              </div>
            </section>
          )}

          {family && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
                  Família {family.name}
                </p>
                <Link href="/pai" className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-violet">
                  Gerenciar
                </Link>
              </div>
              <div className="bg-white rounded-kid-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full grad-primary flex items-center justify-center text-white font-heading font-bold text-[18px]">
                  {family.parents[0]?.name?.[0] ?? "F"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-[16px] text-kid-text-strong">
                    {family.parents[0]?.name ?? "Responsável"}
                  </p>
                  <p className="font-body text-[13px] text-kid-text-soft">Responsável</p>
                </div>
              </div>
            </section>
          )}
          <Footer />
        </div>
      </div>

      <CriancaTabBar childId={childId} active="amigos" />
    </main>
  );
}
