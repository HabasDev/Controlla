import "server-only";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

import { appEnv } from "@/lib/env";

import * as schema from "./schema";

let cachedClient: Sql | null = null;
let cachedDb: PostgresJsDatabase<typeof schema> | null = null;

export function getDb() {
  if (!appEnv.databaseUrl) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = postgres(appEnv.databaseUrl, {
      max: 10,
      prepare: false
    });
  }

  if (!cachedDb) {
    cachedDb = drizzle(cachedClient, { schema });
  }

  return cachedDb;
}

export function requireDb() {
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL no esta configurado.");
  }

  return db;
}
