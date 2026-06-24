import AppIcon from "@/components/AppIcon";

export default function BossLockedCard() {
  return (
    <section className="relative rounded-[32px] overflow-hidden flex flex-row items-center px-5 py-5 lg:flex-col lg:items-center lg:justify-center lg:text-center lg:px-6 lg:py-10 lg:min-h-[394px] w-full max-w-[396px] mx-auto lg:max-w-none bg-white border border-kid-sunk/60">
      {/* raios cinza girando lentamente */}
      <div className="absolute left-[60px] top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-1/2 w-[240%] aspect-square pointer-events-none">
        <div className="w-full h-full locked-rays animate-[spin_70s_linear_infinite] motion-reduce:animate-none" />
      </div>

      <div className="relative shrink-0 w-[80px] h-[80px] lg:w-auto lg:h-auto">
        <AppIcon name="lock" size={128} className="drop-shadow w-full h-full" />
      </div>
      <h2 className="relative ml-4 font-heading font-extrabold text-[32px] lg:text-[40px] leading-[1.05] text-kid-text-strong lg:ml-0 lg:mt-6 lg:text-center">
        Indisponível
      </h2>
    </section>
  );
}
