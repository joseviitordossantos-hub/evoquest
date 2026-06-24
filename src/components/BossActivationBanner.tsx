import { activateBossForChildren } from "@/lib/boss";
import { prisma } from "@/lib/prisma";
import BossBannerClient from "./BossBannerClient";

type Props = {
  pendingChildren: { id: string; displayName: string }[];
  template: {
    name: string;
    iconName: string;
    defaultMaxHp: number;
    month: number;
    year: number;
  };
};

export default async function BossActivationBanner({ pendingChildren, template }: Props) {
  const family = await prisma.family.findFirstOrThrow();
  const rewards = await prisma.reward.findMany({
    where: { familyId: family.id, active: true, forBoss: true },
    orderBy: { coinsCost: "asc" },
    select: { id: true, title: true, coinsCost: true },
  });

  return (
    <BossBannerClient
      pendingChildren={pendingChildren}
      template={template}
      rewards={rewards}
      action={activateBossForChildren}
    />
  );
}
