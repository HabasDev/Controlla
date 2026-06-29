import Link from "next/link";
import { Bell, CalendarDays, Cloud, FileText, Gauge, HelpCircle, LockKeyhole, ShieldCheck, Zap } from "lucide-react";

import { LoginForm } from "@/components/forms/auth-forms";

const featureList = [
  {
    icon: CalendarDays,
    title: "Vencimientos",
    description: "Nunca pierdas una fecha importante."
  },
  {
    icon: ShieldCheck,
    title: "Seguridad",
    description: "Accesos seguros y controlados."
  },
  {
    icon: FileText,
    title: "Documentos",
    description: "Todo centralizado, todo accesible."
  }
];

const controlCards = [
  {
    icon: Zap,
    title: "Panel inteligente",
    description: "Resumen claro de lo que importa, siempre actualizado.",
    tone: "text-violet-300"
  },
  {
    icon: Gauge,
    title: "Control total",
    description: "Toma decisiones con datos reales y en tiempo real.",
    tone: "text-teal-300"
  },
  {
    icon: Bell,
    title: "Alertas criticas",
    description: "Recibe avisos antes de que sea demasiado tarde.",
    tone: "text-sky-300"
  },
  {
    icon: Cloud,
    title: "En la nube, seguro",
    description: "Tu informacion protegida con tecnologia de vanguardia.",
    tone: "text-fuchsia-300"
  }
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020814] text-white">
      <section className="relative isolate min-h-screen px-6 py-6">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/controla-night-road.png')" }}
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_35%_18%,rgba(20,184,166,0.1),transparent_24rem),linear-gradient(90deg,rgba(2,8,20,0.6)_0%,rgba(2,8,20,0.32)_45%,rgba(2,8,20,0.82)_72%,rgba(2,8,20,0.95)_100%),linear-gradient(180deg,rgba(2,8,20,0.18)_0%,rgba(2,8,20,0.35)_58%,#020814_100%)]" />

        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
          <header className="flex items-center justify-between">
            <Link className="flex items-center gap-2 text-xl font-semibold text-white" href="/">
              <ShieldCheck className="h-7 w-7 text-teal-300" aria-hidden="true" />
              Controlla
            </Link>
            <div className="hidden items-center gap-2 text-xs text-slate-300 sm:flex">
              <span>Modo oscuro</span>
              <span className="h-2.5 w-2.5 rounded-full bg-teal-300 shadow-[0_0_14px_rgba(45,212,191,0.8)]" />
            </div>
          </header>

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_486px] lg:py-8">
            <section className="relative min-w-0">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                Plataforma inteligente
              </p>
              <h1 className="mt-5 max-w-xl text-5xl font-bold leading-[1.03] text-white md:text-6xl">
                Tu empresa,
                <span className="block">bajo <span className="text-teal-300">control.</span></span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                Gestiona vencimientos, documentos y accesos de forma segura y centralizada.
              </p>

              <div className="mt-8 space-y-5">
                {featureList.map((feature) => (
                  <div className="flex items-center gap-4" key={feature.title}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/12 text-teal-300 shadow-[0_0_32px_rgba(20,184,166,0.18)]">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{feature.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 hidden max-w-sm rounded-2xl border border-teal-300/15 bg-slate-950/24 p-4 text-sm text-slate-300 shadow-2xl shadow-black/20 backdrop-blur-sm lg:block">
                <p className="font-medium text-teal-200">Ruta operativa iluminada</p>
                <p className="mt-2 leading-6">
                  Cada vencimiento, documento y responsable avanza hacia el mismo panel de control.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-900/58 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl lg:p-10">
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-semibold">Iniciar sesion</h2>
                  <p className="mt-2 text-sm text-slate-300">Accede a tu panel de empresa</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                  <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <LoginForm />
              <div className="mt-7 flex items-center gap-4 text-xs text-slate-500">
                <span className="h-px flex-1 bg-white/10" />
                <span>o continua con</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <button
                className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-md border border-white/10 bg-white/[0.03] text-sm font-medium text-slate-400"
                disabled
                type="button"
              >
                Google no configurado
              </button>
            </section>
          </div>

          <section className="mb-8 rounded-2xl border border-white/10 bg-slate-900/48 px-6 py-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Todo lo que necesitas, en un solo lugar
            </p>
            <div className="mt-7 grid gap-6 md:grid-cols-4">
              {controlCards.map((item) => (
                <div className="text-center" key={item.title}>
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-white/[0.06] ${item.tone}`}>
                    <item.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                  <p className="mx-auto mt-2 max-w-40 text-xs leading-5 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-base font-semibold text-white">
                <ShieldCheck className="h-5 w-5 text-teal-300" aria-hidden="true" />
                Controlla
              </div>
              <p className="mt-2">2026 Controlla. Todos los derechos reservados.</p>
            </div>
            <div className="flex items-center gap-7">
              <Link className="hover:text-slate-300" href="/login">Privacidad</Link>
              <Link className="hover:text-slate-300" href="/login">Terminos</Link>
              <Link className="hover:text-slate-300" href="/login">Soporte</Link>
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
