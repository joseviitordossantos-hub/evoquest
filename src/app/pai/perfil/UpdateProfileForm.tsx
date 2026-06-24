"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileActionState } from "./actions";

export default function UpdateProfileForm({
  name,
  email,
  phone,
  familyName,
}: {
  name: string;
  email: string;
  phone: string | null;
  familyName: string;
}) {
  const [state, formAction, pending] = useActionState<ProfileActionState, FormData>(
    updateProfile,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Nome">
        <input
          name="name"
          required
          defaultValue={name}
          className="kid-input"
          placeholder="Seu nome"
        />
      </Field>

      <Field label="E-mail">
        <div className="relative">
          <input
            value={email}
            readOnly
            className="kid-input opacity-70 pr-24"
          />
          <span
            className="absolute right-2.5 top-1/2 -translate-y-1/2 kid-chip !text-[10px] !px-2 !py-0.5"
            style={{ background: "#B8EDE3", color: "#0D7D6C" }}
          >
            Verificado
          </span>
        </div>
      </Field>

      <Field label="Telefone">
        <input
          name="phone"
          type="tel"
          defaultValue={phone ?? ""}
          placeholder="(11) 99999-9999"
          className="kid-input"
        />
      </Field>

      {familyName && (
        <Field label="Nome da família">
          <input
            name="familyName"
            defaultValue={familyName}
            className="kid-input"
            placeholder="Família Silva"
          />
        </Field>
      )}

      {state?.error && (
        <p className="font-body font-bold text-[13px] text-kid-danger">{state.error}</p>
      )}
      {state?.success && (
        <p className="font-body font-bold text-[13px] text-kid-success">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="kid-btn kid-btn-sm !min-h-[44px] !px-6"
      >
        {pending ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-kid-text-strong block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
