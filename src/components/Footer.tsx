const LINKS = ["Suporte", "Termos de uso", "Privacidade"];

export default function Footer() {
  return (
    <footer className="bg-[#E8E1F1] border-t border-kid-sunk/60 mt-auto shrink-0">
      <div className="max-w-[1500px] mx-auto px-5 lg:px-8 py-5 flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="font-body font-extrabold text-[12px] text-kid-text-muted">
          Transformando o aprendizado em evolução constante
        </p>
        <nav className="flex items-center justify-center gap-3 flex-wrap">
          {LINKS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              {i > 0 && <span className="w-1 h-1 rounded-full bg-kid-text-muted/60" aria-hidden />}
              <a
                href="#"
                className="font-body font-extrabold text-[11px] uppercase tracking-[0.08em] text-kid-text-muted hover:text-kid-violet transition-colors"
              >
                {label}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
