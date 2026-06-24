import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Admin"
};

export default function AdminPage() {
  return (
    <>
      <PageHeader title="Admin" description="Zona reservada para operaciones internas del SaaS." />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Administracion preparada</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Esta base separa el panel de empresa de una futura zona de administracion del producto. No incluye funciones internas fuera del alcance inicial.
          </CardContent>
        </Card>
      </div>
    </>
  );
}
