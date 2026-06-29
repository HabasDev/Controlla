import Link from "next/link";
import {
  Bell,
  Building2,
  Eye,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";

import { signOutAction } from "@/modules/auth/actions";
import { AppNavigation } from "@/components/layout/app-navigation";
import { CommandPalette } from "@/components/layout/command-palette";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen overflow-x-hidden bg-[#020814] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_58%_18%,rgba(20,184,166,0.10),transparent_30rem),linear-gradient(180deg,#020814,#03101c_54%,#020814)]" />
      <div className="fixed inset-0 control-grid opacity-[0.045]" />
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-cyan-200/10 bg-slate-950/70 text-white backdrop-blur-xl lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_18rem)]" />
        <div className="relative flex h-full flex-col">
        <div className="flex h-24 items-center gap-3 border-b border-cyan-200/10 px-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200/20 bg-cyan-300/8 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.12)]">
            <Eye className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">Controlla</p>
            <p className="text-xs text-slate-400">Todo bajo control.</p>
          </div>
        </div>
        <div className="px-5 py-5">
          <Link className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-cyan-300/70 bg-cyan-300/5 text-sm font-semibold text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.10)] transition hover:bg-cyan-300/10" href="/dashboard/obligaciones">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nueva obligacion
          </Link>
        </div>
        <div className="px-4">
          <AppNavigation />
        </div>
        <div className="mt-auto space-y-3 border-t border-cyan-200/10 p-4">
          <div className="rounded-lg border border-cyan-200/12 bg-white/[0.035] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-200/12 bg-cyan-300/8">
                <Building2 className="h-4 w-4 text-cyan-200" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{companyName ?? "Empresa demo"}</p>
                <p className="truncate text-xs text-slate-400">Plan: Empresarial</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-cyan-200/8 bg-white/[0.025] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200/15 bg-cyan-200/8 text-cyan-100">
              {user?.fullName?.slice(0, 1).toUpperCase() ?? "D"}
            </div>
            <div className="min-w-0 text-slate-200">
              <p className="truncate text-sm font-medium">{user?.fullName ?? "Modo demo"}</p>
              <p className="truncate text-xs text-slate-400">{user?.email ?? "Sin sesion conectada"}</p>
            </div>
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
      <div className="relative lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-cyan-200/10 bg-[#020814]/80 px-4 backdrop-blur-xl lg:h-20 lg:px-8">
          <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
            <Eye className="h-5 w-5 text-cyan-200 lg:hidden" aria-hidden="true" />
            <span className="lg:hidden">Controlla</span>
            <span className="hidden items-center gap-2 text-sm text-cyan-200 lg:inline-flex">
              Sistema listo
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <CommandPalette />
            <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-200/10 bg-white/[0.03] text-slate-300 hover:text-cyan-100 lg:inline-flex" type="button" aria-label="Notificaciones">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-200/10 bg-cyan-300/10 text-cyan-100 lg:flex">
              {user?.fullName?.slice(0, 1).toUpperCase() ?? <UserRound className="h-4 w-4" aria-hidden="true" />}
            </div>
          </div>
        </header>
        <main className="min-w-0 overflow-x-hidden pb-24 lg:pb-0">
          <div className="px-4 py-4 lg:px-8">
            <RuntimeWarnings warnings={warnings} />
          </div>
          {children}
        </main>
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/92 px-2 py-2 backdrop-blur lg:hidden">
          <AppNavigation compact limit={4} />
        </div>
      </div>
    </div>
  );
}
