import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import PaiNav from "@/components/PaiNav";

import { COMPLEXITY_META, type ComplexityT } from "@/lib/enums";
import { getRankForLevel } from "@/lib/ranks";
import AppIcon from "@/components/AppIcon";
import BannerSlot from "@/components/BannerSlot";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

export default async function PaiDashboard() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);

  const family = await prisma.family.findFirst({
    include: {
      children: {
        include: {
          streak: true,
          missions: {
            where: { active: true },
            include: {
              logs: {
                where: { markedAt: { gte: startOfToday } },
                orderBy: { markedAt: "desc" },
                take: 1,
              },
            },
          },
          logs: { where: { status: "PENDING" }, take: 5, orderBy: { markedAt: "desc" }, include: { mission: true } },
          xpEvents: true,
          achievements: true,
          bosses: { where: { month: currentMonth, year: currentYear } },
        },
      },
    },
  });

  if (!family) return <p className="p-8">Sem família seed. Rode <code>npm run db:seed</code>.</p>;

  return (
    <>
      <PaiNav active="painel" />

      <div className="px-4 py-6 max-w-6xl mx-auto">
        {/* Banner */}
        <div className="mb-6">
          <BannerSlot />
        </div>

        {family.children.map((child, idx) => {
          const totalXp = child.xpEvents.reduce((s, e) => s + e.amount, 0);
          const level = Math.floor(totalXp / 100) + 1;
          const rank = getRankForLevel(level);
          const activeBoss = child.bosses.find((b) => b.active);

          return (
            <section
              key={child.id}
              className={`${idx === 0 ? "" : "mt-5"} p-5 sm:p-6 rounded-kid-xl bg-white`}
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-heading font-bold text-3xl text-kid-text-strong">{child.displayName}</h2>
                      <span className="grad-xp text-white font-body font-extrabold text-[11px] uppercase tracking-[0.08em] rounded-pill px-3 py-1">
                        Nível {level}
                      </span>
                      <span
                        className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] rounded-pill px-3 py-1"
                        style={{ background: rank.bgColor, color: rank.color }}
                      >
                        {rank.label}
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
                  {activeBoss && (
                    <Link
                      href={`/pai/boss/${activeBoss.id}/editar`}
                      className="kid-chip inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{
                        background: activeBoss.defeatedAt ? "#B8EDE3" : "#FFD0E5",
                        color: activeBoss.defeatedAt ? "#0D7D6C" : "#C4225A",
                      }}
                    >
                      <AppIcon name={activeBoss.iconName} size={14} />
                      {activeBoss.defeatedAt
                        ? `${activeBoss.name} derrotado!`
                        : `${activeBoss.name} ${activeBoss.currentHp}/${activeBoss.maxHp} HP`}
                    </Link>
                  )}
                </div>
              </div>

              {(() => {
                const cols: { key: string; label: string; titleClass: string; bg: string; missions: typeof child.missions }[] = [
                  { key: "todo",     label: "A fazer",              titleClass: "text-[#1E3A5F]", bg: "#DBEAFE", missions: [] },
                  { key: "progress", label: "Em andamento",         titleClass: "text-[#664D03]", bg: "#FFF3CD", missions: [] },
                  { key: "pending",  label: "Aguardando aprovação", titleClass: "text-[#A04518]", bg: "#FFD9C4", missions: [] },
                  { key: "done",     label: "Concluída",            titleClass: "text-[#1B5E2E]", bg: "#D4EDDA", missions: [] },
                ];

                for (const m of child.missions) {
                  const latest = m.logs[0];
                  let key: string;
                  if (latest?.status === "PENDING") key = "pending";
                  else if (latest?.status === "APPROVED") key = "done";
                  else if (m.currentProgress > 0) key = "progress";
                  else key = "todo";
                  cols.find((c) => c.key === key)!.missions.push(m);
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {cols.map((col) => (
                      <div
                        key={col.key}
                        className="rounded-kid-md p-3 flex flex-col gap-2"
                        style={{ background: col.bg }}
                      >
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <p className={`font-body font-extrabold text-[11px] uppercase tracking-[0.08em] ${col.titleClass}`}>
                            {col.label}
                          </p>
                          <span className={`font-heading font-bold text-[14px] ${col.titleClass}`}>
                            {col.missions.length}
                          </span>
                        </div>

                        {col.missions.length === 0 ? (
                          <p className="font-body font-bold text-[12px] text-kid-text-muted py-2">
                            —
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {col.missions.map((m) => (
                              <li key={m.id} className="bg-white rounded-[10px] p-2.5">
                                <p className="font-heading font-semibold text-[13px] text-kid-text-strong leading-tight">
                                  {m.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                  <span className="font-body font-extrabold text-[10px] text-kid-text-muted">
                                    {m.xpReward} XP
                                  </span>
                                  <span className="text-kid-text-muted">·</span>
                                  <span className="font-body font-extrabold text-[10px] text-kid-text-muted">
                                    {COMPLEXITY_META[m.difficulty as ComplexityT]?.label ?? m.difficulty}
                                  </span>
                                  {m.targetCount > 1 && col.key === "progress" && (
                                    <>
                                      <span className="text-kid-text-muted">·</span>
                                      <span className="font-body font-extrabold text-[10px] text-kid-text-muted">
                                        {m.currentProgress}/{m.targetCount}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="flex gap-3 mt-4 flex-wrap">
                <Link
                  href={`/pai/missao/nova?childId=${child.id}`}
                  className="kid-btn kid-btn-sm inline-flex"
                >
                  + Nova missão
                </Link>
                {child.logs.length > 0 && (
                  <Link
                    href={`/pai/aprovar?childId=${child.id}`}
                    className="kid-btn kid-btn-sm kid-btn-gold inline-flex"
                  >
                    Aprovar em lote ({child.logs.length}) →
                  </Link>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
