import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("TURSO_DATABASE_URL não definido");

const client = createClient({ url, authToken });

const TABLES = [
  "Achievement",
  "WalletTransaction",
  "Redemption",
  "Reward",
  "Streak",
  "XpEvent",
  "MissionLog",
  "Mission",
  "ConsentRecord",
  "Child",
  "User",
  "Family",
  "_prisma_migrations",
];

async function main() {
  console.log("→ Dropando tabelas existentes…");
  for (const t of TABLES) {
    try {
      await client.execute(`DROP TABLE IF EXISTS "${t}"`);
      console.log(`  ✓ ${t}`);
    } catch (e) {
      console.warn(`  ! ${t}:`, (e as Error).message);
    }
  }

  console.log("→ Aplicando schema novo…");
  const sql = readFileSync("/tmp/turso-schema.sql", "utf8");
  // strip comment-only lines, then split on ;
  const cleaned = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  const stmts = cleaned
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const s of stmts) {
    await client.execute(s);
  }
  console.log(`  ✓ ${stmts.length} statements aplicados`);

  console.log("\n✅ Turso resetado. Agora roda: npm run db:seed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
