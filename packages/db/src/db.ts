import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { loadEnvConfig } from "@next/env";
import { cwd } from "node:process";

loadEnvConfig(cwd());

if (!process.env.DB_URL) {
  console.error("DB_URL not set");
  process.exit(1);
}

const client = new Pool({
  connectionString: process.env.DB_URL,
});

export const db = drizzle(client, { schema });
