import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/db";
import { companyMembers, notificationDeliveries, notifications, obligations, reminderRules } from "@/db/schema";
import { formatDateEs, isReminderDue } from "@/lib/date/obligations";
import { buildReminderType, isDuplicateReminderNotification } from "@/modules/reminders/service";

export async function createDueNotificationsForCompany(input: {
  companyId: string;
  timezone: string;
  now?: Date;
}) {
  const db = getDb();

  if (!db) {
    return { created: 0, skipped: 0 };
  }

  const activeObligations = await db
    .select({
      obligationId: obligations.id,
      title: obligations.title,
      dueDate: obligations.dueDate,
      responsibleUserId: obligations.responsibleUserId,
      ruleId: reminderRules.id,
      daysBeforeDue: reminderRules.daysBeforeDue,
      channel: reminderRules.channel
    })
    .from(obligations)
    .innerJoin(reminderRules, eq(reminderRules.obligationId, obligations.id))
    .where(
      and(
        eq(obligations.companyId, input.companyId),
        eq(obligations.status, "active"),
        eq(reminderRules.enabled, true)
      )
    );

  const dueRules = activeObligations.filter((row) =>
    isReminderDue({
      dueDate: row.dueDate,
      daysBeforeDue: row.daysBeforeDue,
      timezone: input.timezone,
      now: input.now
    })
  );

  if (dueRules.length === 0) {
    return { created: 0, skipped: 0 };
  }

  const members = await db
    .select({
      userId: companyMembers.userId,
      role: companyMembers.role
    })
    .from(companyMembers)
    .where(and(eq(companyMembers.companyId, input.companyId), eq(companyMembers.status, "active")));

  const relevantObligationIds = dueRules.map((rule) => rule.obligationId);
  const existing = await db
    .select({
      obligationId: notifications.obligationId,
      userId: notifications.userId,
      type: notifications.type
    })
    .from(notifications)
    .where(inArray(notifications.obligationId, relevantObligationIds));

  let created = 0;
  let skipped = 0;

  for (const rule of dueRules) {
    const recipients = members.filter(
      (member) =>
        member.role === "owner" ||
        member.role === "admin" ||
        member.role === "manager" ||
        member.userId === rule.responsibleUserId
    );

    for (const recipient of recipients) {
      const candidate = {
        companyId: input.companyId,
        obligationId: rule.obligationId,
        userId: recipient.userId,
        daysBeforeDue: rule.daysBeforeDue,
        channel: rule.channel
      };

      if (isDuplicateReminderNotification(existing, candidate)) {
        skipped += 1;
        continue;
      }

      const type = buildReminderType(rule.daysBeforeDue, rule.channel);
      const severity = rule.daysBeforeDue <= 7 ? "critical" : rule.daysBeforeDue <= 30 ? "warning" : "info";
      const relative =
        rule.daysBeforeDue > 0
          ? `vence en ${rule.daysBeforeDue} dias`
          : rule.daysBeforeDue === 0
            ? "vence hoy"
            : `vencio hace ${Math.abs(rule.daysBeforeDue)} dias`;

      const [notification] = await db
        .insert(notifications)
        .values({
          companyId: input.companyId,
          userId: recipient.userId,
          obligationId: rule.obligationId,
          type,
          title: `Accion necesaria: ${rule.title}`,
          message: `${rule.title} ${relative}. Fecha de vencimiento: ${formatDateEs(rule.dueDate)}.`,
          severity
        })
        .returning({ id: notifications.id });

      if (rule.channel === "email") {
        await db.insert(notificationDeliveries).values({
          notificationId: notification.id,
          channel: "email",
          recipient: recipient.userId,
          status: "pending"
        });
      }

      created += 1;
    }
  }

  return { created, skipped };
}
