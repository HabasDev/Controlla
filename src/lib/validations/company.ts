import { z } from "zod";

import { optionalText, requiredText } from "./shared";

export const companySchema = z.object({
  name: requiredText("El nombre de la empresa", 120),
  legalName: optionalText(160),
  taxId: optionalText(32),
  timezone: z.string().trim().min(1, "La zona horaria es obligatoria.").default("Europe/Madrid"),
  industry: optionalText(120)
});

export type CompanyInput = z.infer<typeof companySchema>;
