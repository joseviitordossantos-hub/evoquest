import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { fmtBRL } from "@/lib/enums";
import EvoQuestLogo from "@/components/EvoQuestLogo";
import PaiNavMenu from "@/components/PaiNavMenu";
import AppIcon from "@/components/AppIcon";

export default async function PaiNav({ active }: { active?: string }) {
  const family = await prisma.family.findFirst({ include: { children: true } });
  const balance = family?.balanceCents ?? 0;
  const pending = await prisma.redemption.count({ where: { status: "REQUESTED" } });

  const items = [
    { href: "/pai", label: "Painel", key: "painel", icon: "grid" },
    { href: "/pai/recompensas", label: "Recompensas", key: "recompensas", icon: "gift" },
    { href: "/pai/resgates", label: `Resgates${pending ? ` (${pending})` : ""}`, key: "resgates", icon: "inbox" },
    { href: "/pai/carteira", label: "Carteira", key: "carteira", icon: "wallet" },
  ];

  const quickActions = [
    { href: "/pai/missao/nova", label: "Nova missão", icon: "plus" },
    { href: "/pai/recompensas/nova", label: "Nova recompensa", icon: "star" },
    { href: "/pai/aprovar", label: "Aprovar pendentes", icon: "check" },
  ];

  const children = family?.children ?? [];

  return (
    <nav className="bg-white/80 backdrop-blur-lg sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
        <Link href="/">
          <EvoQuestLogo height={36} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1.5">
          {items.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              className={`px-4 py-1.5 rounded-pill font-body font-extrabold text-[13px] uppercase tracking-[0.04em] transition-all ${
                active === it.key
                  ? "grad-primary text-white"
                  : "text-kid-text-body hover:-translate-y-0.5 hover:bg-kid-tint-violet"
              }`}
            >
              {it.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop balance */}
          <Link href="/pai/carteira" className="hidden md:flex kid-chip kid-chip-teal text-[13px] items-center gap-1">
            <AppIcon name="coin" size={16} /> {fmtBRL(balance)}
          </Link>

          {/* Mobile hamburger */}
          <PaiNavMenu
            items={items}
            active={active}
            balance={fmtBRL(balance)}
            quickActions={quickActions}
            children={children.map((c) => ({ id: c.id, name: c.displayName, avatarSeed: c.avatarSeed }))}
          />
        </div>
      </div>
    </nav>
  );
}
