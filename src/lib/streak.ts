import { prisma } from "./prisma";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function daysBetween(a: Date, b: Date) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((db.getTime() - da.getTime()) / ONE_DAY_MS);
}

export async function touchStreak(childId: string, today = new Date()) {
  const streak = await prisma.streak.findUniqueOrThrow({ where: { childId } });
  const last = streak.lastActiveDate;

  if (!last) {
    return prisma.streak.update({
      where: { childId },
      data: { currentDays: 1, longestDays: Math.max(1, streak.longestDays), lastActiveDate: today },
    });
  }
  if (sameDay(last, today)) return streak;

  const gap = daysBetween(last, today);

  if (gap === 1) {
    const next = streak.currentDays + 1;
    return prisma.streak.update({
      where: { childId },
      data: { currentDays: next, longestDays: Math.max(next, streak.longestDays), lastActiveDate: today },
    });
  }

  // gap > 1: tenta gastar freeze automaticamente (1 freeze = 1 dia perdoado)
  const missed = gap - 1;
  if (missed <= streak.freezesAvailable) {
    const next = streak.currentDays + 1;
    return prisma.streak.update({
      where: { childId },
      data: {
        currentDays: next,
        longestDays: Math.max(next, streak.longestDays),
        lastActiveDate: today,
        freezesAvailable: streak.freezesAvailable - missed,
        freezesUsedThisMonth: streak.freezesUsedThisMonth + missed,
      },
    });
  }

  // streak quebrou
  return prisma.streak.update({
    where: { childId },
    data: { currentDays: 1, lastActiveDate: today },
  });
}
