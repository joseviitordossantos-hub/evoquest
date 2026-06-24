type Props = { brand: string; className?: string };

export default function CardBrandLogo({ brand, className = "h-6 w-auto" }: Props) {
  switch (brand.toUpperCase()) {
    case "VISA":
      return (
        <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Visa">
          <rect width="48" height="16" rx="3" fill="#1A1F71" />
          <text x="24" y="11.5" textAnchor="middle" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="9" letterSpacing="0.5">VISA</text>
        </svg>
      );
    case "MASTERCARD":
      return (
        <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Mastercard">
          <rect width="48" height="16" rx="3" fill="#fff" stroke="#E5DCF5" />
          <circle cx="20.5" cy="8" r="5" fill="#EB001B" />
          <circle cx="27.5" cy="8" r="5" fill="#F79E1B" />
          <path d="M24 4.6a5 5 0 010 6.8 5 5 0 010-6.8z" fill="#FF5F00" />
        </svg>
      );
    case "AMEX":
      return (
        <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="American Express">
          <rect width="48" height="16" rx="3" fill="#2E77BC" />
          <text x="24" y="11" textAnchor="middle" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize="6" letterSpacing="0.4">AMERICAN</text>
          <text x="24" y="13.8" textAnchor="middle" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize="3.5" letterSpacing="0.4">EXPRESS</text>
        </svg>
      );
    case "ELO":
      return (
        <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Elo">
          <rect width="48" height="16" rx="3" fill="#000" />
          <circle cx="20" cy="8" r="3.5" fill="#FFE600" />
          <circle cx="24" cy="8" r="3.5" fill="#EE3124" />
          <circle cx="28" cy="8" r="3.5" fill="#00A4E0" />
          <text x="24" y="12" textAnchor="middle" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize="4" letterSpacing="0.6">ELO</text>
        </svg>
      );
    case "HIPERCARD":
      return (
        <svg viewBox="0 0 48 16" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Hipercard">
          <rect width="48" height="16" rx="3" fill="#B3131B" />
          <text x="24" y="11" textAnchor="middle" fill="#fff" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize="6" letterSpacing="0.2">HIPER</text>
        </svg>
      );
    default:
      return (
        <span className={`inline-flex items-center justify-center font-body font-extrabold text-[10px] uppercase tracking-[0.06em] px-2 py-1 rounded bg-kid-sunk text-kid-text-muted ${className}`}>
          {brand}
        </span>
      );
  }
}
