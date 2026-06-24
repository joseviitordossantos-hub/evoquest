import { prisma } from "./prisma";
import { getRankForLevel } from "./ranks";

// 1 moeda a cada XP_PER_COIN pontos de XP conquistados.
export const XP_PER_COIN = 5;

export function xpToCoins(xp: number) {
  return Math.floor(xp / XP_PER_COIN);
}

export async function getChildStats(childId: string) {
  const [child, xpEvents, openRedemptions] = await Promise.all([
    prisma.child.findUniqueOrThrow({ where: { id: childId }, include: { streak: true } }),
    prisma.xpEvent.findMany({ where: { childId } }),
    prisma.redemption.findMany({ where: { childId, status: { in: ["REQUESTED", "APPROVED"] } } }),
  ]);

  const totalXp = xpEvents.reduce((s, e) => s + e.amount, 0);
  const level = Math.floor(totalXp / 100) + 1;
  const xpInLevel = totalXp % 100;

  const earnedCoins = xpToCoins(totalXp);
  const reservedCoins = openRedemptions.reduce((s, r) => s + r.coinsSpent, 0);
  const availableCoins = Math.max(0, earnedCoins + child.bonusCoins - reservedCoins);
  const rank = getRankForLevel(level);

  return { child, totalXp, level, xpInLevel, earnedCoins, availableCoins, rank };
}
