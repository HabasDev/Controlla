import Link from "next/link";

import { RegisterForm } from "@/components/forms/auth-forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Registro"
};

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Despues crearas la empresa inicial.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegisterForm />
        <p className="text-sm text-muted-foreground">
          Ya tienes cuenta?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
