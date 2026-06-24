"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS, hrefFor, deriveActiveTab } from "@/components/crianca/nav";

export default function CriancaSidebarNav({ childId }: { childId: string }) {
  const active = deriveActiveTab(usePathname() ?? "", childId);

  return (
    <nav className="flex flex-col gap-1.5">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.key;
        return (
          <Link
            key={t.key}
            href={hrefFor(childId, t.key)}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 px-4 h-12 rounded-pill font-body font-extrabold text-[14px] transition-all duration-300 ease-[cubic-bezier(.2,.8,.3,1)] kid-tappable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kid-violet/40 ${
              isActive
                ? "grad-primary text-white"
                : "text-kid-text-body hover:bg-kid-tint-violet hover:-translate-y-0.5"
            }`}
          >
            <Icon className={`w-[22px] h-[22px] shrink-0 ${isActive ? "animate-pop" : ""}`} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
