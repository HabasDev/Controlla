import "server-only";

import { eq, isNull, or } from "drizzle-orm";

import { requireDb } from "@/db";
import { obligationTypes } from "@/db/schema";

export async function getVisibleObligationTypes(companyId: string) {
  const db = requireDb();

  return db
    .select({
      id: obligationTypes.id,
      name: obligationTypes.name,
      category: obligationTypes.category,
      isSystemTemplate: obligationTypes.isSystemTemplate
    })
    .from(obligationTypes)
    .where(or(isNull(obligationTypes.companyId), eq(obligationTypes.companyId, companyId)))
    .orderBy(obligationTypes.name);
}
