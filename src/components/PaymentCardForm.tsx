"use client";

import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { addPaymentCard, type ProfileActionState } from "@/app/pai/perfil/actions";

function formatNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export default function PaymentCardForm() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [number, setNumber] = useState("");
  const [state, formAction, pending] = useActionState<ProfileActionState, FormData>(
    addPaymentCard,
    undefined
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      setNumber("");
    }
  }, [state]);

  const currentYear = new Date().getFullYear();

  const modal = open ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5 animate-fade-in"
      onClick={() => setOpen(false)}
      role="dialog"
    >
      <div
        className="bg-white rounded-kid-xl p-6 max-w-[420px] w-full animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading font-bold text-[22px] text-kid-text-strong leading-tight">
          Novo cartão
        </h3>
        <p className="font-body text-[13px] text-kid-text-muted mt-1">
          O número do cartão não é salvo. Guardamos só os 4 últimos dígitos.
        </p>

        <form action={formAction} className="mt-5 space-y-3">
          <label className="block">
            <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-kid-text-strong block mb-1.5">
              Número do cartão
            </span>
            <input
              name="number"
              required
              value={number}
              onChange={(e) => setNumber(formatNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              className="kid-input font-mono"
              inputMode="numeric"
              autoComplete="cc-number"
            />
          </label>

          <label className="block">
            <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-kid-text-strong block mb-1.5">
              Nome no cartão
            </span>
            <input
              name="holderName"
              required
              placeholder="JOSE V SANTOS"
              className="kid-input uppercase"
              autoComplete="cc-name"
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-kid-text-strong block mb-1.5">
                Mês
              </span>
              <input
                name="expiryMonth"
                type="number"
                min={1}
                max={12}
                required
                placeholder="12"
                className="kid-input"
                autoComplete="cc-exp-month"
              />
            </label>
            <label className="block">
              <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-kid-text-strong block mb-1.5">
                Ano
              </span>
              <input
                name="expiryYear"
                type="number"
                min={currentYear}
                max={currentYear + 20}
                required
                placeholder={String(currentYear + 4)}
                className="kid-input"
                autoComplete="cc-exp-year"
              />
            </label>
            <label className="block">
              <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-kid-text-strong block mb-1.5">
                Bandeira
              </span>
              <select name="brand" className="kid-input" defaultValue="">
                <option value="">Auto</option>
                <option value="VISA">Visa</option>
                <option value="MASTERCARD">Master</option>
                <option value="AMEX">Amex</option>
                <option value="ELO">Elo</option>
                <option value="HIPERCARD">Hiper</option>
              </select>
            </label>
          </div>

          {state?.error && (
            <p className="font-body font-bold text-[13px] text-kid-danger text-center">
              {state.error}
            </p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 kid-btn kid-btn-secondary !text-[14px] !min-h-[44px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 kid-btn !text-[14px] !min-h-[44px]"
            >
              {pending ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="kid-btn kid-btn-secondary kid-btn-sm w-full inline-flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Adicionar cartão
      </button>
      {mounted && modal && createPortal(modal, document.body)}
    </>
  );
}
