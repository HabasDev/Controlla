import { z } from "zod";

export const uuidSchema = z.string().uuid("Identificador no valido.");
export const optionalUuidSchema = z.string().uuid("Identificador no valido.").optional().or(z.literal(""));

export const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Usa una fecha valida.")
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }, "Usa una fecha valida.");

export const emptyStringToUndefined = z.literal("").transform(() => undefined);

export function optionalText(maxLength = 500) {
  return z
    .string()
    .trim()
    .max(maxLength, `Maximo ${maxLength} caracteres.`)
    .optional()
    .or(emptyStringToUndefined);
}

export function requiredText(label: string, maxLength = 160) {
  return z.string().trim().min(1, `${label} es obligatorio.`).max(maxLength, `Maximo ${maxLength} caracteres.`);
}

export function zodFieldErrors(error: z.ZodError) {
  const flattened = error.flatten().fieldErrors;
  const fieldErrors: Record<string, string[]> = {};

  for (const [field, messages] of Object.entries(flattened)) {
    if (messages?.length) {
      fieldErrors[field] = messages;
    }
  }

  return fieldErrors;
}
