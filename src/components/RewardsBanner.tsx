import Image from "next/image";

export default function RewardsBanner() {
  return (
    <section className="hidden lg:block kid-card overflow-hidden border border-[#e8e6f2] p-0">
      <Image
        src="/banner-recompensas.png"
        alt="Se torne um herói — Complete suas missões, suba de nível e resgate suas recompensas"
        width={1200}
        height={500}
        className="w-full h-full object-cover"
        priority
      />
    </section>
  );
}
