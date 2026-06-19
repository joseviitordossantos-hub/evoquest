import CriancaHeader from "@/components/CriancaHeader";
import CriancaTabBar from "@/components/CriancaTabBar";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";

export default async function Amigos({ params }: { params: Promise<{ id: string }> }) {
  const { id: childId } = await params;

  return (
    <main className="min-h-screen bg-kid-base pb-28 font-body">
      <CriancaHeader childId={childId} />

      <div className="max-w-[480px] mx-auto px-5 pt-4">
        <p className="kid-label mb-1">AMIGOS</p>
        <h2 className="font-heading font-bold text-2xl text-kid-text-strong mb-6">
          Sua turma
        </h2>

        <EmptyState
          emoji="star"
          title="Em breve!"
          body="Você vai poder ver amigos, comparar conquistas e competir em squads."
        />
        <Footer />
      </div>

      <CriancaTabBar childId={childId} active="amigos" />
    </main>
  );
}
