import { InviteMemberForm } from "@/components/forms/invite-member-form";
import { MemberAccessControls } from "@/features/members/components/member-access-controls";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTeamData } from "@/modules/dashboard/data";

export const metadata = {
  title: "Equipo"
};

function resolveCompanyId(company: { id?: string; companyId?: string }) {
  return company.companyId ?? company.id ?? "";
}

export default async function TeamPage() {
  const data = await getTeamData();
  const companyId = resolveCompanyId(data.company);

  return (
    <>
      <PageHeader title="Equipo" description="Gestiona miembros, invitaciones, roles y accesos a la empresa." />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Invitar usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteMemberForm companyId={companyId} disabled={data.isDemo} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Miembros</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acceso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.fullName}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{member.role}</Badge>
                    </TableCell>
                    <TableCell>{member.status}</TableCell>
                    <TableCell>
                      <MemberAccessControls
                        companyId={companyId}
                        disabled={data.isDemo}
                        role={member.role}
                        userId={member.userId}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
