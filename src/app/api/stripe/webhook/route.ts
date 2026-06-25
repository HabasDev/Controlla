import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

import { getDb } from "@/db";
import { subscriptions } from "@/db/schema";
import { appEnv } from "@/lib/env";
import { getStripeClient } from "@/modules/billing/service";

function isStripeSubscription(value: unknown): value is Stripe.Subscription {
  return typeof value === "object" && value !== null && "id" in value && "status" in value;
}

export async function POST(request: Request) {
  const stripe = getStripeClient();

  if (!stripe || !appEnv.stripeWebhookSecret) {
    return NextResponse.json({ message: "Stripe no esta configurado." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Falta stripe-signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, appEnv.stripeWebhookSecret);
  } catch {
    return NextResponse.json({ message: "Firma de Stripe no valida." }, { status: 400 });
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.created"
  ) {
    const subscription = event.data.object;
    const db = getDb();

    if (db && isStripeSubscription(subscription)) {
      await db
        .update(subscriptions)
        .set({
          stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
    }
  }

  return NextResponse.json({ received: true });
}
