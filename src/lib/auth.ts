import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentParent() {
  const email = (await cookies()).get("evoquest_session")?.value;
  if (!email) return null;
  return prisma.user.findFirst({
    where: { email, role: "PARENT" },
    include: {
      family: true,
      cards: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
    },
  });
}

export async function getCurrentParentOrThrow() {
  const parent = await getCurrentParent();
  if (!parent) throw new Error("Não autenticado");
  return parent;
}
