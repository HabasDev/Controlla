import { ObligationBoard } from "@/features/obligations/components/obligation-board";
import { PageHeader } from "@/components/dashboard/page-header";
import { ObligationForm } from "@/components/forms/obligation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFormOptionsData, getObligationsData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Obligaciones"
};

function resolveCompanyId(company: { id?: string; companyId?: string }) {
  return company.companyId ?? company.id ?? "";
}

export default async function ObligationsPage() {
  const [data, options] = await Promise.all([getObligationsData(), getFormOptionsData()]);
  const companyId = resolveCompanyId(data.company);

  return (
    <>
      <PageHeader title="Obligaciones" description="Crea, filtra y revisa obligaciones por fecha, estado, responsable, tipo y sede." />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Crear obligacion</CardTitle>
          </CardHeader>
          <CardContent>
            <ObligationForm
              assets={options.assets}
              companyId={companyId}
              disabled={data.isDemo}
              locations={options.locations}
              members={options.members}
              obligationTypes={options.obligationTypes}
            />
          </CardContent>
        </Card>
        <ObligationBoard locations={data.locations} members={data.members} obligations={data.obligations} />
      </div>
    </>
  );
}
