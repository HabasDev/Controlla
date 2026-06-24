import { z } from "zod";

import { FREQUENCY_UNITS } from "@/types";

import { optionalText, optionalUuidSchema, requiredText } from "./shared";

export const obligationTypeSchema = z.object({
  companyId: optionalUuidSchema,
  name: requiredText("El nombre del tipo", 120),
  category: requiredText("La categoria", 80),
  description: optionalText(500),
  defaultFrequencyUnit: z.enum(FREQUENCY_UNITS).optional().or(z.literal("")),
  defaultFrequencyValue: z.coerce.number().int().positive().optional(),
  icon: optionalText(80)
});

export type ObligationTypeInput = z.infer<typeof obligationTypeSchema>;
