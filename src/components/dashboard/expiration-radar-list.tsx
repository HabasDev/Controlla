import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { RadarPoint } from "@/lib/radar/radar-types";

type ExpirationRadarListProps = {
  points: RadarPoint[];
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export function ExpirationRadarList({ points, selectedId, hoveredId, onHover, onSelect }: ExpirationRadarListProps) {
  const visiblePoints = points.slice(0, 6);

  return (
    <div className="space-y-3">
      {visiblePoints.map((point) => {
        const isActive = point.id === selectedId;
        const isHover = point.id === hoveredId;

        return (
          <Link
            key={point.id}
            href={`/dashboard/obligaciones/${point.id}`}
            onMouseEnter={() => onHover(point.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(point.id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(point.id)}
            className={cn(
              "group flex items-center justify-between gap-3 rounded-3xl border px-4 py-3 text-left transition",
              isActive ? "border-cyan-300/30 bg-cyan-50 shadow-sm" : "border-slate-200/80 bg-white hover:border-slate-300/90 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-3.5 w-3.5 rounded-full ring-1 ring-slate-200"
                style={{ backgroundColor: point.color }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{point.title}</p>
                <p className="truncate text-xs text-slate-500">{point.urgencyLabel}</p>
              </div>
            </div>
            <ArrowRight className={cn("h-4 w-4 transition", isHover || isActive ? "text-cyan-500" : "text-slate-400")} aria-hidden="true" />
          </Link>
        );
      })}

      {points.length > 6 ? (
        <Link
          href="/dashboard/obligaciones"
          className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
        >
          Ver todas las obligaciones
        </Link>
      ) : null}
    </div>
  );
}
