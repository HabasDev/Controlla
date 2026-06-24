import { NextResponse } from "next/server";

import { getMissingRuntimeWarnings, hasDatabaseConfig, hasSupabaseConfig } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    ok: true,
    services: {
      database: hasDatabaseConfig(),
      supabase: hasSupabaseConfig()
    },
    warnings: getMissingRuntimeWarnings()
  });
}
