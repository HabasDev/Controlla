"use server";

import { randomUUID } from "crypto";

import { and, eq } from "drizzle-orm";

import { requireDb } from "@/db";
import { assets, companyMembers, locations, obligationTypes, obligations, reminderRules } from "@/db/schema";
import { requirePermission } from "@/lib/auth/session";
import { calculateNextDueDate } from "@/lib/date/obligations";
import { obligationSchema, type ObligationInput } from "@/lib/validations/obligation";
import { zodFieldErrors } from "@/lib/validations/shared";
import { createActivityLog } from "@/modules/audit-log/service";
import { buildDefaultReminderRules } from "@/modules/reminders/service";
import type { ActionResult, FrequencyUnit } from "@/types";

function nullableId(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

function nullableDate(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

function moneyValue(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(2) : null;
}

async function verifyObligationReferences(input: ObligationInput) {
  const db = requireDb();
  const locationId = nullableId(input.locationId);
  const assetId = nullableId(input.assetId);
  const responsibleUserId = nullableId(input.responsibleUserId);

  if (locationId) {
    const location = await db.query.locations.findFirst({
      where: and(eq(locations.id, locationId), eq(locations.companyId, input.companyId))
    });

    if (!location) {
      throw new Error("La sede indicada no pertenece a esta empresa.");
    }
  }

  if (assetId) {
    const asset = await db.query.assets.findFirst({
      where: and(eq(assets.id, assetId), eq(assets.companyId, input.companyId))
    });

    if (!asset) {
      throw new Error("El activo indicado no pertenece a esta empresa.");
    }
  }

  if (responsibleUserId) {
    const membership = await db.query.companyMembers.findFirst({
      where: and(
        eq(companyMembers.companyId, input.companyId),
        eq(companyMembers.userId, responsibleUserId),
        eq(companyMembers.status, "active")
      )
    });

    if (!membership) {
      throw new Error("El responsable debe ser miembro activo de la empresa.");
    }
  }

  const type = await db.query.obligationTypes.findFirst({
    where: eq(obligationTypes.id, input.obligationTypeId)
  });

  if (!type || (type.companyId !== null && type.companyId !== input.companyId)) {
    throw new Error("El tipo de obligacion no pertenece a esta empresa.");
  }
}

export async function createObligationAction(input: ObligationInput): Promise<ActionResult<{ obligationId: string }>> {
  const parsed = obligationSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos de la obligacion.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  const { user } = await requirePermission(parsed.data.companyId, "obligations:manage");
  const db = requireDb();

  try {
    await verifyObligationReferences(parsed.data);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "No se pudo validar la obligacion." };
  }

  const recurrenceUnit = parsed.data.recurrenceEnabled ? (parsed.data.recurrenceUnit as FrequencyUnit) : null;
  const recurrenceInterval = parsed.data.recurrenceEnabled ? parsed.data.recurrenceInterval : null;
  const nextDueDate =
    parsed.data.recurrenceEnabled && recurrenceUnit && recurrenceInterval
      ? calculateNextDueDate({
          fromDate: parsed.data.dueDate,
          unit: recurrenceUnit,
          interval: recurrenceInterval
        })
      : null;

  const [obligation] = await db
    .insert(obligations)
    .values({
      companyId: parsed.data.companyId,
      locationId: nullableId(parsed.data.locationId),
      assetId: nullableId(parsed.data.assetId),
      obligationTypeId: parsed.data.obligationTypeId,
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      priority: parsed.data.priority,
      responsibleUserId: nullableId(parsed.data.responsibleUserId),
      startDate: nullableDate(parsed.data.startDate),
      dueDate: parsed.data.dueDate,
      recurrenceEnabled: parsed.data.recurrenceEnabled,
      recurrenceUnit,
      recurrenceInterval,
      autoCreateNext: parsed.data.autoCreateNext,
      nextDueDate,
      estimatedCost: moneyValue(parsed.data.estimatedCost),
      actualCost: moneyValue(parsed.data.actualCost),
      notes: parsed.data.notes
    })
    .returning({ id: obligations.id });

  const rules = parsed.data.reminderRules.length > 0 ? parsed.data.reminderRules : buildDefaultReminderRules();

  await db.insert(reminderRules).values(
    rules.map((rule) => ({
      companyId: parsed.data.companyId,
      obligationId: obligation.id,
      daysBeforeDue: rule.daysBeforeDue,
      channel: rule.channel,
      enabled: rule.enabled
    }))
  );

  await createActivityLog({
    companyId: parsed.data.companyId,
    actorUserId: user.id,
    entityType: "obligation",
    entityId: obligation.id,
    action: "obligation.created",
    metadata: { title: parsed.data.title }
  });

  return { ok: true, data: { obligationId: obligation.id }, message: "Obligacion creada." };
}

export async function completeObligationAction(companyId: string, obligationId: string): Promise<ActionResult> {
  const { user } = await requirePermission(companyId, "obligations:manage");
  const db = requireDb();

  const obligation = await db.query.obligations.findFirst({
    where: and(eq(obligations.id, obligationId), eq(obligations.companyId, companyId))
  });

  if (!obligation) {
    return { ok: false, message: "No se encontro la obligacion." };
  }

  const nextDueDate =
    obligation.recurrenceEnabled && obligation.recurrenceUnit && obligation.recurrenceInterval
      ? calculateNextDueDate({
          fromDate: obligation.dueDate,
          unit: obligation.recurrenceUnit,
          interval: obligation.recurrenceInterval
        })
      : null;

  await db
    .update(obligations)
    .set({
      status: "completed",
      completedAt: new Date(),
      completedBy: user.id,
      lastCompletedDate: obligation.dueDate,
      nextDueDate
    })
    .where(and(eq(obligations.id, obligationId), eq(obligations.companyId, companyId)));

  if (obligation.autoCreateNext && nextDueDate) {
    const newObligationId = randomUUID();
    await db.insert(obligations).values({
      id: newObligationId,
      companyId: obligation.companyId,
      locationId: obligation.locationId,
      assetId: obligation.assetId,
      obligationTypeId: obligation.obligationTypeId,
      title: obligation.title,
      description: obligation.description,
      status: "active",
      priority: obligation.priority,
      responsibleUserId: obligation.responsibleUserId,
      startDate: obligation.dueDate,
      dueDate: nextDueDate,
      recurrenceEnabled: obligation.recurrenceEnabled,
      recurrenceUnit: obligation.recurrenceUnit,
      recurrenceInterval: obligation.recurrenceInterval,
      autoCreateNext: obligation.autoCreateNext,
      nextDueDate:
        obligation.recurrenceUnit && obligation.recurrenceInterval
          ? calculateNextDueDate({
              fromDate: nextDueDate,
              unit: obligation.recurrenceUnit,
              interval: obligation.recurrenceInterval
            })
          : null,
      estimatedCost: obligation.estimatedCost,
      notes: obligation.notes
    });

    await db.insert(reminderRules).values(
      buildDefaultReminderRules().map((rule) => ({
        companyId,
        obligationId: newObligationId,
        daysBeforeDue: rule.daysBeforeDue,
        channel: rule.channel,
        enabled: rule.enabled
      }))
    );
  }

  await createActivityLog({
    companyId,
    actorUserId: user.id,
    entityType: "obligation",
    entityId: obligationId,
    action: "obligation.completed"
  });

  return { ok: true, message: "Obligacion completada." };
}

export async function updateObligationAction(
  companyId: string,
  obligationId: string,
  input: ObligationInput
): Promise<ActionResult> {
  const parsed = obligationSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Revisa los datos de la obligacion.", fieldErrors: zodFieldErrors(parsed.error) };
  }

  if (parsed.data.companyId !== companyId) {
    return { ok: false, message: "La obligacion no pertenece a la empresa activa." };
  }

  const { user } = await requirePermission(companyId, "obligations:manage");
  const db = requireDb();

  try {
    await verifyObligationReferences(parsed.data);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "No se pudo validar la obligacion." };
  }

  const recurrenceUnit = parsed.data.recurrenceEnabled ? (parsed.data.recurrenceUnit as FrequencyUnit) : null;
  const recurrenceInterval = parsed.data.recurrenceEnabled ? parsed.data.recurrenceInterval : null;
  const nextDueDate =
    parsed.data.recurrenceEnabled && recurrenceUnit && recurrenceInterval
      ? calculateNextDueDate({
          fromDate: parsed.data.dueDate,
          unit: recurrenceUnit,
          interval: recurrenceInterval
        })
      : null;

  await db
    .update(obligations)
    .set({
      locationId: nullableId(parsed.data.locationId),
      assetId: nullableId(parsed.data.assetId),
      obligationTypeId: parsed.data.obligationTypeId,
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      priority: parsed.data.priority,
      responsibleUserId: nullableId(parsed.data.responsibleUserId),
      startDate: nullableDate(parsed.data.startDate),
      dueDate: parsed.data.dueDate,
      recurrenceEnabled: parsed.data.recurrenceEnabled,
      recurrenceUnit,
      recurrenceInterval,
      autoCreateNext: parsed.data.autoCreateNext,
      nextDueDate,
      estimatedCost: moneyValue(parsed.data.estimatedCost),
      actualCost: moneyValue(parsed.data.actualCost),
      notes: parsed.data.notes
    })
    .where(and(eq(obligations.id, obligationId), eq(obligations.companyId, companyId)));

  await createActivityLog({
    companyId,
    actorUserId: user.id,
    entityType: "obligation",
    entityId: obligationId,
    action: "obligation.updated",
    metadata: { title: parsed.data.title }
  });

  return { ok: true, message: "Obligacion actualizada." };
}

