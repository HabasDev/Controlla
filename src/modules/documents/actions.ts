"use server";

import { randomUUID } from "crypto";

import { and, eq } from "drizzle-orm";

import { requireDb } from "@/db";
import { assets, documents, obligations } from "@/db/schema";
import { requirePermission } from "@/lib/auth/session";
import { deleteDocument, uploadDocument } from "@/lib/storage/documents";
import { documentMetadataSchema, validateDocumentFile } from "@/lib/validations/document";
import { zodFieldErrors } from "@/lib/validations/shared";
import { createActivityLog } from "@/modules/audit-log/service";
import type { ActionResult } from "@/types";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function nullableId(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

export async function uploadDocumentAction(formData: FormData): Promise<ActionResult<{ documentId: string }>> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { ok: false, message: "Selecciona un archivo." };
  }

  const fileError = validateDocumentFile(file);

  if (fileError) {
    return { ok: false, message: fileError };
  }

  const parsed = documentMetadataSchema.safeParse({
    companyId: formString(formData, "companyId"),
    obligationId: formString(formData, "obligationId"),
    assetId: formString(formData, "assetId"),
    documentType: formString(formData, "documentType"),
    expirationDate: formString(formData, "expirationDate"),
    notes: formString(formData, "notes")
  });

  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos del documento.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { user } = await requirePermission(parsed.data.companyId, "documents:manage");
  const db = requireDb();
  const obligationId = nullableId(parsed.data.obligationId);
  const assetId = nullableId(parsed.data.assetId);

  if (obligationId) {
    const obligation = await db.query.obligations.findFirst({
      where: and(eq(obligations.id, obligationId), eq(obligations.companyId, parsed.data.companyId))
    });

    if (!obligation) {
      return { ok: false, message: "La obligacion no pertenece a esta empresa." };
    }
  }

  if (assetId) {
    const asset = await db.query.assets.findFirst({
      where: and(eq(assets.id, assetId), eq(assets.companyId, parsed.data.companyId))
    });

    if (!asset) {
      return { ok: false, message: "El activo no pertenece a esta empresa." };
    }
  }

  const documentId = randomUUID();
  const storagePath = await uploadDocument({
    companyId: parsed.data.companyId,
    documentId,
    file
  });

  try {
    await db.insert(documents).values({
      id: documentId,
      companyId: parsed.data.companyId,
      obligationId,
      assetId,
      uploadedBy: user.id,
      fileName: file.name,
      storagePath,
      mimeType: file.type,
      sizeBytes: file.size,
      documentType: parsed.data.documentType,
      expirationDate: parsed.data.expirationDate || null,
      notes: parsed.data.notes
    });
  } catch (error) {
    await deleteDocument(storagePath);
    throw error;
  }

  await createActivityLog({
    companyId: parsed.data.companyId,
    actorUserId: user.id,
    entityType: "document",
    entityId: documentId,
    action: "document.uploaded",
    metadata: { fileName: file.name }
  });

  return { ok: true, data: { documentId }, message: "Documento subido." };
}

export async function deleteDocumentAction(companyId: string, documentId: string): Promise<ActionResult> {
  const { user } = await requirePermission(companyId, "documents:manage");
  const db = requireDb();
  const document = await db.query.documents.findFirst({
    where: and(eq(documents.id, documentId), eq(documents.companyId, companyId))
  });

  if (!document) {
    return { ok: false, message: "Documento no encontrado." };
  }

  await deleteDocument(document.storagePath);
  await db.delete(documents).where(and(eq(documents.id, documentId), eq(documents.companyId, companyId)));

  await createActivityLog({
    companyId,
    actorUserId: user.id,
    entityType: "document",
    entityId: documentId,
    action: "document.deleted",
    metadata: { fileName: document.fileName }
  });

  return { ok: true, message: "Documento eliminado." };
}
