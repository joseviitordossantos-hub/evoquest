import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BannerSlot() {
  const family = await prisma.family.findFirst({
    include: {
      children: {
        include: {
          bosses: {
            where: { active: true },
            take: 1,
          },
        },
      },
    },
  });

  const firstChildWithBoss = family?.children.find((c) => c.bosses.length > 0);
  const activeBoss = firstChildWithBoss?.bosses[0];
  const bossHref = activeBoss
    ? `/pai/boss/${activeBoss.id}/editar`
    : undefined;

  const inner = (
    <>
      <div className="relative rounded-kid-xl overflow-hidden aspect-[1118/513] sm:aspect-[1120/350] bg-kid-base">
        <picture>
          <source media="(min-width: 640px)" srcSet="/Boss%20desktop.png" />
          <img
            src="/Boss%20mobile.png"
            alt="Novo boss disponível — Ative agora para seu filho"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: i === 0 ? 18 : 7,
              height: 7,
              background: i === 0 ? "#7C5CFF" : "rgba(124, 92, 255, 0.28)",
            }}
          />
        ))}
      </div>
    </>
  );

  if (bossHref) {
    return (
      <Link href={bossHref} className="block transition-transform hover:-translate-y-0.5 kid-tappable">
        {inner}
      </Link>
    );
  }

  return <div>{inner}</div>;
}
