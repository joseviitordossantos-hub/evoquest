import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PaiNav from "@/components/PaiNav";
import Footer from "@/components/Footer";
import XpComplexityPicker from "@/components/XpComplexityPicker";
import AppIcon from "@/components/AppIcon";
import { emojiToIconName } from "@/lib/iconMap";

export const dynamic = "force-dynamic";

async function createMission(formData: FormData) {
  "use server";
  const childId = String(formData.get("childId"));
  const title = String(formData.get("title"));
  const category = String(formData.get("category"));
  const difficulty = String(formData.get("difficulty")) as "COMMON" | "RARE" | "LEGENDARY" | "MYTHIC";
  const xpReward = Number(formData.get("xpReward"));
  const rewardText = String(formData.get("rewardText") || "");
  const rewardId = String(formData.get("rewardId") || "");
  const frequency = String(formData.get("frequency")) as "DAILY" | "WEEKLY" | "ONCE";

  const parent = await prisma.user.findFirstOrThrow({ where: { role: "PARENT" } });

  await prisma.mission.create({
    data: {
      childId,
      title,
      category,
      difficulty,
      xpReward,
      rewardText: rewardText || null,
      rewardId: rewardId || null,
      frequency,
      createdById: parent.id,
    },
  });

  if (rewardId) {
    const r = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (r && r.kind === "DIGITAL_CODE" && r.costCents > 0 && r.stock > 0) {
      await prisma.reward.update({
        where: { id: rewardId },
        data: { stock: { decrement: 1 } },
      });
    }
  }

  redirect("/pai");
}

export default async function NovaMissao({
  searchParams,
}: {
  searchParams: Promise<{ childId?: string; rewardId?: string }>;
}) {
  const { childId, rewardId } = await searchParams;

  const [child, allRewards, family] = await Promise.all([
    childId
      ? prisma.child.findUnique({ where: { id: childId } })
      : Promise.resolve(null),
    prisma.reward.findMany({ where: { active: true }, orderBy: { title: "asc" } }),
    prisma.family.findFirst({ include: { children: { orderBy: { displayName: "asc" } } } }),
  ]);
  const availableRewards = allRewards.filter(
    (r) => !(r.kind === "DIGITAL_CODE" && r.costCents > 0) || r.stock > 0
  );
  const lockedReward = rewardId ? allRewards.find((r) => r.id === rewardId) ?? null : null;
  const lockedRewardIcon = lockedReward ? emojiToIconName(lockedReward.emoji) : null;
  const children = family?.children ?? [];

  return (
    <main className="min-h-screen bg-kid-base pattern-dots-violet font-body">
      <PaiNav active="painel" />
      <div className="px-4 sm:px-6 py-8 sm:py-10 max-w-2xl mx-auto">
        <span className="kid-chip kid-chip-violet">NOVA MISSÃO</span>
        <h1 className="font-heading font-bold text-4xl text-kid-text-strong leading-tight mt-3 mb-3">
          {child ? `Pra ${child.displayName}` : "Criar missão"}
        </h1>

        {lockedReward && (
          <div className="bg-white rounded-kid-xl p-4 mb-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-[10px] bg-kid-base flex items-center justify-center shrink-0">
              {lockedRewardIcon ? (
                <AppIcon name={lockedRewardIcon} size={40} />
              ) : (
                <span className="text-3xl">{lockedReward.emoji}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body font-extrabold text-[10px] uppercase tracking-[0.12em] text-kid-text-muted">
                Prêmio vinculado
              </p>
              <p className="font-heading font-bold text-[16px] text-kid-text-strong leading-tight">
                {lockedReward.title}
              </p>
              <p className="font-body font-bold text-[12px] text-kid-text-muted mt-0.5">
                Custa {lockedReward.coinsCost} coins · estoque: {lockedReward.stock}
              </p>
            </div>
          </div>
        )}

        <form
          action={createMission}
          className="bg-white rounded-kid-xl p-6 space-y-4"
        >
          {!child && (
            <Field label="Para qual filho?">
              {children.length === 0 ? (
                <p className="font-body text-[13px] text-kid-text-muted bg-kid-base rounded-[10px] p-3">
                  Sem crianças cadastradas.
                </p>
              ) : (
                <select name="childId" required className="kid-input" defaultValue="">
                  <option value="" disabled>
                    — Selecione uma criança —
                  </option>
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.displayName}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          )}
          {child && <input type="hidden" name="childId" value={child.id} />}

          <Field label="Título da missão">
            <input
              name="title"
              required
              className="kid-input"
              placeholder="Ler 10 páginas"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Categoria">
              <select name="category" className="kid-input">
                <option value="leitura">Leitura</option>
                <option value="estudo">Estudo</option>
                <option value="idioma">Idioma</option>
                <option value="esporte">Esporte</option>
                <option value="rotina">Rotina</option>
                <option value="outro">Outro</option>
              </select>
            </Field>
            <Field label="Frequência">
              <select name="frequency" className="kid-input">
                <option value="DAILY">Diária</option>
                <option value="WEEKLY">Semanal</option>
                <option value="ONCE">Uma vez (meta)</option>
              </select>
            </Field>
          </div>
          <XpComplexityPicker />

          {lockedReward ? (
            <input type="hidden" name="rewardId" value={lockedReward.id} />
          ) : (
            <Field label="Vincular recompensa do estoque (opcional)">
              {availableRewards.length === 0 ? (
                <p className="font-body text-[13px] text-kid-text-muted bg-kid-base rounded-[10px] p-3">
                  Sem recompensas em estoque. Vá em{" "}
                  <a href="/pai/recompensas" className="text-kid-violet font-extrabold underline">
                    Recompensas
                  </a>{" "}
                  e clique em <strong>Comprar</strong> para adicionar itens ao estoque.
                </p>
              ) : (
                <select name="rewardId" className="kid-input" defaultValue="">
                  <option value="">— Nenhuma —</option>
                  {availableRewards.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.emoji} {r.title} (estoque: {r.stock})
                    </option>
                  ))}
                </select>
              )}
            </Field>
          )}

          <Field label="Recompensa combinada por texto (opcional)">
            <input
              name="rewardText"
              className="kid-input"
              placeholder="Ex: 1h extra de Roblox no fim de semana"
            />
          </Field>
          <div className="flex gap-3 pt-2 flex-wrap">
            <button type="submit" className="kid-btn">Criar missão</button>
            <a href="/pai" className="kid-btn kid-btn-secondary">Cancelar</a>
          </div>
        </form>
        <Footer />
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-body font-extrabold text-[12px] uppercase tracking-[0.12em] text-kid-text-strong block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
