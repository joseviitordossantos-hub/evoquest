"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Credenciais do protótipo. Cada par resolve para o e-mail de um responsável
// existente no banco — esse e-mail é o que fica guardado na sessão.
const CREDENTIALS: { email: string; password: string; sessionEmail: string }[] = [
  {
    email: "jose.vitor@evoquest.com.br",
    password: "jose 1234",
    sessionEmail: "jose.vitor@evoquest.com.br",
  },
  // Login de teste rápido (apenas protótipo)
  {
    email: "admin",
    password: "admin",
    sessionEmail: "jose.vitor@evoquest.com.br",
  },
];

export type LoginState = { error?: string };

export async function signIn(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const match = CREDENTIALS.find(
    (c) => c.email === email && c.password === password
  );

  if (!match) {
    return { error: "E-mail ou senha incorretos." };
  }

  const jar = await cookies();
  jar.set("evoquest_session", match.sessionEmail, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  redirect("/pai");
}
