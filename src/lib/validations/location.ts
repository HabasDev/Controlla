import { z } from "zod";

import { optionalText, requiredText, uuidSchema } from "./shared";

export const locationSchema = z.object({
  companyId: uuidSchema,
  name: requiredText("El nombre de la sede", 120),
  address: optionalText(240),
  city: optionalText(120),
  postalCode: optionalText(16),
  country: optionalText(120),
  notes: optionalText(500)
});

export type LocationInput = z.infer<typeof locationSchema>;
