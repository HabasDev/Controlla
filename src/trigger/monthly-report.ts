import { and, eq, gte, inArray, lte } from "drizzle-orm";

import { getDb } from "@/db";
import { companies, companyMembers, documents, obligations } from "@/db/schema";
import { getTodayDateOnly } from "@/lib/date/obligations";
import { sendEmail } from "@/lib/email/client";
import { monthlyReportEmailTemplate } from "@/lib/email/templates";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const monthlyReportSchedule = {
  id: "monthly-report",
  cron: "0 8 1 * *",
  timezone: "Europe/Madrid"
};

function offsetDateOnly(days: number) {
  const today = getTodayDateOnly();
  const [year, month, day] = today.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

async function getUserEmail(userId: string) {
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const { data } = await admin.auth.admin.getUserById(userId);
  return data.user?.email ?? null;
}

export async function monthlyReportTask() {
  const db = getDb();

  if (!db) {
    return { sent: 0, failed: 0, errors: ["DATABASE_URL no esta configurado."] };
  }

  const companyRows = await db.select({ id: companies.id, name: companies.name }).from(companies);
  const today = getTodayDateOnly();
  const nextThirtyDays = offsetDateOnly(30);
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const company of companyRows) {
    const [expired, upcoming, completed, expiringDocuments, recipients] = await Promise.all([
      db
        .select({ id: obligations.id })
        .from(obligations)
        .where(and(eq(obligations.companyId, company.id), eq(obligations.status, "active"), lte(obligations.dueDate, today))),
      db
        .select({ id: obligations.id })
        .from(obligations)
        .where(and(eq(obligations.companyId, company.id), eq(obligations.status, "active"), gte(obligations.dueDate, today), lte(obligations.dueDate, nextThirtyDays))),
      db
        .select({ id: obligations.id })
        .from(obligations)
        .where(and(eq(obligations.companyId, company.id), eq(obligations.status, "completed"))),
      db
        .select({ id: documents.id })
        .from(documents)
        .where(and(eq(documents.companyId, company.id), gte(documents.expirationDate, today), lte(documents.expirationDate, nextThirtyDays))),
      db
        .select({ userId: companyMembers.userId })
        .from(companyMembers)
        .where(and(eq(companyMembers.companyId, company.id), eq(companyMembers.status, "active"), inArray(companyMembers.role, ["owner", "admin"])))
    ]);

    const template = monthlyReportEmailTemplate({
      companyName: company.name,
      expired: expired.length,
      upcoming: upcoming.length,
      completed: completed.length,
      expiringDocuments: expiringDocuments.length
    });

    for (const recipient of recipients) {
      const email = await getUserEmail(recipient.userId);

      if (!email) {
        failed += 1;
        errors.push(`No se pudo resolver email de ${recipient.userId}`);
        continue;
      }

      const result = await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text
      });

      if (result.sent) {
        sent += 1;
      } else {
        failed += 1;
        errors.push(result.errorMessage);
      }
    }
  }

  return { sent, failed, errors };
}
