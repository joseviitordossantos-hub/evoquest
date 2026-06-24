"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TABS, hrefFor, deriveActiveTab } from "@/components/crianca/nav";

export default function CriancaTabBar({ childId }: { childId: string }) {
  const active = deriveActiveTab(usePathname() ?? "", childId);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/90 backdrop-blur-xl shadow-[0_-2px_16px_rgba(123,92,255,0.08)]">
      <div
        className="flex items-center justify-around max-w-[480px] mx-auto px-2 pt-2"
        style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}
      >
        {TABS.map((t) => {
          const isActive = active === t.key;
          const Icon = t.icon;
          return (
            <Link
              key={t.key}
              href={hrefFor(childId, t.key)}
              aria-label={t.label}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center justify-center h-12 rounded-full transition-all duration-300 ease-[cubic-bezier(.2,.8,.3,1)] kid-tappable ${
                isActive
                  ? "grad-primary text-white px-5"
                  : "text-kid-text-muted hover:text-kid-violet hover:-translate-y-0.5 px-3"
              }`}
            >
              <Icon className={`w-[22px] h-[22px] shrink-0 ${isActive ? "animate-pop" : ""}`} />
              {isActive && (
                <span className="tab-label font-body font-extrabold text-[13px] tracking-[0.02em]">
                  {t.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
