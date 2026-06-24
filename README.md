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
- `/crianca/[id]` — jornada do dia, XP, nível, streak com escudos de gelo + carrossel de últimas conquistas. Mission cards com cores de raridade (fundo + ícone gradiente por complexidade: Comum/Raro/Lendário/Mítico)
- `/crianca/[id]/recompensas` — loja agrupada, com indicação de quanto falta para cada
- `/crianca/[id]/conquistas` — grid 4-col de troféus coloridos por raridade (Rare/Epic/Legendary/Mythic), bloqueados em silhueta com pista
- `/crianca/[id]/perfil` — perfil estilo rede social: hero do avatar, stats (missões/seguindo/seguidores), chips de visão geral (streak, XP, liga, nível) e família

### Sistema
- Schema Prisma com 12 modelos (família, criança, missões, logs, XP, streak, recompensas, resgates, carteira, transações, conquistas, LGPD)
- Streak com freeze automático
- Engine de conquistas reavaliada após cada aprovação
- XP reservado quando criança resgata (reembolsado se rejeitado)
- Carteira parental real (transações com extrato) — pagamento mockado
- Sistema de raridade de conquistas (Rare, Epic, Legendary, Mythic) com paleta dedicada e tratamento especial (stripes diagonais em Legendary)
- Sistema de raridade de missões (Common, Rare, Legendary, Mythic) — cards com fundo tintado e ícone gradiente por complexidade, definidos em `RARITY_CARD` dentro de `MissionCard.tsx`

## Design system

Tokens centralizados em `tailwind.config.ts` (cores `kid-*`, raios `kid-sm…kid-xl`, animações `wiggle/float/pop`) e utilitários em `src/app/globals.css` (`pattern-diagonal-stripes`, `scrollbar-hide`).

**Raridade de conquistas** — tokens `kid-{rare,epic,legendary,mythic}-{from,to,shadow}` no Tailwind; estilos compostos em `src/lib/enums.ts › RARITY_STYLE` (gradiente + chip + sombra 3D). Ícones PNG resolvidos via `src/lib/iconMap.ts` (emoji → arquivo em `/public/icons`).

**Raridade de missões** — cada mission card exibe fundo tintado e ícone com gradiente de acordo com a complexidade (COMMON cinza-lilás, RARE azul, LEGENDARY dourado, MYTHIC vermelho). Cores em `RARITY_CARD` dentro de `src/components/MissionCard.tsx`. O badge `ComplexityBadge` usa `COMPLEXITY_META` + `RARITY_STYLE` de `enums.ts`.

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
