import { z } from "zod";

import { ASSET_STATUSES } from "@/types";

import { optionalText, optionalUuidSchema, requiredText, uuidSchema } from "./shared";

export const assetSchema = z.object({
  companyId: uuidSchema,
  locationId: optionalUuidSchema,
  name: requiredText("El nombre del activo", 160),
  assetType: requiredText("El tipo de activo", 80),
  internalReference: optionalText(80),
  serialNumber: optionalText(120),
  description: optionalText(1000),
  status: z.enum(ASSET_STATUSES).default("active"),
  responsibleUserId: optionalUuidSchema
});

export type AssetInput = z.infer<typeof assetSchema>;
