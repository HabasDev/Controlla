import Image from "next/image";
import Link from "next/link";
import { CalendarDays, FileCheck2, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Vencimientos",
    description: "No pierdas nunca una fecha importante"
  },
  {
    icon: ShieldCheck,
    title: "Seguridad",
    description: "Accesos seguros y controlados"
  },
  {
    icon: FileCheck2,
    title: "Documentos",
    description: "Todo centralizado, todo accesible"
  }
];

function CyberEye() {
  return (
    <div className="relative hidden h-36 max-w-xl items-center justify-center overflow-hidden lg:flex" aria-hidden="true">
      <div className="absolute h-20 w-56 rounded-[50%] bg-teal-300/7 blur-3xl" />
      <Image
        alt=""
        className="relative h-auto w-[18rem] opacity-78 mix-blend-screen drop-shadow-[0_0_22px_rgba(45,212,191,0.22)] [mask-image:radial-gradient(ellipse_at_center,black_36%,rgba(0,0,0,0.74)_58%,transparent_84%)]"
        height={220}
        priority
        src="/images/controla-cyber-eye-linework-v2.png"
        unoptimized
        width={520}
      />
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020814] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(2,8,20,1)_0%,rgba(5,13,29,0.98)_46%,rgba(3,28,38,0.76)_100%)]" />
      <div className="absolute right-[-7rem] top-[-4rem] h-[34rem] w-[34rem] rotate-45 border border-cyan-300/10 bg-cyan-400/5" />
      <div className="absolute right-[-12rem] top-[8rem] h-24 w-[42rem] -rotate-45 bg-teal-400/20 blur-sm" />
      <div className="absolute right-[-10rem] top-[14rem] h-20 w-[34rem] -rotate-45 bg-cyan-300/10" />
      <div className="absolute inset-0 control-grid opacity-[0.08]" />

      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-6 py-10 lg:grid-cols-[1fr_440px] lg:px-10">
        <div className="flex min-h-0 flex-col justify-between lg:min-h-[38rem]">
          <div>
            <Link className="inline-flex items-center gap-3 text-xl font-semibold" href="/">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal-300 text-teal-300">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              Controlla
            </Link>

            <div className="mt-20 hidden max-w-xl lg:block">
              <p className="inline-flex rounded-md bg-teal-400/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-200">
                Bienvenido a Controlla
              </p>
              <h1 className="mt-5 text-5xl font-bold leading-[1.05] text-white md:text-6xl">
                Todo bajo control.
                <span className="block text-teal-300">Siempre.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                La plataforma inteligente para gestionar vencimientos, documentos y accesos en tu empresa.
              </p>

              <div className="mt-8 space-y-5">
                {features.map((feature) => (
                  <div className="flex items-center gap-4" key={feature.title}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-400/12 text-teal-300 shadow-[0_0_30px_rgba(20,184,166,0.18)]">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{feature.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <CyberEye />

          <p className="hidden text-sm text-slate-500 lg:block">2026 Controlla. Todos los derechos reservados.</p>
        </div>

        <div className="mx-auto w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
