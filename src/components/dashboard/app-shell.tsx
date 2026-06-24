import Link from "next/link";
import {
  Bell,
  Building2,
  CreditCard,
  FileText,
  Gauge,
  LogOut,
  MapPin,
  Settings,
  ShieldCheck,
  Users,
  Wrench
} from "lucide-react";

import { signOutAction } from "@/modules/auth/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RuntimeWarnings } from "@/components/shared/runtime-warnings";
import { cn } from "@/lib/utils/cn";
import type { CurrentUser } from "@/lib/auth/session";

const navItems = [
  { href: "/dashboard", label: "Panel", icon: Gauge },
  { href: "/dashboard/obligaciones", label: "Obligaciones", icon: Bell },
  { href: "/dashboard/activos", label: "Activos", icon: Wrench },
  { href: "/dashboard/documentos", label: "Documentos", icon: FileText },
  { href: "/dashboard/equipo", label: "Equipo", icon: Users },
  { href: "/dashboard/configuracion", label: "Configuracion", icon: Settings },
  { href: "/dashboard/facturacion", label: "Facturacion", icon: CreditCard }
] as const;

export function AppShell({
  children,
  user,
  warnings
}: {
  children: React.ReactNode;
  user: CurrentUser | null;
  warnings: string[];
}) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card lg:block">
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold">Controla</p>
            <p className="text-xs text-muted-foreground">Fechas criticas bajo control</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              href={item.href}
              key={item.href}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.fullName ?? "Modo demo"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? "Sin sesion conectada"}</p>
            </div>
          </div>
          {user ? (
            <form action={signOutAction}>
              <Button className="w-full" type="submit" variant="outline">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Cerrar sesion
              </Button>
            </form>
          ) : null}
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card/95 px-4 backdrop-blur lg:hidden">
          <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            Controla
          </Link>
          <Link className="text-sm text-muted-foreground" href="/dashboard/configuracion">
            <MapPin className="h-4 w-4" aria-label="Configuracion" />
          </Link>
        </header>
        <main>
          <div className="px-4 py-4 lg:px-6">
            <RuntimeWarnings warnings={warnings} />
          </div>
          <Separator />
          {children}
        </main>
      </div>
    </div>
  );
}
