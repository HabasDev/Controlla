import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, FileCheck2, History, ShieldCheck } from "lucide-react";

import { ObligationActions } from "@/features/obligations/components/obligation-actions";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
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
  const formsDisabled = detail.isDemo && !detail.isDemoWritable;
  const documentUploadDisabled = documentsData.isDemo;
  const relatedDocuments = documentsData.documents.filter((document) => document.obligationId === detail.obligation.id);
  const reminderDays = [90, 30, 15, 7, 1, 0, -7];
  const relativeDueDate = formatRelativeDueDate(detail.obligation);
  const timeline = [
    {
      label: "Alta",
      value: "Registrada",
      icon: ShieldCheck
    },
    {
      label: "Avisos",
      value: reminderDays.slice(0, 4).map((days) => `${days}d`).join(" / "),
      icon: CalendarClock
    },
    {
      label: "Vencimiento",
      value: relativeDueDate,
      icon: FileCheck2
    }
  ];

  return (
    <>
      <PageHeader
        actions={
          <Link className="text-sm font-medium text-primary hover:underline" href="/dashboard/obligaciones">
            Volver a obligaciones
          </Link>
        }
        description={`${detail.obligation.typeName} - ${detail.obligation.assetName}`}
        title={detail.obligation.title}
      />
      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="dark-control-surface overflow-hidden text-white">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Expediente operativo</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">{relativeDueDate}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    {detail.obligation.responsibleName} controla esta obligacion asociada a {detail.obligation.assetName}.
                  </p>
                </div>
                <StatusBadge status={detail.obligation.computedStatus} />
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {timeline.map((item) => (
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={item.label}>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      <item.icon className="h-4 w-4 text-cyan-200" aria-hidden />
                      {item.label}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                <p className="text-xs text-muted-foreground">{relativeDueDate}</p>
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
                disabled={formsDisabled}
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
                disabled={formsDisabled}
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
                disabled={documentUploadDisabled}
                obligations={obligationsData.obligations.map((item) => ({ id: item.id, title: item.title }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4" aria-hidden />
                Historial
              </CardTitle>
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