export async function createNextRenewalAction(companyId: string, obligationId: string): Promise<ActionResult<{ obligationId: string }>> {
  const { user } = await requirePermission(companyId, "obligations:manage");
  const db = requireDb();

  const obligation = await db.query.obligations.findFirst({
    where: and(eq(obligations.id, obligationId), eq(obligations.companyId, companyId))
  });

  if (!obligation) {
    return { ok: false, message: "No se encontro la obligacion." };
  }

  if (!obligation.recurrenceEnabled || !obligation.recurrenceUnit || !obligation.recurrenceInterval) {
    return { ok: false, message: "Esta obligacion no tiene recurrencia configurada." };
  }

  const dueDate =
    obligation.nextDueDate ??
    calculateNextDueDate({
      fromDate: obligation.dueDate,
      unit: obligation.recurrenceUnit,
      interval: obligation.recurrenceInterval
    });

  const [nextObligation] = await db
    .insert(obligations)
    .values({
      companyId,
      locationId: obligation.locationId,
      assetId: obligation.assetId,
      obligationTypeId: obligation.obligationTypeId,
      title: obligation.title,
      description: obligation.description,
      status: "active",
      priority: obligation.priority,
      responsibleUserId: obligation.responsibleUserId,
      startDate: obligation.dueDate,
      dueDate,
      recurrenceEnabled: true,
      recurrenceUnit: obligation.recurrenceUnit,
      recurrenceInterval: obligation.recurrenceInterval,
      autoCreateNext: obligation.autoCreateNext,
      nextDueDate: calculateNextDueDate({
        fromDate: dueDate,
        unit: obligation.recurrenceUnit,
        interval: obligation.recurrenceInterval
      }),
      estimatedCost: obligation.estimatedCost,
      notes: obligation.notes
    })
    .returning({ id: obligations.id });

  await db.insert(reminderRules).values(
    buildDefaultReminderRules().map((rule) => ({
      companyId,
      obligationId: nextObligation.id,
      daysBeforeDue: rule.daysBeforeDue,
      channel: rule.channel,
      enabled: rule.enabled
    }))
  );

  await createActivityLog({
    companyId,
    actorUserId: user.id,
    entityType: "obligation",
    entityId: nextObligation.id,
    action: "obligation.created",
    metadata: { renewedFrom: obligationId }
  });

  return { ok: true, data: { obligationId: nextObligation.id }, message: "Proxima renovacion creada." };
}

