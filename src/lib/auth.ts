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

export async function getCurrentChild() {
  const childId = (await cookies()).get("evoquest_child_session")?.value;
  if (!childId) return null;
  return prisma.child.findUnique({ where: { id: childId } });
}

export async function getFamilyFromSession() {
  const familyId = (await cookies()).get("evoquest_family_session")?.value;
  if (!familyId) return null;
  return prisma.family.findUnique({
    where: { id: familyId },
    include: { children: true },
  });
}

export async function setChildSession(childId: string) {
  const jar = await cookies();
  jar.set("evoquest_child_session", childId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  jar.delete("evoquest_family_session");
}

export async function setFamilySession(familyId: string) {
  const jar = await cookies();
  jar.set("evoquest_family_session", familyId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
}
