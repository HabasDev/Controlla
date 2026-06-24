"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormResult } from "@/components/forms/form-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction, loginAction, registerAction } from "@/modules/auth/actions";

const loginSchema = z.object({
  email: z.string().email("Introduce un email valido."),
  password: z.string().min(8, "Minimo 8 caracteres.")
});

const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, "Indica tu nombre.")
});

const forgotSchema = z.object({
  email: z.string().email("Introduce un email valido.")
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ForgotValues = z.infer<typeof forgotSchema>;

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isOk, setIsOk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await loginAction(values);
          setMessage(result.message ?? null);
          setIsOk(result.ok);
          if (result.ok) {
            router.push("/dashboard");
            router.refresh();
          }
        })
      )}
    >
      <FormResult message={message} ok={isOk} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        <p className="text-xs text-critical">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contrasena</Label>
        <Input id="password" type="password" {...form.register("password")} />
        <p className="text-xs text-critical">{form.formState.errors.password?.message}</p>
      </div>
      <Button className="w-full" disabled={isPending} type="submit">
        <Mail className="h-4 w-4" aria-hidden="true" />
        Entrar
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isOk, setIsOk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await registerAction(values);
          setMessage(result.message ?? null);
          setIsOk(result.ok);
          if (result.ok) {
            router.push("/onboarding");
          }
        })
      )}
    >
      <FormResult message={message} ok={isOk} />
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre</Label>
        <Input id="fullName" {...form.register("fullName")} />
        <p className="text-xs text-critical">{form.formState.errors.fullName?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        <p className="text-xs text-critical">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contrasena</Label>
        <Input id="password" type="password" {...form.register("password")} />
        <p className="text-xs text-critical">{form.formState.errors.password?.message}</p>
      </div>
      <Button className="w-full" disabled={isPending} type="submit">
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
        Crear cuenta
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isOk, setIsOk] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" }
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await forgotPasswordAction(values);
          setMessage(result.message ?? null);
          setIsOk(result.ok);
        })
      )}
    >
      <FormResult message={message} ok={isOk} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        <p className="text-xs text-critical">{form.formState.errors.email?.message}</p>
      </div>
      <Button className="w-full" disabled={isPending} type="submit">
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        Recuperar acceso
      </Button>
    </form>
  );
}
