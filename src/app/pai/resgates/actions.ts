"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/enums";

export async function approveRedemption(formData: FormData) {
  const id = String(formData.get("id"));
  await prisma.redemption.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath("/pai/resgates");
  revalidatePath("/pai");
}

export async function rejectRedemption(formData: FormData) {
  const id = String(formData.get("id"));
  const r = await prisma.redemption.findUniqueOrThrow({ where: { id } });
  // Devolve XP à criança
  await prisma.$transaction([
    prisma.redemption.update({ where: { id }, data: { status: "REJECTED" } }),
    prisma.xpEvent.create({ data: { childId: r.childId, amount: r.xpSpent, reason: `refund:${id}` } }),
  ]);
  revalidatePath("/pai/resgates");
  revalidatePath("/pai");
}

export async function deliverRedemption(formData: FormData) {
  const id = String(formData.get("id"));
  const deliveryCode = String(formData.get("deliveryCode") || "");
  const r = await prisma.redemption.findUniqueOrThrow({ where: { id }, include: { reward: true, child: true } });

  const ops: any[] = [
    prisma.redemption.update({
      where: { id },
      data: { status: "DELIVERED", deliveredAt: new Date(), deliveryCode: deliveryCode || null, costCentsPaid: r.reward.costCents },
    }),
  ];

  if (r.reward.costCents > 0) {
    ops.push(
      prisma.family.update({
        where: { id: r.child.familyId },
        data: { balanceCents: { decrement: r.reward.costCents } },
      }),
      prisma.walletTransaction.create({
        data: {
          familyId: r.child.familyId,
          amountCents: -r.reward.costCents,
          type: "DEBIT_REDEMPTION",
          description: `Resgate: ${r.reward.title} (${r.child.displayName})`,
        },
      })
    );
  }

  await prisma.$transaction(ops);

  revalidatePath("/pai/resgates");
  revalidatePath("/pai");
  revalidatePath("/pai/carteira");
}
