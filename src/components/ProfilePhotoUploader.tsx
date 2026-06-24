"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { uploadProfilePhoto, type ProfileActionState } from "@/app/pai/perfil/actions";

export default function ProfilePhotoUploader({
  photoPath,
  name,
}: {
  photoPath: string | null;
  name: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<ProfileActionState, FormData>(
    uploadProfilePhoto,
    undefined
  );

  useEffect(() => {
    if (state?.success) setPreview(null);
  }, [state]);

  const handlePick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    formRef.current?.requestSubmit();
  };

  const displayedUrl = preview ?? photoPath;
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center gap-2">
      <form action={formAction} ref={formRef}>
        <input
          ref={inputRef}
          type="file"
          name="photo"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={handlePick}
          disabled={pending}
          aria-label="Trocar foto de perfil"
          className="relative w-[120px] h-[120px] rounded-full overflow-hidden ring-4 ring-white/40 transition-transform hover:scale-105 active:scale-95 disabled:opacity-70"
        >
          {displayedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayedUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grad-primary flex items-center justify-center font-heading font-bold text-5xl text-white">
              {initial}
            </div>
          )}

          {/* Hover overlay with camera icon */}
          <span className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>

          {pending && (
            <span className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="font-body font-extrabold text-[11px] uppercase tracking-[0.1em] text-white">
                Enviando...
              </span>
            </span>
          )}
        </button>
      </form>

      {state?.error && (
        <p className="font-body font-bold text-[12px] text-kid-danger text-center max-w-[200px]">
          {state.error}
        </p>
      )}
    </div>
  );
}
