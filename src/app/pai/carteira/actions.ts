"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addFunds(formData: FormData) {
  const cents = formData.get("amountCents")
    ? Number(formData.get("amountCents"))
    : Math.round(Number(formData.get("amountReais") || 0) * 100);
  if (!cents || cents <= 0) return;

  const method = String(formData.get("method") || "Pix");
  const family = await prisma.family.findFirstOrThrow();

  await prisma.$transaction([
    prisma.family.update({ where: { id: family.id }, data: { balanceCents: { increment: cents } } }),
    prisma.walletTransaction.create({
      data: { familyId: family.id, amountCents: cents, type: "CREDIT", description: `Adicionou ${(cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} via ${method}` },
    }),
  ]);

  revalidatePath("/pai/carteira");
  revalidatePath("/pai");
  redirect("/pai/carteira");
}
