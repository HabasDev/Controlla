import type { RadarPoint } from "@/lib/radar/radar-types";
import { ArrowRight } from "lucide-react";

type ExpirationRadarTooltipProps = {
  point?: RadarPoint;
  clusterCount?: number;
  clusterItems?: RadarPoint[];
  visible: boolean;
  x: number;
  y: number;
};

export function ExpirationRadarTooltip({ point, clusterCount, clusterItems, visible, x, y }: ExpirationRadarTooltipProps) {
  if (!visible) {
    return null;
  }

  const left = Math.min(Math.max(x + 16, 12), 320 - 220);
  const top = Math.min(Math.max(y - 16, 12), 320 - 112);

  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 w-[220px] rounded-2xl border border-slate-200/80 bg-white/98 p-4 text-sm text-slate-900 shadow-[0_16px_48px_rgba(15,23,42,0.12)] backdrop-blur"
      style={{ left, top }}
    >
      {clusterCount ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Cluster</p>
          <p className="font-semibold text-slate-900">{clusterCount} obligaciones cercanas</p>
          <div className="space-y-1 text-slate-600">
            {clusterItems?.slice(0, 4).map((item) => (
              <p key={item.id} className="truncate text-sm">
                {item.title}
              </p>
            ))}
            {clusterItems && clusterItems.length > 4 ? (
              <p className="text-xs text-slate-500">y {clusterItems.length - 4} mas</p>
            ) : null}
          </div>
        </div>
      ) : point ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{point.statusCategory === "unknown" ? "Sin fecha" : point.statusCategory === "expired" ? "Vencida" : point.statusCategory === "today" ? "Hoy" : "Horizonte"}</span>
            <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: point.color }} />
          </div>
          <p className="font-semibold text-slate-900">{point.title}</p>
          <p className="text-xs text-slate-500">Activo: {point.assetName ?? "Sin activo"}</p>
          <div className="rounded-2xl bg-slate-100 p-3 text-xs text-slate-600">
            <p>{point.urgencyLabel}</p>
            <p>Prioridad: {point.priority ? point.priority.charAt(0).toUpperCase() + point.priority.slice(1) : "Media"}</p>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-cyan-700">
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Ver obligacion</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
