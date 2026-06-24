import "server-only";

import { and, count, desc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import {
  activityLogs,
  assets,
  companies,
  companyMembers,
  documents,
  locations,
  obligationTypes,
  obligations,
  profiles,
  subscriptions
} from "@/db/schema";
import { getCurrentCompany } from "@/lib/auth/session";
import {
  getDaysUntilDueDate,
  getObligationStatus,
  type ComputedObligationStatus
} from "@/lib/date/obligations";
import { getPlanLimits } from "@/modules/billing/service";
import {
  demoActivity,
  demoAssets,
  demoCompany,
  demoDocuments,
  demoLocations,
  demoMembers,
  demoObligationTypes,
  demoNotifications,
  demoObligations
} from "@/modules/demo/data";
import type { FrequencyUnit, ObligationPriority, ObligationStatus } from "@/types";

export type DashboardObligation = {
  id: string;
  title: string;
  typeName: string;
  assetName: string;
  locationName: string;
  responsibleName: string;
  dueDate: string;
  status: ObligationStatus;
  priority: ObligationPriority;
  recurrenceEnabled: boolean;
  recurrenceUnit: FrequencyUnit;
  recurrenceInterval: number;
  computedStatus: ComputedObligationStatus;
};

export async function getDashboardData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if (!db || !company) {
    const expired = demoObligations.filter((item) => item.computedStatus === "expired").length;
    const dueIn7 = demoObligations.filter((item) => {
      const days = getDaysUntilDueDate(item.dueDate);
      return days >= 0 && days <= 7;
    }).length;
    const dueIn30 = demoObligations.filter((item) => {
      const days = getDaysUntilDueDate(item.dueDate);
      return days >= 0 && days <= 30;
    }).length;

    return {
      company: demoCompany,
      isDemo: true,
      stats: {
        expired,
        dueIn7,
        dueIn30,
        assets: demoAssets.length
      },
      obligations: demoObligations,
      alerts: demoNotifications,
      activity: demoActivity,
      locations: demoLocations,
      members: demoMembers
    };
  }

  const companyObligations = await db
    .select({
      id: obligations.id,
      title: obligations.title,
      dueDate: obligations.dueDate,
      status: obligations.status,
      priority: obligations.priority,
      recurrenceEnabled: obligations.recurrenceEnabled,
      recurrenceUnit: obligations.recurrenceUnit,
      recurrenceInterval: obligations.recurrenceInterval,
      typeName: obligationTypes.name,
      assetName: assets.name,
      locationName: locations.name,
      responsibleName: profiles.fullName
    })
    .from(obligations)
    .innerJoin(obligationTypes, eq(obligationTypes.id, obligations.obligationTypeId))
    .leftJoin(assets, eq(assets.id, obligations.assetId))
    .leftJoin(locations, eq(locations.id, obligations.locationId))
    .leftJoin(profiles, eq(profiles.id, obligations.responsibleUserId))
    .where(eq(obligations.companyId, company.companyId))
    .orderBy(obligations.dueDate);

  const dashboardObligations: DashboardObligation[] = companyObligations.map((item) => ({
    ...item,
    assetName: item.assetName ?? "Empresa",
    locationName: item.locationName ?? "Empresa",
    responsibleName: item.responsibleName ?? "Sin asignar",
    recurrenceUnit: item.recurrenceUnit ?? "months",
    recurrenceInterval: item.recurrenceInterval ?? 1,
    computedStatus: getObligationStatus({
      dueDate: item.dueDate,
      status: item.status,
      timezone: company.timezone
    })
  }));

  const assetCount = await db
    .select({ value: count() })
    .from(assets)
    .where(eq(assets.companyId, company.companyId));

  const activity = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      detail: activityLogs.entityType,
      createdAt: activityLogs.createdAt
    })
    .from(activityLogs)
    .where(eq(activityLogs.companyId, company.companyId))
    .orderBy(desc(activityLogs.createdAt))
    .limit(8);

  return {
    company: {
      id: company.companyId,
      name: company.name,
      timezone: company.timezone
    },
    isDemo: false,
    stats: {
      expired: dashboardObligations.filter((item) => item.computedStatus === "expired").length,
      dueIn7: dashboardObligations.filter((item) => {
        const days = getDaysUntilDueDate(item.dueDate, company.timezone);
        return days >= 0 && days <= 7;
      }).length,
      dueIn30: dashboardObligations.filter((item) => {
        const days = getDaysUntilDueDate(item.dueDate, company.timezone);
        return days >= 0 && days <= 30;
      }).length,
      assets: assetCount[0]?.value ?? 0
    },
    obligations: dashboardObligations,
    alerts: [],
    activity: activity.map((item) => ({
      id: item.id,
      action: item.action,
      label: item.action,
      detail: item.detail,
      createdAt: item.createdAt.toISOString()
    })),
    locations: [],
    members: []
  };
}

