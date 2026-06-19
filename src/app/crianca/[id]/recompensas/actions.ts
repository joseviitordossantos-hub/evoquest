"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getChildStats } from "@/lib/childStats";

export async function requestRedemption(formData: FormData) {
  const rewardId = String(formData.get("rewardId"));
  const childId = String(formData.get("childId"));

  const reward = await prisma.reward.findUniqueOrThrow({ where: { id: rewardId } });
  const { availableXp } = await getChildStats(childId);
  if (availableXp < reward.xpCost) return;

  // Reservamos o XP via XpEvent negativo (reembolsado se for rejeitado pelo pai)
  await prisma.$transaction([
    prisma.redemption.create({
      data: { childId, rewardId, status: "REQUESTED", xpSpent: reward.xpCost },
    }),
    prisma.xpEvent.create({
      data: { childId, amount: -reward.xpCost, reason: `redemption:${rewardId}` },
    }),
  ]);

  revalidatePath(`/crianca/${childId}/recompensas`);
  revalidatePath("/pai/resgates");
  revalidatePath("/pai");
}
