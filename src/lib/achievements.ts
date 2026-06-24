import { prisma } from "./prisma";
import { ACHIEVEMENTS } from "./enums";

export async function evaluateAchievements(childId: string) {
  const [logs, streak, xpEvents, bosses] = await Promise.all([
    prisma.missionLog.findMany({ where: { childId, status: "APPROVED" }, include: { mission: true } }),
    prisma.streak.findUnique({ where: { childId } }),
    prisma.xpEvent.findMany({ where: { childId } }),
    prisma.monthlyBoss.findMany({ where: { childId, defeatedAt: { not: null } } }),
  ]);

  const totalXp = xpEvents.reduce((s, e) => s + e.amount, 0);
  const level = Math.floor(totalXp / 100) + 1;
  const approvedCount = logs.length;
  const bossCompleted = logs.some((l) => l.mission.difficulty === "MYTHIC");
  const longest = streak?.longestDays ?? 0;
  const slainBosses = bosses.length;
  const speedKill = bosses.some(
    (b) => b.defeatedAt && b.defeatedAt.getTime() - b.createdAt.getTime() < 10 * 24 * 60 * 60 * 1000
  );
  const perfectKill = slainBosses > 0 && (streak?.freezesUsedThisMonth ?? 0) === 0;

  const earnedCodes: string[] = [];
  if (approvedCount >= 1) earnedCodes.push("FIRST_MISSION");
  if (approvedCount >= 10) earnedCodes.push("TEN_MISSIONS");
  if (approvedCount >= 30) earnedCodes.push("THIRTY_MISSIONS");
  if (longest >= 7) earnedCodes.push("STREAK_7");
  if (longest >= 30) earnedCodes.push("STREAK_30");
  if (bossCompleted) earnedCodes.push("BOSS_HUNTER");
  if (level >= 5) earnedCodes.push("LEVEL_5");
  if (level >= 10) earnedCodes.push("LEVEL_10");
  if (slainBosses >= 1) earnedCodes.push("BOSS_SLAYER");
  if (speedKill) earnedCodes.push("BOSS_SPEEDRUNNER");
  if (perfectKill) earnedCodes.push("BOSS_PERFECT");

  for (const code of earnedCodes) {
    const meta = ACHIEVEMENTS[code];
    await prisma.achievement.upsert({
      where: { childId_code: { childId, code } },
      create: { childId, code, title: meta.title, emoji: meta.emoji },
      update: {},
    });
  }
}