export async function getAssetsData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if (!db || !company) {
    return {
      company: demoCompany,
      assets: demoAssets,
      locations: demoLocations,
      members: demoMembers,
      isDemo: true
    };
  }

  const rows = await db
    .select({
      id: assets.id,
      name: assets.name,
      assetType: assets.assetType,
      status: assets.status,
      locationName: locations.name,
      responsibleName: profiles.fullName
    })
    .from(assets)
    .leftJoin(locations, eq(locations.id, assets.locationId))
    .leftJoin(profiles, eq(profiles.id, assets.responsibleUserId))
    .where(eq(assets.companyId, company.companyId))
    .orderBy(assets.name);

  return {
    company,
    assets: rows.map((row) => ({
      ...row,
      locationName: row.locationName ?? "Sin sede",
      responsibleName: row.responsibleName ?? "Sin asignar",
      obligationsCount: 0,
      documentsCount: 0
    })),
    locations: [],
    members: [],
    isDemo: false
  };
}

export async function getObligationsData() {
  const data = await getDashboardData();
  return {
    company: data.company,
    obligations: data.obligations,
    locations: data.locations,
    members: data.members,
    isDemo: data.isDemo
  };
}

export async function getDocumentsData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if (!db || !company) {
    return {
      company: demoCompany,
      documents: demoDocuments,
      isDemo: true
    };
  }

  const rows = await db
    .select({
      id: documents.id,
      fileName: documents.fileName,
      documentType: documents.documentType,
      expirationDate: documents.expirationDate,
      sizeBytes: documents.sizeBytes,
      mimeType: documents.mimeType,
      assetName: assets.name,
      obligationTitle: obligations.title
    })
    .from(documents)
    .leftJoin(assets, eq(assets.id, documents.assetId))
    .leftJoin(obligations, eq(obligations.id, documents.obligationId))
    .where(eq(documents.companyId, company.companyId))
    .orderBy(desc(documents.createdAt));

  return {
    company,
    documents: rows.map((row) => ({
      ...row,
      documentType: row.documentType ?? "Documento",
      assetName: row.assetName ?? "Empresa",
      obligationTitle: row.obligationTitle ?? "Sin obligacion",
      expirationDate: row.expirationDate ?? null
    })),
    isDemo: false
  };
}

export async function getTeamData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if (!db || !company) {
    return {
      company: demoCompany,
      members: demoMembers,
      isDemo: true
    };
  }

  const rows = await db
    .select({
      id: companyMembers.id,
      userId: companyMembers.userId,
      role: companyMembers.role,
      status: companyMembers.status,
      fullName: profiles.fullName
    })
    .from(companyMembers)
    .leftJoin(profiles, eq(profiles.id, companyMembers.userId))
    .where(eq(companyMembers.companyId, company.companyId))
    .orderBy(companyMembers.createdAt);

  return {
    company,
    members: rows.map((row) => ({
      ...row,
      fullName: row.fullName ?? "Usuario invitado",
      email: "Email gestionado en Supabase Auth"
    })),
    isDemo: false
  };
}

export async function getCompanySettingsData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if (!db || !company) {
    return {
      company: demoCompany,
      locations: demoLocations,
      isDemo: true
    };
  }

  const fullCompany = await db.query.companies.findFirst({
    where: eq(companies.id, company.companyId)
  });
  const companyLocations = await db.query.locations.findMany({
    where: eq(locations.companyId, company.companyId)
  });

  return {
    company: fullCompany ?? company,
    locations: companyLocations,
    isDemo: false
  };
}

export async function getBillingData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if (!db || !company) {
    const plan = "free" as const;
    return {
      company: demoCompany,
      subscription: {
        plan,
        status: "inactive"
      },
      limits: getPlanLimits(plan),
      isDemo: true
    };
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.companyId, company.companyId)
  });
  const plan = subscription?.plan ?? "free";

  return {
    company,
    subscription: subscription ?? {
      plan,
      status: "inactive"
    },
    limits: getPlanLimits(plan),
    isDemo: false
  };
}

