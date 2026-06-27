import Link from "next/link";
import { AlertTriangle, CalendarClock, CheckCircle2, Clock3, FileText, Plus, Radar, Wrench } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { ObligationBoard } from "@/features/obligations/components/obligation-board";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { getDashboardData } from "@/modules/dashboard/data";
import { formatDateEs, formatRelativeDueDate, getDaysUntilDueDate } from "@/lib/date/obligations";

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
  const attentionItems = data.obligations
    .filter((item) => ["expired", "critical", "warning"].includes(item.computedStatus))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);
  const horizonItems = data.obligations
    .slice()
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 7);
  const urgentCount = data.stats.expired + data.stats.dueToday + data.stats.dueIn7;
  const today = new Intl.DateTimeFormat("es-ES", { dateStyle: "full", timeZone: data.company.timezone }).format(new Date());
  const summary =
    urgentCount > 0
      ? `Hay ${urgentCount} obligaciones que requieren atencion esta semana.`
      : "La operativa esta estable. No hay vencimientos criticos esta semana.";

  return (
    <>
      <PageHeader
        title={`Panel de ${data.company.name}`}
        description="Resumen operativo de obligaciones, activos, alertas y actividad reciente."
      />
      <div className="space-y-6 p-6">
        <section className="dark-control-surface overflow-hidden rounded-xl border p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Control room</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{summary}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                {today}. Prioriza lo vencido, revisa los hitos proximos y archiva documentacion antes de que se convierta en urgencia.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className={cn(buttonVariants(), "bg-white text-slate-950 hover:bg-cyan-50")} href="/dashboard/obligaciones">
                  Revisar obligaciones
                </Link>
                <Link className={cn(buttonVariants({ variant: "outline" }), "border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white")} href="/dashboard/documentos">
                  Ver documentos
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Salud operativa</p>
                  <p className="mt-1 text-4xl font-semibold">{Math.round((statusCounts.normal / total) * 100)}%</p>
                </div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/10">
                  <span className="absolute h-12 w-12 rounded-full border border-cyan-200/40 motion-safe:animate-pulse-soft" />
                  <Radar className="h-7 w-7 text-cyan-100" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/10">
                <div className="bg-success" style={{ width: `${(statusCounts.normal / total) * 100}%` }} />
                <div className="bg-warning" style={{ width: `${(statusCounts.warning / total) * 100}%` }} />
                <div className="bg-critical" style={{ width: `${(statusCounts.expired / total) * 100}%` }} />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link className={cn(buttonVariants(), "gap-2")} href="/dashboard/obligaciones">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crear obligacion
          </Link>
          <Link className={cn(buttonVariants({ variant: "outline" }), "gap-2")} href="/dashboard/activos">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Crear activo
          </Link>
          <Link className={cn(buttonVariants({ variant: "outline" }), "gap-2")} href="/dashboard/documentos">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Subir documento
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard detail="Prioridad maxima" href="/dashboard/obligaciones" icon={AlertTriangle} title="Vencidas" tone="critical" value={data.stats.expired} />
          <MetricCard detail="Revisar hoy" href="/dashboard/obligaciones" icon={Clock3} title="Vencen hoy" tone="critical" value={data.stats.dueToday} />
          <MetricCard detail="Proxima semana" href="/dashboard/obligaciones" icon={Clock3} title="7 dias" tone="warning" value={data.stats.dueIn7} />
          <MetricCard detail="Horizonte mensual" href="/dashboard/obligaciones" icon={CalendarClock} title="30 dias" value={data.stats.dueIn30} />
          <MetricCard detail="Archivo privado" href="/dashboard/documentos" icon={FileText} title="Documentos" tone="success" value={data.stats.documents} />
          <MetricCard detail="Recursos activos" href="/dashboard/activos" icon={Wrench} title="Activos" tone="success" value={data.stats.assets} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <Card>
            <CardHeader>
              <CardTitle>Radar de vencimientos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {horizonItems.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                  No hay vencimientos registrados todavia. Crea una obligacion para activar el radar operativo.
                </div>
              ) : (
                horizonItems.map((item) => {
                  const days = getDaysUntilDueDate(item.dueDate, data.company.timezone);
                  return (
                    <Link className="group grid gap-3 rounded-lg border bg-background/70 p-3 transition hover:border-primary/30 hover:bg-background sm:grid-cols-[96px_1fr_auto]" href={`/dashboard/obligaciones/${item.id}`} key={item.id}>
                      <div className="text-sm">
                        <p className="font-semibold">{formatDateEs(item.dueDate)}</p>
                        <p className={cn("text-xs", days <= 7 ? "text-critical" : "text-muted-foreground")}>{formatRelativeDueDate(item)}</p>
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.assetName} - {item.responsibleName}</p>
                      </div>
                      <StatusBadge status={item.computedStatus} />
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requiere atencion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {attentionItems.length === 0 ? (
                <div className="rounded-lg border border-success/20 bg-success/10 p-4">
                  <div className="flex items-center gap-2 font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Sistema en calma
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">No hay obligaciones urgentes en el radar actual.</p>
                </div>
              ) : (
                attentionItems.map((item) => (
                  <div className="rounded-md border p-3" key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeDueDate(item)}</p>
                      </div>
                      <StatusBadge status={item.computedStatus} />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "h-8")} href={`/dashboard/obligaciones/${item.id}`}>
                        Ver expediente
                      </Link>
                    </div>
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
