"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-2xl font-semibold">No se pudo cargar el panel</h2>
      <p className="max-w-md text-muted-foreground">Revisa la configuracion del entorno o vuelve a intentarlo.</p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
