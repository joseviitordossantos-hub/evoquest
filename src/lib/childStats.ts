import { prisma } from "./prisma";

export async function getChildStats(childId: string) {
  const [child, xpEvents, redemptions] = await Promise.all([
    prisma.child.findUniqueOrThrow({ where: { id: childId }, include: { streak: true } }),
    prisma.xpEvent.findMany({ where: { childId } }),
    prisma.redemption.findMany({ where: { childId, status: { in: ["REQUESTED", "APPROVED"] } } }),
  ]);

  const totalXp = xpEvents.reduce((s, e) => s + e.amount, 0);
  const reservedXp = redemptions.reduce((s, r) => s + r.xpSpent, 0);
  const availableXp = totalXp - reservedXp;
  const level = Math.floor(totalXp / 100) + 1;
  const xpInLevel = totalXp % 100;

  return { child, totalXp, availableXp, level, xpInLevel };
}
