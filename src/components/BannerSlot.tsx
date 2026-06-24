/* Banner responsivo — imagem mobile (<640px) e desktop (>=640px) */
export default function BannerSlot() {
  return (
    <div>
      <div className="relative rounded-kid-xl overflow-hidden aspect-[1118/513] sm:aspect-[1120/350] bg-kid-base">
        <picture>
          <source media="(min-width: 640px)" srcSet="/Boss%20desktop.png" />
          <img
            src="/Boss%20mobile.png"
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
      </div>
      {/* Indicadores (carrossel) */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="rounded-full"
            style={{
              width: i === 0 ? 18 : 7,
              height: 7,
              background: i === 0 ? "#7C5CFF" : "rgba(124, 92, 255, 0.28)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
