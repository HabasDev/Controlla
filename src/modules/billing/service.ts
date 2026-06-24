import "server-only";

import Stripe from "stripe";

import { appEnv } from "@/lib/env";

let stripe: Stripe | null = null;

export function getStripeClient() {
  if (!appEnv.stripeSecretKey) {
    return null;
  }

  stripe ??= new Stripe(appEnv.stripeSecretKey);

  return stripe;
}

export function getPlanLimits(plan: "free" | "starter" | "business" | "enterprise") {
  const limits = {
    free: { assets: 15, users: 2 },
    starter: { assets: 100, users: 5 },
    business: { assets: 500, users: 20 },
    enterprise: { assets: null, users: null }
  } as const;

  return limits[plan];
}