export async function getFormOptionsData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if (!db || !company) {
    return {
      company: demoCompany,
      obligationTypes: demoObligationTypes,
      assets: demoAssets.map((asset) => ({ id: asset.id, name: asset.name })),
      locations: demoLocations,
      members: demoMembers,
      isDemo: true
    };
  }

  const [typeRows, assetRows, locationRows, memberRows] = await Promise.all([
    db
      .select({
        id: obligationTypes.id,
        name: obligationTypes.name
      })
      .from(obligationTypes)
      .where(eq(obligationTypes.companyId, company.companyId)),
    db
      .select({
        id: assets.id,
        name: assets.name
      })
      .from(assets)
      .where(eq(assets.companyId, company.companyId))
      .orderBy(assets.name),
    db
      .select({
        id: locations.id,
        name: locations.name
      })
      .from(locations)
      .where(eq(locations.companyId, company.companyId))
      .orderBy(locations.name),
    db
      .select({
        userId: companyMembers.userId,
        fullName: profiles.fullName
      })
      .from(companyMembers)
      .leftJoin(profiles, eq(profiles.id, companyMembers.userId))
      .where(and(eq(companyMembers.companyId, company.companyId), eq(companyMembers.status, "active")))
  ]);

  const systemTypeRows = await db
    .select({
      id: obligationTypes.id,
      name: obligationTypes.name
    })
    .from(obligationTypes)
    .where(eq(obligationTypes.isSystemTemplate, true));

  return {
    company,
    obligationTypes: [...systemTypeRows, ...typeRows],
    assets: assetRows,
    locations: locationRows,
    members: memberRows.map((member) => ({
      userId: member.userId,
      fullName: member.fullName ?? "Usuario"
    })),
    isDemo: false
  };
}

export async function getObligationDetailData(obligationId: string) {
  const db = getDb();
  const company = await getCurrentCompany();
  const options = await getFormOptionsData();

  if (!db || !company) {
    const obligation = demoObligations.find((item) => item.id === obligationId) ?? null;

    if (!obligation) {
      return { obligation: null, options, isDemo: true };
    }

    const type = demoObligationTypes.find((item) => item.name === obligation.typeName);
    const asset = demoAssets.find((item) => item.name === obligation.assetName);
    const location = demoLocations.find((item) => item.name === obligation.locationName);
    const member = demoMembers.find((item) => item.fullName === obligation.responsibleName);

    return {
      obligation: {
        ...obligation,
        description: "Seguimiento demo de obligacion critica.",
        obligationTypeId: type?.id ?? demoObligationTypes[0].id,
        assetId: asset?.id ?? "",
        locationId: location?.id ?? "",
        responsibleUserId: member?.userId ?? "",
        autoCreateNext: true,
        notes: ""
      },
      options,
      isDemo: true
    };
  }

  const row = await db
    .select({
      id: obligations.id,
      companyId: obligations.companyId,
      locationId: obligations.locationId,
      assetId: obligations.assetId,
      obligationTypeId: obligations.obligationTypeId,
      title: obligations.title,
      description: obligations.description,
      status: obligations.status,
      priority: obligations.priority,
      responsibleUserId: obligations.responsibleUserId,
      startDate: obligations.startDate,
      dueDate: obligations.dueDate,
      recurrenceEnabled: obligations.recurrenceEnabled,
      recurrenceUnit: obligations.recurrenceUnit,
      recurrenceInterval: obligations.recurrenceInterval,
      autoCreateNext: obligations.autoCreateNext,
      nextDueDate: obligations.nextDueDate,
      notes: obligations.notes,
      typeName: obligationTypes.name,
      assetName: assets.name,
      locationName: locations.name,
      responsibleName: profiles.fullName
    })
    .from(obligations)
    .innerJoin(obligationTypes, eq(obligationTypes.id, obligations.obligationTypeId))
    .leftJoin(assets, eq(assets.id, obligations.assetId))
    .leftJoin(locations, eq(locations.id, obligations.locationId))
    .leftJoin(profiles, eq(profiles.id, obligations.responsibleUserId))
    .where(and(eq(obligations.id, obligationId), eq(obligations.companyId, company.companyId)))
    .limit(1);

  const obligation = row[0];

  if (!obligation) {
    return { obligation: null, options, isDemo: false };
  }

  return {
    obligation: {
      ...obligation,
      assetId: obligation.assetId ?? "",
      locationId: obligation.locationId ?? "",
      responsibleUserId: obligation.responsibleUserId ?? "",
      description: obligation.description ?? "",
      notes: obligation.notes ?? "",
      recurrenceUnit: obligation.recurrenceUnit ?? "years",
      recurrenceInterval: obligation.recurrenceInterval ?? 1,
      assetName: obligation.assetName ?? "Empresa",
      locationName: obligation.locationName ?? "Empresa",
      responsibleName: obligation.responsibleName ?? "Sin asignar",
      computedStatus: getObligationStatus({
        dueDate: obligation.dueDate,
        status: obligation.status,
        timezone: company.timezone
      })
    },
    options,
    isDemo: false
  };
}
