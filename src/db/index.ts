import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/sogd_realty";

// Auto-detect SSL for cloud databases (Neon.tech, Supabase, AWS RDS, etc.)
const needsSsl =
  connectionString.includes("sslmode=require") ||
  connectionString.includes("neon.tech") ||
  connectionString.includes("supabase.co") ||
  connectionString.includes("pooler.supabase.com");

export const pgClient = postgres(connectionString, {
  prepare: false, // Essential for PgBouncer & Supabase/Neon connection poolers
  ssl: needsSsl ? "require" : false,
  max: 10,
});

export const db = drizzle(pgClient, { schema });

export type Database = typeof db;
