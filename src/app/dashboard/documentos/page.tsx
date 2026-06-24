import { FileText } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { DeleteDocumentButton } from "@/components/dashboard/delete-document-button";
import { SecureDownloadButton } from "@/components/dashboard/secure-download-button";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";
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
            <CardContent>
              <Table>
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
