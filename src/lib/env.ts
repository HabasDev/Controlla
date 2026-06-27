export const appEnv = {
  get appUrl() {
    return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  },
  get databaseUrl() {
    return process.env.DATABASE_URL;
  },
  get supabaseUrl() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  },
  get supabaseAnonKey() {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  },
  get supabaseServiceRoleKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  },
  get resendApiKey() {
    return process.env.RESEND_API_KEY;
  },
  get emailFrom() {
    return process.env.EMAIL_FROM ?? "Controla <notificaciones@controla.local>";
  },
  get stripeSecretKey() {
    return process.env.STRIPE_SECRET_KEY;
  },
  get stripeWebhookSecret() {
    return process.env.STRIPE_WEBHOOK_SECRET;
  },
  get sentryDsn() {
    return process.env.SENTRY_DSN;
  },
  get triggerSecretKey() {
    return process.env.TRIGGER_SECRET_KEY;
  }
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
