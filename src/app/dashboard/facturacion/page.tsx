import { CreditCard } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appEnv } from "@/lib/env";
import { getBillingData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Facturacion"
};

export default async function BillingPage() {
  const data = await getBillingData();
  const stripeReady = Boolean(appEnv.stripeSecretKey);

  return (
    <>
      <PageHeader title="Facturacion" description="Base preparada para suscripciones con Stripe sin exigir claves en desarrollo." />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plan actual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-3xl font-semibold capitalize">{data.subscription.plan}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Limite de activos</p>
                <p className="text-2xl font-semibold">{data.limits.assets ?? "Sin limite"}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Limite de usuarios</p>
                <p className="text-2xl font-semibold">{data.limits.users ?? "Sin limite"}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Estado de suscripcion: {data.subscription.status}</p>
            <Button disabled={!stripeReady}>
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              Gestionar suscripcion
            </Button>
            {!stripeReady ? <p className="text-sm text-muted-foreground">Configura Stripe para activar el portal de suscripcion.</p> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preparado para Stripe</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            La tabla de suscripciones y el webhook estan listos para enlazar clientes, suscripciones y periodos cuando se activen claves reales.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
