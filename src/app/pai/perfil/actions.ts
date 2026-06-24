"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getCurrentParentOrThrow } from "@/lib/auth";

export type ProfileActionState = { error?: string; success?: string } | undefined;

const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const ALLOWED_BRANDS = ["VISA", "MASTERCARD", "ELO", "AMEX", "HIPERCARD"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function detectBrand(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (/^4/.test(digits)) return "VISA";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "MASTERCARD";
  if (/^3[47]/.test(digits)) return "AMEX";
  if (/^6(?:011|5)/.test(digits) || /^636/.test(digits)) return "ELO";
  if (/^606282/.test(digits)) return "HIPERCARD";
  return "VISA";
}

export async function updateProfile(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parent = await getCurrentParentOrThrow();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const familyName = String(formData.get("familyName") ?? "").trim();

  if (!name) return { error: "Nome é obrigatório." };

  await prisma.user.update({
    where: { id: parent.id },
    data: { name, phone },
  });

  if (parent.familyId && familyName) {
    await prisma.family.update({
      where: { id: parent.familyId },
      data: { name: familyName },
    });
  }

  revalidatePath("/pai/perfil");
  revalidatePath("/pai");
  return { success: "Dados atualizados!" };
}

export async function uploadProfilePhoto(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parent = await getCurrentParentOrThrow();
  const file = formData.get("photo") as File | null;

  if (!file || file.size === 0) return { error: "Selecione um arquivo." };
  if (!ALLOWED_MIMES.includes(file.type)) {
    return { error: "Formato inválido. Use PNG, JPG ou WEBP." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Arquivo muito grande (máx 5MB)." };
  }

  const ext = file.type === "image/png" ? "png"
    : file.type === "image/webp" ? "webp"
    : "jpg";
  const safeId = parent.id.replace(/[^a-zA-Z0-9_-]/g, "");
  const filename = `${safeId}-${Date.now()}.${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(uploadsDir, { recursive: true });
  const filepath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const photoPath = `/uploads/avatars/${filename}`;
  await prisma.user.update({
    where: { id: parent.id },
    data: { photoPath },
  });

  revalidatePath("/pai/perfil");
  revalidatePath("/pai");
  return { success: "Foto atualizada!" };
}

export async function addPaymentCard(
  _prev: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const parent = await getCurrentParentOrThrow();
  const number = String(formData.get("number") ?? "").replace(/\D/g, "");
  const holderName = String(formData.get("holderName") ?? "").trim().toUpperCase();
  const expiryMonth = Number(formData.get("expiryMonth") ?? 0);
  const expiryYear = Number(formData.get("expiryYear") ?? 0);
  const brandRaw = String(formData.get("brand") ?? "").trim().toUpperCase();

  if (number.length < 13 || number.length > 19) {
    return { error: "Número do cartão inválido." };
  }
  if (!holderName) return { error: "Nome no cartão é obrigatório." };
  if (expiryMonth < 1 || expiryMonth > 12) {
    return { error: "Mês de expiração inválido." };
  }
  const currentYear = new Date().getFullYear();
  if (expiryYear < currentYear || expiryYear > currentYear + 20) {
    return { error: "Ano de expiração inválido." };
  }

  const brand = ALLOWED_BRANDS.includes(brandRaw) ? brandRaw : detectBrand(number);
  const last4 = number.slice(-4);
  const existingCount = await prisma.paymentCard.count({ where: { userId: parent.id } });
  const isPrimary = existingCount === 0;

  await prisma.paymentCard.create({
    data: {
      userId: parent.id,
      brand,
      last4,
      holderName,
      expiryMonth,
      expiryYear,
      isPrimary,
    },
  });

  revalidatePath("/pai/perfil");
  return { success: "Cartão adicionado!" };
}

export async function removePaymentCard(formData: FormData) {
  const parent = await getCurrentParentOrThrow();
  const id = String(formData.get("id"));
  const card = await prisma.paymentCard.findUnique({ where: { id } });
  if (!card || card.userId !== parent.id) return;

  await prisma.paymentCard.delete({ where: { id } });

  // If we removed the primary, promote the next one
  if (card.isPrimary) {
    const next = await prisma.paymentCard.findFirst({
      where: { userId: parent.id },
      orderBy: { createdAt: "asc" },
    });
    if (next) {
      await prisma.paymentCard.update({
        where: { id: next.id },
        data: { isPrimary: true },
      });
    }
  }

  revalidatePath("/pai/perfil");
}

export async function setPrimaryCard(formData: FormData) {
  const parent = await getCurrentParentOrThrow();
  const id = String(formData.get("id"));
  const card = await prisma.paymentCard.findUnique({ where: { id } });
  if (!card || card.userId !== parent.id) return;

  await prisma.$transaction([
    prisma.paymentCard.updateMany({
      where: { userId: parent.id, isPrimary: true },
      data: { isPrimary: false },
    }),
    prisma.paymentCard.update({
      where: { id },
      data: { isPrimary: true },
    }),
  ]);

  revalidatePath("/pai/perfil");
}

export async function addFunds(formData: FormData) {
  const cents = formData.get("amountCents")
    ? Number(formData.get("amountCents"))
    : Math.round(Number(formData.get("amountReais") || 0) * 100);
  if (!cents || cents <= 0) return;

  const method = String(formData.get("method") || "Pix");
  const family = await prisma.family.findFirstOrThrow();

  await prisma.$transaction([
    prisma.family.update({
      where: { id: family.id },
      data: { balanceCents: { increment: cents } },
    }),
    prisma.walletTransaction.create({
      data: {
        familyId: family.id,
        amountCents: cents,
        type: "CREDIT",
        description: `Adicionou ${(cents / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })} via ${method}`,
      },
    }),
  ]);

  revalidatePath("/pai/perfil");
  revalidatePath("/pai");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.set("evoquest_session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  redirect("/login");
}
