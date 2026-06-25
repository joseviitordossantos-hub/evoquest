import CriancaSidebar from "@/components/CriancaSidebar";
import CriancaTabBar from "@/components/CriancaTabBar";
import ChildTopBar from "@/components/ChildTopBar";
import Footer from "@/components/Footer";

export default async function CriancaDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id: childId } = await params;

  return (
    <div className="min-h-screen bg-kid-base font-body lg:flex">
      <CriancaSidebar childId={childId} />
      <div className="flex-1 min-w-0 flex flex-col">
        <ChildTopBar childId={childId} />
        <div className="flex-1 min-w-0 pb-32 lg:pb-0 flex flex-col gap-8">
          {children}
          <Footer />
        </div>
      </div>
      <CriancaTabBar childId={childId} />
    </div>
  );
}
