import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesCrianca() {
  return (
    <div className="max-w-[480px] mx-auto px-5 pt-5 space-y-4 lg:max-w-5xl lg:px-8 lg:pt-8">
      <header className="px-1">
        <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-muted">
          Conta
        </p>
        <h1 className="font-heading font-bold text-[24px] text-kid-text-strong leading-tight mt-1">
          Configurações
        </h1>
      </header>

      <EmptyState
        emoji="brain"
        title="Em breve"
        body="Preferências de conta, notificações e privacidade vão aparecer aqui."
      />
      <Footer />
    </div>
  );
}
