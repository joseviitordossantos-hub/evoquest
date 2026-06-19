# AprendeAi — Protótipo V0+

App de motivação familiar para apresentação. Família Silva pré-populada com 2 crianças, histórico de missões, conquistas, carteira parental com saldo e 16 recompensas em 4 categorias.

## Rodar

```bash
npm install
npx prisma db push
npm run db:seed   # idempotente — pode rodar sempre
npm run dev
```

## Roteiro de demo (recomendado)

1. **`/`** — landing. Clique numa das crianças (Lila tem mais conteúdo).
2. **`/crianca/[lila]`** — jornada gamificada. Aba **Hoje** com missões pendentes.
3. Marca uma missão como "Eu fiz!" — vira PENDENTE.
4. Aba **Loja** — catálogo agrupado por tipo (Digital / Experiência / Físico / Privilégio). Resgate algo que ela pode pagar (ex: Pizza de sexta, 150 XP).
5. Aba **Troféus** — conquistas já desbloqueadas + bloqueadas com pista.
6. Volte na home, entre como **responsável** (`/pai`).
7. **Painel**: resumo da família, ações pendentes, missões e aprovações por filho.
8. **/pai/resgates**: aprove o pedido da criança. Se for recompensa digital com custo R$, o botão "Marcar entregue" debita a carteira.
9. **/pai/carteira**: extrato + adicionar saldo (Pix/Cartão — mockado para demo).
10. **/pai/recompensas**: catálogo gerenciável. **+ Nova recompensa** cria itens novos.

## Funcionalidades implementadas

### Pai (estética editorial)
- `/pai` — painel com saldo, resgates pendentes, missões/aprovações por filho
- `/pai/missao/nova` — criar missão (categoria, dificuldade, XP, recompensa textual)
- `/pai/aprovar` — aprovação em lote semanal (com auto-cálculo de conquistas)
- `/pai/recompensas` — catálogo agrupado por tipo, ativar/desativar
- `/pai/recompensas/nova` — criar recompensa (emoji, tipo, custo XP + R$)
- `/pai/carteira` — saldo, adicionar fundos (Pix/Cartão mockados), extrato
- `/pai/resgates` — aprovar, rejeitar (com reembolso de XP), marcar como entregue (debita carteira)

### Criança (estética gamificada)
- `/crianca/[id]` — jornada do dia, XP, nível, streak com escudos de gelo
- `/crianca/[id]/recompensas` — loja agrupada, com indicação de quanto falta para cada
- `/crianca/[id]/conquistas` — 8 badges, ganhas e bloqueadas com pista

### Sistema
- Schema Prisma com 12 modelos (família, criança, missões, logs, XP, streak, recompensas, resgates, carteira, transações, conquistas, LGPD)
- Streak com freeze automático
- Engine de conquistas reavaliada após cada aprovação
- XP reservado quando criança resgata (reembolsado se rejeitado)
- Carteira parental real (transações com extrato) — pagamento mockado

## Recompensas pré-cadastradas

**Digitais** (custo XP + R$ debitado da carteira):
- 🟢 Robux R$ 15 / R$ 30 — provedor Roblox
- 🎮 V-Bucks R$ 25 — Epic Games
- 🕹️ Steam R$ 20
- 🎵 Spotify 1 mês
- 📚 Kindle e-book R$ 15

**Experiências** (combinadas):
- 🎬 Cinema (R$ 40)
- 🍕 Pizza de sexta (sem custo R$)
- ⛺ Acampamento no quintal

**Físicos** (entrega presencial):
- 🍦 Sorvete · 📖 Livro novo · 🃏 Figurinhas

**Privilégios** (zero R$):
- 🎞️ Escolher filme · 📱 +30min tela · 🌙 Ficar acordado · 🆓 Dispensar tarefa

## O que ainda falta (próximo turno)

- Auth real (qualquer um abre `/pai` hoje)
- Onboarding (cadastro família + termo LGPD)
- Upload de foto opcional na conclusão de missão
- PWA + responsive mobile polido
- Notificação semanal "ação pendente" para o pai
- Gateway de pagamento real (Stripe / Pagar.me) substituindo o mock
- API de gift card (Reloadly / Tremendous) para entrega automática

## Stack

Next.js 15 (App Router) · TypeScript · Prisma · SQLite (V0 — schema pronto para PostgreSQL no V1) · Tailwind · Server Actions.
