import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg";
import * as schema from "./schema";
import { loadEnvConfig } from "@next/env";
import { cwd } from "node:process";

loadEnvConfig(cwd());

if(!process.env.DB_URL) {
    console.error("DB_URL not set");
    console.log(process.env.DB_URL)
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

export const db = drizzle(pool, { schema });

async function main() {
    console.log("Migrating database...");
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migration ended...");
    return;
}


main();
