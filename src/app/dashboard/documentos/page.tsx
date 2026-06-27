import { FileText } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { DeleteDocumentButton } from "@/features/documents/components/delete-document-button";
import { SecureDownloadButton } from "@/features/documents/components/secure-download-button";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateEs, getObligationStatus } from "@/lib/date/obligations";
import { getDocumentsData, getFormOptionsData, getObligationsData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Documentos"
};

function resolveCompanyId(company: { id?: string; companyId?: string }) {
  return company.companyId ?? company.id ?? "";
}

export default async function DocumentsPage() {
  const [data, options, obligationsData] = await Promise.all([getDocumentsData(), getFormOptionsData(), getObligationsData()]);
  const companyId = resolveCompanyId(data.company);

  return (
    <>
      <PageHeader title="Documentos" description="Sube documentos privados y descarga siempre mediante URL firmada." />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Subir documento</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUploadForm
              assets={options.assets}
              companyId={companyId}
              disabled={data.isDemo}
              obligations={obligationsData.obligations.map((item) => ({ id: item.id, title: item.title }))}
            />
          </CardContent>
        </Card>

        {data.documents.length === 0 ? (
          <EmptyState icon={FileText} title="Sin documentos" description="Todavia no hay documentos asociados a esta empresa." />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Biblioteca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 md:hidden">
                {data.documents.map((document) => {
                  const expiring =
                    document.expirationDate && getObligationStatus({ dueDate: document.expirationDate }) !== "normal";
                  return (
                    <article className="rounded-lg border bg-background/70 p-4 shadow-sm" key={document.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{document.fileName}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{Math.round(document.sizeBytes / 1024)} KB</p>
                        </div>
                        <Badge variant={expiring ? "warning" : "secondary"}>{document.documentType}</Badge>
                      </div>
                      <dl className="mt-4 grid gap-3 text-sm">
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Relacionado</dt>
                          <dd className="mt-1 font-medium">{document.assetName || "Sin activo"}</dd>
                          <dd className="text-xs text-muted-foreground">{document.obligationTitle || "Sin obligacion"}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Caducidad</dt>
                          <dd className={expiring ? "mt-1 font-semibold text-critical" : "mt-1 font-medium"}>
                            {document.expirationDate ? formatDateEs(document.expirationDate) : "Sin caducidad"}
                          </dd>
                        </div>
                      </dl>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <SecureDownloadButton disabled={data.isDemo} documentId={document.id} />
                        <DeleteDocumentButton companyId={companyId} disabled={data.isDemo} documentId={document.id} />
                      </div>
                    </article>
                  );
                })}
              </div>

              <Table className="hidden md:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Archivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Relacionado</TableHead>
                    <TableHead>Caducidad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.documents.map((document) => {
                    const expiring =
                      document.expirationDate && getObligationStatus({ dueDate: document.expirationDate }) !== "normal";
                    return (
                      <TableRow key={document.id}>
                        <TableCell>
                          <p className="font-medium">{document.fileName}</p>
                          <p className="text-xs text-muted-foreground">{Math.round(document.sizeBytes / 1024)} KB</p>
                        </TableCell>
                        <TableCell>{document.documentType}</TableCell>
                        <TableCell>
                          {document.assetName}
                          <p className="text-xs text-muted-foreground">{document.obligationTitle}</p>
                        </TableCell>
                        <TableCell className={expiring ? "font-medium text-critical" : ""}>
                          {document.expirationDate ? formatDateEs(document.expirationDate) : "Sin caducidad"}
                        </TableCell>
                        <TableCell className="flex flex-wrap gap-2">
                          <SecureDownloadButton disabled={data.isDemo} documentId={document.id} />
                          <DeleteDocumentButton companyId={companyId} disabled={data.isDemo} documentId={document.id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
