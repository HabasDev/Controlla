import { createClient } from "@supabase/supabase-js";

import { loadEnvFiles } from "@/server/env/load-env-files";

export function getScriptSupabaseAdminClient() {
  loadEnvFiles();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
