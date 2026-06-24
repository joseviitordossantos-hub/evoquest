"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateBoss(formData: FormData) {
  const id = String(formData.get("id"));
  const maxHp = Number(formData.get("maxHp") || 500);
  const rewardId = String(formData.get("rewardId") || "") || null;

  const boss = await prisma.monthlyBoss.findUniqueOrThrow({ where: { id } });

  const hpDiff = maxHp - boss.maxHp;
  const newCurrentHp = Math.max(0, boss.currentHp + hpDiff);

  await prisma.monthlyBoss.update({
    where: { id },
    data: {
      maxHp,
      currentHp: newCurrentHp,
      rewardId,
    },
  });

  revalidatePath("/pai");
  revalidatePath(`/crianca/${boss.childId}`);
  redirect("/pai");
}
