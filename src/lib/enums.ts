export const RewardKind = {
  DIGITAL_CODE: "DIGITAL_CODE",
  PHYSICAL: "PHYSICAL",
  EXPERIENCE: "EXPERIENCE",
  PRIVILEGE: "PRIVILEGE",
} as const;
export type RewardKindT = (typeof RewardKind)[keyof typeof RewardKind];

export const rewardKindLabel: Record<string, string> = {
  DIGITAL_CODE: "Digital",
  PHYSICAL: "Físico",
  EXPERIENCE: "Experiência",
  PRIVILEGE: "Privilégio",
};

export const rewardKindEmoji: Record<string, string> = {
  DIGITAL_CODE: "💳",
  PHYSICAL: "📦",
  EXPERIENCE: "🎟️",
  PRIVILEGE: "⭐",
};

export const rewardKindIconName: Record<string, string> = {
  DIGITAL_CODE: "rw-digital",
  PHYSICAL: "rw-physical",
  EXPERIENCE: "rw-experience",
  PRIVILEGE: "rw-privilege",
};

export const RedemptionStatus = {
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
  DELIVERED: "DELIVERED",
  REJECTED: "REJECTED",
} as const;

export const redemptionStatusLabel: Record<string, string> = {
  REQUESTED: "Aguardando aprovação",
  APPROVED: "Aprovado — pagar/entregar",
  DELIVERED: "Entregue",
  REJECTED: "Rejeitado",
};

export const Difficulty = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
  BOSS: "BOSS",
} as const;

export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY" | "MYTHIC";

export const ACHIEVEMENTS: Record<string, { title: string; emoji: string; description: string; rarity: Rarity }> = {
  FIRST_MISSION: { title: "Primeira conquista", emoji: "🌱", description: "Completou sua primeira missão", rarity: "COMMON" },
  TEN_MISSIONS: { title: "Dez é nada", emoji: "🔟", description: "Completou 10 missões", rarity: "RARE" },
  THIRTY_MISSIONS: { title: "Constância", emoji: "💪", description: "Completou 30 missões", rarity: "EPIC" },
  STREAK_7: { title: "Uma semana firme", emoji: "🔥", description: "7 dias seguidos", rarity: "RARE" },
  STREAK_30: { title: "Mês de fogo", emoji: "🌋", description: "30 dias seguidos", rarity: "LEGENDARY" },
  BOSS_HUNTER: { title: "Caçador de Boss", emoji: "🐲", description: "Derrotou uma missão Boss", rarity: "LEGENDARY" },
  LEVEL_5: { title: "Aventureiro experiente", emoji: "⚔️", description: "Chegou ao nível 5", rarity: "EPIC" },
  LEVEL_10: { title: "Lenda em formação", emoji: "👑", description: "Chegou ao nível 10", rarity: "MYTHIC" },
};

export const RARITY_STYLE: Record<Rarity, { label: string; chip: string; chipText: string; fill: string; from: string; to: string }> = {
  COMMON:    { label: "COMUM",     chip: "bg-[#8C849E]", chipText: "text-white", fill: "bg-gradient-to-br from-[#F1EDF7] to-[#9F95B0]", from: "#F1EDF7", to: "#9F95B0" },
  RARE:      { label: "RARE",      chip: "bg-[#1B7CC9]", chipText: "text-white", fill: "bg-gradient-to-br from-[#6FC1FA] to-[#1B7CC9]", from: "#6FC1FA", to: "#1B7CC9" },
  EPIC:      { label: "EPIC",      chip: "bg-[#5234CC]", chipText: "text-white", fill: "bg-gradient-to-br from-[#9C82FF] to-[#5234CC]", from: "#9C82FF", to: "#5234CC" },
  LEGENDARY: { label: "LEGENDARY", chip: "bg-[#D4831A]", chipText: "text-white", fill: "bg-gradient-to-br from-[#FFC25C] to-[#D4831A]", from: "#FFC25C", to: "#D4831A" },
  MYTHIC:    { label: "MYTHIC",    chip: "bg-[#B82332]", chipText: "text-white", fill: "bg-gradient-to-br from-[#FF6675] to-[#B82332]", from: "#FF6675", to: "#B82332" },
};

export function fmtBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
