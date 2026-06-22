"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AppIcon from "@/components/AppIcon";
import type { Notif } from "@/lib/parentNotifications";

const TINT_CLS: Record<Notif["tint"], string> = {
  gold: "bg-kid-tint-gold text-kid-on-gold",
  teal: "bg-kid-tint-teal text-kid-on-teal",
  pink: "bg-kid-tint-pink text-kid-on-pink",
  violet: "bg-kid-tint-violet text-kid-on-violet",
  orange: "bg-kid-tint-orange text-kid-on-orange",
};

function relativeTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h}h`;
  const days = Math.floor(h / 24);
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  return d.toLocaleDateString("pt-BR");
}

export default function ParentNotificationsBell({ items }: { items: Notif[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const actionableCount = items.filter((i) => i.actionable).length;
  const total = items.length;

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          open ? "grad-primary text-white" : "bg-kid-tint-violet text-kid-on-violet hover:bg-kid-sunk"
        }`}
        aria-label={`Notificações${actionableCount ? ` (${actionableCount} pendentes)` : ""}`}
        aria-expanded={open}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {actionableCount > 0 && (
          <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-kid-danger text-white font-body font-extrabold text-[10px] leading-none flex items-center justify-center ring-2 ring-white">
            {actionableCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-kid-xl shadow-[0_12px_40px_rgba(60,35,160,0.18)] overflow-hidden z-50"
          style={{ maxHeight: "min(560px, calc(100vh - 120px))" }}
          role="dialog"
        >
          <div className="px-4 py-3 border-b border-kid-sunk flex items-center justify-between">
            <div>
              <p className="kid-label">NOTIFICAÇÕES</p>
              <h3 className="font-heading font-bold text-[16px] text-kid-text-strong leading-tight">
                Atividade recente
              </h3>
            </div>
            {actionableCount > 0 && (
              <span className="kid-chip kid-chip-pink !text-[10px]">
                {actionableCount} pendente{actionableCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "calc(min(560px, 100vh - 120px) - 70px)" }}>
            {total === 0 ? (
              <p className="font-body text-[13px] text-kid-text-muted p-6 text-center">
                Sem atividade recente.
              </p>
            ) : (
              <ul className="p-2 space-y-1">
                {items.map((n) => {
                  const Row = (
                    <div
                      className={`flex items-start gap-3 rounded-[10px] p-2.5 ${
                        n.actionable ? "bg-kid-base hover:bg-kid-sunk transition-colors" : "hover:bg-kid-base/60"
                      }`}
                    >
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${TINT_CLS[n.tint]}`}>
                        <AppIcon name={n.icon} size={18} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[13px] text-kid-text-strong leading-snug">
                          <span className="font-extrabold">{n.childName}</span>{" "}
                          <span className="text-kid-text-soft">{n.detail}</span>
                        </p>
                        <p className="font-body font-bold text-[12px] text-kid-text-strong truncate">
                          {n.title}
                        </p>
                        <p className="font-body font-extrabold text-[9px] uppercase tracking-[0.1em] text-kid-text-muted mt-0.5">
                          {relativeTime(n.at)}
                        </p>
                      </div>
                      {n.actionable && (
                        <span className="text-kid-text-muted self-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </span>
                      )}
                    </div>
                  );
                  return (
                    <li key={n.id}>
                      {n.href ? (
                        <Link href={n.href} onClick={() => setOpen(false)} className="block">
                          {Row}
                        </Link>
                      ) : (
                        Row
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
