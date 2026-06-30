"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ExpirationRadarTooltip } from "@/components/dashboard/expiration-radar-tooltip";
import { ExpirationRadarList } from "@/components/dashboard/expiration-radar-list";
import { createRadarPoints } from "@/lib/radar/radar-formatters";
import type { RadarObligation, RadarPoint } from "@/lib/radar/radar-types";

const SVG_SIZE = 320;
const CENTER = SVG_SIZE / 2;

type ExpirationRadarProps = {
  obligations: RadarObligation[];
  timezone?: string;
};

const RING_LABELS = [
  { label: "Hoy", radius: 48 },
  { label: "7 días", radius: 72 },
  { label: "30 días", radius: 96 },
  { label: "90 días", radius: 122 }
];

function groupNearbyPoints(points: RadarPoint[]) {
  const clusters: Array<{ x: number; y: number; items: RadarPoint[] }> = [];

  for (const point of points) {
    const nearby = clusters.find((cluster) => {
      const dx = point.x - cluster.x;
      const dy = point.y - cluster.y;
      return Math.hypot(dx, dy) < 20;
    });

    if (nearby) {
      nearby.items.push(point);
      nearby.x = (nearby.x * (nearby.items.length - 1) + point.x) / nearby.items.length;
      nearby.y = (nearby.y * (nearby.items.length - 1) + point.y) / nearby.items.length;
    } else {
      clusters.push({ x: point.x, y: point.y, items: [point] });
    }
  }

  return clusters.map((cluster) => ({ ...cluster, count: cluster.items.length }));
}

