"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setChildSession, setFamilySession } from "@/lib/auth";

const DEFAULT_LOGIN = { email: "admin@evoquest.com.br", password: "evoquest1234" };
const DEFAULT_CHILD_PIN = "1234";

export type LoginState = { error?: string };

export async function signIn(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (email !== DEFAULT_LOGIN.email || password !== DEFAULT_LOGIN.password) {
    return { error: "E-mail ou senha incorretos." };
  }

  const parent = await prisma.user.findFirst({
    where: { role: "PARENT" },
    orderBy: { createdAt: "asc" },
  });
  if (!parent) {
    return { error: "Nenhum responsável cadastrado." };
  }

  const jar = await cookies();
  jar.set("evoquest_session", parent.email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/pai");
}

export async function signInAsChild(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const familyCode = String(formData.get("familyCode") ?? "").trim().toLowerCase();
  const pin = String(formData.get("pin") ?? "");

  if (!familyCode) {
    return { error: "Informe o código da família." };
  }
  if (pin !== DEFAULT_CHILD_PIN) {
    return { error: "PIN incorreto." };
  }

  const parent = await prisma.user.findFirst({
    where: { role: "PARENT" },
    include: { family: { include: { children: true } } },
    orderBy: { createdAt: "asc" },
  });

  if (!parent?.family) {
    return { error: "Família não encontrada." };
  }

  const children = parent.family.children;
  if (children.length === 0) {
    return { error: "Nenhuma criança cadastrada nesta família." };
  }

  if (children.length === 1) {
    await setChildSession(children[0].id);
    redirect(`/crianca/${children[0].id}`);
  }

  await setFamilySession(parent.family.id);
  redirect("/selecionar-perfil");
}
