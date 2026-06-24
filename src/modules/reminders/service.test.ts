import { describe, expect, it } from "vitest";

import { buildDefaultReminderRules, buildReminderType, isDuplicateReminderNotification } from "./service";

describe("reminder service", () => {
  it("builds default email and in-app reminder rules", () => {
    const rules = buildDefaultReminderRules();

    expect(rules).toHaveLength(14);
    expect(rules.some((rule) => rule.daysBeforeDue === 90 && rule.channel === "email")).toBe(true);
    expect(rules.some((rule) => rule.daysBeforeDue === -7 && rule.channel === "in_app")).toBe(true);
  });

  it("creates stable reminder type keys", () => {
    expect(buildReminderType(7, "email")).toBe("obligation_due_7_email");
    expect(buildReminderType(-7, "in_app")).toBe("obligation_due_-7_in_app");
  });

  it("prevents duplicate reminder notifications for the same obligation, user and rule", () => {
    const existing = [
      {
        obligationId: "obligation-1",
        userId: "user-1",
        type: "obligation_due_7_email"
      }
    ];

    expect(
      isDuplicateReminderNotification(existing, {
        companyId: "company-1",
        obligationId: "obligation-1",
        userId: "user-1",
        daysBeforeDue: 7,
        channel: "email"
      })
    ).toBe(true);

    expect(
      isDuplicateReminderNotification(existing, {
        companyId: "company-1",
        obligationId: "obligation-1",
        userId: "user-2",
        daysBeforeDue: 7,
        channel: "email"
      })
    ).toBe(false);
  });
});
