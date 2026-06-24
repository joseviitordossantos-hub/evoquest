export type Tab = "home" | "recompensas" | "conquistas" | "perfil";

export function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

export function IconGift({ className }: { className?: string }) {
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

export function IconTrophy({ className }: { className?: string }) {
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

export function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export const TABS: { key: Tab; label: string; icon: typeof IconHome }[] = [
  { key: "home", label: "Home", icon: IconHome },
  { key: "recompensas", label: "Recompensas", icon: IconGift },
  { key: "conquistas", label: "Conquistas", icon: IconTrophy },
  { key: "perfil", label: "Perfil", icon: IconUser },
];

export function hrefFor(childId: string, key: Tab): string {
  switch (key) {
    case "home": return `/crianca/${childId}`;
    case "recompensas": return `/crianca/${childId}/recompensas`;
    case "conquistas": return `/crianca/${childId}/conquistas`;
    case "perfil": return `/crianca/${childId}/perfil`;
  }
}

export function deriveActiveTab(pathname: string, childId: string): Tab {
  const base = `/crianca/${childId}`;
  if (pathname === base || pathname === `${base}/`) return "home";
  if (pathname.startsWith(`${base}/recompensas`)) return "recompensas";
  if (pathname.startsWith(`${base}/conquistas`)) return "conquistas";
  if (pathname.startsWith(`${base}/perfil`)) return "perfil";
  return "home";
}
