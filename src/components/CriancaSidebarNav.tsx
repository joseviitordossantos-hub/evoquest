"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_MAIN, SIDEBAR_FOOTER, hrefFor, deriveActiveTab, type Tab } from "@/components/crianca/nav";

function NavItem({
  childId,
  tab,
  active,
}: {
  childId: string;
  tab: (typeof SIDEBAR_MAIN)[number];
  active: Tab;
}) {
  const Icon = tab.icon;
  const isActive = active === tab.key;
  return (
    <Link
      href={hrefFor(childId, tab.key)}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 pl-6 pr-3 h-[52px] rounded-pill font-body font-extrabold text-[17px] transition-all duration-300 ease-[cubic-bezier(.2,.8,.3,1)] kid-tappable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kid-violet/40 ${
        isActive
          ? "bg-[#B04CFF] text-white"
          : "text-kid-text-soft hover:bg-kid-tint-violet/60 hover:-translate-y-0.5"
      }`}
    >
      <Icon className={`w-[24px] h-[24px] shrink-0 ${isActive ? "animate-pop" : ""}`} />
      {tab.label}
    </Link>
  );
}

export default function CriancaSidebarNav({ childId }: { childId: string }) {
  const active = deriveActiveTab(usePathname() ?? "", childId);

  return (
    <nav className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col gap-2">
        {SIDEBAR_MAIN.map((t) => (
          <NavItem key={t.key} childId={childId} tab={t} active={active} />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <div className="kid-divider mb-2" />
        {SIDEBAR_FOOTER.map((t) => (
          <NavItem key={t.key} childId={childId} tab={t} active={active} />
        ))}
      </div>
    </nav>
  );
}
