import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

function IconCaretDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default async function ChildTopBar({ childId }: { childId: string }) {
  const child = await prisma.child.findUniqueOrThrow({
    where: { id: childId },
    select: { displayName: true, avatarSeed: true },
  });
  const avatarSrc = AVATAR_MAP[child.avatarSeed] ?? null;
  const firstName = child.displayName.split(" ")[0];

  return (
    <header className="hidden lg:flex items-center justify-end gap-3 h-[88px] px-8 bg-white border-b border-kid-sunk/60">
      <button
        type="button"
        aria-label="Notificações"
        className="w-[43px] h-[43px] rounded-full bg-kid-tint-violet text-kid-on-violet flex items-center justify-center transition-transform hover:-translate-y-0.5 kid-tappable"
      >
        <IconBell className="w-[22px] h-[22px]" />
      </button>

      <Link
        href={`/crianca/${childId}/perfil`}
        className="flex items-center gap-2 bg-kid-tint-violet rounded-pill pl-2 pr-3 py-2 transition-transform hover:-translate-y-0.5 kid-tappable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kid-violet/40"
      >
        <span className="w-7 h-7 rounded-full overflow-hidden bg-white/70 shrink-0 flex items-center justify-center">
          {avatarSrc ? (
            <Image src={avatarSrc} alt={child.displayName} width={28} height={28} className="object-cover w-full h-full" />
          ) : (
            <span className="font-heading font-bold text-[13px] text-kid-on-violet">{firstName.charAt(0)}</span>
          )}
        </span>
        <span className="font-body font-extrabold text-[15px] text-kid-text-strong whitespace-nowrap">
          Olá, {firstName}!
        </span>
        <IconCaretDown className="w-3 h-3 text-kid-text-strong" />
      </Link>
    </header>
  );
}
