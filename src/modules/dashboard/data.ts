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
import { getDaysUntilDueDate, getObligationStatus, type ComputedObligationStatus } from "@/lib/date/obligations";
import { allowsDemoMode } from "@/lib/env";
import { getPlanLimits } from "@/modules/billing/service";
import { demoCompany, demoLocations, demoMembers, demoObligationTypes } from "@/modules/demo/data";
import { getDemoStoreSnapshot, type DemoAssetRecord, type DemoDocumentRecord, type DemoObligationRecord, type DemoStore } from "@/modules/demo/store";
import type { AssetStatus, CompanyMemberStatus, CompanyRole, FrequencyUnit, ObligationPriority, ObligationStatus } from "@/types";

type CompanyContext = {
  id: string;
  companyId?: string;
  name: string;
  timezone: string;
  role?: CompanyRole;
};

export type DashboardObligation = {
  id: string;
  companyId: string;
  locationId: string;
  assetId: string;
  obligationTypeId: string;
  title: string;
  description?: string;
  typeName: string;
  assetName: string;
  locationName: string;
  responsibleUserId: string;
  responsibleName: string;
  dueDate: string;
  status: ObligationStatus;
  priority: ObligationPriority;
  recurrenceEnabled: boolean;
  recurrenceUnit: FrequencyUnit;
  recurrenceInterval: number;
  autoCreateNext?: boolean;
  notes?: string;
  computedStatus: ComputedObligationStatus;
};

export type DashboardAsset = {
  id: string;
  companyId: string;
  locationId: string;
  responsibleUserId: string;
  name: string;
  assetType: string;
  status: AssetStatus;
  locationName: string;
  responsibleName: string;
  internalReference: string;
  serialNumber: string;
  description: string;
  obligationsCount: number;
  documentsCount: number;
};

export type DashboardDocument = {
  id: string;
  companyId: string;
  obligationId: string;
  assetId: string;
  fileName: string;
  documentType: string;
  expirationDate: string | null;
  sizeBytes: number;
  mimeType: string;
  assetName: string;
  obligationTitle: string;
};

function demoCompanyContext(): CompanyContext {
  return {
    id: demoCompany.id,
    name: demoCompany.name,
    timezone: demoCompany.timezone
  };
}

function displayMemberName(userId: string | null | undefined) {
  if (!userId) {
    return "Sin asignar";
  }

  return demoMembers.find((member) => member.userId === userId)?.fullName ?? "Sin asignar";
}

function displayLocationName(locationId: string | null | undefined) {
  if (!locationId) {
    return "Empresa";
  }

  return demoLocations.find((location) => location.id === locationId)?.name ?? "Empresa";
}

function displayTypeName(obligationTypeId: string) {
  return demoObligationTypes.find((type) => type.id === obligationTypeId)?.name ?? "Obligacion";
}

function displayAssetName(store: DemoStore, assetId: string | null | undefined) {
  if (!assetId) {
    return "Empresa";
  }

  return store.assets.find((asset) => asset.id === assetId)?.name ?? "Empresa";
}

function toDemoObligation(store: DemoStore, obligation: DemoObligationRecord): DashboardObligation {
  return {
    id: obligation.id,
    companyId: obligation.companyId,
    locationId: obligation.locationId ?? "",
    assetId: obligation.assetId ?? "",
    obligationTypeId: obligation.obligationTypeId,
    title: obligation.title,
    description: obligation.description,
    typeName: displayTypeName(obligation.obligationTypeId),
    assetName: displayAssetName(store, obligation.assetId),
    locationName: displayLocationName(obligation.locationId),
    responsibleUserId: obligation.responsibleUserId ?? "",
    responsibleName: displayMemberName(obligation.responsibleUserId),
    dueDate: obligation.dueDate,
    status: obligation.status,
    priority: obligation.priority,
    recurrenceEnabled: obligation.recurrenceEnabled,
    recurrenceUnit: obligation.recurrenceUnit ?? "months",
    recurrenceInterval: obligation.recurrenceInterval ?? 1,
    autoCreateNext: obligation.autoCreateNext,
    notes: obligation.notes,
    computedStatus: getObligationStatus({
      dueDate: obligation.dueDate,
      status: obligation.status,
      timezone: demoCompany.timezone
    })
  };
}

