import Link from "next/link";
import { CalendarClock, FileCheck2, Radar, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1fr_460px]">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 control-grid opacity-25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(45,212,191,0.22),transparent_28rem)]" />
        <Link className="relative flex items-center gap-2 text-lg font-semibold" href="/">
          <ShieldCheck className="h-6 w-6 text-cyan-200" aria-hidden="true" />
          Controlla
        </Link>
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Acceso seguro</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight">Ordena fechas criticas antes de que se conviertan en urgencias.</h1>
          <p className="mt-4 max-w-lg text-slate-300">
            Gestiona empresas, sedes, activos, obligaciones, documentos y avisos con separacion segura por compañía.
          </p>
          <div className="mt-8 grid max-w-lg gap-3">
            {[
              { icon: Radar, label: "Radar de vencimientos" },
              { icon: CalendarClock, label: "Fechas en Europe/Madrid" },
              { icon: FileCheck2, label: "Documentacion privada firmada" }
            ].map((item) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={item.label}>
                <item.icon className="mb-3 h-5 w-5 text-cyan-100" aria-hidden="true" />
                <p className="font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-sm text-slate-400">Fechas en formato DD/MM/YYYY. Acceso preparado para beta privada.</p>
      </section>
      <section className="flex items-center justify-center bg-background px-6 py-12 text-foreground">{children}</section>
    </main>
  );
}
