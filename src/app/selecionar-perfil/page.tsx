import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getFamilyFromSession } from "@/lib/auth";
import { getRankForLevel } from "@/lib/ranks";
import EvoQuestLogo from "@/components/EvoQuestLogo";
import AvatarRing from "@/components/AvatarRing";
import { selectProfile } from "./actions";

export const dynamic = "force-dynamic";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

export default async function SelecionarPerfil() {
  const family = await getFamilyFromSession();
  if (!family) redirect("/login");

  const childrenWithXp = await Promise.all(
    family.children.map(async (child) => {
      const xpEvents = await prisma.xpEvent.findMany({ where: { childId: child.id } });
      const totalXp = xpEvents.reduce((s, e) => s + e.amount, 0);
      const level = Math.floor(totalXp / 100) + 1;
      const rank = getRankForLevel(level);
      return { ...child, level, rank };
    })
  );

  return (
    <main className="min-h-screen bg-kid-base font-body flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[600px] flex flex-col items-center">
        <EvoQuestLogo height={48} />

        <h1 className="font-heading font-extrabold text-[32px] sm:text-[40px] text-kid-text-strong mt-10 text-center leading-tight">
          Quem vai jogar?
        </h1>
        <p className="font-body font-semibold text-[15px] text-kid-text-soft mt-2 text-center">
          Selecione seu perfil para continuar
        </p>

        <div className="flex flex-wrap items-start justify-center gap-8 sm:gap-12 mt-12">
          {childrenWithXp.map((child, i) => (
            <form key={child.id} action={selectProfile}>
              <input type="hidden" name="childId" value={child.id} />
              <button
                type="submit"
                className="flex flex-col items-center gap-3 group transition-transform hover:-translate-y-1 active:translate-y-0 kid-tappable"
                style={{
                  animationName: "slide-up",
                  animationDuration: "600ms",
                  animationDelay: `${i * 120}ms`,
                  animationFillMode: "backwards",
                  animationTimingFunction: "cubic-bezier(0.2, 0.8, 0.3, 1)",
                }}
              >
                <div className="rounded-[28px] bg-white p-5 shadow-sm group-hover:shadow-md transition-shadow">
                  <AvatarRing
                    src={AVATAR_MAP[child.avatarSeed] ?? null}
                    alt={child.displayName}
                    fallback={child.displayName[0]}
                    badge={child.rank.badge}
                    gradFrom={child.rank.color}
                    gradTo={child.rank.bgColor}
                    size={108}
                  />
                </div>

                <span className="font-heading font-bold text-[18px] text-kid-text-strong">
                  {child.displayName}
                </span>
                <span
                  className="font-body font-extrabold text-[12px] uppercase tracking-[0.08em] px-3 py-1 rounded-pill"
                  style={{ color: child.rank.color, backgroundColor: child.rank.bgColor }}
                >
                  Nível {child.level}
                </span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </main>
  );
}
