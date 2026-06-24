"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fmtBRL } from "@/lib/enums";

export default function BuyRewardButton({
  rewardId,
  title,
  costCents,
  action,
}: {
  rewardId: string;
  title: string;
  costCents: number;
  action: (formData: FormData) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const modal = open ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5 animate-fade-in"
      onClick={() => setOpen(false)}
      role="dialog"
    >
      <div
        className="bg-white rounded-kid-xl p-6 max-w-[380px] w-full text-center animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading font-bold text-[20px] text-kid-text-strong leading-tight">
          Confirmar compra
        </h3>
        <p className="font-body text-[14px] text-kid-text-body mt-3">
          Você vai debitar <strong>{fmtBRL(costCents)}</strong> da carteira da família para adicionar{" "}
          <strong>{title}</strong> ao seu estoque.
        </p>
        <p className="font-body text-[12px] text-kid-text-muted mt-2">
          Depois você pode vincular este item a uma missão como prêmio.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 kid-btn kid-btn-secondary !text-[14px] !min-h-[44px]"
          >
            Cancelar
          </button>
          <form action={action} className="flex-1">
            <input type="hidden" name="id" value={rewardId} />
            <button className="kid-btn !text-[14px] !min-h-[44px] w-full">
              Confirmar
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="kid-btn kid-btn-sm kid-flat flex-1 !text-[12px] !min-h-[36px] !px-3 inline-flex items-center justify-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Comprar
      </button>

      {mounted && modal && createPortal(modal, document.body)}
    </>
  );
}
