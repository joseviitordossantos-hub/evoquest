import Link from "next/link";

type Tab = "home" | "recompensas" | "conquistas" | "perfil";

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function IconGift({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C9 3 12 8 12 8" />
      <path d="M16.5 8a2.5 2.5 0 0 0 0-5C15 3 12 8 12 8" />
    </svg>
  );
}

function IconTrophy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
      <path d="M12 16v2" />
      <path d="M8 21h8" />
      <path d="M12 18h0" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const TABS: { key: Tab; label: string; icon: typeof IconHome }[] = [
  { key: "home", label: "Home", icon: IconHome },
  { key: "recompensas", label: "Recompensas", icon: IconGift },
  { key: "conquistas", label: "Conquistas", icon: IconTrophy },
  { key: "perfil", label: "Perfil", icon: IconUser },
];

export default function CriancaTabBar({ childId, active }: { childId: string; active: Tab }) {
  const hrefFor = (key: Tab) => {
    switch (key) {
      case "home": return `/crianca/${childId}`;
      case "recompensas": return `/crianca/${childId}/recompensas`;
      case "conquistas": return `/crianca/${childId}/conquistas`;
      case "perfil": return `/crianca/${childId}/perfil`;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl shadow-[0_-2px_16px_rgba(123,92,255,0.08)]">
      <div className="flex items-center justify-around max-w-[480px] mx-auto px-1 py-2">
        {TABS.map((t) => {
          const isActive = active === t.key;
          const Icon = t.icon;
          return (
            <Link
              key={t.key}
              href={hrefFor(t.key)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2.5 py-2 rounded-2xl transition-all ${
                isActive
                  ? "grad-primary text-white"
                  : "text-kid-text-muted hover:text-kid-violet hover:-translate-y-0.5"
              }`}
            >
              <Icon className="w-[20px] h-[20px]" />
              <span className="font-body font-extrabold text-[10px] tracking-[0.04em] mt-0.5">
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
