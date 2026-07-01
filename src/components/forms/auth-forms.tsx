"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, EyeOff, KeyRound, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
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
  email: z.string().trim().email("Introduce un email válido."),
  password: z.string().min(8, "Minimo 8 caracteres.")
});

const registerSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, "Indica tu nombre.")
});

const forgotSchema = z.object({
  email: z.string().trim().email("Introduce un email válido.")
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ForgotValues = z.infer<typeof forgotSchema>;

const authInputClass =
  "h-12 border-white/10 bg-slate-950/55 pl-4 pr-11 text-white shadow-inner shadow-black/20 placeholder:text-slate-500 focus-visible:ring-teal-300";
const authLabelClass = "text-sm font-medium text-slate-100";
const authButtonClass =
  "h-12 bg-gradient-to-r from-teal-300 to-cyan-500 text-slate-950 shadow-lg shadow-teal-950/30 hover:from-teal-200 hover:to-cyan-400";

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
        <Label className={authLabelClass} htmlFor="email">
          Email
        </Label>
        <div className="relative">
          <Input className={authInputClass} id="email" placeholder="tu@email.com" type="email" {...form.register("email")} />
          <Mail className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-300" aria-hidden="true" />
        </div>
        <p className="text-xs text-critical">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label className={authLabelClass} htmlFor="password">
          Contraseña
        </Label>
        <div className="relative">
          <Input className={authInputClass} id="password" type="password" {...form.register("password")} />
          <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3 text-slate-400">
            <LockKeyhole className="h-4 w-4 text-teal-300" aria-hidden="true" />
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
        <p className="text-xs text-critical">{form.formState.errors.password?.message}</p>
      </div>
      <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
        <label className="flex items-center gap-2">
          <input className="h-4 w-4 rounded border-white/20 bg-slate-950/60 accent-teal-300" type="checkbox" />
          Recordarme
        </label>
        <Link className="font-medium text-teal-300 hover:text-teal-200" href="/forgot-password">
          Olvidaste tu contraseña?
        </Link>
      </div>
      <Button className={`w-full ${authButtonClass}`} disabled={isPending} type="submit">
        Acceder
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
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
        <Label className={authLabelClass} htmlFor="fullName">
          Nombre
        </Label>
        <Input className={authInputClass} id="fullName" {...form.register("fullName")} />
        <p className="text-xs text-critical">{form.formState.errors.fullName?.message}</p>
      </div>
      <div className="space-y-2">
        <Label className={authLabelClass} htmlFor="email">
          Email
        </Label>
        <Input className={authInputClass} id="email" type="email" {...form.register("email")} />
        <p className="text-xs text-critical">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label className={authLabelClass} htmlFor="password">
          Contraseña
        </Label>
        <Input className={authInputClass} id="password" type="password" {...form.register("password")} />
        <p className="text-xs text-critical">{form.formState.errors.password?.message}</p>
      </div>
      <Button className={`w-full ${authButtonClass}`} disabled={isPending} type="submit">
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
        <Label className={authLabelClass} htmlFor="email">
          Email
        </Label>
        <Input className={authInputClass} id="email" type="email" {...form.register("email")} />
        <p className="text-xs text-critical">{form.formState.errors.email?.message}</p>
      </div>
      <Button className={`w-full ${authButtonClass}`} disabled={isPending} type="submit">
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        Recuperar acceso
      </Button>
    </form>
  );
}