function toDemoAsset(store: DemoStore, asset: DemoAssetRecord): DashboardAsset {
  return {
    id: asset.id,
    companyId: asset.companyId,
    locationId: asset.locationId ?? "",
    responsibleUserId: asset.responsibleUserId ?? "",
    name: asset.name,
    assetType: asset.assetType,
    status: asset.status,
    locationName: displayLocationName(asset.locationId),
    responsibleName: displayMemberName(asset.responsibleUserId),
    internalReference: asset.internalReference,
    serialNumber: asset.serialNumber,
    description: asset.description,
    obligationsCount: store.obligations.filter((obligation) => obligation.assetId === asset.id).length,
    documentsCount: store.documents.filter((document) => document.assetId === asset.id).length
  };
}

function toDemoDocument(store: DemoStore, document: DemoDocumentRecord): DashboardDocument {
  const obligation = document.obligationId ? store.obligations.find((item) => item.id === document.obligationId) : null;

  return {
    id: document.id,
    companyId: document.companyId,
    obligationId: document.obligationId ?? "",
    assetId: document.assetId ?? "",
    fileName: document.fileName,
    documentType: document.documentType || "Documento",
    expirationDate: document.expirationDate,
    sizeBytes: document.sizeBytes,
    mimeType: document.mimeType,
    assetName: displayAssetName(store, document.assetId),
    obligationTitle: obligation?.title ?? "Sin obligacion"
  };
}

function statsFromObligations(obligationsData: DashboardObligation[], timezone: string) {
  return {
    expired: obligationsData.filter((item) => item.computedStatus === "expired").length,
    dueToday: obligationsData.filter((item) => item.status === "active" && getDaysUntilDueDate(item.dueDate, timezone) === 0).length,
    dueIn7: obligationsData.filter((item) => {
      const days = getDaysUntilDueDate(item.dueDate, timezone);
      return item.status === "active" && days >= 0 && days <= 7;
    }).length,
    dueIn30: obligationsData.filter((item) => {
      const days = getDaysUntilDueDate(item.dueDate, timezone);
      return item.status === "active" && days >= 0 && days <= 30;
    }).length,
    obligations: obligationsData.length
  };
}

async function getDemoDashboardData() {
  const store = await getDemoStoreSnapshot();
  const obligationsData = store.obligations
    .map((obligation) => toDemoObligation(store, obligation))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const stats = statsFromObligations(obligationsData, demoCompany.timezone);

  return {
    company: demoCompanyContext(),
    isDemo: true,
    isDemoWritable: true,
    stats: {
      ...stats,
      assets: store.assets.length,
      documents: store.documents.length
    },
    obligations: obligationsData,
    alerts: [],
    activity: store.activity.slice(0, 8),
    locations: demoLocations,
    members: demoMembers
  };
}

