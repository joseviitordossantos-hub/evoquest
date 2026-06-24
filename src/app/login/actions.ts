"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Login padrão do protótipo. Resolve dinamicamente para o primeiro responsável
// cadastrado no banco, funcionando em qualquer ambiente (dev/prod).
const DEFAULT_LOGIN = { email: "admin@evoquest.com.br", password: "evoquest1234" };

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
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  redirect("/pai");
}
