import type { IconName } from "@/components/ui/KidIcon";
import AppIcon from "@/components/AppIcon";

export default function EmptyState({
  emoji,
  title,
  body,
}: {
  emoji: IconName;
  title: string;
  body?: string;
}) {
  return (
    <div className="relative text-center py-12 px-4">
      <div className="mb-3 flex justify-center">
        <AppIcon name={emoji} size={64} />
      </div>
      <p className="font-heading font-semibold text-[24px] text-kid-text-strong leading-tight">{title}</p>
      {body && <p className="font-body text-kid-text-body mt-2 max-w-[280px] mx-auto">{body}</p>}
    </div>
  );
}
