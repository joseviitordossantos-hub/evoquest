import AppIcon from "@/components/AppIcon";

const STATES: Record<string, { label: string; icon: string; chip: string }> = {
  REQUESTED: { label: "ESPERANDO", icon: "hourglass", chip: "kid-chip-gold" },
  APPROVED: { label: "APROVADO", icon: "check", chip: "kid-chip-teal" },
  DELIVERED: { label: "ENTREGUE", icon: "party", chip: "kid-chip-teal" },
  REJECTED: { label: "REJEITADO", icon: "cross", chip: "kid-chip-pink" },
};

export default function RedeemStatusPill({ status }: { status: string }) {
  const s = STATES[status] ?? STATES.REQUESTED;
  return (
    <span className={`kid-chip ${s.chip} !text-[11px] !px-3 !py-1 inline-flex items-center gap-1`}>
      {s.label} <AppIcon name={s.icon} size={14} />
    </span>
  );
}
