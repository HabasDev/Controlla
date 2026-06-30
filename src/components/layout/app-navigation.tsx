"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { Bell, CreditCard, FileText, Gauge, Settings, Users, Wrench } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type AppNavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const navItems: AppNavItem[] = [
  { href: "/dashboard", label: "Panel", icon: Gauge },
  { href: "/dashboard/obligaciones", label: "Obligaciones", icon: Bell },
  { href: "/dashboard/activos", label: "Activos", icon: Wrench },
  { href: "/dashboard/documentos", label: "Documentos", icon: FileText },
  { href: "/dashboard/equipo", label: "Equipo", icon: Users },
  { href: "/dashboard/configuracion", label: "Configuracion", icon: Settings },
  { href: "/dashboard/facturacion", label: "Facturacion", icon: CreditCard }
];

export function AppNavigation({ compact = false, limit }: { compact?: boolean; limit?: number }) {
  const pathname = usePathname();
  const items = typeof limit === "number" ? navItems.slice(0, limit) : navItems;

  return (
    <nav className={cn(compact ? "grid grid-cols-4 gap-1" : "space-y-1")}>
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              compact
                ? "flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold"
                : "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
              active
                ? compact
                  ? "bg-slate-900 text-white shadow-lg"
                  : "border-l-2 border-cyan-300 bg-cyan-300/10 pl-3 text-white shadow-[0_0_28px_rgba(34,211,238,0.10)]"
                : compact
                  ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                  : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
            )}
            href={item.href}
            key={item.href}
          >
            <item.icon className={cn(compact ? "h-4 w-4" : "h-4 w-4", active ? "text-cyan-200" : "")} aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
