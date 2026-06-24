"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { touchStreak } from "@/lib/streak";
import { getChildStats } from "@/lib/childStats";

export async function markMissionDone(formData: FormData) {
  const missionId = String(formData.get("missionId"));
  const childId = String(formData.get("childId"));

  const start = new Date(); start.setHours(0, 0, 0, 0);
  const already = await prisma.missionLog.findFirst({
    where: { missionId, childId, markedAt: { gte: start } },
  });
  if (already) return;

  await prisma.missionLog.create({
    data: { missionId, childId, status: "PENDING" },
  });
  await touchStreak(childId);

  revalidatePath(`/crianca/${childId}`);
}

export async function claimLevelUp(formData: FormData) {
  const childId = String(formData.get("childId"));
  const child = await prisma.child.findUniqueOrThrow({ where: { id: childId } });
  const stats = await getChildStats(childId);
  const levelsGained = stats.level - child.highestLevelClaimed;
  if (levelsGained <= 0) {
    revalidatePath(`/crianca/${childId}`);
    return;
  }
  const coinBonus = levelsGained * 10;
  await prisma.child.update({
    where: { id: childId },
    data: {
      highestLevelClaimed: stats.level,
      bonusCoins: { increment: coinBonus },
    },
  });
  revalidatePath(`/crianca/${childId}`);
}
