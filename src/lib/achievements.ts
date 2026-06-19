import { prisma } from "./prisma";
import { ACHIEVEMENTS } from "./enums";

export async function evaluateAchievements(childId: string) {
  const [logs, streak, xpEvents] = await Promise.all([
    prisma.missionLog.findMany({ where: { childId, status: "APPROVED" }, include: { mission: true } }),
    prisma.streak.findUnique({ where: { childId } }),
    prisma.xpEvent.findMany({ where: { childId } }),
  ]);

  const totalXp = xpEvents.reduce((s, e) => s + e.amount, 0);
  const level = Math.floor(totalXp / 100) + 1;
  const approvedCount = logs.length;
  const bossCompleted = logs.some((l) => l.mission.difficulty === "BOSS");
  const longest = streak?.longestDays ?? 0;

  const earnedCodes: string[] = [];
  if (approvedCount >= 1) earnedCodes.push("FIRST_MISSION");
  if (approvedCount >= 10) earnedCodes.push("TEN_MISSIONS");
  if (approvedCount >= 30) earnedCodes.push("THIRTY_MISSIONS");
  if (longest >= 7) earnedCodes.push("STREAK_7");
  if (longest >= 30) earnedCodes.push("STREAK_30");
  if (bossCompleted) earnedCodes.push("BOSS_HUNTER");
  if (level >= 5) earnedCodes.push("LEVEL_5");
  if (level >= 10) earnedCodes.push("LEVEL_10");

  for (const code of earnedCodes) {
    const meta = ACHIEVEMENTS[code];
    await prisma.achievement.upsert({
      where: { childId_code: { childId, code } },
      create: { childId, code, title: meta.title, emoji: meta.emoji },
      update: {},
    });
  }
}
