import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function wipe() {
  await prisma.achievement.deleteMany();
  await prisma.xpEvent.deleteMany();
  await prisma.missionLog.deleteMany();
  await prisma.redemption.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.child.deleteMany();
  await prisma.consentRecord.deleteMany();
  await prisma.user.deleteMany();
  await prisma.family.deleteMany();
}

function daysAgo(n: number) {
  const d = new Date(); d.setDate(d.getDate() - n); d.setHours(10, 0, 0, 0);
  return d;
}

async function main() {
  await wipe();

  const family = await prisma.family.create({
    data: {
      name: "Família Silva",
      balanceCents: 8500, // R$ 85 já carregados
      parents: { create: [{ email: "pai@demo.com", name: "Marcos Silva", role: "PARENT" }] },
      consent: { create: { parentName: "Marcos Silva", parentDocHash: "demo-hash", termsVersion: "v0.1" } },
    },
  });

  await prisma.walletTransaction.createMany({
    data: [
      { familyId: family.id, amountCents: 5000, type: "CREDIT", description: "Adicionou R$ 50,00 via Pix", createdAt: daysAgo(20) },
      { familyId: family.id, amountCents: 5000, type: "CREDIT", description: "Adicionou R$ 50,00 via Cartão", createdAt: daysAgo(10) },
      { familyId: family.id, amountCents: -1500, type: "DEBIT_REDEMPTION", description: "Resgate: Robux R$ 15,00 (Lila)", createdAt: daysAgo(8) },
    ],
  });

  const parent = await prisma.user.findFirstOrThrow({ where: { familyId: family.id } });

  // Crianças
  const lila = await prisma.child.create({
    data: {
      familyId: family.id,
      displayName: "Lila",
      birthDate: new Date("2016-03-10"),
      interests: JSON.stringify(["leitura", "desenho", "minecraft", "inglês"]),
      avatarSeed: "lila",
      streak: { create: { currentDays: 9, longestDays: 12, lastActiveDate: new Date(), freezesAvailable: 1, freezesUsedThisMonth: 1 } },
    },
  });

  const theo = await prisma.child.create({
    data: {
      familyId: family.id,
      displayName: "Théo",
      birthDate: new Date("2014-09-22"),
      interests: JSON.stringify(["futebol", "youtube", "matemática", "roblox"]),
      avatarSeed: "theo",
      streak: { create: { currentDays: 3, longestDays: 8, lastActiveDate: new Date(), freezesAvailable: 2 } },
    },
  });

  // Missões da Lila
  const lilaMissions = await Promise.all([
    prisma.mission.create({ data: { childId: lila.id, title: "Ler 10 páginas", category: "leitura", difficulty: "EASY", xpReward: 15, frequency: "DAILY", targetCount: 10, currentProgress: 7, createdById: parent.id, rewardText: "1 episódio extra de série" } }),
    prisma.mission.create({ data: { childId: lila.id, title: "Praticar inglês 15min", category: "idioma", difficulty: "MEDIUM", xpReward: 25, frequency: "DAILY", targetCount: 1, currentProgress: 0, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: lila.id, title: "Arrumar o quarto", category: "rotina", difficulty: "EASY", xpReward: 10, frequency: "DAILY", targetCount: 1, currentProgress: 1, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: lila.id, title: "Desenhar 1 página do sketchbook", category: "outro", difficulty: "MEDIUM", xpReward: 20, frequency: "DAILY", targetCount: 5, currentProgress: 3, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: lila.id, title: "Ler 1 livro inteiro", category: "leitura", difficulty: "BOSS", xpReward: 200, frequency: "ONCE", targetCount: 150, currentProgress: 92, createdById: parent.id, rewardText: "Um livro novo de presente" } }),
  ]);

  // Missões do Théo
  const theoMissions = await Promise.all([
    prisma.mission.create({ data: { childId: theo.id, title: "Estudar matemática 20min", category: "estudo", difficulty: "MEDIUM", xpReward: 25, frequency: "DAILY", targetCount: 1, currentProgress: 0, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: theo.id, title: "Treinar futebol no quintal", category: "esporte", difficulty: "EASY", xpReward: 15, frequency: "DAILY", targetCount: 3, currentProgress: 2, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: theo.id, title: "Tirar nota ≥ 8 na prova", category: "estudo", difficulty: "HARD", xpReward: 80, frequency: "ONCE", targetCount: 1, currentProgress: 0, createdById: parent.id, rewardText: "Robux 100" } }),
    prisma.mission.create({ data: { childId: theo.id, title: "Praticar inglês 15min", category: "idioma", difficulty: "MEDIUM", xpReward: 25, frequency: "DAILY", targetCount: 1, currentProgress: 0, createdById: parent.id } }),
  ]);

  // Histórico de missões aprovadas (Lila)
  const approvedDates = [9, 8, 7, 6, 5, 4, 3, 2, 1]; // 9 dias de streak
  for (const ago of approvedDates) {
    const m = lilaMissions[ago % 3];
    const log = await prisma.missionLog.create({
      data: { missionId: m.id, childId: lila.id, status: "APPROVED", markedAt: daysAgo(ago), approvedAt: daysAgo(ago), approvedBy: parent.id, xpAwarded: m.xpReward },
    });
    await prisma.xpEvent.create({ data: { childId: lila.id, amount: m.xpReward, reason: `mission:${m.id}`, createdAt: log.markedAt } });
  }

  // Lila concluiu 1 BOSS
  const bossLog = await prisma.missionLog.create({
    data: { missionId: lilaMissions[4].id, childId: lila.id, status: "APPROVED", markedAt: daysAgo(5), approvedAt: daysAgo(5), approvedBy: parent.id, xpAwarded: 200 },
  });
  await prisma.xpEvent.create({ data: { childId: lila.id, amount: 200, reason: `mission:${lilaMissions[4].id}`, createdAt: bossLog.markedAt } });

  // Lila tem 2 missões marcadas hoje aguardando aprovação
  await prisma.missionLog.create({ data: { missionId: lilaMissions[0].id, childId: lila.id, status: "PENDING", childNote: "Li o capítulo 3 inteiro!" } });
  await prisma.missionLog.create({ data: { missionId: lilaMissions[1].id, childId: lila.id, status: "PENDING" } });

  // Histórico Théo
  for (const ago of [3, 2, 1]) {
    const m = theoMissions[ago % 2];
    const log = await prisma.missionLog.create({
      data: { missionId: m.id, childId: theo.id, status: "APPROVED", markedAt: daysAgo(ago), approvedAt: daysAgo(ago), approvedBy: parent.id, xpAwarded: m.xpReward },
    });
    await prisma.xpEvent.create({ data: { childId: theo.id, amount: m.xpReward, reason: `mission:${m.id}`, createdAt: log.markedAt } });
  }
  // 1 pendente do Théo
  await prisma.missionLog.create({ data: { missionId: theoMissions[1].id, childId: theo.id, status: "PENDING" } });

  // Catálogo de recompensas — rico para apresentação
  await prisma.reward.createMany({
    data: [
      // Digitais (com custo R$)
      { familyId: family.id, title: "Robux R$ 15", description: "100 Robux para Roblox", emoji: "🟢", kind: "DIGITAL_CODE", provider: "Roblox", xpCost: 200, costCents: 1500, featured: true },
      { familyId: family.id, title: "Robux R$ 30", description: "200 Robux para Roblox", emoji: "🟢", kind: "DIGITAL_CODE", provider: "Roblox", xpCost: 400, costCents: 3000 },
      { familyId: family.id, title: "V-Bucks R$ 25", description: "1000 V-Bucks Fortnite", emoji: "🎮", kind: "DIGITAL_CODE", provider: "Epic Games", xpCost: 350, costCents: 2500 },
      { familyId: family.id, title: "Steam R$ 20", description: "Gift card Steam", emoji: "🕹️", kind: "DIGITAL_CODE", provider: "Steam", xpCost: 280, costCents: 2000 },
      { familyId: family.id, title: "Spotify 1 mês", description: "Plano individual", emoji: "🎵", kind: "DIGITAL_CODE", provider: "Spotify", xpCost: 300, costCents: 2190 },
      { familyId: family.id, title: "Kindle e-book R$ 15", description: "1 livro digital à escolha", emoji: "📚", kind: "DIGITAL_CODE", provider: "Amazon", xpCost: 250, costCents: 1500, featured: true },
      // Físicos (sem código digital, pai entrega)
      { familyId: family.id, title: "Sorvete favorito", description: "Pode ser na sorveteria", emoji: "🍦", kind: "PHYSICAL", xpCost: 80, costCents: 0 },
      { familyId: family.id, title: "Livro novo", description: "Um livro à escolha (até R$ 50)", emoji: "📖", kind: "PHYSICAL", xpCost: 250, costCents: 5000 },
      { familyId: family.id, title: "Pacote de figurinhas", description: "Álbum atual", emoji: "🃏", kind: "PHYSICAL", xpCost: 60, costCents: 500 },
      // Experiências
      { familyId: family.id, title: "Cinema no fim de semana", description: "Filme à escolha", emoji: "🎬", kind: "EXPERIENCE", xpCost: 300, costCents: 4000 },
      { familyId: family.id, title: "Pizza de sexta", description: "Você escolhe o sabor", emoji: "🍕", kind: "EXPERIENCE", xpCost: 150, costCents: 0, featured: true },
      { familyId: family.id, title: "Acampamento no quintal", description: "Barraca na sala/quintal numa sexta", emoji: "⛺", kind: "EXPERIENCE", xpCost: 200, costCents: 0 },
      // Privilégios (zero R$)
      { familyId: family.id, title: "Escolher filme de sexta", description: "Você decide", emoji: "🎞️", kind: "PRIVILEGE", xpCost: 30, costCents: 0 },
      { familyId: family.id, title: "+30min de tela hoje", description: "Limite extra para o dia", emoji: "📱", kind: "PRIVILEGE", xpCost: 50, costCents: 0 },
      { familyId: family.id, title: "Ficar acordado +1h sexta", description: "Vale 1 sexta-feira", emoji: "🌙", kind: "PRIVILEGE", xpCost: 70, costCents: 0 },
    ],
  });

  // Resgate já entregue (histórico)
  const robux = await prisma.reward.findFirstOrThrow({ where: { title: "Robux R$ 15" } });
  await prisma.redemption.create({
    data: {
      childId: lila.id, rewardId: robux.id, status: "DELIVERED",
      requestedAt: daysAgo(8), deliveredAt: daysAgo(8),
      xpSpent: 200, costCentsPaid: 1500,
      deliveryCode: "ROBUX-XXXX-AAAA-BBBB",
      parentNote: "Código entregue por WhatsApp",
    },
  });

  // Resgate pendente da Lila (sorvete)
  const sorvete = await prisma.reward.findFirstOrThrow({ where: { title: "Sorvete favorito" } });
  await prisma.redemption.create({
    data: { childId: lila.id, rewardId: sorvete.id, status: "REQUESTED", xpSpent: 80 },
  });

  // Conquistas Lila (auto-calculadas depois, mas plantamos algumas)
  await prisma.achievement.createMany({
    data: [
      { childId: lila.id, code: "FIRST_MISSION", title: "Primeira conquista", emoji: "🌱", earnedAt: daysAgo(9) },
      { childId: lila.id, code: "STREAK_7", title: "Uma semana firme", emoji: "🔥", earnedAt: daysAgo(2) },
      { childId: lila.id, code: "BOSS_HUNTER", title: "Caçador de Boss", emoji: "🐲", earnedAt: daysAgo(5) },
      { childId: lila.id, code: "LEVEL_10", title: "Lenda em formação", emoji: "👑", earnedAt: daysAgo(1) },
      { childId: theo.id, code: "FIRST_MISSION", title: "Primeira conquista", emoji: "🌱", earnedAt: daysAgo(3) },
    ],
  });

  console.log("\n✅ Seed rica criada!");
  console.log(`   Família: ${family.id}`);
  console.log(`   Lila:    ${lila.id}`);
  console.log(`   Théo:    ${theo.id}`);
  console.log(`   Saldo:   R$ ${(family.balanceCents / 100).toFixed(2)}\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
