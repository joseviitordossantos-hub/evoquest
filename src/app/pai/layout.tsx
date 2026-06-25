import Footer from "@/components/Footer";

export default function PaiLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-kid-base pattern-dots-violet font-body flex flex-col gap-8">
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
