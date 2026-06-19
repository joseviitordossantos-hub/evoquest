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

export const ACHIEVEMENTS: Record<string, { title: string; emoji: string; description: string }> = {
  FIRST_MISSION: { title: "Primeira conquista", emoji: "🌱", description: "Completou sua primeira missão" },
  TEN_MISSIONS: { title: "Dez é nada", emoji: "🔟", description: "Completou 10 missões" },
  THIRTY_MISSIONS: { title: "Constância", emoji: "💪", description: "Completou 30 missões" },
  STREAK_7: { title: "Uma semana firme", emoji: "🔥", description: "7 dias seguidos" },
  STREAK_30: { title: "Mês de fogo", emoji: "🌋", description: "30 dias seguidos" },
  BOSS_HUNTER: { title: "Caçador de Boss", emoji: "🐲", description: "Derrotou uma missão Boss" },
  LEVEL_5: { title: "Aventureiro experiente", emoji: "⚔️", description: "Chegou ao nível 5" },
  LEVEL_10: { title: "Lenda em formação", emoji: "👑", description: "Chegou ao nível 10" },
};

export function fmtBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
