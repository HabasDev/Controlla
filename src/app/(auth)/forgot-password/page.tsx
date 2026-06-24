import Link from "next/link";

import { ForgotPasswordForm } from "@/components/forms/auth-forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Recuperar acceso"
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recuperar acceso</CardTitle>
        <CardDescription>Te enviaremos un enlace de recuperacion si el email existe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ForgotPasswordForm />
        <Link className="text-sm text-primary hover:underline" href="/login">
          Volver a iniciar sesion
        </Link>
      </CardContent>
    </Card>
  );
}
