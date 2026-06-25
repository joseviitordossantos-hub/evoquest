import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PaiNav from "@/components/PaiNav";

export const dynamic = "force-dynamic";
import { fmtBRL } from "@/lib/enums";
import { toggleRewardActive, toggleRewardFeatured, buyRewardStock } from "./actions";

import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";
import BuyRewardButton from "@/components/BuyRewardButton";
import BannerSlot from "@/components/BannerSlot";

function isPaidDigital(r: { kind: string; costCents: number }) {
  return r.kind === "DIGITAL_CODE" && r.costCents > 0;
}

const FILTER_OPTIONS = [
  { key: "all",        label: "Tudo" },
  { key: "free",       label: "Sem custo" },
  { key: "in-stock",   label: "Em estoque" },
  { key: "to-buy",     label: "Para comprar" },
  { key: "featured",   label: "Favoritas" },
] as const;

type RewardRow = Awaited<ReturnType<typeof prisma.reward.findMany>>[number];

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#E0306E" : "none"} stroke={filled ? "#E0306E" : "currentColor"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.5" y2="16.5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="14" y2="12" />
      <line x1="4" y1="17" x2="9" y2="17" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.74 19.74 0 0 1 4.06-5.05" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.86 19.86 0 0 1-2.16 3.16" />
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

