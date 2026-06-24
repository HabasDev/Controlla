"use server";

import { and, eq } from "drizzle-orm";

import { requireDb } from "@/db";
import { assets, companyMembers, locations } from "@/db/schema";
import { requirePermission } from "@/lib/auth/session";
import { assetSchema, type AssetInput } from "@/lib/validations/asset";
import { zodFieldErrors } from "@/lib/validations/shared";
import { createActivityLog } from "@/modules/audit-log/service";
import type { ActionResult } from "@/types";

function nullableId(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

export async function createAssetAction(input: AssetInput): Promise<ActionResult<{ assetId: string }>> {
  const parsed = assetSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos del activo.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { user } = await requirePermission(parsed.data.companyId, "assets:manage");
  const db = requireDb();
  const locationId = nullableId(parsed.data.locationId);
  const responsibleUserId = nullableId(parsed.data.responsibleUserId);

  if (locationId) {
    const location = await db.query.locations.findFirst({
      where: and(eq(locations.id, locationId), eq(locations.companyId, parsed.data.companyId))
    });

    if (!location) {
      return { ok: false, message: "La sede indicada no pertenece a esta empresa." };
    }
  }

  if (responsibleUserId) {
    const membership = await db.query.companyMembers.findFirst({
      where: and(
        eq(companyMembers.companyId, parsed.data.companyId),
        eq(companyMembers.userId, responsibleUserId),
        eq(companyMembers.status, "active")
      )
    });

    if (!membership) {
      return { ok: false, message: "El responsable debe ser miembro activo de la empresa." };
    }
  }

  const [asset] = await db
    .insert(assets)
    .values({
      companyId: parsed.data.companyId,
      locationId,
      name: parsed.data.name,
      assetType: parsed.data.assetType,
      internalReference: parsed.data.internalReference,
      serialNumber: parsed.data.serialNumber,
      description: parsed.data.description,
      status: parsed.data.status,
      responsibleUserId
    })
    .returning({ id: assets.id });

  await createActivityLog({
    companyId: parsed.data.companyId,
    actorUserId: user.id,
    entityType: "asset",
    entityId: asset.id,
    action: "asset.created",
    metadata: { name: parsed.data.name }
  });

  return { ok: true, data: { assetId: asset.id }, message: "Activo creado." };
}
