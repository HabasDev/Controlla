import Link from "next/link";
import {
  AlertTriangle,
  Box,
  CalendarClock,
  CalendarDays,
  Clock3,
  FileText,
  HeartPulse,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { ExpirationRadar } from "@/components/dashboard/expiration-radar";
import { getDashboardData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Panel"
};

const toneClasses = {
  cyan: "text-cyan-300 bg-cyan-300/10 border-cyan-300/18",
  red: "text-red-400 bg-red-500/10 border-red-400/20",
  amber: "text-amber-300 bg-amber-400/10 border-amber-300/20",
  green: "text-emerald-300 bg-emerald-400/10 border-emerald-300/20",
  violet: "text-violet-300 bg-violet-400/10 border-violet-300/20"
};

function PanelCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "rounded-xl border border-cyan-200/10 bg-slate-950/46 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </section>
  );
}

function Sparkline({ tone = "cyan" }: { tone?: "cyan" | "red" | "amber" | "green" }) {
  const stroke = {
    cyan: "#22d3ee",
    red: "#ef4444",
    amber: "#f59e0b",
    green: "#22c55e"
  }[tone];

  return (
    <svg className="h-7 w-20 opacity-85" viewBox="0 0 80 28" aria-hidden="true">
      <path d="M2 23 14 11l11 8 13-15 12 12 12-7 16 5" fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="1.5" />
      <path d="M2 28 14 16l11 8 13-15 12 12 12-7 16 5v9H2Z" fill={stroke} opacity="0.12" />
    </svg>
  );
}

function MetricTile({
  title,
  value,
  detail,
  icon: Icon,
  tone
}: {
  title: string;
  value: number;
  detail: string;
  icon: typeof AlertTriangle;
  tone: keyof typeof toneClasses;
}) {
  const sparkTone = tone === "red" ? "red" : tone === "amber" ? "amber" : tone === "green" ? "green" : "cyan";

  return (
    <PanelCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", toneClasses[tone])}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <Sparkline tone={sparkTone} />
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-300">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </PanelCard>
  );
}

function RadarGraphic() {
  return (
    <div className="relative h-48 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_5rem)]">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/28" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/22" />
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />
      <div className="absolute left-1/2 top-1/2 h-px w-48 -translate-x-1/2 bg-cyan-300/20" />
      <div className="absolute left-1/2 top-1/2 h-48 w-px -translate-y-1/2 bg-cyan-300/20" />
      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.95)]" />
      <div className="absolute left-[68%] top-[32%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
      <div className="absolute left-[76%] top-[58%] h-1.5 w-1.5 rounded-full bg-cyan-300" />
      <div className="absolute left-[37%] top-[72%] h-1.5 w-1.5 rounded-full bg-cyan-300" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_50%,rgba(34,211,238,0.12)_50%,transparent_72%)]" />
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const attentionCount = data.stats.expired + data.stats.dueToday + data.stats.dueIn7;
  const today = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric", timeZone: data.company.timezone }).format(new Date());
  const activityItems = data.activity.slice(0, 4);

  return (
    <div className="px-4 pb-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Bienvenido de nuevo, <span className="font-semibold text-cyan-300">{data.company.name}</span>
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Panel de control</h1>
          <p className="mt-2 text-sm text-slate-400">Resumen operativo de obligaciones, activos, alertas y actividad reciente.</p>
        </div>
        <div className="inline-flex h-10 items-center justify-between gap-3 rounded-md border border-cyan-200/10 bg-slate-950/52 px-4 text-sm text-slate-300 backdrop-blur lg:min-w-72">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <time dateTime={new Date().toISOString()}>{today}</time>
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.65fr_0.85fr]">
        <PanelCard className="overflow-hidden p-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Control room</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight text-white">
                {attentionCount > 0
                  ? `Hay ${attentionCount} obligaciones que requieren atencion esta semana.`
                  : "No hay obligaciones criticas esta semana."}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Ultima actualizacion: {today}. Prioriza tu jornada, revisa los items pendientes y mantiene tu operacion al dia.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className={cn(buttonVariants(), "bg-cyan-300 text-slate-950 hover:bg-cyan-200")} href="/dashboard/obligaciones">
                  Revisar obligaciones
                </Link>
                <Link className={cn(buttonVariants({ variant: "outline" }), "border-cyan-200/12 bg-white/[0.03] text-slate-200 hover:bg-white/[0.06] hover:text-white")} href="/dashboard/documentos">
                  Ver documentos
                </Link>
              </div>
            </div>
            <RadarGraphic />
          </div>
        </PanelCard>

        <PanelCard className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Salud operativa</p>
              <p className="mt-5 text-3xl font-semibold text-white">Lo haremos</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                Esta métrica queda pendiente hasta definir un criterio fiable con datos reales.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/14 bg-cyan-300/8 text-cyan-200">
              <HeartPulse className="h-7 w-7" aria-hidden="true" />
            </div>
          </div>
          <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 rounded-full bg-cyan-300/45" />
          </div>
          <svg className="mt-8 h-20 w-full" viewBox="0 0 260 80" aria-hidden="true">
            <path d="M4 58 35 44l31 12 31-36 31 30 31-38 31 20 31-26 35 16" fill="none" stroke="#22d3ee" strokeLinecap="round" strokeWidth="1.5" />
            <path d="M4 80V58l31-14 31 12 31-36 31 30 31-38 31 20 31-26 35 16v58Z" fill="#22d3ee" opacity="0.08" />
          </svg>
        </PanelCard>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
        <MetricTile detail="Prioridad maxima" icon={AlertTriangle} title="Vencidas" tone="red" value={data.stats.expired} />
        <MetricTile detail="Revisar hoy" icon={Clock3} title="Vencen hoy" tone="amber" value={data.stats.dueToday} />
        <MetricTile detail="Proxima semana" icon={CalendarClock} title="7 dias" tone="amber" value={data.stats.dueIn7} />
        <MetricTile detail="Horizonte mensual" icon={CalendarDays} title="30 dias" tone="cyan" value={data.stats.dueIn30} />
        <MetricTile detail="Archivo privado" icon={FileText} title="Documentos" tone="green" value={data.stats.documents} />
        <MetricTile detail="Recursos activos" icon={Box} title="Activos" tone="cyan" value={data.stats.assets} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <ExpirationRadar obligations={data.obligations} timezone={data.company.timezone} />

        <PanelCard className="p-5">
          <h2 className="text-lg font-semibold text-white">Actividad reciente</h2>
          <div className="mt-4 divide-y divide-white/8">
            {activityItems.length === 0 ? (
              <p className="py-6 text-sm text-slate-500">Todavia no hay actividad registrada.</p>
            ) : (
              activityItems.map((activity, index) => (
                <div className="flex items-center gap-3 py-3" key={activity.id}>
                  <span className={cn("h-2.5 w-2.5 rounded-full", index % 3 === 0 ? "bg-red-500" : index % 3 === 1 ? "bg-green-400" : "bg-cyan-400")} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-300">{activity.label}</p>
                    <p className="truncate text-xs text-slate-500">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-slate-600">{new Date(activity.createdAt).toLocaleDateString("es-ES")}</span>
                </div>
              ))
            )}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
