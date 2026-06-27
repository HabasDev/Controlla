import { randomUUID } from "crypto";

import { and, eq } from "drizzle-orm";

import { loadEnvFiles } from "@/server/env/load-env-files";
import {
  assets,
  companies,
  companyMembers,
  documents,
  locations,
  notifications,
  obligationTypes,
  obligations,
  profiles,
  reminderRules,
  subscriptions
} from "@/db/schema";
import { getTodayDateOnly } from "@/lib/date/obligations";
import { buildDefaultReminderRules } from "@/modules/reminders/service";
import { closeScriptDb, getScriptDb } from "@/server/db/script-client";
import { getScriptSupabaseAdminClient } from "@/server/supabase/script-admin";

loadEnvFiles();

function offsetDate(days: number) {
  const today = getTodayDateOnly();
  const [year, month, day] = today.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

async function createDemoUser(input: { email: string; fullName: string }) {
  const admin = getScriptSupabaseAdminClient();

  if (!admin) {
    throw new Error("Configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para crear usuarios demo.");
  }

  const { data: existing } = await admin.auth.admin.listUsers();
  const found = existing.users.find((user) => user.email === input.email);

  if (found) {
    return found.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: `${randomUUID()}A1!`,
    email_confirm: true,
    user_metadata: {
      full_name: input.fullName
    }
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? `No se pudo crear ${input.email}`);
  }

  return data.user.id;
}

