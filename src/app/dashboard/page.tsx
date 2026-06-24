import { AlertTriangle, Archive, CalendarClock, CheckCircle2, Clock3 } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { ObligationBoard } from "@/components/dashboard/obligation-board";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Panel"
};

export default async function DashboardPage() {
  const data = await getDashboardData();
  const statusCounts = {
    normal: data.obligations.filter((item) => item.computedStatus === "normal").length,
    warning: data.obligations.filter((item) => item.computedStatus === "warning").length,
    expired: data.obligations.filter((item) => item.computedStatus === "expired" || item.computedStatus === "critical").length
  };
  const total = Math.max(statusCounts.normal + statusCounts.warning + statusCounts.expired, 1);

  return (
    <>
      <PageHeader
        title={`Panel de ${data.company.name}`}
        description="Resumen operativo de obligaciones, activos, alertas y actividad reciente."
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={AlertTriangle} title="Obligaciones vencidas" tone="critical" value={data.stats.expired} />
          <MetricCard icon={Clock3} title="Vencen en 7 dias" tone="warning" value={data.stats.dueIn7} />
          <MetricCard icon={CalendarClock} title="Vencen en 30 dias" value={data.stats.dueIn30} />
          <MetricCard icon={Archive} title="Activos" tone="success" value={data.stats.assets} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Estado general</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-4 overflow-hidden rounded-full bg-muted">
                <div className="bg-success" style={{ width: `${(statusCounts.normal / total) * 100}%` }} />
                <div className="bg-warning" style={{ width: `${(statusCounts.warning / total) * 100}%` }} />
                <div className="bg-critical" style={{ width: `${(statusCounts.expired / total) * 100}%` }} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                  Correcto: {statusCounts.normal}
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-warning" aria-hidden="true" />
                  Proximo: {statusCounts.warning}
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-critical" aria-hidden="true" />
                  Urgente o vencido: {statusCounts.expired}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas criticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin obligaciones criticas.</p>
              ) : (
                data.alerts.map((alert) => (
                  <div className="rounded-md border p-3" key={alert.id}>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Proximas obligaciones</h2>
          <ObligationBoard locations={data.locations} members={data.members} obligations={data.obligations} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.activity.map((activity) => (
              <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0" key={activity.id}>
                <div>
                  <p className="text-sm font-medium">{activity.label}</p>
                  <p className="text-xs text-muted-foreground">{activity.detail}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleDateString("es-ES")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
