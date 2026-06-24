"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AppIcon from "@/components/AppIcon";

interface NavItem {
  href: string;
  label: string;
  key: string;
  icon: string;
}

interface QuickAction {
  href: string;
  label: string;
  icon: string;
}

interface ChildInfo {
  id: string;
  name: string;
  avatarSeed: string;
}

const AVATAR_MAP: Record<string, string> = {
  lila: "/avatar-girl.png",
  theo: "/avatar-boy.png",
};

const ICONS: Record<string, React.ReactNode> = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5" height="5" rx="1" /><rect x="11" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="11" width="5" height="5" rx="1" /><rect x="11" y="11" width="5" height="5" rx="1" />
    </svg>
  ),
  gift: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="14" height="8" rx="1" /><rect x="1" y="5" width="16" height="3" rx="1" />
      <line x1="9" y1="5" x2="9" y2="16" /><path d="M9 5C9 3 7.5 2 6 2s-2 1.5 0 3h3z" /><path d="M9 5c0-2 1.5-3 3-3s2 1.5 0 3H9z" />
    </svg>
  ),
  inbox: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10l3-7h8l3 7" /><path d="M2 10v5a1 1 0 001 1h12a1 1 0 001-1v-5H12l-1.5 2h-3L6 10H2z" />
    </svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="14" height="12" rx="2" /><path d="M2 8h14" /><circle cx="13" cy="11" r="1" fill="currentColor" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="9" y1="3" x2="9" y2="15" /><line x1="3" y1="9" x2="15" y2="9" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2l2.1 4.3 4.9.7-3.5 3.4.8 4.8L9 13l-4.3 2.2.8-4.8L2 7l4.9-.7z" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,10 7,14 15,4" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="6" r="3" />
      <path d="M3 16c1-3.5 3.5-5 6-5s5 1.5 6 5" />
    </svg>
  ),
};

export default function PaiNavMenu({
  items,
  active,
  balance,
  quickActions,
  children,
}: {
  items: NavItem[];
  active?: string;
  balance: string;
  quickActions: QuickAction[];
  children: ChildInfo[];
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-kid-md bg-kid-sunk flex items-center justify-center transition-colors hover:bg-kid-tint-violet"
        aria-label="Menu"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="5" x2="17" y2="5" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="15" x2="17" y2="15" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed left-0 right-0 top-[69px] bg-white shadow-[0_12px_40px_rgba(123,92,255,0.12)] z-50 overflow-y-auto max-h-[calc(100vh-69px)]">
          {/* Balance */}
          <Link
            href="/pai/perfil"
            className="flex items-center justify-between px-5 py-4 bg-kid-tint-teal/40"
          >
            <span className="font-body font-extrabold text-[13px] uppercase tracking-[0.06em] text-kid-on-teal">Saldo da carteira</span>
            <span className="font-heading font-bold text-xl text-kid-on-teal inline-flex items-center gap-1"><AppIcon name="coin" size={20} /> {balance}</span>
          </Link>

          {/* Nav items */}
          <div className="py-2">
            {items.map((it) => (
              <Link
                key={it.key}
                href={it.href}
                className={`flex items-center gap-3 px-5 py-3.5 font-body font-extrabold text-[14px] uppercase tracking-[0.04em] transition-colors ${
                  active === it.key
                    ? "grad-primary text-white"
                    : "text-kid-text-body hover:bg-kid-tint-violet/50"
                }`}
              >
                <span className={active === it.key ? "text-white/80" : "text-kid-text-muted"}>{ICONS[it.icon]}</span>
                {it.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-kid-sunk" />

          {/* Quick actions */}
          <div className="py-2">
            <p className="px-5 py-2 font-body font-extrabold text-[11px] uppercase tracking-[0.12em] text-kid-text-muted">
              Ações rápidas
            </p>
            {quickActions.map((qa) => (
              <Link
                key={qa.href}
                href={qa.href}
                className="flex items-center gap-3 px-5 py-3 font-body font-bold text-[14px] text-kid-text-body hover:bg-kid-tint-violet/50 transition-colors"
              >
                <span className="w-8 h-8 rounded-kid-md bg-kid-tint-violet flex items-center justify-center text-kid-on-violet">
                  {ICONS[qa.icon]}
                </span>
                {qa.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-kid-sunk" />

          {/* Children quick switch */}
          <div className="py-2 pb-4">
            <p className="px-5 py-2 font-body font-extrabold text-[11px] uppercase tracking-[0.12em] text-kid-text-muted">
              Ver como criança
            </p>
            <div className="flex gap-3 px-5 pt-1">
              {children.map((c) => (
                <Link
                  key={c.id}
                  href={`/crianca/${c.id}`}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  {AVATAR_MAP[c.avatarSeed] ? (
                    <Image
                      src={AVATAR_MAP[c.avatarSeed]}
                      alt={c.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-kid-sunk group-hover:ring-kid-primary transition-all"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full grad-primary flex items-center justify-center font-heading font-bold text-lg text-white">
                      {c.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-body font-bold text-[12px] text-kid-text-body">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
