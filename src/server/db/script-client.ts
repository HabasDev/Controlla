import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

import * as schema from "@/db/schema";
import { loadEnvFiles } from "@/server/env/load-env-files";

let cachedClient: Sql | null = null;
let cachedDb: PostgresJsDatabase<typeof schema> | null = null;

export function getScriptDb() {
  loadEnvFiles();

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL no esta configurado.");
  }

  if (!cachedClient) {
    cachedClient = postgres(databaseUrl, {
      max: 10,
      prepare: false
    });
  }

  if (!cachedDb) {
    cachedDb = drizzle(cachedClient, { schema });
  }

  return cachedDb;
}

export async function closeScriptDb() {
  if (cachedClient) {
    await cachedClient.end();
    cachedClient = null;
    cachedDb = null;
  }
}
