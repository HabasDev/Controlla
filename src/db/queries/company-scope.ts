import "server-only";

import { and, eq } from "drizzle-orm";

import { requireDb } from "@/db";
import { companyMembers } from "@/db/schema";

export async function userHasActiveCompanyMembership(input: { companyId: string; userId: string }) {
  const db = requireDb();
  const membership = await db.query.companyMembers.findFirst({
    where: and(
      eq(companyMembers.companyId, input.companyId),
      eq(companyMembers.userId, input.userId),
      eq(companyMembers.status, "active")
    )
  });

  return Boolean(membership);
}