export function ExpirationRadar({ obligations, timezone }: ExpirationRadarProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point?: RadarPoint; clusterItems?: RadarPoint[]; clusterCount?: number } | null>(null);

  const points = useMemo(() => {
    return createRadarPoints(obligations || [], timezone).sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }, [obligations, timezone]);

  const clusters = useMemo(() => {
    const raw = points.filter((point) => point.statusCategory !== "unknown");
    return groupNearbyPoints(raw);
  }, [points]);

  const emptyState = points.length === 0;
  const noCritical = !points.some((point) => point.statusCategory === "expired" || point.statusCategory === "today" || point.statusCategory === "soon");

  function handlePointMouseEnter(point: RadarPoint) {
    setHoveredId(point.id);
    setTooltip({ x: point.x, y: point.y, point });
  }

  function handlePointMouseLeave() {
    setHoveredId(null);
    setTooltip(null);
  }

  function handleClusterMouseEnter(cluster: { x: number; y: number; items: RadarPoint[] }) {
    setTooltip({ x: cluster.x, y: cluster.y, clusterCount: cluster.items.length, clusterItems: cluster.items });
  }

  function handleClusterMouseLeave() {
    setTooltip(null);
  }

  function handleSelect(id: string) {
    setSelectedId(id);
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100/80 p-5 text-slate-900">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="relative flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Radar de vencimientos</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">Ubica las obligaciones por urgencia de forma clara y sin ruido.</p>
            </div>
            <Link
              href="/dashboard/obligaciones"
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Ver todas
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-4">
            <div className="relative mx-auto w-[320px] max-w-full">
              <svg
                width={SVG_SIZE}
                height={SVG_SIZE}
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                aria-label="Radar de vencimientos"
                role="img"
                className="block"
              >
                <defs>
                  <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <circle cx={CENTER} cy={CENTER} r={CENTER - 4} fill="#ffffff" opacity="0.96" />
                {[40, 72, 96, 122, 138].map((radius) => (
                  <circle key={radius} cx={CENTER} cy={CENTER} r={radius} fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.32" />
                ))}
                {[0, 60, 120, 180, 240, 300].map((angle) => {
                  const radians = (angle * Math.PI) / 180;
                  const x = CENTER + Math.cos(radians) * (CENTER - 4);
                  const y = CENTER + Math.sin(radians) * (CENTER - 4);
                  return <line key={angle} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1" opacity="0.18" />;
                })}
                {RING_LABELS.map((item) => (
                  <text key={item.label} x={CENTER + 6} y={CENTER - item.radius + 16} fill="#475569" fontSize="10" fontWeight="600">
                    {item.label}
                  </text>
                ))}
                <circle cx={CENTER} cy={CENTER} r="14" fill="#38bdf8" opacity="0.12" />
                <circle cx={CENTER} cy={CENTER} r="6" fill="#0f172a" opacity="0.18" />
                <circle cx={CENTER} cy={CENTER} r="3" fill="#0891b2" />
                <g className="motion-safe:animate-radar-sweep">
                  <path d={`M${CENTER} ${CENTER} L${CENTER + 138} ${CENTER} A138 138 0 0 1 ${CENTER + 18} ${CENTER - 137} Z`} fill="url(#radar-sweep)" opacity="0.18" />
                </g>
                {clusters.map((cluster, index) => {
                  if (cluster.items.length <= 1) {
                    const point = cluster.items[0];
                    const isActive = point.id === selectedId;
                    const isHover = point.id === hoveredId;

                    return (
                      <g key={point.id}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={point.size}
                          fill={point.color}
                          opacity={isActive || isHover ? 0.95 : 0.88}
                          stroke={isActive ? "#0f766e" : "#ffffff"}
                          strokeWidth={isActive ? 2 : 1}
                          className="cursor-pointer transition duration-150"
                          role="button"
                          tabIndex={0}
                          aria-label={`${point.title}, ${point.urgencyLabel}, prioridad ${point.priority ?? "media"}`}
                          onMouseEnter={() => handlePointMouseEnter(point)}
                          onMouseLeave={handlePointMouseLeave}
                          onFocus={() => handlePointMouseEnter(point)}
                          onBlur={handlePointMouseLeave}
                          onClick={() => handleSelect(point.id)}
                        />
                        <circle cx={point.x} cy={point.y} r={point.size + 4} fill={point.color} opacity={isActive || isHover ? 0.08 : 0} />
                      </g>
                    );
                  }

                  return (
                    <g key={`cluster-${index}`}>
                      <circle
                        cx={cluster.x}
                        cy={cluster.y}
                        r={12}
                        fill="#475569"
                        opacity="0.18"
                        onMouseEnter={() => handleClusterMouseEnter(cluster)}
                        onMouseLeave={handleClusterMouseLeave}
                      />
                      <text
                        x={cluster.x}
                        y={cluster.y + 4}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="600"
                        pointerEvents="none"
                      >
                        +{cluster.items.length}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <ExpirationRadarTooltip
                visible={Boolean(tooltip)}
                x={tooltip?.x ?? CENTER}
                y={tooltip?.y ?? CENTER}
                point={tooltip?.point}
                clusterCount={tooltip?.clusterCount}
                clusterItems={tooltip?.clusterItems}
              />
            </div>
          </div>
          {emptyState ? (
            <div className="mt-5 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-slate-600">
              <p className="text-sm font-semibold text-slate-900">No hay vencimientos próximos.</p>
              <p className="mt-2 text-sm">Tu operación está bajo control.</p>
            </div>
          ) : noCritical ? (
            <div className="mt-5 rounded-3xl border border-emerald-200/70 bg-emerald-50 p-5 text-slate-700">
              <p className="text-sm font-semibold text-emerald-800">No tienes vencimientos críticos en los próximos 30 días.</p>
            </div>
          ) : null}
        </div>

        <div className="lg:w-[320px]">
          <ExpirationRadarList
            points={points}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onHover={(id) => {
              setHoveredId(id);
              if (id) {
                const point = points.find((item) => item.id === id);
                if (point) {
                  setTooltip({ x: point.x, y: point.y, point });
                }
              } else {
                setTooltip(null);
              }
            }}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
}
