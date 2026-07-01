import { Building2 } from "lucide-react";

import { CompanyForm } from "@/components/forms/company-form";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCompanySettingsData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Configuracion"
};

function resolveCompanyId(company: { id?: string; companyId?: string }) {
  return company.companyId ?? company.id ?? "";
}

export default async function SettingsPage() {
  const data = await getCompanySettingsData();
  const companyId = resolveCompanyId(data.company);
  const companyValues = {
    name: "name" in data.company ? data.company.name : "",
    legalName: "legalName" in data.company && data.company.legalName ? data.company.legalName : undefined,
    taxId: "taxId" in data.company && data.company.taxId ? data.company.taxId : undefined,
    timezone: "timezone" in data.company ? data.company.timezone : "Europe/Madrid",
    industry: "industry" in data.company && data.company.industry ? data.company.industry : undefined
  };

  return (
    <>
      <PageHeader title="Configuracion de empresa" description="Datos fiscales, zona horaria, sedes y preferencias base." />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos de empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyForm companyId={companyId} disabled={data.isDemo} initialValues={companyValues} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sedes</CardTitle>
          </CardHeader>
          <CardContent>
            {data.locations.length === 0 ? (
              <EmptyState icon={Building2} title="Sin sedes" description="Las sedes se mostraran aqui cuando se registren en la empresa." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Direccion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{"city" in location ? location.city ?? "Sin ciudad" : "Sin ciudad"}</TableCell>
                      <TableCell>{"address" in location ? location.address ?? "Sin direccion" : "Sin direccion"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferencias de avisos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Avisos predeterminados activos: 90, 30, 15, 7, 1 y 0 dias antes del vencimiento, mas 7 dias despues.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
