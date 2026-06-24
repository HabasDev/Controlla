import { z } from "zod";

import { COMPANY_ROLES } from "@/types";

import { uuidSchema } from "./shared";

export const invitationSchema = z.object({
  companyId: uuidSchema,
  email: z.string().trim().email("Introduce un email valido.").max(240),
  role: z.enum(COMPANY_ROLES).refine((role) => role !== "owner", {
    message: "La propiedad no se asigna por invitacion."
  })
});

export type InvitationInput = z.infer<typeof invitationSchema>;
