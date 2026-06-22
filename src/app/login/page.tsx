import Link from "next/link";
import EvoQuestLogo from "@/components/EvoQuestLogo";
import AppIcon from "@/components/AppIcon";

export default function Login() {
  return (
    <main className="min-h-screen bg-kid-base font-body flex flex-col">
      <nav className="bg-white/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/"><EvoQuestLogo height={36} /></Link>
          <Link href="/cadastro" className="font-body font-extrabold text-[13px] text-kid-violet hover:underline">
            Criar conta →
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[440px]">
          <div className="text-center mb-8">
            <span className="kid-chip kid-chip-violet inline-flex items-center gap-1">
              <AppIcon name="star" size={14} /> RESPONSÁVEL
            </span>
            <h1 className="font-heading font-bold text-[36px] leading-tight text-kid-text-strong mt-3">
              Entrar na conta
            </h1>
            <p className="font-body text-[15px] text-kid-text-soft mt-2">
              Acesse o painel da família.
            </p>
          </div>

          <form action="/pai" className="bg-white rounded-kid-xl p-6 space-y-4">
            <div>
              <label className="block font-body font-extrabold text-[11px] uppercase tracking-[0.12em] text-kid-text-muted mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="voce@email.com"
                className="w-full p-3 bg-kid-base rounded-[10px] font-body font-bold text-[15px] text-kid-text-strong outline-none focus:ring-2 focus:ring-kid-violet/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-body font-extrabold text-[11px] uppercase tracking-[0.12em] text-kid-text-muted">
                  Senha
                </label>
                <Link href="/recuperar" className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-violet hover:underline">
                  Esqueci
                </Link>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full p-3 bg-kid-base rounded-[10px] font-body font-bold text-[15px] text-kid-text-strong outline-none focus:ring-2 focus:ring-kid-violet/30"
              />
            </div>

            <label className="flex items-center gap-2 font-body font-bold text-[13px] text-kid-text-body cursor-pointer">
              <input type="checkbox" name="remember" defaultChecked className="w-4 h-4 accent-kid-violet" />
              Lembrar de mim neste dispositivo
            </label>

            <button type="submit" className="kid-btn w-full">
              Entrar
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-kid-sunk" />
            <span className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-kid-text-muted">
              ou continue com
            </span>
            <div className="flex-1 h-px bg-kid-sunk" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="kid-btn-secondary !min-h-[48px] !text-[14px]">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.55-.21-2.27H12v4.29h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.22-4.74 3.22-8.08z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.99 7.28-2.65l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.13a6.65 6.65 0 0 1 0-4.26V7.03H2.18a11 11 0 0 0 0 9.94l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" /></svg>
              Google
            </button>
            <button type="button" className="kid-btn-secondary !min-h-[48px] !text-[14px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
              Apple
            </button>
          </div>

          <p className="text-center mt-6 font-body text-[14px] text-kid-text-body">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-extrabold text-kid-violet hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
