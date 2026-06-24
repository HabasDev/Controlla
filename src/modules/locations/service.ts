import "server-only";

import { eq } from "drizzle-orm";

import { requireDb } from "@/db";
import { locations } from "@/db/schema";

export async function getLocationsForCompany(companyId: string) {
  const db = requireDb();

  return db.query.locations.findMany({
    where: eq(locations.companyId, companyId),
    orderBy: (table, { asc }) => [asc(table.name)]
  });
}
