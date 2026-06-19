import Image from "next/image";

export default function EvoQuestLogo({ className = "", height = 40 }: { className?: string; height?: number }) {
  return (
    <Image
      src="/logo-evoquest.png"
      alt="EvoQuest"
      width={Math.round(height * 5.37)}
      height={height}
      className={className}
      priority
    />
  );
}
