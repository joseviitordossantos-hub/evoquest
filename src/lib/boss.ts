import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import type { Mission, MissionLog, MonthlyBoss, BossTemplate } from "@prisma/client";

function monthYearFromDate(d: Date) {
  return { month: d.getMonth() + 1, year: d.getFullYear() };
}

export function daysRemainingInMonth(now = new Date()): number {
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
}

export async function getCurrentBoss(childId: string): Promise<MonthlyBoss | null> {
  const { month, year } = monthYearFromDate(new Date());
  return prisma.monthlyBoss.findUnique({
    where: { childId_month_year: { childId, month, year } },
  });
}

export async function getCurrentBossTemplate(): Promise<BossTemplate | null> {
  const { month, year } = monthYearFromDate(new Date());
  return prisma.bossTemplate.findUnique({
    where: { month_year: { month, year } },
  });
}

export async function activateBossForChildren(formData: FormData) {
  "use server";
  const childIds = formData.getAll("childIds").map((v) => String(v)).filter(Boolean);
  const rewardIdRaw = String(formData.get("rewardId") || "");
  const rewardId = rewardIdRaw || null;

  if (childIds.length === 0) return;

  const template = await getCurrentBossTemplate();
  if (!template) throw new Error("Nenhum boss disponível para o mês corrente");

  const { month, year } = monthYearFromDate(new Date());

  for (const childId of childIds) {
    await prisma.monthlyBoss.upsert({
      where: { childId_month_year: { childId, month, year } },
      create: {
        childId,
        month,
        year,
        templateId: template.id,
        name: template.name,
        iconName: template.iconName,
        maxHp: template.defaultMaxHp,
        currentHp: template.defaultMaxHp,
        active: true,
        rewardId,
      },
      update: {
        templateId: template.id,
        name: template.name,
        iconName: template.iconName,
        active: true,
        rewardId,
      },
    });
    revalidatePath(`/crianca/${childId}`);
  }

  revalidatePath("/pai");
}

export type DamageResult = {
  damage: number;
  hpBefore: number;
  hpAfter: number;
  justDefeated: boolean;
  bossName: string;
};

export async function dealDamageFromMissionLog(
  log: MissionLog & { mission: Mission }
): Promise<DamageResult | null> {
  const boss = await getCurrentBoss(log.childId);
  if (!boss || !boss.active || boss.defeatedAt) return null;

  const damage = log.mission.xpReward;
  const hpBefore = boss.currentHp;
  const hpAfter = Math.max(0, hpBefore - damage);
  const justDefeated = hpAfter === 0 && hpBefore > 0;

  await prisma.bossDamage.create({
    data: { bossId: boss.id, missionLogId: log.id, amount: damage },
  });

  await prisma.monthlyBoss.update({
    where: { id: boss.id },
    data: {
      currentHp: hpAfter,
      defeatedAt: justDefeated ? new Date() : undefined,
    },
  });

  if (justDefeated && boss.rewardId) {
    await prisma.redemption.create({
      data: {
        childId: log.childId,
        rewardId: boss.rewardId,
        status: "REQUESTED",
        coinsSpent: 0,
        parentNote: `Drop do boss ${boss.name}`,
      },
    });
  }

  return { damage, hpBefore, hpAfter, justDefeated, bossName: boss.name };
}
