import Link from "next/link";
import { notFound } from "next/navigation";

import { ObligationBoard } from "@/components/dashboard/obligation-board";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAssetsData, getDocumentsData, getObligationsData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Detalle de activo"
};

export default async function AssetDetailPage({ params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const [assetsData, obligationsData, documentsData] = await Promise.all([
    getAssetsData(),
    getObligationsData(),
    getDocumentsData()
  ]);
  const asset = assetsData.assets.find((item) => item.id === assetId);

  if (!asset) {
    notFound();
  }

  const relatedObligations = obligationsData.obligations.filter((item) => item.assetName === asset.name);
  const relatedDocuments = documentsData.documents.filter((item) => item.assetName === asset.name);

  return (
    <>
      <PageHeader
        actions={
          <Link className="text-sm font-medium text-primary hover:underline" href="/dashboard/activos">
            Volver a activos
          </Link>
        }
        description={`${asset.assetType} · ${asset.locationName}`}
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
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Obligaciones relacionadas</h2>
            <ObligationBoard locations={obligationsData.locations} members={obligationsData.members} obligations={relatedObligations} />
          </section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              La actividad de este activo se registra en `activity_logs` cuando se crea, edita o se asocian documentos.
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