export async function cancelObligationAction(companyId: string, obligationId: string): Promise<ActionResult> {
  const { user } = await requirePermission(companyId, "obligations:manage");
  const db = requireDb();

  await db
    .update(obligations)
    .set({ status: "cancelled" })
    .where(and(eq(obligations.id, obligationId), eq(obligations.companyId, companyId)));

  await createActivityLog({
    companyId,
    actorUserId: user.id,
    entityType: "obligation",
    entityId: obligationId,
    action: "obligation.cancelled"
  });

  return { ok: true, message: "Obligacion cancelada." };
}

export async function duplicateObligationAction(companyId: string, obligationId: string): Promise<ActionResult<{ obligationId: string }>> {
  const { user } = await requirePermission(companyId, "obligations:manage");
  const db = requireDb();

  const obligation = await db.query.obligations.findFirst({
    where: and(eq(obligations.id, obligationId), eq(obligations.companyId, companyId))
  });

  if (!obligation) {
    return { ok: false, message: "No se encontro la obligacion." };
  }

  const [duplicated] = await db
    .insert(obligations)
    .values({
      companyId,
      locationId: obligation.locationId,
      assetId: obligation.assetId,
      obligationTypeId: obligation.obligationTypeId,
      title: `${obligation.title} (copia)`,
      description: obligation.description,
      status: "active",
      priority: obligation.priority,
      responsibleUserId: obligation.responsibleUserId,
      startDate: obligation.startDate,
      dueDate: obligation.dueDate,
      recurrenceEnabled: obligation.recurrenceEnabled,
      recurrenceUnit: obligation.recurrenceUnit,
      recurrenceInterval: obligation.recurrenceInterval,
      autoCreateNext: obligation.autoCreateNext,
      nextDueDate: obligation.nextDueDate,
      estimatedCost: obligation.estimatedCost,
      notes: obligation.notes
    })
    .returning({ id: obligations.id });

  await db.insert(reminderRules).values(
    buildDefaultReminderRules().map((rule) => ({
      companyId,
      obligationId: duplicated.id,
      daysBeforeDue: rule.daysBeforeDue,
      channel: rule.channel,
      enabled: rule.enabled
    }))
  );

  await createActivityLog({
    companyId,
    actorUserId: user.id,
    entityType: "obligation",
    entityId: duplicated.id,
    action: "obligation.created",
    metadata: { duplicatedFrom: obligationId }
  });

  return { ok: true, data: { obligationId: duplicated.id }, message: "Obligacion duplicada." };
}
