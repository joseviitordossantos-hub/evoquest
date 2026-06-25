"use client";

import { useState, useActionState, useRef } from "react";
import Link from "next/link";
import EvoQuestLogo from "@/components/EvoQuestLogo";
import AppIcon from "@/components/AppIcon";
import { signIn, signInAsChild } from "./actions";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.55-.21-2.27H12v4.29h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.22-4.74 3.22-8.08z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.99 7.28-2.65l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.13a6.65 6.65 0 0 1 0-4.26V7.03H2.18a11 11 0 0 0 0 9.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#1877F2" d="M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87V12h3.33l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12z" />
    </svg>
  );
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
      {off && <line x1="3" y1="3" x2="21" y2="21" />}
    </svg>
  );
}

function PinInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const digits = value.padEnd(4, "").split("").slice(0, 4);

  const handleChange = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const arr = [...digits];
    arr[i] = char;
    const next = arr.join("").replace(/ /g, "");
    onChange(next);
    if (char && i < 3) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-[58px] h-[64px] bg-kid-base rounded-[14px] text-center font-heading font-bold text-[28px] text-kid-text-strong outline-none focus:ring-2 focus:ring-kid-violet/30 transition-shadow"
        />
      ))}
    </div>
  );
}

export default function Login() {
  const [mode, setMode] = useState<"parent" | "child">("parent");
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState("");
  const [parentState, parentAction, parentPending] = useActionState(signIn, undefined);
  const [childState, childAction, childPending] = useActionState(signInAsChild, undefined);

  return (
    <main className="min-h-screen lg:h-screen lg:overflow-hidden bg-white font-body grid lg:grid-cols-2">
      {/* ── Promo panel (escondido no mobile) ── */}
      <div className="hidden lg:block relative overflow-hidden bg-white m-4 xl:m-5 rounded-[32px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/heroes-img-login.png"
          alt="EvoQuest"
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-10 xl:p-14">
          <div
            className="flex items-center gap-2 mb-5 animate-slide-up"
            style={{ animationDelay: "300ms", animationDuration: "1100ms", animationFillMode: "backwards" }}
          >
            <AppIcon name="star" size={40} />
            <AppIcon name="star" size={52} />
            <AppIcon name="star" size={40} />
          </div>
          <h2
            className="font-heading font-black text-white text-[56px] xl:text-[68px] leading-[1.02] drop-shadow-lg animate-slide-up"
            style={{ animationDelay: "700ms", animationDuration: "1100ms", animationFillMode: "backwards" }}
          >
            Transforme esforço<br />em conquista.
          </h2>
          <p
            className="font-body font-semibold text-white/90 text-[18px] xl:text-[20px] mt-5 max-w-[540px] leading-relaxed drop-shadow animate-slide-up"
            style={{ animationDelay: "1100ms", animationDuration: "1100ms", animationFillMode: "backwards" }}
          >
            Um app para pais incentivarem hábitos saudáveis nos filhos — não pelo prêmio,
            mas pelo orgulho de conquistar.
          </p>
        </div>
      </div>

      {/* ── Formulário ── */}
      <div className="flex flex-col justify-center items-center px-5 sm:px-8 py-8 min-h-screen lg:h-screen lg:overflow-y-auto">
        <div className="w-full max-w-[400px]">
          <Link href="/" className="block w-fit mx-auto">
            <EvoQuestLogo height={40} />
          </Link>

          {/* Toggle Responsável / Criança */}
          <div className="mt-8 bg-kid-base rounded-pill p-1 flex">
            <button
              type="button"
              onClick={() => setMode("parent")}
              className={`flex-1 h-[44px] rounded-pill font-heading font-bold text-[14px] transition-all ${
                mode === "parent"
                  ? "grad-primary text-white shadow-sm"
                  : "text-kid-text-muted hover:text-kid-text-soft"
              }`}
            >
              Responsável
            </button>
            <button
              type="button"
              onClick={() => setMode("child")}
              className={`flex-1 h-[44px] rounded-pill font-heading font-bold text-[14px] transition-all ${
                mode === "child"
                  ? "grad-primary text-white shadow-sm"
                  : "text-kid-text-muted hover:text-kid-text-soft"
              }`}
            >
              Criança
            </button>
          </div>

          {mode === "parent" ? (
            <>
              <h1 className="font-heading font-black text-[34px] sm:text-[40px] leading-tight text-kid-text-strong mt-8 text-center">
                Bem-vindo de volta
              </h1>
              <p className="font-body text-[15px] text-kid-text-soft mt-2 text-center">
                Faça login na sua conta
              </p>

              <form action={parentAction} className="mt-7 space-y-4">
                <div className="bg-kid-base rounded-[14px] px-5 h-[58px] flex items-center focus-within:ring-2 focus-within:ring-kid-violet/30 transition-shadow">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Endereço de e-mail"
                    className="w-full bg-transparent outline-none font-body font-semibold text-[15px] text-kid-text-strong placeholder:text-kid-text-muted placeholder:font-normal"
                  />
                </div>

                <div className="bg-kid-base rounded-[14px] px-5 h-[58px] flex items-center gap-3 focus-within:ring-2 focus-within:ring-kid-violet/30 transition-shadow">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Senha"
                    className="flex-1 bg-transparent outline-none font-body font-semibold text-[15px] text-kid-text-strong placeholder:text-kid-text-muted placeholder:font-normal"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="text-kid-text-muted hover:text-kid-violet transition-colors shrink-0"
                  >
                    <EyeIcon off={!showPassword} />
                  </button>
                </div>

                {parentState?.error && (
                  <p className="font-body font-semibold text-[14px] text-kid-danger text-center -mb-1">
                    {parentState.error}
                  </p>
                )}

                <div className="flex justify-end">
                  <Link
                    href="/recuperar"
                    className="font-body font-semibold text-[14px] text-kid-text-soft hover:text-kid-violet transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <button type="submit" disabled={parentPending} className="kid-btn w-full !h-[56px]">
                  {parentPending ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-kid-sunk" />
                <span className="font-body font-semibold text-[13px] text-kid-text-muted whitespace-nowrap">
                  Ou entre com
                </span>
                <div className="flex-1 h-px bg-kid-sunk" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="h-[54px] rounded-[14px] border border-kid-sunk bg-white inline-flex items-center justify-center gap-2.5 font-body font-bold text-[15px] text-kid-text-strong hover:bg-kid-base transition-colors"
                >
                  <GoogleIcon /> Google
                </button>
                <button
                  type="button"
                  className="h-[54px] rounded-[14px] border border-kid-sunk bg-white inline-flex items-center justify-center gap-2.5 font-body font-bold text-[15px] text-kid-text-strong hover:bg-kid-base transition-colors"
                >
                  <FacebookIcon /> Facebook
                </button>
              </div>

              <p className="text-center mt-7 font-body font-semibold text-[14px] text-kid-text-soft">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="font-extrabold text-kid-violet hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading font-black text-[34px] sm:text-[40px] leading-tight text-kid-text-strong mt-8 text-center">
                Olá, aventureiro!
              </h1>
              <p className="font-body text-[15px] text-kid-text-soft mt-2 text-center">
                Entre com o código da sua família
              </p>

              <form action={childAction} className="mt-7 space-y-6">
                <div className="bg-kid-base rounded-[14px] px-5 h-[58px] flex items-center focus-within:ring-2 focus-within:ring-kid-violet/30 transition-shadow">
                  <input
                    type="text"
                    name="familyCode"
                    required
                    placeholder="E-mail do responsável"
                    className="w-full bg-transparent outline-none font-body font-semibold text-[15px] text-kid-text-strong placeholder:text-kid-text-muted placeholder:font-normal"
                  />
                </div>

                <div>
                  <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted text-center mb-3">
                    PIN de acesso
                  </p>
                  <PinInput value={pin} onChange={setPin} />
                  <input type="hidden" name="pin" value={pin} />
                </div>

                {childState?.error && (
                  <p className="font-body font-semibold text-[14px] text-kid-danger text-center">
                    {childState.error}
                  </p>
                )}

                <button type="submit" disabled={childPending} className="kid-btn w-full !h-[56px]">
                  {childPending ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <p className="text-center mt-7 font-body font-semibold text-[14px] text-kid-text-soft">
                Peça o código e PIN para seu responsável
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
