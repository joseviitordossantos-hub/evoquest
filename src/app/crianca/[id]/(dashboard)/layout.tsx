import CriancaSidebar from "@/components/CriancaSidebar";
import CriancaTabBar from "@/components/CriancaTabBar";

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
      <div className="flex-1 min-w-0 pb-32 lg:pb-0">{children}</div>
      <CriancaTabBar childId={childId} />
    </div>
  );
}
