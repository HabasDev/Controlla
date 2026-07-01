import { Building2, CheckCircle2, FileCheck2, Radar } from "lucide-react";

import { CompanyForm } from "@/components/forms/company-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasDatabaseConfig, hasSupabaseConfig } from "@/lib/env";

export const metadata = {
  title: "Onboarding"
};

export default function OnboardingPage() {
  const disabled = !hasDatabaseConfig() || !hasSupabaseConfig();
  const steps = [
    {
      title: "Empresa",
      description: "Define la entidad sobre la que se aislarán obligaciones, documentos y equipo.",
      icon: Building2,
      active: true
    },
    {
      title: "Primer vencimiento",
      description: "Registra un hito importante para que aparezca en el radar operativo.",
      icon: Radar
    },
    {
      title: "Documentación",
      description: "Adjunta archivos privados cuando exista soporte real de Supabase.",
      icon: FileCheck2
    }
  ];

  return (
    <div className="grid w-full gap-5">
      <aside className="dark-control-surface overflow-hidden rounded-lg p-5 text-white">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Puesta en marcha</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Lleva la empresa al primer estado controlado.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            El onboarding empieza por la empresa activa. Después podrás crear obligaciones, asociar activos y subir documentos.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3" key={step.title}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-cyan-200/25 bg-cyan-200/10">
                <step.icon className="h-4 w-4 text-cyan-100" aria-hidden />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{index + 1}. {step.title}</p>
                  {step.active ? <CheckCircle2 className="h-4 w-4 text-cyan-200" aria-hidden /> : null}
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Crea tu empresa</CardTitle>
          <CardDescription>
            Esta será la empresa activa inicial. Podrás añadir sedes, usuarios, activos y obligaciones después.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm disabled={disabled} />
        </CardContent>
      </Card>
    </div>
  );
}
