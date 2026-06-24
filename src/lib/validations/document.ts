import { z } from "zod";

import { dateOnlySchema, optionalText, optionalUuidSchema, uuidSchema } from "./shared";

export const DOCUMENT_BUCKET = "company-documents";
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
] as const;

export const documentMetadataSchema = z.object({
  companyId: uuidSchema,
  obligationId: optionalUuidSchema,
  assetId: optionalUuidSchema,
  documentType: optionalText(120),
  expirationDate: dateOnlySchema.optional().or(z.literal("")),
  notes: optionalText(500)
});

export function validateDocumentFile(file: File) {
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number])) {
    return "Solo se permiten PDF, JPG, PNG y DOCX.";
  }

  if (file.size <= 0) {
    return "El archivo esta vacio.";
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return "El archivo supera el limite de 10 MB.";
  }

  return null;
}

export type DocumentMetadataInput = z.infer<typeof documentMetadataSchema>;
