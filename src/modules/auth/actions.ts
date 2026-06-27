"use server";

import { z } from "zod";

import { getDb } from "@/db";
import { profiles } from "@/db/schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { zodFieldErrors } from "@/lib/validations/shared";
import type { ActionResult } from "@/types";

const authSchema = z.object({
  email: z.string().trim().email("Introduce un email valido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.")
});

const registerSchema = authSchema.extend({
  fullName: z.string().trim().min(2, "Indica tu nombre.").max(120)
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Introduce un email valido.")
});

export type LoginInput = z.infer<typeof authSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = authSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase Auth no esta configurado." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: "No se pudo iniciar sesion. Revisa el email y la contraseña." };
  }

  return { ok: true, message: "Sesion iniciada." };
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los campos.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase Auth no esta configurado." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName
      }
    }
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  const db = getDb();

  if (db && data.user) {
    await db
      .insert(profiles)
      .values({
        id: data.user.id,
        fullName: parsed.data.fullName
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          fullName: parsed.data.fullName
        }
      });
  }

  return { ok: true, message: "Cuenta creada. Continua creando tu empresa." };
}

export async function forgotPasswordAction(input: ForgotPasswordInput): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa el email.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase Auth no esta configurado." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "Te hemos enviado instrucciones para recuperar el acceso." };
}

export async function signOutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}
