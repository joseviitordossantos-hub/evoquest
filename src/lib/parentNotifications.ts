import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS } from "@/lib/enums";

export type Notif = {
  id: string;
  type: "mission_pending" | "mission_approved" | "achievement" | "redemption" | "streak";
  icon: string;
  tint: "gold" | "teal" | "pink" | "violet" | "orange";
  childName: string;
  title: string;
  detail: string;
  at: string; // ISO — keep serializable for client component
  href?: string;
  actionable?: boolean;
};

export async function fetchParentNotifications(familyId: string): Promise<Notif[]> {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [pendingLogs, approvedLogs, achievements, redemptions, streaks] = await Promise.all([
    prisma.missionLog.findMany({
      where: { status: "PENDING", child: { familyId } },
      orderBy: { markedAt: "desc" },
      take: 8,
      include: { mission: true, child: true },
    }),
    prisma.missionLog.findMany({
      where: { status: "APPROVED", child: { familyId }, approvedAt: { gte: since } },
      orderBy: { approvedAt: "desc" },
      take: 8,
      include: { mission: true, child: true },
    }),
    prisma.achievement.findMany({
      where: { child: { familyId }, earnedAt: { gte: since } },
      orderBy: { earnedAt: "desc" },
      take: 8,
      include: { child: true },
    }),
    prisma.redemption.findMany({
      where: { status: "REQUESTED", child: { familyId } },
      orderBy: { requestedAt: "desc" },
      take: 6,
      include: { reward: true, child: true },
    }),
    prisma.streak.findMany({
      where: { child: { familyId }, currentDays: { in: [3, 7, 14, 30, 60, 100] } },
      include: { child: true },
    }),
  ]);

  const items: Notif[] = [];

  for (const log of pendingLogs) {
    items.push({
      id: `p-${log.id}`,
      type: "mission_pending",
      icon: "hourglass",
      tint: "gold",
      childName: log.child.displayName,
      title: log.mission.title,
      detail: "marcou como concluída — aguardando sua aprovação",
      at: log.markedAt.toISOString(),
      href: `/pai/aprovar?childId=${log.childId}`,
      actionable: true,
    });
  }
  for (const log of approvedLogs) {
    items.push({
      id: `a-${log.id}`,
      type: "mission_approved",
      icon: "check",
      tint: "teal",
      childName: log.child.displayName,
      title: log.mission.title,
      detail: `concluiu a missão · +${log.xpAwarded} XP`,
      at: (log.approvedAt ?? log.markedAt).toISOString(),
    });
  }
  for (const a of achievements) {
    const meta = ACHIEVEMENTS[a.code];
    items.push({
      id: `t-${a.id}`,
      type: "achievement",
      icon: "trophy",
      tint: "pink",
      childName: a.child.displayName,
      title: a.title,
      detail: meta?.description ?? "Nova conquista desbloqueada",
      at: a.earnedAt.toISOString(),
    });
  }
  for (const r of redemptions) {
    items.push({
      id: `r-${r.id}`,
      type: "redemption",
      icon: "gift",
      tint: "violet",
      childName: r.child.displayName,
      title: r.reward.title,
      detail: `pediu um resgate · ${r.coinsSpent} coins`,
      at: r.requestedAt.toISOString(),
      href: "/pai/resgates",
      actionable: true,
    });
  }
  for (const s of streaks) {
    if (!s.lastActiveDate) continue;
    items.push({
      id: `s-${s.childId}-${s.currentDays}`,
      type: "streak",
      icon: "fire",
      tint: "orange",
      childName: s.child.displayName,
      title: `${s.currentDays} dias seguidos`,
      detail: "marco de ofensiva atingido",
      at: s.lastActiveDate.toISOString(),
    });
  }

  items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return items.slice(0, 12);
}
