import Link from "next/link";
import { notFound } from "next/navigation";

import { AssetForm } from "@/components/forms/asset-form";
import { ObligationBoard } from "@/features/obligations/components/obligation-board";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAssetDetailData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Detalle de activo"
};

export default async function AssetDetailPage({ params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const detail = await getAssetDetailData(assetId);
  const asset = detail.asset;

  if (!asset) {
    notFound();
  }

  const companyId = detail.options.company.companyId ?? detail.options.company.id ?? "";
  const formsDisabled = detail.isDemo && !detail.isDemoWritable;

  return (
    <>
      <PageHeader
        actions={
          <Link className="text-sm font-medium text-primary hover:underline" href="/dashboard/activos">
            Volver a activos
          </Link>
        }
        description={`${asset.assetType} - ${asset.locationName}`}
        title={asset.name}
      />
      <div className="grid gap-6 p-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos generales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Tipo</p>
                <p className="font-medium">{asset.assetType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                <Badge variant={asset.status === "active" ? "success" : "outline"}>{asset.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Sede</p>
                <p className="font-medium">{asset.locationName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Responsable asignado</p>
                <p className="font-medium">{asset.responsibleName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Referencia</p>
                <p className="font-medium">{asset.internalReference || "Sin referencia"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Numero de serie</p>
                <p className="font-medium">{asset.serialNumber || "Sin numero"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Descripcion</p>
                <p className="font-medium">{asset.description || "Sin descripcion."}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Editar activo</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetForm
                assetId={asset.id}
                companyId={companyId}
                disabled={formsDisabled}
                initialValues={{
                  companyId,
                  name: asset.name,
                  assetType: asset.assetType,
                  status: asset.status,
                  locationId: asset.locationId,
                  responsibleUserId: asset.responsibleUserId,
                  internalReference: asset.internalReference,
                  serialNumber: asset.serialNumber,
                  description: asset.description
                }}
                locations={detail.options.locations}
                members={detail.options.members}
              />
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Obligaciones relacionadas</h2>
            <ObligationBoard locations={detail.options.locations} members={detail.options.members} obligations={detail.obligations} />
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {detail.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin documentos asociados.</p>
              ) : (
                detail.documents.map((document) => (
                  <div className="rounded-md border p-3" key={document.id}>
                    <p className="text-sm font-medium">{document.fileName}</p>
                    <p className="text-xs text-muted-foreground">{document.documentType}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              La actividad de este activo se registra cuando se crea, edita o se asocian documentos.
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
