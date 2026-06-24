import Link from "next/link";
import { notFound } from "next/navigation";

import { ObligationActions } from "@/components/dashboard/obligation-actions";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";
import { ObligationForm } from "@/components/forms/obligation-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateEs, formatRelativeDueDate } from "@/lib/date/obligations";
import { getDocumentsData, getObligationDetailData, getObligationsData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Detalle de obligacion"
};

function resolveCompanyId(company: { id?: string; companyId?: string }) {
  return company.companyId ?? company.id ?? "";
}

export default async function ObligationDetailPage({ params }: { params: Promise<{ obligationId: string }> }) {
  const { obligationId } = await params;
  const [detail, documentsData, obligationsData] = await Promise.all([
    getObligationDetailData(obligationId),
    getDocumentsData(),
    getObligationsData()
  ]);

  if (!detail.obligation) {
    notFound();
  }

  const companyId = resolveCompanyId(detail.options.company);
  const relatedDocuments = documentsData.documents.filter((document) => document.obligationTitle === detail.obligation.title);
  const reminderDays = [90, 30, 15, 7, 1, 0, -7];

  return (
    <>
      <PageHeader
        actions={
          <Link className="text-sm font-medium text-primary hover:underline" href="/dashboard/obligaciones">
            Volver a obligaciones
          </Link>
        }
        description={`${detail.obligation.typeName} · ${detail.obligation.assetName}`}
        title={detail.obligation.title}
      />
      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Datos generales</CardTitle>
                <StatusBadge status={detail.obligation.computedStatus} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm md:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Fecha de vencimiento</p>
                <p className="font-medium">{formatDateEs(detail.obligation.dueDate)}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeDueDate(detail.obligation)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Responsable asignado</p>
                <p className="font-medium">{detail.obligation.responsibleName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Prioridad</p>
                <Badge variant={detail.obligation.priority === "critical" ? "critical" : "secondary"}>{detail.obligation.priority}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Periodicidad</p>
                <p className="font-medium">
                  {detail.obligation.recurrenceEnabled
                    ? `Cada ${detail.obligation.recurrenceInterval} ${detail.obligation.recurrenceUnit}`
                    : "Sin recurrencia"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground">Descripcion</p>
                <p>{detail.obligation.description || "Sin descripcion."}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Editar obligacion</CardTitle>
            </CardHeader>
            <CardContent>
              <ObligationForm
                assets={detail.options.assets}
                companyId={companyId}
                disabled={detail.isDemo}
                initialValues={{
                  companyId,
                  title: detail.obligation.title,
                  obligationTypeId: detail.obligation.obligationTypeId,
                  assetId: detail.obligation.assetId,
                  locationId: detail.obligation.locationId,
                  responsibleUserId: detail.obligation.responsibleUserId,
                  dueDate: detail.obligation.dueDate,
                  priority: detail.obligation.priority,
                  status: detail.obligation.status,
                  recurrenceEnabled: detail.obligation.recurrenceEnabled,
                  recurrenceUnit: detail.obligation.recurrenceUnit,
                  recurrenceInterval: detail.obligation.recurrenceInterval,
                  autoCreateNext: detail.obligation.autoCreateNext,
                  description: detail.obligation.description,
                  notes: detail.obligation.notes
                }}
                locations={detail.options.locations}
                members={detail.options.members}
                obligationId={detail.obligation.id}
                obligationTypes={detail.options.obligationTypes}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent>
              <ObligationActions
                companyId={companyId}
                disabled={detail.isDemo}
                obligationId={detail.obligation.id}
                recurrenceEnabled={detail.obligation.recurrenceEnabled}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reglas de aviso</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {reminderDays.map((days) => (
                <Badge key={days} variant={days <= 7 ? "warning" : "secondary"}>
                  {days > 0 ? `${days} dias antes` : days === 0 ? "Dia de vencimiento" : `${Math.abs(days)} dias despues`}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedDocuments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin documentos asociados.</p>
              ) : (
                relatedDocuments.map((document) => (
                  <div className="rounded-md border p-3" key={document.id}>
                    <p className="text-sm font-medium">{document.fileName}</p>
                    <p className="text-xs text-muted-foreground">{document.documentType}</p>
                  </div>
                ))
              )}
              <DocumentUploadForm
                assets={detail.options.assets}
                companyId={companyId}
                disabled={detail.isDemo}
                obligations={obligationsData.obligations.map((item) => ({ id: item.id, title: item.title }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Crear, editar, completar, cancelar y subir documentos queda registrado en `activity_logs`.
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
