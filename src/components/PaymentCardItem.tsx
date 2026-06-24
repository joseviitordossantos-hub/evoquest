import CardBrandLogo from "@/components/CardBrandLogo";
import { removePaymentCard, setPrimaryCard } from "@/app/pai/perfil/actions";

type Card = {
  id: string;
  brand: string;
  last4: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  isPrimary: boolean;
};

export default function PaymentCardItem({ card }: { card: Card }) {
  const expiry = `${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}`;
  return (
    <div className="bg-white rounded-kid-xl p-4 border border-kid-sunk flex items-center gap-3">
      <CardBrandLogo brand={card.brand} className="h-7 w-auto shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-heading font-bold text-[15px] text-kid-text-strong">
            •••• {card.last4}
          </p>
          {card.isPrimary && (
            <span className="kid-chip kid-chip-teal !text-[10px] !px-2 !py-0.5">
              Primário
            </span>
          )}
        </div>
        <p className="font-body font-bold text-[12px] text-kid-text-muted leading-tight mt-0.5 truncate">
          {card.holderName} · exp {expiry}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!card.isPrimary && (
          <form action={setPrimaryCard}>
            <input type="hidden" name="id" value={card.id} />
            <button
              type="submit"
              aria-label="Marcar como primário"
              title="Marcar como primário"
              className="w-8 h-8 rounded-full bg-kid-sunk text-kid-text-muted hover:bg-kid-tint-teal hover:text-kid-on-teal transition-colors flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </form>
        )}
        <form action={removePaymentCard}>
          <input type="hidden" name="id" value={card.id} />
          <button
            type="submit"
            aria-label="Remover cartão"
            title="Remover"
            className="w-8 h-8 rounded-full bg-kid-sunk text-kid-text-muted hover:bg-kid-tint-pink hover:text-kid-danger transition-colors flex items-center justify-center"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
