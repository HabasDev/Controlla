import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";
import { es } from "date-fns/locale";

import type { FrequencyUnit, ObligationStatus } from "@/types";

export const DEFAULT_TIMEZONE = "Europe/Madrid";
export const WARNING_DAYS = 30;
export const CRITICAL_DAYS = 7;

export type ComputedObligationStatus = "completed" | "expired" | "critical" | "warning" | "normal" | "cancelled";

type DateParts = {
  year: number;
  month: number;
  day: number;
};

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function assertValidDateOnly(value: string) {
  const match = DATE_ONLY_PATTERN.exec(value);

  if (!match) {
    throw new Error(`Fecha invalida: ${value}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`Fecha invalida: ${value}`);
  }

  return { year, month, day };
}

function datePartsToUtcDay(parts: DateParts) {
  return Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / DAY_MS);
}

function toDateOnlyString(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dateOnlyToNoonUtc(value: string) {
  const parts = assertValidDateOnly(value);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12));
}

export function getTodayDateOnly(timezone = DEFAULT_TIMEZONE, now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("No se pudo calcular la fecha actual.");
  }

  return `${year}-${month}-${day}`;
}

export function getDaysUntilDueDate(dueDate: string, timezone = DEFAULT_TIMEZONE, now = new Date()) {
  const today = assertValidDateOnly(getTodayDateOnly(timezone, now));
  const due = assertValidDateOnly(dueDate);

  return datePartsToUtcDay(due) - datePartsToUtcDay(today);
}

export function getObligationStatus(input: {
  dueDate: string;
  status?: ObligationStatus;
  timezone?: string;
  now?: Date;
}): ComputedObligationStatus {
  if (input.status === "completed") {
    return "completed";
  }

  if (input.status === "cancelled") {
    return "cancelled";
  }

  const days = getDaysUntilDueDate(input.dueDate, input.timezone, input.now);

  if (days < 0 || input.status === "expired") {
    return "expired";
  }

  if (days <= CRITICAL_DAYS) {
    return "critical";
  }

  if (days <= WARNING_DAYS) {
    return "warning";
  }

  return "normal";
}

export function isReminderDue(input: {
  dueDate: string;
  daysBeforeDue: number;
  timezone?: string;
  now?: Date;
}) {
  return getDaysUntilDueDate(input.dueDate, input.timezone, input.now) === input.daysBeforeDue;
}

export function calculateNextDueDate(input: {
  fromDate: string;
  unit: FrequencyUnit;
  interval: number;
}) {
  if (!Number.isInteger(input.interval) || input.interval < 1) {
    throw new Error("El intervalo de recurrencia debe ser un entero positivo.");
  }

  const baseDate = dateOnlyToNoonUtc(input.fromDate);
  const next =
    input.unit === "days"
      ? addDays(baseDate, input.interval)
      : input.unit === "weeks"
        ? addWeeks(baseDate, input.interval)
        : input.unit === "months"
          ? addMonths(baseDate, input.interval)
          : addYears(baseDate, input.interval);

  return toDateOnlyString(next);
}

export function formatDateEs(date: string) {
  return format(dateOnlyToNoonUtc(date), "dd/MM/yyyy", { locale: es });
}

export function formatRelativeDueDate(input: {
  dueDate: string;
  status?: ObligationStatus;
  timezone?: string;
  now?: Date;
}) {
  const status = getObligationStatus(input);

  if (status === "completed") {
    return "Completada";
  }

  if (status === "cancelled") {
    return "Cancelada";
  }

  const days = getDaysUntilDueDate(input.dueDate, input.timezone, input.now);

  if (days < 0) {
    const overdueDays = Math.abs(days);
    return overdueDays === 1 ? "Vencio ayer" : `Vencida hace ${overdueDays} dias`;
  }

  if (days === 0) {
    return "Vence hoy";
  }

  if (days === 1) {
    return "Vence manana";
  }

  return `Vence en ${days} dias`;
}
