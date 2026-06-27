import Link from "next/link";
import {
  Building2,
  LogOut,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { signOutAction } from "@/modules/auth/actions";
import { AppNavigation } from "@/components/layout/app-navigation";
import { CommandPalette } from "@/components/layout/command-palette";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RuntimeWarnings } from "@/components/shared/runtime-warnings";
import type { CurrentUser } from "@/lib/auth/session";

export function AppShell({
  children,
  user,
  warnings,
  companyName
}: {
  children: React.ReactNode;
  user: CurrentUser | null;
  warnings: string[];
  companyName?: string;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background control-grid">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950 text-white lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_22rem)]" />
        <div className="relative flex h-full flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-200/30 bg-cyan-200/10 text-cyan-100">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">Controlla</p>
            <p className="text-xs text-slate-400">Centro de control operativo</p>
          </div>
        </div>
        <div className="px-4 py-4">
          <Link className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-50" href="/dashboard/obligaciones">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nueva obligacion
          </Link>
        </div>
        <div className="px-3">
          <AppNavigation />
        </div>
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.06]">
                <Building2 className="h-4 w-4 text-cyan-100" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{companyName ?? "Empresa demo"}</p>
                <p className="truncate text-xs text-slate-400">Plan beta privada</p>
              </div>
            </div>
          </div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-200/10 text-cyan-100">
              {user?.fullName?.slice(0, 1).toUpperCase() ?? "D"}
            </div>
            <div className="min-w-0 text-slate-200">
              <p className="truncate text-sm font-medium">{user?.fullName ?? "Modo demo"}</p>
              <p className="truncate text-xs text-slate-400">{user?.email ?? "Sin sesion conectada"}</p>
            </div>
          </div>
          {user ? (
            <form action={signOutAction}>
              <Button className="w-full border-white/15 bg-white/[0.04] text-slate-100 hover:bg-white/[0.08]" type="submit" variant="outline">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Cerrar sesion
              </Button>
            </form>
          ) : null}
        </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/82 px-4 backdrop-blur lg:h-20 lg:px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
            <ShieldCheck className="h-5 w-5 text-primary lg:hidden" aria-hidden="true" />
            <span className="lg:hidden">Controlla</span>
            <span className="hidden text-sm text-muted-foreground lg:inline">Sistema listo</span>
          </Link>
          <div className="flex items-center gap-2">
            <CommandPalette />
          </div>
        </header>
        <main className="min-w-0 overflow-x-hidden pb-24 lg:pb-0">
          <div className="px-4 py-4 lg:px-6">
            <RuntimeWarnings warnings={warnings} />
          </div>
          <Separator />
          {children}
        </main>
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/92 px-2 py-2 backdrop-blur lg:hidden">
          <AppNavigation compact limit={4} />
        </div>
      </div>
    </div>
  );
}
