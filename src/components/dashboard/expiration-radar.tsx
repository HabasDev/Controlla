"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ExpirationRadarTooltip } from "@/components/dashboard/expiration-radar-tooltip";
import { ExpirationRadarList } from "@/components/dashboard/expiration-radar-list";
import { createRadarPoints } from "@/lib/radar/radar-formatters";
import type { RadarObligation, RadarPoint } from "@/lib/radar/radar-types";

const SVG_SIZE = 320;
const CENTER = SVG_SIZE / 2;
const OUTER_RADIUS = 138;

type ExpirationRadarProps = {
  obligations: RadarObligation[];
  timezone?: string;
};

type RadarCluster = {
  x: number;
  y: number;
  items: RadarPoint[];
  count: number;
};

const RINGS = [28, 46, 64, 86, 110, OUTER_RADIUS];
const RADIAL_LINES = Array.from({ length: 12 }, (_, index) => index * 30);
const TICKS = Array.from({ length: 36 }, (_, index) => index * 10);

const RING_LABELS = [
  { label: "Hoy", x: CENTER + 10, y: CENTER - 28 },
  { label: "7 dias", x: CENTER + 68, y: CENTER - 52 },
  { label: "30 dias", x: CENTER + 90, y: CENTER + 10 },
  { label: "90 dias", x: CENTER + 58, y: CENTER + 100 }
];

