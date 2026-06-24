"use server";

import { eq } from "drizzle-orm";

import { requireDb } from "@/db";
import { companies, companyMembers, subscriptions } from "@/db/schema";
import { requireCurrentUser, requirePermission, setActiveCompanyCookie } from "@/lib/auth/session";
import { companySchema, type CompanyInput } from "@/lib/validations/company";
import { zodFieldErrors } from "@/lib/validations/shared";
import { createActivityLog } from "@/modules/audit-log/service";
import type { ActionResult } from "@/types";

export async function createInitialCompanyAction(input: CompanyInput): Promise<ActionResult<{ companyId: string }>> {
  const parsed = companySchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos de la empresa.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const user = await requireCurrentUser();
  const db = requireDb();

  const [company] = await db
    .insert(companies)
    .values({
      name: parsed.data.name,
      legalName: parsed.data.legalName,
      taxId: parsed.data.taxId,
      timezone: parsed.data.timezone,
      industry: parsed.data.industry
    })
    .returning({ id: companies.id });

  await db.insert(companyMembers).values({
    companyId: company.id,
    userId: user.id,
    role: "owner",
    status: "active"
  });

  await db.insert(subscriptions).values({
    companyId: company.id,
    plan: "free",
    status: "inactive"
  });

  await setActiveCompanyCookie(company.id);

  return {
    ok: true,
    data: { companyId: company.id },
    message: "Empresa creada."
  };
}

export async function updateCompanyAction(companyId: string, input: CompanyInput): Promise<ActionResult> {
  const parsed = companySchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos de la empresa.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { user } = await requirePermission(companyId, "company:update");
  const db = requireDb();

  await db
    .update(companies)
    .set({
      name: parsed.data.name,
      legalName: parsed.data.legalName,
      taxId: parsed.data.taxId,
      timezone: parsed.data.timezone,
      industry: parsed.data.industry
    })
    .where(eq(companies.id, companyId));

  await createActivityLog({
    companyId,
    actorUserId: user.id,
    entityType: "company",
    entityId: companyId,
    action: "company.updated"
  });

  return { ok: true, message: "Configuracion actualizada." };
}
