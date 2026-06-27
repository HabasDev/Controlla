import Link from "next/link";

import { LoginForm } from "@/components/forms/auth-forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Entrar"
};

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Iniciar sesion</CardTitle>
        <CardDescription>Accede al panel de tu empresa.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <div className="flex justify-between text-sm text-muted-foreground">
          <Link className="hover:text-foreground" href="/forgot-password">
            Recuperar contraseña
          </Link>
          <Link className="hover:text-foreground" href="/register">
            Crear cuenta
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