export async function getDashboardData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if ((!db || !company) && allowsDemoMode()) {
    return getDemoDashboardData();
  }

  if (!db || !company) {
    throw new Error("La base de datos o la empresa activa no estan configuradas.");
  }

  const [companyObligations, assetCount, documentCount, activity, locationRows, memberRows] = await Promise.all([
    db
      .select({
        id: obligations.id,
        companyId: obligations.companyId,
        locationId: obligations.locationId,
        assetId: obligations.assetId,
        obligationTypeId: obligations.obligationTypeId,
        title: obligations.title,
        description: obligations.description,
        dueDate: obligations.dueDate,
        status: obligations.status,
        priority: obligations.priority,
        responsibleUserId: obligations.responsibleUserId,
        recurrenceEnabled: obligations.recurrenceEnabled,
        recurrenceUnit: obligations.recurrenceUnit,
        recurrenceInterval: obligations.recurrenceInterval,
        autoCreateNext: obligations.autoCreateNext,
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
      .where(eq(obligations.companyId, company.companyId))
      .orderBy(obligations.dueDate),
    db.select({ value: count() }).from(assets).where(eq(assets.companyId, company.companyId)),
    db.select({ value: count() }).from(documents).where(eq(documents.companyId, company.companyId)),
    db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        detail: activityLogs.entityType,
        createdAt: activityLogs.createdAt
      })
      .from(activityLogs)
      .where(eq(activityLogs.companyId, company.companyId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(8),
    db
      .select({
        id: locations.id,
        name: locations.name,
        city: locations.city,
        address: locations.address
      })
      .from(locations)
      .where(eq(locations.companyId, company.companyId))
      .orderBy(locations.name),
    db
      .select({
        id: companyMembers.id,
        userId: companyMembers.userId,
        role: companyMembers.role,
        status: companyMembers.status,
        fullName: profiles.fullName
      })
      .from(companyMembers)
      .leftJoin(profiles, eq(profiles.id, companyMembers.userId))
      .where(and(eq(companyMembers.companyId, company.companyId), eq(companyMembers.status, "active")))
      .orderBy(companyMembers.createdAt)
  ]);

  const dashboardObligations: DashboardObligation[] = companyObligations.map((item) => ({
    id: item.id,
    companyId: item.companyId,
    locationId: item.locationId ?? "",
    assetId: item.assetId ?? "",
    obligationTypeId: item.obligationTypeId,
    title: item.title,
    description: item.description ?? "",
    typeName: item.typeName,
    assetName: item.assetName ?? "Empresa",
    locationName: item.locationName ?? "Empresa",
    responsibleUserId: item.responsibleUserId ?? "",
    responsibleName: item.responsibleName ?? "Sin asignar",
    dueDate: item.dueDate,
    status: item.status,
    priority: item.priority,
    recurrenceEnabled: item.recurrenceEnabled,
    recurrenceUnit: item.recurrenceUnit ?? "months",
    recurrenceInterval: item.recurrenceInterval ?? 1,
    autoCreateNext: item.autoCreateNext,
    notes: item.notes ?? "",
    computedStatus: getObligationStatus({
      dueDate: item.dueDate,
      status: item.status,
      timezone: company.timezone
    })
  }));
  const stats = statsFromObligations(dashboardObligations, company.timezone);

  return {
    company: {
      id: company.companyId,
      companyId: company.companyId,
      name: company.name,
      timezone: company.timezone,
      role: company.role
    },
    isDemo: false,
    isDemoWritable: false,
    stats: {
      ...stats,
      assets: assetCount[0]?.value ?? 0,
      documents: documentCount[0]?.value ?? 0
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
    locations: locationRows,
    members: memberRows.map((member) => ({
      id: member.id,
      userId: member.userId,
      fullName: member.fullName ?? "Usuario",
      role: member.role,
      status: member.status
    }))
  };
}

export async function getAssetsData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if ((!db || !company) && allowsDemoMode()) {
    const store = await getDemoStoreSnapshot();
    return {
      company: demoCompanyContext(),
      assets: store.assets.map((asset) => toDemoAsset(store, asset)),
      locations: demoLocations,
      members: demoMembers,
      isDemo: true,
      isDemoWritable: true
    };
  }

  if (!db || !company) {
    throw new Error("La base de datos o la empresa activa no estan configuradas.");
  }

  const [assetRows, obligationRows, documentRows, locationRows, memberRows] = await Promise.all([
    db
      .select({
        id: assets.id,
        companyId: assets.companyId,
        locationId: assets.locationId,
        responsibleUserId: assets.responsibleUserId,
        name: assets.name,
        assetType: assets.assetType,
        status: assets.status,
        internalReference: assets.internalReference,
        serialNumber: assets.serialNumber,
        description: assets.description,
        locationName: locations.name,
        responsibleName: profiles.fullName
      })
      .from(assets)
      .leftJoin(locations, eq(locations.id, assets.locationId))
      .leftJoin(profiles, eq(profiles.id, assets.responsibleUserId))
      .where(eq(assets.companyId, company.companyId))
      .orderBy(assets.name),
    db
      .select({
        assetId: obligations.assetId
      })
      .from(obligations)
      .where(eq(obligations.companyId, company.companyId)),
    db
      .select({
        assetId: documents.assetId
      })
      .from(documents)
      .where(eq(documents.companyId, company.companyId)),
    db
      .select({
        id: locations.id,
        name: locations.name,
        city: locations.city,
        address: locations.address
      })
      .from(locations)
      .where(eq(locations.companyId, company.companyId))
      .orderBy(locations.name),
    db
      .select({
        id: companyMembers.id,
        userId: companyMembers.userId,
        role: companyMembers.role,
        status: companyMembers.status,
        fullName: profiles.fullName
      })
      .from(companyMembers)
      .leftJoin(profiles, eq(profiles.id, companyMembers.userId))
      .where(and(eq(companyMembers.companyId, company.companyId), eq(companyMembers.status, "active")))
  ]);

  return {
    company: {
      id: company.companyId,
      companyId: company.companyId,
      name: company.name,
      timezone: company.timezone,
      role: company.role
    },
    assets: assetRows.map((row) => ({
      id: row.id,
      companyId: row.companyId,
      locationId: row.locationId ?? "",
      responsibleUserId: row.responsibleUserId ?? "",
      name: row.name,
      assetType: row.assetType,
      status: row.status,
      locationName: row.locationName ?? "Sin sede",
      responsibleName: row.responsibleName ?? "Sin asignar",
      internalReference: row.internalReference ?? "",
      serialNumber: row.serialNumber ?? "",
      description: row.description ?? "",
      obligationsCount: obligationRows.filter((item) => item.assetId === row.id).length,
      documentsCount: documentRows.filter((item) => item.assetId === row.id).length
    })),
    locations: locationRows,
    members: memberRows.map((member) => ({
      id: member.id,
      userId: member.userId,
      fullName: member.fullName ?? "Usuario",
      role: member.role,
      status: member.status
    })),
    isDemo: false,
    isDemoWritable: false
  };
}

export async function getObligationsData() {
  const data = await getDashboardData();
  return {
    company: data.company,
    obligations: data.obligations,
    locations: data.locations,
    members: data.members,
    isDemo: data.isDemo,
    isDemoWritable: data.isDemoWritable
  };
}

export async function getDocumentsData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if ((!db || !company) && allowsDemoMode()) {
    const store = await getDemoStoreSnapshot();
    return {
      company: demoCompanyContext(),
      documents: store.documents.map((document) => toDemoDocument(store, document)),
      isDemo: true,
      isDemoWritable: true
    };
  }

  if (!db || !company) {
    throw new Error("La base de datos o la empresa activa no estan configuradas.");
  }

  const rows = await db
    .select({
      id: documents.id,
      companyId: documents.companyId,
      obligationId: documents.obligationId,
      assetId: documents.assetId,
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
    company: {
      id: company.companyId,
      companyId: company.companyId,
      name: company.name,
      timezone: company.timezone,
      role: company.role
    },
    documents: rows.map((row) => ({
      id: row.id,
      companyId: row.companyId,
      obligationId: row.obligationId ?? "",
      assetId: row.assetId ?? "",
      fileName: row.fileName,
      documentType: row.documentType ?? "Documento",
      assetName: row.assetName ?? "Empresa",
      obligationTitle: row.obligationTitle ?? "Sin obligacion",
      expirationDate: row.expirationDate ?? null,
      sizeBytes: row.sizeBytes,
      mimeType: row.mimeType
    })),
    isDemo: false,
    isDemoWritable: false
  };
}

export async function getTeamData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if ((!db || !company) && allowsDemoMode()) {
    return {
      company: demoCompanyContext(),
      members: demoMembers,
      isDemo: true,
      isDemoWritable: true
    };
  }

  if (!db || !company) {
    throw new Error("La base de datos o la empresa activa no estan configuradas.");
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
    company: {
      id: company.companyId,
      companyId: company.companyId,
      name: company.name,
      timezone: company.timezone,
      role: company.role
    },
    members: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      role: row.role,
      status: row.status as CompanyMemberStatus,
      fullName: row.fullName ?? "Usuario invitado",
      email: "Email gestionado en Supabase Auth"
    })),
    isDemo: false,
    isDemoWritable: false
  };
}

