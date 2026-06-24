import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1fr_440px]">
      <section className="hidden border-r bg-card p-10 lg:flex lg:flex-col lg:justify-between">
        <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          Controla
        </Link>
        <div>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight">Ordena fechas criticas antes de que se conviertan en urgencias.</h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Gestiona empresas, sedes, activos, obligaciones, documentos y avisos con separacion segura por compania.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">Europe/Madrid por defecto. Fechas en formato DD/MM/YYYY.</p>
      </section>
      <section className="flex items-center justify-center px-6 py-12">{children}</section>
    </main>
  );
}
