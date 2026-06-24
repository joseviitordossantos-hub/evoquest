import Link from "next/link";
import EvoQuestLogo from "@/components/EvoQuestLogo";
import CriancaSidebarNav from "@/components/CriancaSidebarNav";

export default async function CriancaSidebar({ childId }: { childId: string }) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[300px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen bg-white border-r border-kid-sunk/60 px-6 py-7">
      <Link
        href={`/crianca/${childId}`}
        className="px-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kid-violet/40 rounded-kid-md"
        aria-label="EvoQuest"
      >
        <EvoQuestLogo height={34} />
      </Link>

      <div className="kid-divider mt-6 mb-6" />

      <CriancaSidebarNav childId={childId} />
    </aside>
  );
}
