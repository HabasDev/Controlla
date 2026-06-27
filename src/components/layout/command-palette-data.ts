import { FileUp, Gauge, Plus, Search, Settings, Wrench } from "lucide-react";
import type { ComponentType } from "react";

export type CommandItem = {
  id: string;
  label: string;
  hint: string;
  href: string;
  keywords: string[];
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

export const commandItems: CommandItem[] = [
  { id: "dashboard", label: "Ir al panel", hint: "Estado operativo", href: "/dashboard", keywords: ["dashboard", "panel", "estado"], icon: Gauge },
  { id: "obligations", label: "Ver obligaciones", hint: "Vencimientos y avisos", href: "/dashboard/obligaciones", keywords: ["obligaciones", "vencimientos", "itv"], icon: Search },
  { id: "new-obligation", label: "Crear obligacion", hint: "Registrar un vencimiento", href: "/dashboard/obligaciones", keywords: ["crear", "obligacion", "vencimiento"], icon: Plus },
  { id: "assets", label: "Ver activos", hint: "Vehiculos, equipos y sedes", href: "/dashboard/activos", keywords: ["activos", "vehiculos", "equipos"], icon: Wrench },
  { id: "new-asset", label: "Crear activo", hint: "Alta de recurso operativo", href: "/dashboard/activos", keywords: ["crear", "activo"], icon: Plus },
  { id: "documents", label: "Subir documento", hint: "Archivo privado firmado", href: "/dashboard/documentos", keywords: ["documentos", "subir", "pdf"], icon: FileUp },
  { id: "settings", label: "Configuracion", hint: "Empresa y sedes", href: "/dashboard/configuracion", keywords: ["ajustes", "configuracion", "empresa"], icon: Settings }
];

export function filterCommandItems(items: CommandItem[], query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) =>
    [item.label, item.hint, ...item.keywords].some((value) => value.toLowerCase().includes(normalized))
  );
}
