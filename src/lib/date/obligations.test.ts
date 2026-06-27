import { describe, expect, it } from "vitest";

import {
  calculateNextDueDate,
  formatRelativeDueDate,
  getDaysUntilDueDate,
  getObligationStatus,
  isReminderDue
} from "./obligations";

const now = new Date("2026-06-24T10:00:00.000Z");

describe("obligation date helpers", () => {
  it("calculates days until due date using date-only semantics", () => {
    expect(getDaysUntilDueDate("2026-06-24", "Europe/Madrid", now)).toBe(0);
    expect(getDaysUntilDueDate("2026-07-01", "Europe/Madrid", now)).toBe(7);
    expect(getDaysUntilDueDate("2026-06-20", "Europe/Madrid", now)).toBe(-4);
  });

  it("computes visual obligation status", () => {
    expect(getObligationStatus({ dueDate: "2026-06-20", now })).toBe("expired");
    expect(getObligationStatus({ dueDate: "2026-06-30", now })).toBe("critical");
    expect(getObligationStatus({ dueDate: "2026-07-20", now })).toBe("warning");
    expect(getObligationStatus({ dueDate: "2026-08-30", now })).toBe("normal");
    expect(getObligationStatus({ dueDate: "2026-06-20", status: "completed", now })).toBe("completed");
  });

  it("detects due reminder rules without duplicate date math", () => {
    expect(isReminderDue({ dueDate: "2026-07-01", daysBeforeDue: 7, now })).toBe(true);
    expect(isReminderDue({ dueDate: "2026-06-17", daysBeforeDue: -7, now })).toBe(true);
    expect(isReminderDue({ dueDate: "2026-07-01", daysBeforeDue: 1, now })).toBe(false);
  });

  it("generates next recurrent dates across month ends and leap years", () => {
    expect(calculateNextDueDate({ fromDate: "2026-01-31", unit: "months", interval: 1 })).toBe("2026-02-28");
    expect(calculateNextDueDate({ fromDate: "2024-02-29", unit: "years", interval: 1 })).toBe("2025-02-28");
    expect(calculateNextDueDate({ fromDate: "2026-06-24", unit: "weeks", interval: 2 })).toBe("2026-07-08");
  });

  it("formats relative copy in Spanish business language", () => {
    expect(formatRelativeDueDate({ dueDate: "2026-06-24", now })).toBe("Vence hoy");
    expect(formatRelativeDueDate({ dueDate: "2026-06-25", now })).toBe("Vence mañana");
    expect(formatRelativeDueDate({ dueDate: "2026-06-20", now })).toBe("Vencida hace 4 dias");
  });
});
