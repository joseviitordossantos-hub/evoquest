import EvoQuestLogo from "@/components/EvoQuestLogo";
import AppIcon from "@/components/AppIcon";

export default function Footer() {
  return (
    <footer className="pt-10 pb-6 text-center space-y-3 px-4">
      <div className="flex justify-center">
        <EvoQuestLogo height={24} />
      </div>
      <p className="font-body font-bold text-[12px] text-kid-text-muted">
        Transformando o aprendizado em evolução constante
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-text-muted">Suporte</span>
        <span className="font-body text-[11px] text-kid-text-muted">·</span>
        <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-text-muted">Termos de uso</span>
        <span className="font-body text-[11px] text-kid-text-muted">·</span>
        <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-text-muted">Privacidade</span>
      </div>
      <p className="font-body font-bold text-[11px] text-kid-text-muted pt-1 flex items-center justify-center gap-1">
        Feito com <AppIcon name="heart" size={14} /> por EvoQuest
      </p>
    </footer>
  );
}
