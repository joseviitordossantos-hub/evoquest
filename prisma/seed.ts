import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

function makeSeedClient() {
  if (process.env.TURSO_DATABASE_URL) {
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql as any);
    return new PrismaClient({ adapter } as any);
  }
  return new PrismaClient();
}

const prisma = makeSeedClient();

async function wipe() {
  await prisma.bossDamage.deleteMany();
  await prisma.monthlyBoss.deleteMany();
  await prisma.bossTemplate.deleteMany();
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
  await prisma.paymentCard.deleteMany();
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
      parents: { create: [{ email: "jose.vitor@evoquest.com.br", name: "José Vitor Silva", role: "PARENT", phone: "(11) 98765-4321" }] },
      consent: { create: { parentName: "José Vitor Silva", parentDocHash: "demo-hash", termsVersion: "v0.1" } },
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
      streak: { create: { currentDays: 9, longestDays: 12, lastActiveDate: new Date(), freezesAvailable: 1, freezesUsedThisMonth: 1 } },
    },
  });

  // Missões da Lila
  const lilaMissions = await Promise.all([
    prisma.mission.create({ data: { childId: lila.id, title: "Ler 10 páginas", category: "leitura", difficulty: "COMMON", xpReward: 15, frequency: "DAILY", targetCount: 10, currentProgress: 7, createdById: parent.id, rewardText: "1 episódio extra de série" } }),
    prisma.mission.create({ data: { childId: lila.id, title: "Praticar inglês 15min", category: "idioma", difficulty: "RARE", xpReward: 37, frequency: "DAILY", targetCount: 1, currentProgress: 0, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: lila.id, title: "Arrumar o quarto", category: "rotina", difficulty: "COMMON", xpReward: 10, frequency: "DAILY", targetCount: 1, currentProgress: 0, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: lila.id, title: "Desenhar 1 página do sketchbook", category: "outro", difficulty: "LEGENDARY", xpReward: 36, frequency: "DAILY", targetCount: 5, currentProgress: 3, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: lila.id, title: "Ler 1 livro inteiro", category: "leitura", difficulty: "MYTHIC", xpReward: 400, frequency: "ONCE", targetCount: 150, currentProgress: 92, createdById: parent.id, rewardText: "Um livro novo de presente" } }),
  ]);

  // Missões do Théo (espelha as da Lila)
  const theoMissions = await Promise.all([
    prisma.mission.create({ data: { childId: theo.id, title: "Ler 10 páginas", category: "leitura", difficulty: "COMMON", xpReward: 15, frequency: "DAILY", targetCount: 10, currentProgress: 7, createdById: parent.id, rewardText: "1 episódio extra de série" } }),
    prisma.mission.create({ data: { childId: theo.id, title: "Praticar inglês 15min", category: "idioma", difficulty: "RARE", xpReward: 37, frequency: "DAILY", targetCount: 1, currentProgress: 0, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: theo.id, title: "Arrumar o quarto", category: "rotina", difficulty: "COMMON", xpReward: 10, frequency: "DAILY", targetCount: 1, currentProgress: 0, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: theo.id, title: "Desenhar 1 página do sketchbook", category: "outro", difficulty: "LEGENDARY", xpReward: 36, frequency: "DAILY", targetCount: 5, currentProgress: 3, createdById: parent.id } }),
    prisma.mission.create({ data: { childId: theo.id, title: "Ler 1 livro inteiro", category: "leitura", difficulty: "MYTHIC", xpReward: 400, frequency: "ONCE", targetCount: 150, currentProgress: 92, createdById: parent.id, rewardText: "Um livro novo de presente" } }),
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

  // Lila — estados variados hoje para visualização
  // Missão 0 (Ler 10 páginas): PENDING (amarelo + esperando)
  await prisma.missionLog.create({ data: { missionId: lilaMissions[0].id, childId: lila.id, status: "PENDING", childNote: "Li o capítulo 3 inteiro!" } });
  // Missão 1 (Praticar inglês): sem log hoje, progress 0 → à fazer (azul)
  // Missão 2 (Arrumar o quarto): APPROVED hoje → concluído (verde)
  const arrumouLog = await prisma.missionLog.create({
    data: { missionId: lilaMissions[2].id, childId: lila.id, status: "APPROVED", markedAt: new Date(), approvedAt: new Date(), approvedBy: parent.id, xpAwarded: lilaMissions[2].xpReward },
  });
  await prisma.xpEvent.create({ data: { childId: lila.id, amount: lilaMissions[2].xpReward, reason: `mission:${lilaMissions[2].id}`, createdAt: arrumouLog.markedAt } });
  // Missão 3 (Desenhar sketchbook): sem log hoje, progress 3/5 → em andamento (amarelo)
  // Missão 4 (Ler livro inteiro): REJECTED hoje → tentar novamente (azul)
  await prisma.missionLog.create({ data: { missionId: lilaMissions[4].id, childId: lila.id, status: "REJECTED", childNote: "Quase lá!", markedAt: new Date() } });

  // Histórico Théo (mesma série da Lila — 9 dias aprovados + BOSS + 2 pendings)
  for (const ago of approvedDates) {
    const m = theoMissions[ago % 3];
    const log = await prisma.missionLog.create({
      data: { missionId: m.id, childId: theo.id, status: "APPROVED", markedAt: daysAgo(ago), approvedAt: daysAgo(ago), approvedBy: parent.id, xpAwarded: m.xpReward },
    });
    await prisma.xpEvent.create({ data: { childId: theo.id, amount: m.xpReward, reason: `mission:${m.id}`, createdAt: log.markedAt } });
  }
  const theoBossLog = await prisma.missionLog.create({
    data: { missionId: theoMissions[4].id, childId: theo.id, status: "APPROVED", markedAt: daysAgo(5), approvedAt: daysAgo(5), approvedBy: parent.id, xpAwarded: 200 },
  });
  await prisma.xpEvent.create({ data: { childId: theo.id, amount: 200, reason: `mission:${theoMissions[4].id}`, createdAt: theoBossLog.markedAt } });
  // Théo — estados variados
  await prisma.missionLog.create({ data: { missionId: theoMissions[0].id, childId: theo.id, status: "PENDING", childNote: "Terminei o capítulo!" } });
  const theoArrumouLog = await prisma.missionLog.create({
    data: { missionId: theoMissions[2].id, childId: theo.id, status: "APPROVED", markedAt: new Date(), approvedAt: new Date(), approvedBy: parent.id, xpAwarded: theoMissions[2].xpReward },
  });
  await prisma.xpEvent.create({ data: { childId: theo.id, amount: theoMissions[2].xpReward, reason: `mission:${theoMissions[2].id}`, createdAt: theoArrumouLog.markedAt } });

  // Catálogo de recompensas — rico para apresentação
  await prisma.reward.createMany({
    data: [
      // Digitais (com custo R$)
      { familyId: family.id, title: "Robux R$ 15", description: "100 Robux para Roblox", emoji: "robux", kind: "DIGITAL_CODE", provider: "Roblox", coinsCost: 40, costCents: 1500, originalCostCents: 1800, featured: true },
      { familyId: family.id, title: "Robux R$ 30", description: "200 Robux para Roblox", emoji: "robux", kind: "DIGITAL_CODE", provider: "Roblox", coinsCost: 80, costCents: 3000, minLevel: 4 },
      { familyId: family.id, title: "V-Bucks R$ 25", description: "1000 V-Bucks Fortnite", emoji: "vbucks", kind: "DIGITAL_CODE", provider: "Epic Games", coinsCost: 70, costCents: 2500, originalCostCents: 3000, minLevel: 6 },
      { familyId: family.id, title: "Steam R$ 20", description: "Gift card Steam", emoji: "steam", kind: "DIGITAL_CODE", provider: "Steam", coinsCost: 56, costCents: 2000, minLevel: 3 },
      { familyId: family.id, title: "Spotify 1 mês", description: "Plano individual", emoji: "spotify", kind: "DIGITAL_CODE", provider: "Spotify", coinsCost: 60, costCents: 2190, minLevel: 5 },
      { familyId: family.id, title: "Battle.net R$ 30", description: "Saldo Battle.net Blizzard", emoji: "battlenet", kind: "DIGITAL_CODE", provider: "Blizzard", coinsCost: 80, costCents: 3000, originalCostCents: 3500, minLevel: 5 },
      { familyId: family.id, title: "RP R$ 25", description: "Riot Points para League of Legends", emoji: "riotpoints", kind: "DIGITAL_CODE", provider: "Riot Games", coinsCost: 70, costCents: 2500, originalCostCents: 2900, minLevel: 5 },
      { familyId: family.id, title: "E-book R$ 15", description: "1 livro digital à escolha", emoji: "📚", kind: "DIGITAL_CODE", provider: "Amazon", coinsCost: 50, costCents: 1500, featured: true },
      // Físicos (sem código digital, pai entrega)
      { familyId: family.id, title: "Sorvete favorito", description: "Pode ser na sorveteria", emoji: "🍦", kind: "PHYSICAL", coinsCost: 16, costCents: 0 },
      { familyId: family.id, title: "Livro novo", description: "Um livro à escolha (até R$ 50)", emoji: "books", kind: "PHYSICAL", coinsCost: 50, costCents: 5000, minLevel: 7 },
      { familyId: family.id, title: "Pacote de figurinhas", description: "Álbum atual", emoji: "cupstrickers", kind: "PHYSICAL", coinsCost: 12, costCents: 500 },
      // Experiências
      { familyId: family.id, title: "Cinema no fim de semana", description: "Filme à escolha", emoji: "cinema", kind: "EXPERIENCE", coinsCost: 60, costCents: 4000, minLevel: 4 },
      { familyId: family.id, title: "Pizza de sexta", description: "Você escolhe o sabor", emoji: "🍕", kind: "EXPERIENCE", coinsCost: 30, costCents: 0, featured: true },
      { familyId: family.id, title: "Acampamento no quintal", description: "Barraca na sala/quintal numa sexta", emoji: "⛺", kind: "EXPERIENCE", coinsCost: 40, costCents: 0 },
      // Privilégios (zero R$)
      { familyId: family.id, title: "Escolher filme de sexta", description: "Você decide", emoji: "film", kind: "PRIVILEGE", coinsCost: 6, costCents: 0 },
      { familyId: family.id, title: "+30min de tela hoje", description: "Limite extra para o dia", emoji: "📱", kind: "PRIVILEGE", coinsCost: 10, costCents: 0 },
      { familyId: family.id, title: "Ficar acordado +1h sexta", description: "Vale 1 sexta-feira", emoji: "🌙", kind: "PRIVILEGE", coinsCost: 14, costCents: 0 },

      // Recompensas de BOSS — versões maiores das digitais/experiências, com desconto
      { familyId: family.id, title: "Robux R$ 50 (drop de boss)", description: "350 Robux — só liberado ao derrotar o boss", emoji: "robux", kind: "DIGITAL_CODE", provider: "Roblox", coinsCost: 100, costCents: 5000, forBoss: true },
      { familyId: family.id, title: "V-Bucks R$ 75 (drop de boss)", description: "3000 V-Bucks Fortnite", emoji: "vbucks", kind: "DIGITAL_CODE", provider: "Epic Games", coinsCost: 150, costCents: 7500, forBoss: true },
      { familyId: family.id, title: "Steam R$ 60 (drop de boss)", description: "Gift card maior em troca da vitória", emoji: "steam", kind: "DIGITAL_CODE", provider: "Steam", coinsCost: 130, costCents: 6000, forBoss: true },
      { familyId: family.id, title: "Battle.net R$ 100 (drop de boss)", description: "Saldo Battle.net Blizzard turbinado", emoji: "battlenet", kind: "DIGITAL_CODE", provider: "Blizzard", coinsCost: 200, costCents: 10000, forBoss: true },
      { familyId: family.id, title: "Cinema + pizza (drop de boss)", description: "Programa completo de sexta", emoji: "cinema", kind: "EXPERIENCE", coinsCost: 80, costCents: 6000, forBoss: true },
      { familyId: family.id, title: "Livro novo até R$ 80 (drop de boss)", description: "Livro físico de até R$ 80", emoji: "books", kind: "PHYSICAL", coinsCost: 100, costCents: 8000, forBoss: true },
    ],
  });

  // Resgate já entregue (histórico)
  const robux = await prisma.reward.findFirstOrThrow({ where: { title: "Robux R$ 15" } });
  await prisma.redemption.create({
    data: {
      childId: lila.id, rewardId: robux.id, status: "DELIVERED",
      requestedAt: daysAgo(8), deliveredAt: daysAgo(8),
      coinsSpent: 40, costCentsPaid: 1500,
      deliveryCode: "ROBUX-XXXX-AAAA-BBBB",
      parentNote: "Código entregue por WhatsApp",
    },
  });

  // Resgate pendente da Lila (sorvete)
  const sorvete = await prisma.reward.findFirstOrThrow({ where: { title: "Sorvete favorito" } });
  await prisma.redemption.create({
    data: { childId: lila.id, rewardId: sorvete.id, status: "REQUESTED", coinsSpent: 16 },
  });

  // Conquistas Lila (auto-calculadas depois, mas plantamos algumas)
  await prisma.achievement.createMany({
    data: [
      { childId: lila.id, code: "FIRST_MISSION", title: "Primeira conquista", emoji: "🌱", earnedAt: daysAgo(9) },
      { childId: lila.id, code: "STREAK_7", title: "Uma semana firme", emoji: "🔥", earnedAt: daysAgo(2) },
      { childId: lila.id, code: "BOSS_HUNTER", title: "Caçador de Boss", emoji: "🐲", earnedAt: daysAgo(5) },
      { childId: lila.id, code: "LEVEL_10", title: "Lenda em formação", emoji: "👑", earnedAt: daysAgo(1) },
      { childId: theo.id, code: "FIRST_MISSION", title: "Primeira conquista", emoji: "🌱", earnedAt: daysAgo(9) },
      { childId: theo.id, code: "STREAK_7", title: "Uma semana firme", emoji: "🔥", earnedAt: daysAgo(2) },
      { childId: theo.id, code: "BOSS_HUNTER", title: "Caçador de Boss", emoji: "🐲", earnedAt: daysAgo(5) },
      { childId: theo.id, code: "LEVEL_10", title: "Lenda em formação", emoji: "👑", earnedAt: daysAgo(1) },
    ],
  });

  // Boss mensal — admin define o template; pai ativa por filho
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const robloxBoss = await prisma.reward.findFirstOrThrow({ where: { title: "Robux R$ 30" } });

  const orcTemplate = await prisma.bossTemplate.create({
    data: {
      month, year,
      name: "Klinox, o Orc",
      iconName: "orcboss",
      defaultMaxHp: 500,
    },
  });

  // Lila já ativou o boss (estado existente preservado)
  await prisma.monthlyBoss.create({
    data: {
      childId: lila.id, month, year,
      templateId: orcTemplate.id,
      name: orcTemplate.name, iconName: orcTemplate.iconName,
      maxHp: 500, currentHp: 320,
      active: true,
      rewardId: robloxBoss.id,
    },
  });
  // Théo: sem MonthlyBoss → painel do pai mostra o banner de ativação

  // Cartões mock do pai
  await prisma.paymentCard.createMany({
    data: [
      { userId: parent.id, brand: "VISA",       last4: "4242", holderName: "JOSE V SANTOS", expiryMonth: 12, expiryYear: 2028, isPrimary: true },
      { userId: parent.id, brand: "MASTERCARD", last4: "5555", holderName: "JOSE V SANTOS", expiryMonth: 8,  expiryYear: 2027, isPrimary: false },
      { userId: parent.id, brand: "ELO",        last4: "9981", holderName: "JOSE V SANTOS", expiryMonth: 3,  expiryYear: 2026, isPrimary: false },
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
