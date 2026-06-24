export const appEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? "Controla <notificaciones@controla.local>",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  sentryDsn: process.env.SENTRY_DSN,
  triggerSecretKey: process.env.TRIGGER_SECRET_KEY
} as const;

export function hasDatabaseConfig() {
  return Boolean(appEnv.databaseUrl);
}

export function hasSupabaseConfig() {
  return Boolean(appEnv.supabaseUrl && appEnv.supabaseAnonKey);
}

export function getMissingRuntimeWarnings() {
  const warnings: string[] = [];

  if (!hasSupabaseConfig()) {
    warnings.push("Supabase Auth no esta configurado. Las acciones de autenticacion quedan desactivadas.");
  }

  if (!hasDatabaseConfig()) {
    warnings.push("DATABASE_URL no esta configurado. El panel muestra datos demo locales.");
  }

  if (!appEnv.resendApiKey) {
    warnings.push("RESEND_API_KEY no esta configurado. Los emails no se enviaran.");
  }

  if (!appEnv.stripeSecretKey) {
    warnings.push("Stripe no esta configurado. Facturacion queda en modo preparacion.");
  }

  if (!appEnv.triggerSecretKey) {
    warnings.push("Trigger.dev no esta configurado. Las tareas programadas quedan preparadas para activarse.");
  }

  return warnings;
}
