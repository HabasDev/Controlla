import "server-only";

import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { calculateNextDueDate } from "@/lib/date/obligations";
import type { AssetInput } from "@/lib/validations/asset";
import type { ObligationInput } from "@/lib/validations/obligation";
import type { AssetStatus, FrequencyUnit, ObligationPriority, ObligationStatus } from "@/types";

import {
  demoActivity,
  demoAssets,
  demoCompany,
  demoDocuments,
  demoLocations,
  demoMembers,
  demoObligationTypes,
  demoObligations
} from "./data";

const DEMO_STORE_PATH = path.join(process.cwd(), ".next", "cache", "controla-demo-store.json");
const DEMO_ACTOR_ID = demoMembers[0]?.userId ?? "31111111-1111-4111-8111-111111111111";

export type DemoAssetRecord = {
  id: string;
  companyId: string;
  locationId: string | null;
  name: string;
  assetType: string;
  internalReference: string;
  serialNumber: string;
  description: string;
  status: AssetStatus;
  responsibleUserId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DemoObligationRecord = {
  id: string;
  companyId: string;
  locationId: string | null;
  assetId: string | null;
  obligationTypeId: string;
  title: string;
  description: string;
  status: ObligationStatus;
  priority: ObligationPriority;
  responsibleUserId: string | null;
  startDate: string | null;
  dueDate: string;
  recurrenceEnabled: boolean;
  recurrenceUnit: FrequencyUnit | null;
  recurrenceInterval: number | null;
  autoCreateNext: boolean;
  completedAt: string | null;
  completedBy: string | null;
  lastCompletedDate: string | null;
  nextDueDate: string | null;
  estimatedCost: string | null;
  actualCost: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type DemoDocumentRecord = {
  id: string;
  companyId: string;
  obligationId: string | null;
  assetId: string | null;
  uploadedBy: string;
  fileName: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  documentType: string;
  expirationDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type DemoActivityRecord = {
  id: string;
  companyId: string;
  actorUserId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  label: string;
  detail: string;
  createdAt: string;
};

export type DemoObligationTypeRecord = {
  id: string;
  companyId: string | null;
  name: string;
  category: string;
  isSystemTemplate: boolean;
};

export type DemoStore = {
  assets: DemoAssetRecord[];
  obligations: DemoObligationRecord[];
  documents: DemoDocumentRecord[];
  activity: DemoActivityRecord[];
  obligationTypes: DemoObligationTypeRecord[];
};

let cachedStore: DemoStore | null = null;

function nullableId(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

function nullableDate(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

function moneyValue(value: number | undefined) {
  return typeof value === "number" ? value.toFixed(2) : null;
}

function findLocationId(name: string) {
  return demoLocations.find((location) => location.name === name)?.id ?? null;
}

function findResponsibleUserId(fullName: string) {
  return demoMembers.find((member) => member.fullName === fullName)?.userId ?? null;
}

function initialDemoStore(): DemoStore {
  const now = new Date().toISOString();
  const obligationTypeRecords: DemoObligationTypeRecord[] = demoObligationTypes.map((type) => ({
    id: type.id,
    companyId: null,
    name: type.name,
    category: "demo",
    isSystemTemplate: true
  }));
  const assets: DemoAssetRecord[] = demoAssets.map((asset) => ({
    id: asset.id,
    companyId: demoCompany.id,
    locationId: findLocationId(asset.locationName),
    name: asset.name,
    assetType: asset.assetType,
    internalReference: "",
    serialNumber: "",
    description: "",
    status: asset.status as AssetStatus,
    responsibleUserId: findResponsibleUserId(asset.responsibleName),
    createdAt: now,
    updatedAt: now
  }));

  const obligations: DemoObligationRecord[] = demoObligations.map((obligation) => {
    const type = demoObligationTypes.find((item) => item.name === obligation.typeName) ?? demoObligationTypes[0];
    const asset = assets.find((item) => item.name === obligation.assetName);

    return {
      id: obligation.id,
      companyId: demoCompany.id,
      locationId: findLocationId(obligation.locationName),
      assetId: asset?.id ?? null,
      obligationTypeId: type.id,
      title: obligation.title,
      description: "Seguimiento demo de obligacion critica.",
      status: obligation.status,
      priority: obligation.priority,
      responsibleUserId: findResponsibleUserId(obligation.responsibleName),
      startDate: null,
      dueDate: obligation.dueDate,
      recurrenceEnabled: obligation.recurrenceEnabled,
      recurrenceUnit: obligation.recurrenceUnit,
      recurrenceInterval: obligation.recurrenceInterval,
      autoCreateNext: true,
      completedAt: null,
      completedBy: null,
      lastCompletedDate: null,
      nextDueDate: calculateNextDueDate({
        fromDate: obligation.dueDate,
        unit: obligation.recurrenceUnit,
        interval: obligation.recurrenceInterval
      }),
      estimatedCost: null,
      actualCost: null,
      notes: "",
      createdAt: now,
      updatedAt: now
    };
  });

  const documents: DemoDocumentRecord[] = demoDocuments.map((document) => {
    const obligation = obligations.find((item) => item.title === document.obligationTitle);
    const asset = assets.find((item) => item.name === document.assetName);

    return {
      id: document.id,
      companyId: demoCompany.id,
      obligationId: obligation?.id ?? null,
      assetId: asset?.id ?? null,
      uploadedBy: DEMO_ACTOR_ID,
      fileName: document.fileName,
      storagePath: `companies/${demoCompany.id}/documents/${document.id}/${document.fileName}`,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      documentType: document.documentType,
      expirationDate: document.expirationDate,
      notes: "",
      createdAt: now,
      updatedAt: now
    };
  });

  const activity: DemoActivityRecord[] = demoActivity.map((item) => ({
    id: item.id,
    companyId: demoCompany.id,
    actorUserId: DEMO_ACTOR_ID,
    entityType: item.action.split(".")[0] ?? "demo",
    entityId: item.id,
    action: item.action,
    label: item.label,
    detail: item.detail,
    createdAt: item.createdAt
  }));

  return {
    assets,
    obligations,
    documents,
    activity,
    obligationTypes: obligationTypeRecords
  };
}

function cloneStore(store: DemoStore): DemoStore {
  return JSON.parse(JSON.stringify(store)) as DemoStore;
}

function normalizeStore(store: DemoStore): DemoStore {
  if (!Array.isArray(store.obligationTypes)) {
    store.obligationTypes = demoObligationTypes.map((type) => ({
      id: type.id,
      companyId: null,
      name: type.name,
      category: "demo",
      isSystemTemplate: true
    }));
  }

  return store;
}

async function readStore() {
  if (cachedStore) {
    return cachedStore;
  }

  try {
    const content = await readFile(DEMO_STORE_PATH, "utf8");
    cachedStore = normalizeStore(JSON.parse(content) as DemoStore);
  } catch {
    cachedStore = initialDemoStore();
    await persistStore(cachedStore);
  }

  return cachedStore;
}

async function persistStore(store: DemoStore) {
  cachedStore = store;
  await mkdir(path.dirname(DEMO_STORE_PATH), { recursive: true });
  await writeFile(DEMO_STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

async function mutateStore<T>(mutator: (store: DemoStore) => T | Promise<T>) {
  const store = await readStore();
  const result = await mutator(store);
  await persistStore(store);
  return result;
}

function addActivity(
  store: DemoStore,
  input: {
    entityType: string;
    entityId: string;
    action: string;
    label: string;
    detail: string;
  }
) {
  store.activity.unshift({
    id: randomUUID(),
    companyId: demoCompany.id,
    actorUserId: DEMO_ACTOR_ID,
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    label: input.label,
    detail: input.detail,
    createdAt: new Date().toISOString()
  });
}

function buildNextDueDate(input: {
  dueDate: string;
  recurrenceEnabled: boolean;
  recurrenceUnit: FrequencyUnit | null;
  recurrenceInterval: number | null;
}) {
  if (!input.recurrenceEnabled || !input.recurrenceUnit || !input.recurrenceInterval) {
    return null;
  }

  return calculateNextDueDate({
    fromDate: input.dueDate,
    unit: input.recurrenceUnit,
    interval: input.recurrenceInterval
  });
}

function resolveDemoObligationTypeId(store: DemoStore, input: ObligationInput) {
  if (input.obligationTypeId) {
    return input.obligationTypeId;
  }

  const name = input.customObligationTypeName?.trim() || "Tarea";
  const existing = store.obligationTypes.find((type) => type.name.toLowerCase() === name.toLowerCase());

  if (existing) {
    return existing.id;
  }

  const type: DemoObligationTypeRecord = {
    id: randomUUID(),
    companyId: demoCompany.id,
    name,
    category: "custom",
    isSystemTemplate: false
  };

  store.obligationTypes.push(type);
  return type.id;
}

function cloneObligationForNext(obligation: DemoObligationRecord, dueDate: string): DemoObligationRecord {
  const now = new Date().toISOString();
  const nextDueDate = buildNextDueDate({
    dueDate,
    recurrenceEnabled: obligation.recurrenceEnabled,
    recurrenceUnit: obligation.recurrenceUnit,
    recurrenceInterval: obligation.recurrenceInterval
  });

  return {
    ...obligation,
    id: randomUUID(),
    status: "active",
    startDate: obligation.dueDate,
    dueDate,
    completedAt: null,
    completedBy: null,
    lastCompletedDate: null,
    actualCost: null,
    nextDueDate,
    createdAt: now,
    updatedAt: now
  };
}

export function isDemoCompanyId(companyId: string) {
  return companyId === demoCompany.id;
}

export async function getDemoStoreSnapshot() {
  return cloneStore(await readStore());
}

export async function createDemoAsset(input: AssetInput) {
  return mutateStore((store) => {
    const now = new Date().toISOString();
    const asset: DemoAssetRecord = {
      id: randomUUID(),
      companyId: demoCompany.id,
      locationId: nullableId(input.locationId),
      name: input.name,
      assetType: input.assetType,
      internalReference: input.internalReference ?? "",
      serialNumber: input.serialNumber ?? "",
      description: input.description ?? "",
      status: input.status,
      responsibleUserId: nullableId(input.responsibleUserId),
      createdAt: now,
      updatedAt: now
    };

    store.assets.unshift(asset);
    addActivity(store, {
      entityType: "asset",
      entityId: asset.id,
      action: "asset.created",
      label: "Activo creado",
      detail: asset.name
    });

    return asset;
  });
}

export async function updateDemoAsset(assetId: string, input: AssetInput) {
  return mutateStore((store) => {
    const asset = store.assets.find((item) => item.id === assetId);

    if (!asset) {
      return null;
    }

    asset.locationId = nullableId(input.locationId);
    asset.name = input.name;
    asset.assetType = input.assetType;
    asset.internalReference = input.internalReference ?? "";
    asset.serialNumber = input.serialNumber ?? "";
    asset.description = input.description ?? "";
    asset.status = input.status;
    asset.responsibleUserId = nullableId(input.responsibleUserId);
    asset.updatedAt = new Date().toISOString();

    addActivity(store, {
      entityType: "asset",
      entityId: asset.id,
      action: "asset.updated",
      label: "Activo actualizado",
      detail: asset.name
    });

    return asset;
  });
}

export async function createDemoObligation(input: ObligationInput) {
  return mutateStore((store) => {
    const now = new Date().toISOString();
    const recurrenceUnit = input.recurrenceEnabled ? (input.recurrenceUnit as FrequencyUnit) : null;
    const recurrenceInterval = input.recurrenceEnabled ? (input.recurrenceInterval ?? null) : null;
    const obligation: DemoObligationRecord = {
      id: randomUUID(),
      companyId: demoCompany.id,
      locationId: nullableId(input.locationId),
      assetId: nullableId(input.assetId),
      obligationTypeId: resolveDemoObligationTypeId(store, input),
      title: input.title,
      description: input.description ?? "",
      status: input.status,
      priority: input.priority,
      responsibleUserId: nullableId(input.responsibleUserId),
      startDate: nullableDate(input.startDate),
      dueDate: input.dueDate,
      recurrenceEnabled: input.recurrenceEnabled,
      recurrenceUnit,
      recurrenceInterval,
      autoCreateNext: input.autoCreateNext,
      completedAt: null,
      completedBy: null,
      lastCompletedDate: null,
      nextDueDate: buildNextDueDate({
        dueDate: input.dueDate,
        recurrenceEnabled: input.recurrenceEnabled,
        recurrenceUnit,
        recurrenceInterval
      }),
      estimatedCost: moneyValue(input.estimatedCost),
      actualCost: moneyValue(input.actualCost),
      notes: input.notes ?? "",
      createdAt: now,
      updatedAt: now
    };

    store.obligations.unshift(obligation);
    addActivity(store, {
      entityType: "obligation",
      entityId: obligation.id,
      action: "obligation.created",
      label: "Obligacion creada",
      detail: obligation.title
    });

    return obligation;
  });
}

export async function updateDemoObligation(obligationId: string, input: ObligationInput) {
  return mutateStore((store) => {
    const obligation = store.obligations.find((item) => item.id === obligationId);

    if (!obligation) {
      return null;
    }

    const recurrenceUnit = input.recurrenceEnabled ? (input.recurrenceUnit as FrequencyUnit) : null;
    const recurrenceInterval = input.recurrenceEnabled ? (input.recurrenceInterval ?? null) : null;

    obligation.locationId = nullableId(input.locationId);
    obligation.assetId = nullableId(input.assetId);
    obligation.obligationTypeId = resolveDemoObligationTypeId(store, input);
    obligation.title = input.title;
    obligation.description = input.description ?? "";
    obligation.status = input.status;
    obligation.priority = input.priority;
    obligation.responsibleUserId = nullableId(input.responsibleUserId);
    obligation.startDate = nullableDate(input.startDate);
    obligation.dueDate = input.dueDate;
    obligation.recurrenceEnabled = input.recurrenceEnabled;
    obligation.recurrenceUnit = recurrenceUnit;
    obligation.recurrenceInterval = recurrenceInterval;
    obligation.autoCreateNext = input.autoCreateNext;
    obligation.nextDueDate = buildNextDueDate({
      dueDate: input.dueDate,
      recurrenceEnabled: input.recurrenceEnabled,
      recurrenceUnit,
      recurrenceInterval
    });
    obligation.estimatedCost = moneyValue(input.estimatedCost);
    obligation.actualCost = moneyValue(input.actualCost);
    obligation.notes = input.notes ?? "";
    obligation.updatedAt = new Date().toISOString();

    addActivity(store, {
      entityType: "obligation",
      entityId: obligation.id,
      action: "obligation.updated",
      label: "Obligacion actualizada",
      detail: obligation.title
    });

    return obligation;
  });
}

export async function completeDemoObligation(obligationId: string, action: "completed" | "resolved" = "completed") {
  return mutateStore((store) => {
    const obligation = store.obligations.find((item) => item.id === obligationId);

    if (!obligation) {
      return null;
    }

    const now = new Date().toISOString();
    const nextDueDate = buildNextDueDate({
      dueDate: obligation.dueDate,
      recurrenceEnabled: obligation.recurrenceEnabled,
      recurrenceUnit: obligation.recurrenceUnit,
      recurrenceInterval: obligation.recurrenceInterval
    });

    obligation.status = "completed";
    obligation.completedAt = now;
    obligation.completedBy = DEMO_ACTOR_ID;
    obligation.lastCompletedDate = obligation.dueDate;
    obligation.nextDueDate = nextDueDate;
    obligation.updatedAt = now;

    if (obligation.autoCreateNext && nextDueDate) {
      store.obligations.unshift(cloneObligationForNext(obligation, nextDueDate));
    }

    addActivity(store, {
      entityType: "obligation",
      entityId: obligation.id,
      action: action === "resolved" ? "obligation.resolved" : "obligation.completed",
      label: action === "resolved" ? "Obligacion resuelta" : "Obligacion completada",
      detail: obligation.title
    });

    return obligation;
  });
}

export async function reviewDemoObligation(obligationId: string) {
  return mutateStore((store) => {
    const obligation = store.obligations.find((item) => item.id === obligationId);

    if (!obligation) {
      return null;
    }

    obligation.updatedAt = new Date().toISOString();
    addActivity(store, {
      entityType: "obligation",
      entityId: obligation.id,
      action: "obligation.reviewed",
      label: "Obligacion revisada",
      detail: obligation.title
    });

    return obligation;
  });
}

export async function cancelDemoObligation(obligationId: string) {
  return mutateStore((store) => {
    const obligation = store.obligations.find((item) => item.id === obligationId);

    if (!obligation) {
      return null;
    }

    obligation.status = "cancelled";
    obligation.updatedAt = new Date().toISOString();
    addActivity(store, {
      entityType: "obligation",
      entityId: obligation.id,
      action: "obligation.cancelled",
      label: "Obligacion cancelada",
      detail: obligation.title
    });

    return obligation;
  });
}

export async function duplicateDemoObligation(obligationId: string) {
  return mutateStore((store) => {
    const obligation = store.obligations.find((item) => item.id === obligationId);

    if (!obligation) {
      return null;
    }

    const now = new Date().toISOString();
    const duplicated: DemoObligationRecord = {
      ...obligation,
      id: randomUUID(),
      title: `${obligation.title} (copia)`,
      status: "active",
      completedAt: null,
      completedBy: null,
      lastCompletedDate: null,
      createdAt: now,
      updatedAt: now
    };

    store.obligations.unshift(duplicated);
    addActivity(store, {
      entityType: "obligation",
      entityId: duplicated.id,
      action: "obligation.created",
      label: "Obligacion duplicada",
      detail: duplicated.title
    });

    return duplicated;
  });
}

export async function createNextDemoRenewal(obligationId: string) {
  return mutateStore((store) => {
    const obligation = store.obligations.find((item) => item.id === obligationId);

    if (!obligation || !obligation.recurrenceEnabled || !obligation.recurrenceUnit || !obligation.recurrenceInterval) {
      return null;
    }

    const dueDate =
      obligation.nextDueDate ??
      calculateNextDueDate({
        fromDate: obligation.dueDate,
        unit: obligation.recurrenceUnit,
        interval: obligation.recurrenceInterval
      });
    const next = cloneObligationForNext(obligation, dueDate);

    store.obligations.unshift(next);
    addActivity(store, {
      entityType: "obligation",
      entityId: next.id,
      action: "obligation.created",
      label: "Renovacion creada",
      detail: next.title
    });

    return next;
  });
}
