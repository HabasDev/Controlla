import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { documents } from "@/db/schema";
import { requirePermission } from "@/lib/auth/session";
import { getSignedDocumentUrl } from "@/lib/storage/documents";

export async function GET(_request: Request, { params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  const db = getDb();

  if (!db) {
    return NextResponse.json({ message: "DATABASE_URL no esta configurado." }, { status: 503 });
  }

  const document = await db.query.documents.findFirst({
    where: eq(documents.id, documentId)
  });

  if (!document) {
    return NextResponse.json({ message: "Documento no encontrado." }, { status: 404 });
  }

  await requirePermission(document.companyId, "documents:read");
  const signedUrl = await getSignedDocumentUrl(document.storagePath);

  return NextResponse.json({ signedUrl });
}
