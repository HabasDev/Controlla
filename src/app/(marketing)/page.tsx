import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CalendarClock,
  FileCheck2,
  Gauge,
  LockKeyhole,
  ShieldCheck
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const controlItems = [
  "ITV y seguros",
  "Extintores",
  "Mantenimientos",
  "Licencias",
  "Contratos",
  "Certificados",
  "Dominios",
  "SSL"
];

const benefits = [
  { icon: CalendarClock, title: "Radar de vencimientos", text: "Prioriza vencido, hoy, 7 dias y 30 dias sin depender de hojas sueltas." },
  { icon: BellRing, title: "Avisos operativos", text: "Recordatorios preparados para email y panel, con reglas por obligacion." },
  { icon: FileCheck2, title: "Documentos privados", text: "Archivos asociados a activos u obligaciones con URLs firmadas." },
  { icon: ShieldCheck, title: "Multiempresa seguro", text: "Separacion por empresa, roles y politicas RLS en base de datos." }
];

const steps = [
  "Registra una obligacion critica",
  "Asociala a un activo o sede",
  "Adjunta documentacion",
  "Revisa el radar antes del vencimiento"
];

export default function MarketingPage() {
  return (
    <main className="overflow-x-hidden bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 control-grid opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.22),transparent_28rem),radial-gradient(circle_at_84%_18%,rgba(245,158,11,0.12),transparent_22rem),linear-gradient(180deg,rgba(2,6,23,0.2),#020617_88%)]" />
        <div className="relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-6 py-6">
          <nav className="flex items-center justify-between gap-4">
            <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
              <ShieldCheck className="h-6 w-6 text-cyan-200" aria-hidden="true" />
              Controlla
            </Link>
            <div className="flex items-center gap-2">
              <Link className="hidden text-sm font-medium text-slate-200 hover:text-white sm:inline" href="/login">
                Entrar
              </Link>
              <Link className={cn(buttonVariants({ size: "sm" }), "bg-white text-slate-950 hover:bg-cyan-50")} href="/register">
                Contratar
              </Link>
            </div>
          </nav>

          <div className="grid min-w-0 flex-1 items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_520px]">
            <div className="min-w-0 max-w-3xl">
              <Badge className="border-cyan-200/40 bg-cyan-200/10 text-cyan-50" variant="outline">
                Centro de control para obligaciones criticas
              </Badge>
              <h1 className="mt-6 max-w-full break-words text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Detecta lo que vence antes de que se convierta en un problema.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Controlla organiza caducidades, activos y documentos para que una pyme sepa que requiere atencion, quien responde y que evidencia esta archivada.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className={cn(buttonVariants({ size: "lg" }), "bg-white text-slate-950 hover:bg-cyan-50")} href="/register">
                  Contratar ahora
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white")} href="#como-funciona">
                  Ver como funciona
                </Link>
              </div>
            </div>

            <div className="dark-control-surface motion-enter min-w-0 rounded-2xl border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Radar operativo</p>
                  <p className="text-xs text-slate-400">Europe/Madrid - datos de empresa</p>
                </div>
                <Badge className="border-cyan-200/30 bg-cyan-200/10 text-cyan-50" variant="outline">Sistema listo</Badge>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  ["Vencido", "Seguro flota", "hace 3 dias", "critical"],
                  ["Hoy", "Revision extintores", "vence hoy", "warning"],
                  ["7 dias", "ITV furgoneta", "vence en 7 dias", "warning"],
                  ["30 dias", "Certificado SSL", "vence en 29 dias", "success"]
                ].map(([slot, title, detail, tone]) => (
                  <div className="grid grid-cols-[minmax(0,72px)_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3" key={title}>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{slot}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{title}</p>
                      <p className="text-xs text-slate-400">{detail}</p>
                    </div>
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        tone === "critical" ? "bg-critical" : tone === "warning" ? "bg-warning" : "bg-success"
                      )}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Salud operativa</span>
                  <span className="font-semibold text-cyan-100">86%</span>
                </div>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/10">
                  <span className="w-[14%] bg-critical" />
                  <span className="w-[22%] bg-warning" />
                  <span className="flex-1 bg-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background text-foreground" id="como-funciona">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">El coste del olvido</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Excel, calendarios y notas no son un sistema de control.</h2>
            <p className="mt-4 text-muted-foreground">
              Una pyme necesita saber que vence, donde esta el documento, quien se ocupa y que pasa primero. Controlla convierte obligaciones dispersas en una cola operativa clara.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {controlItems.map((item) => (
              <div className="control-surface flex items-center gap-3 rounded-lg border p-4" key={item}>
                <Gauge className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-card text-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Producto</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Control visual sin perder rigor operativo.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title}>
                <CardHeader>
                  <benefit.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-muted-foreground">{benefit.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background text-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Flujo</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Primer valor en minutos, no en semanas de implantacion.</h2>
          </div>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div className="control-surface flex items-center gap-4 rounded-lg border p-4" key={step}>
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-16">
        <div className="dark-control-surface mx-auto max-w-5xl rounded-2xl border p-8 text-center">
          <LockKeyhole className="mx-auto h-8 w-8 text-cyan-100" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Empieza con una beta privada de pago.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Sin promesas falsas ni logos inventados: configura tu empresa, registra vencimientos reales y valida si Controlla encaja en tu operativa.
          </p>
          <div className="mt-6">
            <Link className={cn(buttonVariants({ size: "lg" }), "bg-white text-slate-950 hover:bg-cyan-50")} href="/register">
              Contratar acceso
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950 px-6 py-8 text-sm text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Controlla. Control operativo de fechas criticas y documentacion empresarial.</p>
          <div className="flex gap-4">
            <Link className="hover:text-white" href="/login">Entrar</Link>
            <Link className="hover:text-white" href="/register">Contratar</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
