import Link from "next/link";
import { getChildStats } from "@/lib/childStats";
import EvoQuestLogo from "@/components/EvoQuestLogo";
import AvatarRing from "@/components/AvatarRing";
import CoinPill from "@/components/CoinPill";
import CriancaSidebarNav from "@/components/CriancaSidebarNav";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

export default async function CriancaSidebar({ childId }: { childId: string }) {
  const { child, level, availableCoins, rank } = await getChildStats(childId);
  const avatarSrc = AVATAR_MAP[child.avatarSeed] ?? null;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[260px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen bg-white border-r border-kid-sunk/50 px-4 py-6">
      <Link
        href={`/crianca/${childId}`}
        className="px-2 mb-8 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kid-violet/40 rounded-kid-md"
        aria-label="EvoQuest"
      >
        <EvoQuestLogo height={32} />
      </Link>

      <CriancaSidebarNav childId={childId} />

      <div className="mt-auto space-y-4">
        <div className="grad-header rounded-kid-xl p-4 relative overflow-hidden text-white">
          <div className="pattern-dots-light absolute inset-0 opacity-60 rounded-kid-xl" />
          <p className="relative font-heading font-bold text-[15px] leading-tight">
            Continue jogando! 🚀
          </p>
          <p className="relative font-body font-semibold text-[12px] text-white/85 mt-1 leading-snug">
            Complete missões para ganhar XP e subir de nível.
          </p>
        </div>

        <div className="kid-card p-3 flex items-center gap-3">
          <AvatarRing
            src={avatarSrc}
            alt={child.displayName}
            fallback={child.displayName.charAt(0)}
            badge={rank.badge}
            gradFrom={rank.color}
            gradTo={rank.bgColor}
          />
          <div className="min-w-0 flex-1">
            <p className="font-heading font-bold text-[15px] text-kid-text-strong truncate leading-tight">
              {child.displayName}
            </p>
            <p className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-text-muted mt-0.5">
              Nível {level}
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <CoinPill childId={childId} amount={availableCoins} />
        </div>
      </div>
    </aside>
  );
}