const LEGEND_ITEMS = [
  { label: "Vencidas", color: "#ef4444" },
  { label: "Hoy", color: "#f59e0b" },
  { label: "7 dias", color: "#eab308" },
  { label: "30+ dias", color: "#0891b2" }
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

function getPolarPoint(radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;

  return {
    x: CENTER + Math.cos(radians) * radius,
    y: CENTER + Math.sin(radians) * radius
  };
}

function isUrgent(point: RadarPoint) {
  return point.statusCategory === "expired" || point.statusCategory === "today";
}

export function ExpirationRadar({ obligations, timezone }: ExpirationRadarProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<RadarPoint[] | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    point?: RadarPoint;
    clusterItems?: RadarPoint[];
    clusterCount?: number;
  } | null>(null);

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

  function handleClusterMouseEnter(cluster: RadarCluster) {
    setTooltip({ x: cluster.x, y: cluster.y, clusterCount: cluster.items.length, clusterItems: cluster.items });
  }

  function handleClusterMouseLeave() {
    setTooltip(null);
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    setSelectedCluster(null);
  }

  function handleClusterSelect(cluster: RadarCluster) {
    setSelectedId(null);
    setSelectedCluster(cluster.items);
  }

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 text-slate-900 shadow-sm ring-1 ring-slate-100/80">
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

          <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200/80 bg-[radial-gradient(circle_at_50%_45%,rgba(103,232,249,0.24),rgba(240,249,255,0.92)_42%,rgba(248,250,252,0.96)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
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
                  <radialGradient id="radar-surface" cx="50%" cy="50%" r="52%">
                    <stop offset="0%" stopColor="#e0faff" stopOpacity="0.98" />
                    <stop offset="42%" stopColor="#f8fafc" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.78" />
                  </radialGradient>
                  <linearGradient id="radar-sweep-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity="0" />
                    <stop offset="48%" stopColor="#22d3ee" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.34" />
                  </linearGradient>
                  <filter id="radar-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <clipPath id="radar-circle-clip">
                    <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS} />
                  </clipPath>
                </defs>

                <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS + 10} fill="#ffffff" opacity="0.55" />
                <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS} fill="url(#radar-surface)" stroke="#94a3b8" strokeWidth="1.2" opacity="0.98" />
                <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS - 1} fill="none" stroke="#0f766e" strokeWidth="1.4" opacity="0.42" />

                {RINGS.map((radius, index) => (
                  <circle
                    key={radius}
                    cx={CENTER}
                    cy={CENTER}
                    r={radius}
                    fill="none"
                    stroke={index === RINGS.length - 1 ? "#0f766e" : "#94a3b8"}
                    strokeDasharray={index === 0 ? "0" : "4 7"}
                    strokeWidth={index === RINGS.length - 1 ? 1.5 : 1}
                    opacity={index === RINGS.length - 1 ? 0.55 : 0.36}
                  />
                ))}

                {RADIAL_LINES.map((angle) => {
                  const end = getPolarPoint(OUTER_RADIUS, angle);
                  const isCross = angle % 90 === 0;
                  return (
                    <line
                      key={angle}
                      x1={CENTER}
                      y1={CENTER}
                      x2={end.x}
                      y2={end.y}
                      stroke={isCross ? "#0f766e" : "#94a3b8"}
                      strokeWidth={isCross ? 1.15 : 0.8}
                      opacity={isCross ? 0.3 : 0.18}
                    />
                  );
                })}

                {TICKS.map((angle) => {
                  const outer = getPolarPoint(OUTER_RADIUS, angle);
                  const inner = getPolarPoint(angle % 30 === 0 ? OUTER_RADIUS - 9 : OUTER_RADIUS - 5, angle);
                  return (
                    <line
                      key={angle}
                      x1={inner.x}
                      y1={inner.y}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="#0f766e"
                      strokeWidth={angle % 30 === 0 ? 1.2 : 0.8}
                      opacity={angle % 30 === 0 ? 0.38 : 0.22}
                    />
                  );
                })}

                {RING_LABELS.map((item) => (
                  <text key={item.label} x={item.x} y={item.y} fill="#64748b" fontSize="10" fontWeight="700">
                    {item.label}
                  </text>
                ))}

                <g className="radar-sweep" clipPath="url(#radar-circle-clip)" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
                  <path
                    d={`M${CENTER} ${CENTER} L${CENTER + OUTER_RADIUS} ${CENTER} A${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${CENTER + 26} ${CENTER - 135.5} Z`}
                    fill="url(#radar-sweep-gradient)"
                    opacity="0.92"
                  />
                </g>

                <circle cx={CENTER} cy={CENTER} r="22" fill="#14b8a6" opacity="0.08" className="radar-center-pulse" />
                <circle cx={CENTER} cy={CENTER} r="12" fill="#14b8a6" opacity="0.2" filter="url(#radar-soft-glow)" />
                <circle cx={CENTER} cy={CENTER} r="7" fill="#0f766e" opacity="0.9" />
                <circle cx={CENTER} cy={CENTER} r="3" fill="#ecfeff" opacity="0.95" />

                {clusters.map((cluster, index) => {
                  if (cluster.items.length <= 1) {
                    const point = cluster.items[0];
                    const isActive = point.id === selectedId;
                    const isHover = point.id === hoveredId;
                    const urgent = isUrgent(point);

                    return (
                      <g key={point.id} className="cursor-pointer">
                        {urgent ? (
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r={point.size + 9}
                            fill={point.color}
                            opacity="0.12"
                            className="radar-critical-pulse"
                          />
                        ) : null}
                        <circle cx={point.x} cy={point.y} r={point.size + 7} fill={point.color} opacity={isActive || isHover ? 0.18 : 0.09} />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={point.size + 1}
                          fill="#ffffff"
                          opacity={isActive || isHover ? 0.98 : 0.88}
                          stroke={point.color}
                          strokeWidth={isActive || isHover ? 2 : 1.5}
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={Math.max(point.size - 4, 4)}
                          fill={point.color}
                          opacity={isActive || isHover ? 1 : 0.92}
                          role="button"
                          tabIndex={0}
                          aria-label={`${point.title}, ${point.urgencyLabel}, prioridad ${point.priority ?? "media"}`}
                          onMouseEnter={() => handlePointMouseEnter(point)}
                          onMouseLeave={handlePointMouseLeave}
                          onFocus={() => handlePointMouseEnter(point)}
                          onBlur={handlePointMouseLeave}
                          onClick={() => handleSelect(point.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              handleSelect(point.id);
                            }
                          }}
                        />
                      </g>
                    );
                  }

                  const isSelectedCluster =
                    selectedCluster?.length === cluster.items.length &&
                    selectedCluster.every((item) => cluster.items.some((clusterItem) => clusterItem.id === item.id));

                  return (
                    <g
                      key={`cluster-${index}`}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Grupo de ${cluster.items.length} obligaciones cercanas`}
                      onMouseEnter={() => handleClusterMouseEnter(cluster)}
                      onMouseLeave={handleClusterMouseLeave}
                      onFocus={() => handleClusterMouseEnter(cluster)}
                      onBlur={handleClusterMouseLeave}
                      onClick={() => handleClusterSelect(cluster)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleClusterSelect(cluster);
                        }
                      }}
                    >
                      <circle cx={cluster.x} cy={cluster.y} r={20} fill="#0f766e" opacity={isSelectedCluster ? "0.16" : "0.08"} />
                      <circle
                        cx={cluster.x}
                        cy={cluster.y}
                        r={14}
                        fill="#f8fafc"
                        stroke="#0f766e"
                        strokeWidth={isSelectedCluster ? 2 : 1.4}
                        opacity="0.96"
                      />
                      <text x={cluster.x} y={cluster.y + 4} textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="800" pointerEvents="none">
                        +{cluster.items.length}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-500">
                {LEGEND_ITEMS.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                ))}
              </div>
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

          {selectedCluster ? (
            <div className="mt-4 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{selectedCluster.length} obligaciones agrupadas</p>
                <button type="button" className="text-xs font-semibold text-slate-500 transition hover:text-slate-900" onClick={() => setSelectedCluster(null)}>
                  Cerrar
                </button>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {selectedCluster.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/obligaciones/${item.id}`}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-cyan-300 hover:bg-cyan-50/50"
                    onClick={() => handleSelect(item.id)}
                  >
                    <span className="block truncate font-semibold text-slate-900">{item.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">{item.urgencyLabel}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {emptyState ? (
            <div className="mt-5 rounded-3xl border border-slate-200/80 bg-slate-50 p-5 text-slate-600">
              <p className="text-sm font-semibold text-slate-900">No hay vencimientos proximos.</p>
              <p className="mt-2 text-sm">Tu operacion esta bajo control.</p>
            </div>
          ) : noCritical ? (
            <div className="mt-5 rounded-3xl border border-emerald-200/70 bg-emerald-50 p-5 text-slate-700">
              <p className="text-sm font-semibold text-emerald-800">No tienes vencimientos criticos en los proximos 30 dias.</p>
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
