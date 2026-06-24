"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getChildStats } from "@/lib/childStats";

export async function requestRedemption(formData: FormData) {
  const rewardId = String(formData.get("rewardId"));
  const childId = String(formData.get("childId"));

  const reward = await prisma.reward.findUniqueOrThrow({ where: { id: rewardId } });
  const { availableCoins, level } = await getChildStats(childId);
  if (reward.minLevel > 0 && level < reward.minLevel) {
    throw new Error(`Recompensa trancada (requer nível ${reward.minLevel})`);
  }
  if (availableCoins < reward.coinsCost) return;

  // Moedas reservadas só pelo Redemption.coinsSpent — XP fica intocado (continua governando nível/rank).
  await prisma.redemption.create({
    data: { childId, rewardId, status: "REQUESTED", coinsSpent: reward.coinsCost },
  });

  revalidatePath(`/crianca/${childId}/recompensas`);
  revalidatePath("/pai/resgates");
  revalidatePath("/pai");
}
