import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { getDb } from "@/db";
import { getMissingRuntimeWarnings, hasDatabaseConfig, hasSupabaseConfig } from "@/lib/env";

export async function GET() {
  const db = getDb();
  let databaseReachable: boolean | null = null;

  if (db) {
    try {
      await db.execute(sql`select 1`);
      databaseReachable = true;
    } catch {
      databaseReachable = false;
    }
  }

  return NextResponse.json({
    ok: true,
    services: {
      database: hasDatabaseConfig(),
      supabase: hasSupabaseConfig()
    },
    checks: {
      databaseReachable
    },
    warnings: getMissingRuntimeWarnings()
  });
}