async function main() {
  const db = getScriptDb();

  const users = [
    { email: "ana.garcia@example.test", fullName: "Ana Garcia", role: "owner" as const },
    { email: "luis.martin@example.test", fullName: "Luis Martin", role: "manager" as const },
    { email: "marta.ruiz@example.test", fullName: "Marta Ruiz", role: "viewer" as const }
  ];

  const userIds = await Promise.all(users.map((user) => createDemoUser(user)));

  for (const [index, userId] of userIds.entries()) {
    await db
      .insert(profiles)
      .values({
        id: userId,
        fullName: users[index].fullName
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          fullName: users[index].fullName
        }
      });
  }

  let company = await db.query.companies.findFirst({
    where: eq(companies.name, "Taller Garcia")
  });

  if (!company) {
    const [created] = await db
      .insert(companies)
      .values({
        name: "Taller Garcia",
        legalName: "Taller Garcia S.L.",
        taxId: "B12345678",
        timezone: "Europe/Madrid",
        industry: "Taller mecanico"
      })
      .returning();
    company = created;
  }

  for (const [index, userId] of userIds.entries()) {
    await db
      .insert(companyMembers)
      .values({
        companyId: company.id,
        userId,
        role: users[index].role,
        status: "active"
      })
      .onConflictDoUpdate({
        target: [companyMembers.companyId, companyMembers.userId],
        set: {
          role: users[index].role,
          status: "active"
        }
      });
  }

  await db
    .insert(subscriptions)
    .values({
      companyId: company.id,
      plan: "free",
      status: "inactive"
    })
    .onConflictDoNothing();

  const [mainLocation] = await db
    .insert(locations)
    .values({
      companyId: company.id,
      name: "Nave principal",
      address: "Calle Industria 12",
      city: "Madrid",
      postalCode: "28021",
      country: "España"
    })
    .returning();

  const assetInputs = [
    { name: "Furgoneta Ford Transit", assetType: "Vehiculo", responsibleUserId: userIds[1] },
    { name: "Extintor recepcion", assetType: "Extintor", responsibleUserId: userIds[2] },
    { name: "Elevador hidraulico", assetType: "Maquinaria", responsibleUserId: userIds[1] },
    { name: "Compresor", assetType: "Maquinaria", responsibleUserId: userIds[1] },
    { name: "Dominio web", assetType: "Digital", responsibleUserId: userIds[0] }
  ];

  const createdAssets = [];

  for (const assetInput of assetInputs) {
    const [asset] = await db
      .insert(assets)
      .values({
        companyId: company.id,
        locationId: mainLocation.id,
        name: assetInput.name,
        assetType: assetInput.assetType,
        status: "active",
        responsibleUserId: assetInput.responsibleUserId
      })
      .returning();
    createdAssets.push(asset);
  }

  const typeRows = await db.select().from(obligationTypes);
  const typeByName = new Map(typeRows.map((type) => [type.name, type]));

  const obligationInputs = [
    {
      title: "ITV de la furgoneta Ford Transit",
      typeName: "ITV",
      assetName: "Furgoneta Ford Transit",
      dueDate: offsetDate(7),
      priority: "high" as const,
      responsibleUserId: userIds[1],
      recurrenceUnit: "years" as const,
      recurrenceInterval: 1
    },
    {
      title: "Seguro de la furgoneta",
      typeName: "Seguro",
      assetName: "Furgoneta Ford Transit",
      dueDate: offsetDate(-5),
      priority: "critical" as const,
      responsibleUserId: userIds[0],
      recurrenceUnit: "years" as const,
      recurrenceInterval: 1
    },
    {
      title: "Revision de extintor recepcion",
      typeName: "Extintor",
      assetName: "Extintor recepcion",
      dueDate: offsetDate(30),
      priority: "medium" as const,
      responsibleUserId: userIds[2],
      recurrenceUnit: "years" as const,
      recurrenceInterval: 1
    },
    {
      title: "Certificado SSL",
      typeName: "Certificado SSL",
      assetName: "Dominio web",
      dueDate: offsetDate(7),
      priority: "high" as const,
      responsibleUserId: userIds[0],
      recurrenceUnit: "months" as const,
      recurrenceInterval: 3
    },
    {
      title: "Mantenimiento del elevador",
      typeName: "Mantenimiento preventivo",
      assetName: "Elevador hidraulico",
      dueDate: offsetDate(90),
      priority: "medium" as const,
      responsibleUserId: userIds[1],
      recurrenceUnit: "months" as const,
      recurrenceInterval: 6
    }
  ];

  const createdObligations = [];

  for (const input of obligationInputs) {
    const type = typeByName.get(input.typeName);
    const asset = createdAssets.find((item) => item.name === input.assetName);

    if (!type || !asset) {
      throw new Error(`Faltan datos para ${input.title}`);
    }

    const [obligation] = await db
      .insert(obligations)
      .values({
        companyId: company.id,
        locationId: mainLocation.id,
        assetId: asset.id,
        obligationTypeId: type.id,
        title: input.title,
        status: "active",
        priority: input.priority,
        responsibleUserId: input.responsibleUserId,
        dueDate: input.dueDate,
        recurrenceEnabled: true,
        recurrenceUnit: input.recurrenceUnit,
        recurrenceInterval: input.recurrenceInterval,
        autoCreateNext: true
      })
      .returning();

    createdObligations.push(obligation);

    await db.insert(reminderRules).values(
      buildDefaultReminderRules().map((rule) => ({
        companyId: company.id,
        obligationId: obligation.id,
        daysBeforeDue: rule.daysBeforeDue,
        channel: rule.channel,
        enabled: rule.enabled
      }))
    );
  }

  for (const obligation of createdObligations.slice(0, 3)) {
    const documentId = randomUUID();
    await db.insert(documents).values({
      id: documentId,
      companyId: company.id,
      obligationId: obligation.id,
      assetId: obligation.assetId,
      uploadedBy: userIds[0],
      fileName: `${obligation.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`,
      storagePath: `companies/${company.id}/documents/${documentId}/demo.pdf`,
      mimeType: "application/pdf",
      sizeBytes: 240000,
      documentType: "Demo",
      expirationDate: obligation.dueDate
    });
  }

  const overdueObligation = createdObligations.find((obligation) => obligation.title === "Seguro de la furgoneta");

  if (overdueObligation) {
    await db.insert(notifications).values({
      companyId: company.id,
      userId: userIds[0],
      obligationId: overdueObligation.id,
      type: "seed_overdue",
      title: "Tienes 1 obligacion vencida que requiere atencion",
      message: "El seguro de la furgoneta esta vencido.",
      severity: "critical"
    });
  }

  const memberCount = await db.query.companyMembers.findMany({
    where: and(eq(companyMembers.companyId, company.id), eq(companyMembers.status, "active"))
  });

  console.log(`Seed completado: ${company.name}, ${createdAssets.length} activos, ${createdObligations.length} obligaciones, ${memberCount.length} usuarios.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeScriptDb();
  });
