import { CompanyForm } from "@/components/forms/company-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasDatabaseConfig, hasSupabaseConfig } from "@/lib/env";

export const metadata = {
  title: "Onboarding"
};

export default function OnboardingPage() {
  const disabled = !hasDatabaseConfig() || !hasSupabaseConfig();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Crea tu empresa</CardTitle>
        <CardDescription>Esta sera la empresa activa inicial. Podras anadir sedes y usuarios despues.</CardDescription>
      </CardHeader>
      <CardContent>
        <CompanyForm disabled={disabled} />
      </CardContent>
    </Card>
  );
}
