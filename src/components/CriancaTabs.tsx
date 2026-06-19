import Link from "next/link";

export default function CriancaTabs({ childId, active }: { childId: string; active: "home" | "recompensas" | "conquistas" | "amigos" }) {
  const tabs = [
    { key: "home", href: `/crianca/${childId}`, label: "Home" },
    { key: "recompensas", href: `/crianca/${childId}/recompensas`, label: "Recompensas" },
    { key: "conquistas", href: `/crianca/${childId}/conquistas`, label: "Conquistas" },
    { key: "amigos", href: `/crianca/${childId}/amigos`, label: "Amigos" },
  ] as const;

  return (
    <nav className="grid grid-cols-4 gap-2 mt-4">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`text-center py-2.5 rounded-pill text-sm font-bold transition-all ${
            active === t.key ? "grad-primary text-white" : "bg-white text-kid-text-body hover:-translate-y-0.5"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
