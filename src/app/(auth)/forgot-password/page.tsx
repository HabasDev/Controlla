import Link from "next/link";

import { ForgotPasswordForm } from "@/components/forms/auth-forms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Recuperar acceso"
};

export default function ForgotPasswordPage() {
  return (
    <Card
      className="w-full border-white/10 text-white shadow-2xl shadow-black/40 backdrop-blur-xl"
      style={{ background: "linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(8, 18, 35, 0.72))" }}
    >
      <CardHeader className="space-y-3 px-8 pt-9">
        <CardTitle className="text-3xl">Recuperar acceso</CardTitle>
        <CardDescription className="text-base text-slate-300">Te enviaremos un enlace de recuperacion si el email existe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-9">
        <ForgotPasswordForm />
        <Link className="block text-center text-sm font-medium text-teal-300 hover:text-teal-200" href="/login">
          Volver a iniciar sesion
        </Link>
      </CardContent>
    </Card>
  );
}
