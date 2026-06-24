import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BellRing, Building2, CalendarClock, FileCheck2, ShieldCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const benefits = [
  { icon: CalendarClock, title: "Calendario critico", text: "ITV, seguros, licencias y certificados ordenados por urgencia." },
  { icon: BellRing, title: "Avisos configurables", text: "Recordatorios antes y despues del vencimiento, por email o panel." },
  { icon: FileCheck2, title: "Documentos privados", text: "Archivos asociados a activos y obligaciones con descarga firmada." },
  { icon: ShieldCheck, title: "Multiempresa seguro", text: "Datos separados por empresa con roles, permisos y RLS." }
];

const useCases = ["ITV y seguros", "Extintores", "Revisiones electricas", "Formacion PRL", "Licencias", "Contratos", "Dominios web", "Certificados SSL"];
const sectors = ["Talleres", "Gimnasios", "Restaurantes", "Transporte", "Clinicas", "Comunidades"];
const plans = [
  { name: "Free", price: "0 EUR", detail: "Para validar el flujo con pocos activos.", features: ["15 activos", "2 usuarios", "Avisos basicos"] },
  { name: "Starter", price: "29 EUR", detail: "Para pymes con obligaciones recurrentes.", features: ["100 activos", "5 usuarios", "Documentos privados"] },
  { name: "Business", price: "79 EUR", detail: "Para equipos con varias sedes.", features: ["500 activos", "20 usuarios", "Informes mensuales"] }
];

export default function MarketingPage() {
  return (
    <main className="bg-background">
      <section className="relative min-h-[88vh] overflow-hidden text-white">
        <Image alt="Panel operativo de Controla" className="object-cover" fill priority sizes="100vw" src="/images/controla-hero.png" />
        <div className="absolute inset-0 bg-slate-950/68" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-6 py-6">
          <nav className="flex items-center justify-between">
            <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
              <ShieldCheck className="h-6 w-6 text-teal-200" aria-hidden="true" />
              Controla
            </Link>
            <div className="flex items-center gap-2">
              <Link className="hidden text-sm text-slate-200 hover:text-white sm:inline" href="/login">
                Entrar
              </Link>
              <Link className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "bg-white text-slate-950 hover:bg-slate-100")} href="/register">
                Probar gratis
              </Link>
            </div>
          </nav>

          <div className="max-w-3xl pb-16 pt-24">
            <Badge className="mb-5 bg-white/[0.12] text-white" variant="outline">
              SaaS para caducidades, revisiones y documentacion
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
              No vuelvas a olvidar una fecha critica para tu negocio.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
              Controla seguros, ITV, extintores, mantenimientos, licencias, contratos y documentacion desde un solo lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className={cn(buttonVariants({ size: "lg" }), "bg-white text-slate-950 hover:bg-slate-100")} href="/register">
                Probar gratis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
                <Link className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/50 bg-white/[0.08] text-white hover:bg-white/[0.14]")} href="#como-funciona">
                Ver como funciona
              </Link>
            </div>
          </div>

          <div className="grid gap-3 pb-4 sm:grid-cols-3">
            {["Vencido", "Proximo a vencer", "Correcto"].map((label) => (
              <div className="rounded-lg border border-white/[0.18] bg-white/10 p-3 backdrop-blur" key={label}>
                <p className="text-sm text-slate-200">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{label === "Vencido" ? "3" : label === "Proximo a vencer" ? "12" : "86%"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16" id="como-funciona">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Beneficios</p>
          <h2 className="mt-2 text-3xl font-semibold">Un panel para saber que requiere atencion y quien responde.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardHeader>
                <benefit.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{benefit.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Casos de uso</p>
            <h2 className="mt-2 text-3xl font-semibold">Pensado para obligaciones operativas, no para tareas genericas.</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {useCases.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Sectores</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sectors.map((sector) => (
                <div className="flex items-center gap-3 rounded-lg border bg-background p-4" key={sector}>
                  <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="font-medium">{sector}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Planes</p>
          <h2 className="mt-2 text-3xl font-semibold">Precios provisionales para preparar la suscripcion.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <p className="text-3xl font-semibold">{plan.price}</p>
                <p className="text-sm text-muted-foreground">{plan.detail}</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <div className="flex items-center gap-2" key={feature}>
                    <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
                    {feature}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t bg-card px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Controla. SaaS para fechas criticas y documentacion empresarial.</p>
          <div className="flex gap-4">
            <Link href="/login">Entrar</Link>
            <Link href="/register">Probar gratis</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