export async function getCompanySettingsData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if ((!db || !company) && allowsDemoMode()) {
    return {
      company: demoCompanyContext(),
      locations: demoLocations,
      isDemo: true,
      isDemoWritable: true
    };
  }

  if (!db || !company) {
    throw new Error("La base de datos o la empresa activa no estan configuradas.");
  }

  const fullCompany = await db.query.companies.findFirst({
    where: eq(companies.id, company.companyId)
  });
  const companyLocations = await db.query.locations.findMany({
    where: eq(locations.companyId, company.companyId)
  });

  return {
    company:
      fullCompany ?? {
        id: company.companyId,
        name: company.name,
        timezone: company.timezone
      },
    locations: companyLocations,
    isDemo: false,
    isDemoWritable: false
  };
}

export async function getBillingData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if ((!db || !company) && allowsDemoMode()) {
    const plan = "free" as const;
    return {
      company: demoCompanyContext(),
      subscription: {
        plan,
        status: "inactive"
      },
      limits: getPlanLimits(plan),
      isDemo: true,
      isDemoWritable: true
    };
  }

  if (!db || !company) {
    throw new Error("La base de datos o la empresa activa no estan configuradas.");
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.companyId, company.companyId)
  });
  const plan = subscription?.plan ?? "free";

  return {
    company: {
      id: company.companyId,
      companyId: company.companyId,
      name: company.name,
      timezone: company.timezone,
      role: company.role
    },
    subscription: subscription ?? {
      plan,
      status: "inactive"
    },
    limits: getPlanLimits(plan),
    isDemo: false,
    isDemoWritable: false
  };
}

