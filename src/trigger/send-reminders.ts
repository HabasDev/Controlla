import { and, eq } from "drizzle-orm";

import { getDb } from "@/db";
import { companies, notificationDeliveries, notifications, obligations } from "@/db/schema";
import { formatRelativeDueDate } from "@/lib/date/obligations";
import { sendEmail } from "@/lib/email/client";
import { reminderEmailTemplate } from "@/lib/email/templates";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const sendRemindersSchedule = {
  id: "send-reminders",
  cron: "*/15 * * * *",
  timezone: "Europe/Madrid"
};

async function resolveRecipientEmail(recipient: string) {
  if (recipient.includes("@")) {
    return recipient;
  }

  const admin = getSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const { data } = await admin.auth.admin.getUserById(recipient);
  return data.user?.email ?? null;
}

export async function sendPendingRemindersTask(limit = 100) {
  const db = getDb();

  if (!db) {
    return { sent: 0, failed: 0, skipped: 0, errors: ["DATABASE_URL no esta configurado."] };
  }

  const pending = await db
    .select({
      deliveryId: notificationDeliveries.id,
      recipient: notificationDeliveries.recipient,
      notificationId: notifications.id,
      companyName: companies.name,
      obligationTitle: obligations.title,
      dueDate: obligations.dueDate,
      companyTimezone: companies.timezone
    })
    .from(notificationDeliveries)
    .innerJoin(notifications, eq(notifications.id, notificationDeliveries.notificationId))
    .innerJoin(companies, eq(companies.id, notifications.companyId))
    .innerJoin(obligations, eq(obligations.id, notifications.obligationId))
    .where(and(eq(notificationDeliveries.status, "pending"), eq(notificationDeliveries.channel, "email")))
    .limit(limit);

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const delivery of pending) {
    const email = await resolveRecipientEmail(delivery.recipient);

    if (!email) {
      skipped += 1;
      await db
        .update(notificationDeliveries)
        .set({ status: "failed", errorMessage: "No se pudo resolver el email del destinatario." })
        .where(eq(notificationDeliveries.id, delivery.deliveryId));
      continue;
    }

    const template = reminderEmailTemplate({
      companyName: delivery.companyName,
      obligationTitle: delivery.obligationTitle,
      dueDate: delivery.dueDate,
      relativeDueDate: formatRelativeDueDate({
        dueDate: delivery.dueDate,
        timezone: delivery.companyTimezone
      })
    });

    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    if (result.sent) {
      sent += 1;
      await db
        .update(notificationDeliveries)
        .set({
          status: "sent",
          providerMessageId: result.providerMessageId,
          sentAt: new Date()
        })
        .where(eq(notificationDeliveries.id, delivery.deliveryId));
    } else {
      failed += 1;
      errors.push(result.errorMessage);
      await db
        .update(notificationDeliveries)
        .set({
          status: "failed",
          errorMessage: result.errorMessage
        })
        .where(eq(notificationDeliveries.id, delivery.deliveryId));
    }
  }

  return { sent, failed, skipped, errors };
}