function RewardCard({
  r,
  inStock,
  assignedCount = 0,
}: {
  r: RewardRow;
  inStock: boolean;
  assignedCount?: number;
}) {
  const iconName = emojiToIconName(r.emoji);
  const hasDiscount = r.costCents > 0 && r.originalCostCents > r.costCents;
  const discountPct = hasDiscount
    ? Math.round(((r.originalCostCents - r.costCents) / r.originalCostCents) * 100)
    : 0;

  return (
    <div
      className={`bg-white rounded-kid-xl overflow-hidden relative transition-transform hover:-translate-y-1 flex flex-col p-2 sm:p-2.5 ${
        r.active ? "" : "opacity-50"
      }`}
    >
      {/* Image area — lavender background */}
      <div
        className="relative h-[140px] sm:h-[160px] flex items-center justify-center rounded-[14px]"
        style={{ background: "#F4F0FC" }}
      >
        {iconName ? (
          <AppIcon name={iconName} size={88} />
        ) : (
          <span className="text-[64px] leading-none">{r.emoji}</span>
        )}

        {/* Heart toggle (top-right) */}
        <form action={toggleRewardFeatured} className="absolute top-2 right-2">
          <input type="hidden" name="id" value={r.id} />
          <button
            type="submit"
            aria-label={r.featured ? "Remover dos favoritos" : "Marcar como favorito"}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-kid-text-muted shadow-sm hover:scale-110 transition-transform"
          >
            <HeartIcon filled={r.featured} />
          </button>
        </form>

        {/* Stock badge (top-left) */}
        {inStock && (
          <span
            className="absolute top-2 left-2 font-body font-extrabold text-[10px] tracking-[0.06em] uppercase px-2 py-0.5 rounded-pill"
            style={{
              background: isPaidDigital(r) ? "#B8EDE3" : "rgba(255,255,255,0.95)",
              color: isPaidDigital(r) ? "#0D7D6C" : "#4F4668",
            }}
          >
            {isPaidDigital(r) ? `×${r.stock}` : "Sempre"}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-1.5 pt-3 pb-1.5 flex flex-col flex-1 gap-2">
        {/* Title block */}
        <div>
          <p className="font-heading font-bold text-[15px] text-kid-text-strong leading-tight line-clamp-2">
            {r.title}
          </p>
          {r.provider && (
            <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-kid-text-muted mt-1">
              {r.provider}
            </p>
          )}
        </div>

        {/* Price block */}
        <div className="flex-1">
          {hasDiscount && (
            <p className="font-body font-bold text-[12px] text-kid-text-muted line-through leading-none">
              {fmtBRL(r.originalCostCents)}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {r.costCents > 0 ? (
              <p className="font-heading font-extrabold text-[18px] text-kid-text-strong leading-none">
                {fmtBRL(r.costCents)}
              </p>
            ) : (
              <p className="font-body font-extrabold text-[12px] uppercase tracking-[0.08em] text-kid-text-muted">
                Sem custo R$
              </p>
            )}
            {hasDiscount && (
              <span
                className="font-body font-extrabold text-[10px] tracking-[0.06em] uppercase px-2 py-0.5 rounded-md text-white"
                style={{ background: "#FF8A3D" }}
              >
                {discountPct}% OFF
              </span>
            )}
          </div>
          {assignedCount > 0 && (
            <p className="font-body font-bold text-[10px] text-kid-violet mt-1">
              Em {assignedCount} missão{assignedCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Action row — wide primary + small secondary */}
        <div className="flex gap-2 items-center mt-1">
          {!r.active ? (
            <form action={toggleRewardActive} className="flex-1">
              <input type="hidden" name="id" value={r.id} />
              <button
                type="submit"
                className="kid-btn kid-btn-sm kid-flat w-full !text-[12px] !min-h-[36px] !px-3"
              >
                Reativar
              </button>
            </form>
          ) : inStock ? (
            <>
              <Link
                href={`/pai/missao/nova?rewardId=${r.id}`}
                aria-label="Usar nesta missão"
                className="kid-btn kid-btn-sm kid-flat flex-1 !text-[12px] !min-h-[36px] !px-3 inline-flex items-center justify-center gap-1.5"
              >
                Usar
                <ArrowIcon />
              </Link>
              <form action={toggleRewardActive}>
                <input type="hidden" name="id" value={r.id} />
                <button
                  type="submit"
                  aria-label="Desativar recompensa"
                  className="w-9 h-9 rounded-full bg-kid-sunk text-kid-text-muted hover:bg-kid-tint-pink hover:text-kid-danger transition-colors flex items-center justify-center shrink-0"
                >
                  <EyeOffIcon />
                </button>
              </form>
            </>
          ) : (
            <>
              {r.costCents > 0 ? (
                <BuyRewardButton
                  rewardId={r.id}
                  title={r.title}
                  costCents={r.costCents}
                  action={buyRewardStock}
                />
              ) : (
                <span className="flex-1" />
              )}
              <form action={toggleRewardActive}>
                <input type="hidden" name="id" value={r.id} />
                <button
                  type="submit"
                  aria-label="Desativar recompensa"
                  className="w-9 h-9 rounded-full bg-kid-sunk text-kid-text-muted hover:bg-kid-tint-pink hover:text-kid-danger transition-colors flex items-center justify-center shrink-0"
                >
                  <EyeOffIcon />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RewardGrid({
  items,
  assignedCount,
  inStockOverride,
}: {
  items: RewardRow[];
  assignedCount: Map<string, number>;
  inStockOverride?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-5">
      {items.map((r) => (
        <RewardCard
          key={r.id}
          r={r}
          inStock={inStockOverride ?? (!isPaidDigital(r) || r.stock > 0)}
          assignedCount={assignedCount.get(r.id) ?? 0}
        />
      ))}
    </div>
  );
}

function matchesSearch(r: RewardRow, q: string) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    r.title.toLowerCase().includes(needle) ||
    (r.description?.toLowerCase().includes(needle) ?? false) ||
    (r.provider?.toLowerCase().includes(needle) ?? false)
  );
}

type FilterKey = (typeof FILTER_OPTIONS)[number]["key"];

export default async function Recompensas({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; f?: string }>;
}) {
  const { q: rawQ = "", f: rawFilter = "all" } = await searchParams;
  const q = rawQ.trim();
  const filter: FilterKey = (FILTER_OPTIONS.some((o) => o.key === rawFilter) ? rawFilter : "all") as FilterKey;

  const [allRewards, missions] = await Promise.all([
    prisma.reward.findMany({
      orderBy: [{ active: "desc" }, { featured: "desc" }, { coinsCost: "asc" }],
    }),
    prisma.mission.findMany({ where: { rewardId: { not: null }, active: true } }),
  ]);

  const assignedCount = new Map<string, number>();
  for (const m of missions) {
    if (m.rewardId) assignedCount.set(m.rewardId, (assignedCount.get(m.rewardId) ?? 0) + 1);
  }

  const rewards = allRewards.filter((r) => matchesSearch(r, q));

  // Apenas DIGITAL_CODE pago precisa ser "comprado" via plataforma (debita carteira → libera código).
  // Itens físicos/experiências com R$ são pagos offline pelo pai quando a missão é concluída — vão direto para "Em estoque".
  const free        = rewards.filter((r) => r.costCents === 0);
  const paidInStock = rewards.filter(
    (r) => r.costCents > 0 && (r.kind !== "DIGITAL_CODE" || r.stock > 0)
  );
  const paidCatalog = rewards.filter(
    (r) => r.costCents > 0 && r.kind === "DIGITAL_CODE" && r.stock === 0
  );

  const showFree        = filter === "all" || filter === "free"     || (filter === "featured");
  const showPaidInStock = filter === "all" || filter === "in-stock" || filter === "featured";
  const showPaidCatalog = filter === "all" || filter === "to-buy"   || filter === "featured";

  const applyFeatured = (list: RewardRow[]) =>
    filter === "featured" ? list.filter((r) => r.featured) : list;

  const freeShown        = showFree        ? applyFeatured(free)        : [];
  const paidInStockShown = showPaidInStock ? applyFeatured(paidInStock) : [];
  const paidCatalogShown = showPaidCatalog ? applyFeatured(paidCatalog) : [];

  const totalShown = freeShown.length + paidInStockShown.length + paidCatalogShown.length;

  return (
    <>
      <PaiNav active="recompensas" />

      <div className="px-4 sm:px-6 py-6 sm:py-10 max-w-6xl mx-auto">
        {/* Search bar (topo) + Nova */}
        <form method="get" className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2 bg-white rounded-pill h-12 sm:h-14 px-4 sm:px-5 border border-kid-sunk">
            <span className="text-kid-text-muted shrink-0">
              <SearchIcon />
            </span>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Buscar recompensa..."
              className="flex-1 bg-transparent outline-none font-body font-bold text-[14px] sm:text-[15px] text-kid-text-strong placeholder:text-kid-text-muted placeholder:font-normal"
            />
            <input type="hidden" name="f" value={filter} />
          </div>
          <button
            type="submit"
            aria-label="Buscar"
            className="hidden sm:flex w-12 h-12 sm:w-14 sm:h-14 rounded-full items-center justify-center text-[#5A3000] shrink-0 hover:scale-105 transition-transform"
            style={{ background: "#FFD15C" }}
          >
            <SearchIcon />
          </button>
          <Link
            href="/pai/recompensas/nova"
            aria-label="Nova recompensa"
            className="kid-btn kid-btn-sm shrink-0 !min-h-[48px] sm:!min-h-[56px] !px-4 sm:!px-6 !text-[14px] sm:!text-[16px] whitespace-nowrap"
          >
            + Nova
          </Link>
        </form>

        {/* Banner */}
        <div className="mt-5">
          <BannerSlot />
        </div>

        {/* Filtros (embaixo do banner) */}
        <div className="mt-5 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTER_OPTIONS.map((opt) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (opt.key !== "all") params.set("f", opt.key);
            const href = `/pai/recompensas${params.toString() ? `?${params}` : ""}`;
            const isActive = filter === opt.key;
            return (
              <Link
                key={opt.key}
                href={href}
                className={`shrink-0 rounded-pill px-4 py-2 font-body font-extrabold text-[12px] uppercase tracking-[0.06em] transition-colors ${
                  isActive
                    ? "text-[#5A3000]"
                    : "bg-white text-kid-text-body border border-kid-sunk hover:border-kid-text-muted"
                }`}
                style={isActive ? { background: "#FFD15C" } : undefined}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>

        {/* Results count when filtered */}
        {(q || filter !== "all") && (
          <p className="mt-4 font-body font-bold text-[13px] text-kid-text-muted">
            {totalShown === 0 ? "Nada encontrado" : `${totalShown} ${totalShown === 1 ? "resultado" : "resultados"}`}
            {q && ` para "${q}"`}
            {(q || filter !== "all") && (
              <Link href="/pai/recompensas" className="ml-2 text-kid-violet font-extrabold underline">
                limpar
              </Link>
            )}
          </p>
        )}

        {/* Grid unificado — sem container branco, sem subcategorias */}
        <RewardGrid items={freeShown} assignedCount={assignedCount} />
        <RewardGrid items={paidInStockShown} assignedCount={assignedCount} />
        <RewardGrid items={paidCatalogShown} assignedCount={assignedCount} inStockOverride={false} />

        {totalShown === 0 && !q && filter === "all" && (
          <p className="mt-10 text-center font-body text-kid-text-muted">
            Nenhuma recompensa cadastrada ainda. Clique em <strong>+ Nova</strong> para começar.
          </p>
        )}

      </div>
    </>
  );
}
