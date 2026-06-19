"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { touchStreak } from "@/lib/streak";

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
