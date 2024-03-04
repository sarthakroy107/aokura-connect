import * as schema from "./schema.js";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

// if (!process.env.DB_URL) {
//   console.error("DB_URL not set");
//   process.exit(1);
// }

const pool = new Pool({ connectionString: process.env.DB_URL });
export const db = drizzle(pool, { schema });