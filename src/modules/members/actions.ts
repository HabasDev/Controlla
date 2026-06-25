"use server";

import { and, eq } from "drizzle-orm";

import { requireDb } from "@/db";
import { companyMembers, profiles } from "@/db/schema";
import { requirePermission } from "@/lib/auth/session";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  invitationSchema,
  memberAccessSchema,
  updateMemberRoleSchema,
  type InvitationInput
} from "@/lib/validations/member";
import { zodFieldErrors } from "@/lib/validations/shared";
import { createActivityLog } from "@/modules/audit-log/service";
import type { ActionResult, CompanyRole } from "@/types";

export async function inviteMemberAction(input: InvitationInput): Promise<ActionResult> {
  const parsed = invitationSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa la invitacion.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { user } = await requirePermission(parsed.data.companyId, "members:invite");
  const admin = getSupabaseAdminClient();

  if (!admin) {
    return { ok: false, message: "Configura SUPABASE_SERVICE_ROLE_KEY para enviar invitaciones." };
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(parsed.data.email);

  if (error || !data.user) {
    return { ok: false, message: error?.message ?? "No se pudo crear la invitacion." };
  }

  const db = requireDb();

  await db
    .insert(profiles)
    .values({
      id: data.user.id,
      fullName: parsed.data.email
    })
    .onConflictDoNothing();

  await db
    .insert(companyMembers)
    .values({
      companyId: parsed.data.companyId,
      userId: data.user.id,
      role: parsed.data.role,
      status: "invited"
    })
    .onConflictDoUpdate({
      target: [companyMembers.companyId, companyMembers.userId],
      set: {
        role: parsed.data.role,
        status: "invited"
      }
    });

  await createActivityLog({
    companyId: parsed.data.companyId,
    actorUserId: user.id,
    entityType: "member",
    entityId: data.user.id,
    action: "member.invited",
    metadata: { email: parsed.data.email, role: parsed.data.role }
  });

  return { ok: true, message: "Invitacion enviada." };
}

export async function updateMemberRoleAction(input: {
  companyId: string;
  userId: string;
  role: Exclude<CompanyRole, "owner">;
}): Promise<ActionResult> {
  const parsed = updateMemberRoleSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa el cambio de rol.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { user } = await requirePermission(parsed.data.companyId, "members:update-role");
  const db = requireDb();
  const target = await db.query.companyMembers.findFirst({
    where: and(eq(companyMembers.companyId, parsed.data.companyId), eq(companyMembers.userId, parsed.data.userId))
  });

  if (!target) {
    return { ok: false, message: "El usuario no pertenece a esta empresa." };
  }

  if (target.role === "owner") {
    return { ok: false, message: "No se puede cambiar el rol del propietario desde esta pantalla." };
  }

  await db
    .update(companyMembers)
    .set({ role: parsed.data.role })
    .where(and(eq(companyMembers.companyId, parsed.data.companyId), eq(companyMembers.userId, parsed.data.userId)));

  await createActivityLog({
    companyId: parsed.data.companyId,
    actorUserId: user.id,
    entityType: "member",
    entityId: parsed.data.userId,
    action: "member.role_changed",
    metadata: { role: parsed.data.role }
  });

  return { ok: true, message: "Rol actualizado." };
}

export async function deactivateMemberAction(input: { companyId: string; userId: string }): Promise<ActionResult> {
  const parsed = memberAccessSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa el usuario seleccionado.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { user } = await requirePermission(parsed.data.companyId, "members:update-role");
  const db = requireDb();

  if (parsed.data.userId === user.id) {
    return { ok: false, message: "No puedes desactivar tu propio acceso." };
  }

  const target = await db.query.companyMembers.findFirst({
    where: and(eq(companyMembers.companyId, parsed.data.companyId), eq(companyMembers.userId, parsed.data.userId))
  });

  if (!target) {
    return { ok: false, message: "El usuario no pertenece a esta empresa." };
  }

  if (target.role === "owner") {
    return { ok: false, message: "No se puede desactivar al propietario." };
  }

  await db
    .update(companyMembers)
    .set({ status: "disabled" })
    .where(and(eq(companyMembers.companyId, parsed.data.companyId), eq(companyMembers.userId, parsed.data.userId)));

  await createActivityLog({
    companyId: parsed.data.companyId,
    actorUserId: user.id,
    entityType: "member",
    entityId: parsed.data.userId,
    action: "member.role_changed",
    metadata: { status: "disabled" }
  });

  return { ok: true, message: "Usuario desactivado." };
}

export async function removeMemberAccessAction(input: { companyId: string; userId: string }): Promise<ActionResult> {
  const parsed = memberAccessSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa el usuario seleccionado.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { user } = await requirePermission(parsed.data.companyId, "members:update-role");
  const db = requireDb();

  if (parsed.data.userId === user.id) {
    return { ok: false, message: "No puedes eliminar tu propio acceso." };
  }

  const target = await db.query.companyMembers.findFirst({
    where: and(eq(companyMembers.companyId, parsed.data.companyId), eq(companyMembers.userId, parsed.data.userId))
  });

  if (!target) {
    return { ok: false, message: "El usuario no pertenece a esta empresa." };
  }

  if (target.role === "owner") {
    return { ok: false, message: "No se puede eliminar el acceso del propietario." };
  }

  await db
    .delete(companyMembers)
    .where(and(eq(companyMembers.companyId, parsed.data.companyId), eq(companyMembers.userId, parsed.data.userId)));

  await createActivityLog({
    companyId: parsed.data.companyId,
    actorUserId: user.id,
    entityType: "member",
    entityId: parsed.data.userId,
    action: "member.role_changed",
    metadata: { removed: true }
  });

  return { ok: true, message: "Acceso eliminado." };
}
