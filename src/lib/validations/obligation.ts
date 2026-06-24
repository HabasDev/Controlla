import { z } from "zod";

import { FREQUENCY_UNITS, OBLIGATION_PRIORITIES, OBLIGATION_STATUSES } from "@/types";

import { dateOnlySchema, optionalText, optionalUuidSchema, requiredText, uuidSchema } from "./shared";

export const reminderRuleInputSchema = z.object({
  daysBeforeDue: z.coerce
    .number()
    .int("Debe ser un numero entero.")
    .min(-30, "Solo se permiten avisos posteriores hasta 30 dias.")
    .max(365, "No se permiten avisos a mas de 365 dias."),
  channel: z.enum(["email", "in_app"]),
  enabled: z.coerce.boolean().default(true)
});

export const obligationSchema = z
  .object({
    companyId: uuidSchema,
    locationId: optionalUuidSchema,
    assetId: optionalUuidSchema,
    obligationTypeId: uuidSchema,
    title: requiredText("El titulo", 180),
    description: optionalText(1000),
    status: z.enum(OBLIGATION_STATUSES).default("active"),
    priority: z.enum(OBLIGATION_PRIORITIES).default("medium"),
    responsibleUserId: optionalUuidSchema,
    startDate: dateOnlySchema.optional().or(z.literal("")),
    dueDate: dateOnlySchema,
    recurrenceEnabled: z.coerce.boolean().default(false),
    recurrenceUnit: z.enum(FREQUENCY_UNITS).optional().or(z.literal("")),
    recurrenceInterval: z.coerce.number().int().positive().optional(),
    autoCreateNext: z.coerce.boolean().default(false),
    estimatedCost: z.coerce.number().nonnegative().optional(),
    actualCost: z.coerce.number().nonnegative().optional(),
    notes: optionalText(1200),
    reminderRules: z.array(reminderRuleInputSchema).default([])
  })
  .superRefine((value, context) => {
    if (value.recurrenceEnabled && (!value.recurrenceUnit || !value.recurrenceInterval)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrenceInterval"],
        message: "Indica una frecuencia valida para obligaciones recurrentes."
      });
    }
  });

export type ObligationInput = z.infer<typeof obligationSchema>;
