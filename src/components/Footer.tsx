import EvoQuestLogo from "@/components/EvoQuestLogo";
import AppIcon from "@/components/AppIcon";

export default function Footer() {
  return (
    <footer className="pt-8 pb-4 text-center space-y-2">
      <div className="flex justify-center">
        <EvoQuestLogo height={24} />
      </div>
      <p className="font-body font-bold text-[12px] text-kid-text-muted max-w-[280px] mx-auto">
        Transformando o aprendizado em evolução constante
      </p>
      <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-text-muted mt-3">
        Suporte · Termos de uso · Privacidade
      </p>
      <p className="font-body font-bold text-[11px] text-kid-text-muted pt-2 inline-flex items-center gap-1">
        Feito com <AppIcon name="heart" size={14} /> por EvoQuest
      </p>
    </footer>
  );
}
