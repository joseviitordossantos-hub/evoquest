"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getFamilyFromSession, setChildSession } from "@/lib/auth";

export async function selectProfile(formData: FormData) {
  const childId = String(formData.get("childId") ?? "");
  const family = await getFamilyFromSession();

  if (!family) redirect("/login");

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || child.familyId !== family.id) redirect("/login");

  await setChildSession(childId);
  redirect(`/crianca/${childId}`);
}
