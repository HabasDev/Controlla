import { z } from "zod";

import { COMPANY_ROLES } from "@/types";

import { uuidSchema } from "./shared";

const assignableRoleSchema = z.enum(COMPANY_ROLES).refine((role) => role !== "owner", {
  message: "La propiedad no se asigna desde esta accion."
});

export const invitationSchema = z.object({
  companyId: uuidSchema,
  email: z.string().trim().email("Introduce un email valido.").max(240),
  role: assignableRoleSchema
});

export const updateMemberRoleSchema = z.object({
  companyId: uuidSchema,
  userId: uuidSchema,
  role: assignableRoleSchema
});

export const memberAccessSchema = z.object({
  companyId: uuidSchema,
  userId: uuidSchema
});

export type InvitationInput = z.infer<typeof invitationSchema>;
