import type { RadarObligation, RadarPoint, RadarStatusCategory } from "@/lib/radar/radar-types";
import { buildRadarPoint } from "@/lib/radar/radar-positioning";

const STATUS_COLOR_MAP: Record<RadarStatusCategory, string> = {
  expired: "#ef4444",
  today: "#f59e0b",
  soon: "#eab308",
  month: "#0f766e",
  midTerm: "#0891b2",
  future: "#16a34a",
  unknown: "#94a3b8"
};

const PRIORITY_SIZE_MAP: Record<string, number> = {
  critical: 14,
  high: 12,
  medium: 10,
  low: 8
};

export function getRadarColor(category: RadarStatusCategory) {
  return STATUS_COLOR_MAP[category] ?? STATUS_COLOR_MAP.unknown;
}

export function getRadarPointSize(priority?: string) {
  return PRIORITY_SIZE_MAP[priority ?? "medium"] ?? PRIORITY_SIZE_MAP.medium;
}

export function getUrgencyLabel(daysUntilDue: number) {
  if (daysUntilDue < 0) {
    const overdue = Math.abs(daysUntilDue);
    return overdue === 1 ? "Vencida ayer" : `Vencida hace ${overdue} dias`;
  }

  if (daysUntilDue === 0) {
    return "Vence hoy";
  }

  if (daysUntilDue === 1) {
    return "Vence mañana";
  }

  if (daysUntilDue <= 7) {
    return `Vence en ${daysUntilDue} dias`;
  }

  if (daysUntilDue <= 30) {
    return `Vence en ${daysUntilDue} dias`;
  }

  if (daysUntilDue <= 90) {
    return `Vence en ${daysUntilDue} dias`;
  }

  return `Vence en ${daysUntilDue} dias`;
}

export function createRadarPoint(obligation: RadarObligation, timezone?: string): RadarPoint {
  const point = buildRadarPoint(obligation, timezone);
  const category = point.statusCategory;

  return {
    ...point,
    color: getRadarColor(category),
    size: getRadarPointSize(obligation.priority),
    urgencyLabel: getUrgencyLabel(point.daysUntilDue),
    titleLabel: obligation.title
  };
}

export function createRadarPoints(obligations: RadarObligation[], timezone?: string) {
  return obligations.map((obligation) => createRadarPoint(obligation, timezone));
}
