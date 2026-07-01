import "server-only";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { getDb } from "@/db";
import { companies, companyMembers, profiles } from "@/db/schema";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { assertRoleCan, roleCan, type Permission } from "@/lib/permissions";
import type { CompanyRole } from "@/types";

export const ACTIVE_COMPANY_COOKIE = "controla_company_id";

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const db = getDb();
  let profile = null;

  if (db) {
    try {
      profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id)
      });
    } catch {
      profile = null;
    }
  }

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.fullName ?? (typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : null)
  };
}

export async function getActiveCompanyIdFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_COMPANY_COOKIE)?.value ?? null;
}

export async function setActiveCompanyCookie(companyId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_COMPANY_COOKIE, companyId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function getCurrentCompany(preferredCompanyId?: string, currentUser?: CurrentUser | null) {
  const user = currentUser === undefined ? await getCurrentUser() : currentUser;
  const db = getDb();

  if (!user || !db) {
    return null;
  }

  const cookieCompanyId = preferredCompanyId ?? (await getActiveCompanyIdFromCookie());

  let memberships: {
    companyId: string;
    name: string;
    timezone: string;
    role: CompanyRole;
  }[] = [];

  try {
    memberships = await db
      .select({
        companyId: companies.id,
        name: companies.name,
        timezone: companies.timezone,
        role: companyMembers.role
      })
      .from(companyMembers)
      .innerJoin(companies, eq(companyMembers.companyId, companies.id))
      .where(and(eq(companyMembers.userId, user.id), eq(companyMembers.status, "active")));
  } catch {
    return null;
  }

  const selected = cookieCompanyId
    ? memberships.find((membership) => membership.companyId === cookieCompanyId)
    : memberships[0];

  return selected ?? null;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Debes iniciar sesion.");
  }

  return user;
}

export async function requireCompanyMembership(companyId: string) {
  const user = await requireCurrentUser();
  const db = getDb();

  if (!db) {
    throw new Error("DATABASE_URL no esta configurado.");
  }

  const membership = await db.query.companyMembers.findFirst({
    where: and(
      eq(companyMembers.companyId, companyId),
      eq(companyMembers.userId, user.id),
      eq(companyMembers.status, "active")
    )
  });

  if (!membership) {
    throw new Error("No perteneces a esta empresa.");
  }

  return {
    user,
    membership
  };
}

export async function requireCompanyRole(companyId: string, roles: CompanyRole[]) {
  const context = await requireCompanyMembership(companyId);

  if (!roles.includes(context.membership.role)) {
    throw new Error("No tienes permisos suficientes para esta accion.");
  }

  return context;
}

export async function requirePermission(companyId: string, permission: Permission) {
  const context = await requireCompanyMembership(companyId);
  assertRoleCan(context.membership.role, permission);
  return context;
}

export async function canCurrentUser(companyId: string, permission: Permission) {
  const context = await requireCompanyMembership(companyId);
  return roleCan(context.membership.role, permission);
}
