import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { companies } from "@/db/schema";
import { createDueNotificationsForCompany } from "@/modules/notifications/service";

export const checkExpirationsSchedule = {
  id: "check-expirations",
  cron: "0 7 * * *",
  timezone: "Europe/Madrid"
};

export async function checkExpirationsTask(now = new Date()) {
  const db = getDb();

  if (!db) {
    return { processedCompanies: 0, created: 0, skipped: 0, errors: ["DATABASE_URL no esta configurado."] };
  }

  const companyRows = await db.select({ id: companies.id, timezone: companies.timezone }).from(companies);
  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const company of companyRows) {
    try {
      const result = await createDueNotificationsForCompany({
        companyId: company.id,
        timezone: company.timezone,
        now
      });
      created += result.created;
      skipped += result.skipped;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `Error procesando empresa ${company.id}`);
    }
  }

  return {
    processedCompanies: companyRows.length,
    created,
    skipped,
    errors
  };
}

export async function checkSingleCompanyExpirations(companyId: string, now = new Date()) {
  const db = getDb();

  if (!db) {
    return { created: 0, skipped: 0 };
  }

  const company = await db.query.companies.findFirst({
    where: eq(companies.id, companyId)
  });

  if (!company) {
    throw new Error("Empresa no encontrada.");
  }

  return createDueNotificationsForCompany({
    companyId,
    timezone: company.timezone,
    now
  });
}
