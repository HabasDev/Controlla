import "server-only";

import { randomUUID } from "crypto";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { DOCUMENT_BUCKET, validateDocumentFile } from "@/lib/validations/document";

export function sanitizeFileName(fileName: string) {
  const normalized = fileName.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const safe = normalized.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  return safe || `documento-${randomUUID()}`;
}

export function buildDocumentStoragePath(input: {
  companyId: string;
  documentId: string;
  fileName: string;
}) {
  return `companies/${input.companyId}/documents/${input.documentId}/${sanitizeFileName(input.fileName)}`;
}

export async function uploadDocument(input: {
  companyId: string;
  documentId: string;
  file: File;
}) {
  const fileError = validateDocumentFile(input.file);

  if (fileError) {
    throw new Error(fileError);
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase Storage no esta configurado.");
  }

  const storagePath = buildDocumentStoragePath({
    companyId: input.companyId,
    documentId: input.documentId,
    fileName: input.file.name
  });

  const { error } = await supabase.storage.from(DOCUMENT_BUCKET).upload(storagePath, input.file, {
    contentType: input.file.type,
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }

  return storagePath;
}

export async function getSignedDocumentUrl(storagePath: string, expiresInSeconds = 60 * 5) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase Storage no esta configurado.");
  }

  const { data, error } = await supabase.storage.from(DOCUMENT_BUCKET).createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "No se pudo crear la URL firmada.");
  }

  return data.signedUrl;
}

export async function deleteDocument(storagePath: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase Storage no esta configurado.");
  }

  const { error } = await supabase.storage.from(DOCUMENT_BUCKET).remove([storagePath]);

  if (error) {
    throw new Error(error.message);
  }
}
