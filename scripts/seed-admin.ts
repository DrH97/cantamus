/**
 * Seed an initial admin user.
 *
 * Usage: ADMIN_USER=admin ADMIN_PASS=yourpassword pnpm db:seed-admin
 */

import { createClient } from "@libsql/client";
import { hash } from "bcryptjs";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const DB_URL = process.env.DATABASE_URL ?? "file:./data/local.db";

async function main() {
  const username = process.env.ADMIN_USER ?? "admin";
  const password = process.env.ADMIN_PASS;

  if (!password) {
    console.error("Set ADMIN_PASS env var. Example:");
    console.error("  ADMIN_PASS=mysecret pnpm db:seed-admin");
    process.exit(1);
  }

  const client = createClient({ url: DB_URL });
  const db = drizzle(client, { schema });

  const passwordHash = await hash(password, 12);

  await db
    .insert(schema.adminUsers)
    .values({
      id: crypto.randomUUID(),
      username,
      passwordHash,
    })
    .onConflictDoUpdate({
      target: schema.adminUsers.username,
      set: { passwordHash },
    });

  console.log(`Admin user "${username}" created/updated.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
