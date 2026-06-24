export type Rank = {
  label: string;
  minLevel: number;
  color: string;
  bgColor: string;
  badge: string;
};

export const RANKS: Rank[] = [
  { label: "Aprendiz",    minLevel: 1,  color: "#5B5470", bgColor: "#E5DCF5", badge: "/badges/Badge Aprendiz.png" },
  { label: "Aventureiro", minLevel: 3,  color: "#5B3CC7", bgColor: "#E0D4FC", badge: "/badges/Badge Aventureiro.png" },
  { label: "Cavaleiro",   minLevel: 5,  color: "#0D7D6C", bgColor: "#B8EDE3", badge: "/badges/Badge Cavaleiro.png" },
  { label: "Herói",       minLevel: 8,  color: "#A04518", bgColor: "#FFD9C4", badge: "/badges/Badge Heroi.png" },
  { label: "Lenda",       minLevel: 11, color: "#8E5A00", bgColor: "#FDEABC", badge: "/badges/Badge Lenda.png" },
  { label: "Mítico",      minLevel: 21, color: "#FFFFFF", bgColor: "#B82332", badge: "/badges/Badge Lenda.png" },
];

export function getRankForLevel(level: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) return RANKS[i];
  }
  return RANKS[0];
}

export function getNextRank(level: number): Rank | null {
  return RANKS.find((r) => r.minLevel > level) ?? null;
}
