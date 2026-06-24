import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-3xl font-semibold">No encontramos esta pagina</h1>
      <p className="max-w-md text-muted-foreground">Puede que el enlace haya cambiado o que no tengas acceso a este recurso.</p>
      <Link className={buttonVariants()} href="/dashboard">
        Volver al panel
      </Link>
    </main>
  );
}