export async function getFormOptionsData() {
  const db = getDb();
  const company = await getCurrentCompany();

  if ((!db || !company) && allowsDemoMode()) {
    const store = await getDemoStoreSnapshot();
    return {
      company: demoCompanyContext(),
      obligationTypes: demoObligationTypes,
      assets: store.assets.map((asset) => ({ id: asset.id, name: asset.name })),
      locations: demoLocations,
      members: demoMembers,
      isDemo: true,
      isDemoWritable: true
    };
  }

  if (!db || !company) {
    throw new Error("La base de datos o la empresa activa no estan configuradas.");
  }

  const [typeRows, systemTypeRows, assetRows, locationRows, memberRows] = await Promise.all([
    db
      .select({
        id: obligationTypes.id,
        name: obligationTypes.name
      })
      .from(obligationTypes)
      .where(eq(obligationTypes.companyId, company.companyId)),
    db
      .select({
        id: obligationTypes.id,
        name: obligationTypes.name
      })
      .from(obligationTypes)
      .where(eq(obligationTypes.isSystemTemplate, true)),
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

  return {
    company: {
      id: company.companyId,
      companyId: company.companyId,
      name: company.name,
      timezone: company.timezone,
      role: company.role
    },
    obligationTypes: [...systemTypeRows, ...typeRows],
    assets: assetRows,
    locations: locationRows,
    members: memberRows.map((member) => ({
      userId: member.userId,
      fullName: member.fullName ?? "Usuario"
    })),
    isDemo: false,
    isDemoWritable: false
  };
}

export async function getObligationDetailData(obligationId: string) {
  const db = getDb();
  const company = await getCurrentCompany();
  const options = await getFormOptionsData();

  if ((!db || !company) && allowsDemoMode()) {
    const store = await getDemoStoreSnapshot();
    const obligation = store.obligations.find((item) => item.id === obligationId) ?? null;

    if (!obligation) {
      return { obligation: null, options, isDemo: true, isDemoWritable: true };
    }

    return {
      obligation: {
        ...toDemoObligation(store, obligation),
        description: obligation.description,
        startDate: obligation.startDate ?? "",
        assetId: obligation.assetId ?? "",
        locationId: obligation.locationId ?? "",
        responsibleUserId: obligation.responsibleUserId ?? "",
        autoCreateNext: obligation.autoCreateNext,
        notes: obligation.notes
      },
      options,
      isDemo: true,
      isDemoWritable: true
    };
  }

  if (!db || !company) {
    throw new Error("La base de datos o la empresa activa no estan configuradas.");
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
    return { obligation: null, options, isDemo: false, isDemoWritable: false };
  }

  return {
    obligation: {
      ...obligation,
      assetId: obligation.assetId ?? "",
      locationId: obligation.locationId ?? "",
      responsibleUserId: obligation.responsibleUserId ?? "",
      description: obligation.description ?? "",
      startDate: obligation.startDate ?? "",
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
    isDemo: false,
    isDemoWritable: false
  };
}

export async function getAssetDetailData(assetId: string) {
  const [assetsData, obligationsData, documentsData, options] = await Promise.all([
    getAssetsData(),
    getObligationsData(),
    getDocumentsData(),
    getFormOptionsData()
  ]);
  const asset = assetsData.assets.find((item) => item.id === assetId) ?? null;

  if (!asset) {
    return {
      asset: null,
      obligations: [],
      documents: [],
      options,
      isDemo: assetsData.isDemo,
      isDemoWritable: assetsData.isDemoWritable
    };
  }

  return {
    asset,
    obligations: obligationsData.obligations.filter((item) => item.assetId === asset.id),
    documents: documentsData.documents.filter((item) => item.assetId === asset.id),
    options,
    isDemo: assetsData.isDemo,
    isDemoWritable: assetsData.isDemoWritable
  };
}
