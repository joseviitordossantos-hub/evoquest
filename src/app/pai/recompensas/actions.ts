"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleRewardActive(formData: FormData) {
  const id = String(formData.get("id"));
  const r = await prisma.reward.findUniqueOrThrow({ where: { id } });
  await prisma.reward.update({ where: { id }, data: { active: !r.active } });
  revalidatePath("/pai/recompensas");
}

export async function createReward(formData: FormData) {
  const family = await prisma.family.findFirstOrThrow();
  await prisma.reward.create({
    data: {
      familyId: family.id,
      title: String(formData.get("title")),
      description: String(formData.get("description") || "") || null,
      emoji: String(formData.get("emoji") || "🎁"),
      kind: String(formData.get("kind") || "PRIVILEGE"),
      provider: String(formData.get("provider") || "") || null,
      coinsCost: Number(formData.get("coinsCost") || 10),
      costCents: Math.round(Number(formData.get("costReais") || 0) * 100),
      featured: formData.get("featured") === "on",
    },
  });
  redirect("/pai/recompensas");
}
