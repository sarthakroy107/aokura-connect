import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

async function main() {

  const client = new Pool({
    connectionString: process.env.DB_URL,
  });

  console.log("Migrating database...");

  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migration successful!");
  
  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed");
  console.error(e);
  process.exit(1);
});
