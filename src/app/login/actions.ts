"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Credencial fixa do protótipo (responsável principal).
const PRIMARY = { email: "jose.vitor@evoquest.com.br", password: "jose 1234" };

// Login de teste rápido (apenas protótipo). Resolve dinamicamente para o
// primeiro responsável cadastrado, funcionando em qualquer ambiente.
const TEST = { email: "admin", password: "admin" };

export type LoginState = { error?: string };

export async function signIn(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  let sessionEmail: string | null = null;

  if (email === PRIMARY.email && password === PRIMARY.password) {
    sessionEmail = PRIMARY.email;
  } else if (email === TEST.email && password === TEST.password) {
    const parent = await prisma.user.findFirst({
      where: { role: "PARENT" },
      orderBy: { createdAt: "asc" },
    });
    if (!parent) {
      return { error: "Nenhum responsável cadastrado para o login de teste." };
    }
    sessionEmail = parent.email;
  }

  if (!sessionEmail) {
    return { error: "E-mail ou senha incorretos." };
  }

  const jar = await cookies();
  jar.set("evoquest_session", sessionEmail, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  redirect("/pai");
}
