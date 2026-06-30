import { getDaysUntilDueDate } from "@/lib/date/obligations";
import type { RadarObligation, RadarPoint, RadarStatusCategory } from "@/lib/radar/radar-types";

const RADAR_CENTER = 160;
const RADAR_MAX_RADIUS = 140;

const RADAR_RANGES: Array<{
  category: RadarStatusCategory;
  minDays: number;
  maxDays: number;
  minRadius: number;
  maxRadius: number;
  label: string;
}> = [
  { category: "expired", minDays: Number.NEGATIVE_INFINITY, maxDays: -1, minRadius: 18, maxRadius: 34, label: "Vencida" },
  { category: "today", minDays: 0, maxDays: 0, minRadius: 44, maxRadius: 52, label: "Hoy" },
  { category: "soon", minDays: 1, maxDays: 7, minRadius: 62, maxRadius: 70, label: "7 días" },
  { category: "month", minDays: 8, maxDays: 30, minRadius: 88, maxRadius: 96, label: "30 días" },
  { category: "midTerm", minDays: 31, maxDays: 90, minRadius: 112, maxRadius: 122, label: "90 días" },
  { category: "future", minDays: 91, maxDays: Number.POSITIVE_INFINITY, minRadius: 130, maxRadius: 138, label: "> 90 días" }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashString(value: string) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function getStableAngle(id: string) {
  const normalized = (hashString(id) % 360) / 360;
  return normalized * Math.PI * 2;
}

export function getRadarRangeForDays(daysUntilDue: number) {
  return (
    RADAR_RANGES.find((range) => daysUntilDue >= range.minDays && daysUntilDue <= range.maxDays) ?? RADAR_RANGES[RADAR_RANGES.length - 1]
  );
}

function getRangeNormalized(daysUntilDue: number, range: typeof RADAR_RANGES[number]) {
  if (range.category === "expired") {
    const span = 30;
    const value = clamp((-daysUntilDue) / span, 0, 1);
    return 1 - value;
  }

  if (range.category === "future") {
    const span = 90;
    const value = clamp((daysUntilDue - 91) / span, 0, 1);
    return value;
  }

  const span = range.maxDays - range.minDays;
  if (span <= 0) {
    return 0;
  }

  return clamp((daysUntilDue - range.minDays) / span, 0, 1);
}

export function getRadarRadius(daysUntilDue: number, id: string) {
  const range = getRadarRangeForDays(daysUntilDue);
  const normalized = getRangeNormalized(daysUntilDue, range);
  const radiusBias = ((hashString(id) % 12) - 6) * 0.75;

  return clamp(range.minRadius + normalized * (range.maxRadius - range.minRadius) + radiusBias, 12, RADAR_MAX_RADIUS);
}

export function getRadarPointCoordinates(angle: number, radius: number) {
  const x = RADAR_CENTER + Math.cos(angle) * radius;
  const y = RADAR_CENTER + Math.sin(angle) * radius;

  return { x, y };
}

export function buildRadarPoint(obligation: RadarObligation, timezone?: string): RadarPoint {
  const daysUntilDue = getDaysUntilDueDate(obligation.dueDate, timezone);
  const radius = getRadarRadius(daysUntilDue, obligation.id);
  const angle = getStableAngle(obligation.id);
  const { x, y } = getRadarPointCoordinates(angle, radius);

  const statusCategory = obligation.computedStatus === "completed" || obligation.computedStatus === "cancelled"
    ? "unknown"
    : getRadarRangeForDays(daysUntilDue).category;

  return {
    ...obligation,
    daysUntilDue,
    radius,
    angle,
    x,
    y,
    color: "",
    size: 0,
    urgencyLabel: "",
    statusCategory,
    titleLabel: `${obligation.title} · ${obligation.assetName ?? "Sin activo"}`
  };
}
