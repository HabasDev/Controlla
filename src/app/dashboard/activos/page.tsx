import { AssetForm } from "@/components/forms/asset-form";
import { AssetsList } from "@/features/assets/components/assets-list";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAssetsData, getFormOptionsData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Activos"
};

function resolveCompanyId(company: { id?: string; companyId?: string }) {
  return company.companyId ?? company.id ?? "";
}

export default async function AssetsPage() {
  const [data, options] = await Promise.all([getAssetsData(), getFormOptionsData()]);
  const companyId = resolveCompanyId(data.company);
  const formsDisabled = data.isDemo && !data.isDemoWritable;

  return (
    <>
      <PageHeader title="Activos" description="Vehiculos, equipos, instalaciones, contratos y recursos asociados a obligaciones." />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Crear activo</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetForm companyId={companyId} disabled={formsDisabled} locations={options.locations} members={options.members} />
          </CardContent>
        </Card>
        <AssetsList assets={data.assets} />
      </div>
    </>
  );
}
