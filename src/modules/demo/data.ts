import { getObligationStatus, getTodayDateOnly } from "@/lib/date/obligations";
import type { CompanyRole, ObligationPriority, ObligationStatus } from "@/types";

function offsetDate(days: number) {
  const today = getTodayDateOnly();
  const [year, month, day] = today.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export const demoCompany = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Taller Garcia",
  legalName: "Taller Garcia S.L.",
  taxId: "B12345678",
  timezone: "Europe/Madrid",
  industry: "Taller mecanico"
};

export const demoMembers = [
  {
    id: "21111111-1111-4111-8111-111111111111",
    userId: "31111111-1111-4111-8111-111111111111",
    fullName: "Ana Garcia",
    email: "ana@example.test",
    role: "owner" as CompanyRole,
    status: "active"
  },
  {
    id: "21111111-1111-4111-8111-111111111112",
    userId: "31111111-1111-4111-8111-111111111112",
    fullName: "Luis Martin",
    email: "luis@example.test",
    role: "manager" as CompanyRole,
    status: "active"
  },
  {
    id: "21111111-1111-4111-8111-111111111113",
    userId: "31111111-1111-4111-8111-111111111113",
    fullName: "Marta Ruiz",
    email: "marta@example.test",
    role: "viewer" as CompanyRole,
    status: "active"
  }
];

export const demoLocations = [
  {
    id: "41111111-1111-4111-8111-111111111111",
    name: "Nave principal",
    city: "Madrid",
    address: "Calle Industria 12"
  }
];

export const demoObligationTypes = [
  { id: "a1111111-1111-4111-8111-111111111111", name: "ITV" },
  { id: "a1111111-1111-4111-8111-111111111112", name: "Seguro" },
  { id: "a1111111-1111-4111-8111-111111111113", name: "Extintor" },
  { id: "a1111111-1111-4111-8111-111111111114", name: "Certificado SSL" },
  { id: "a1111111-1111-4111-8111-111111111115", name: "Mantenimiento preventivo" },
  { id: "a1111111-1111-4111-8111-111111111116", name: "Licencia" }
];

export const demoAssets = [
  {
    id: "51111111-1111-4111-8111-111111111111",
    name: "Furgoneta Ford Transit",
    assetType: "Vehiculo",
    status: "active",
    locationName: "Nave principal",
    responsibleName: "Luis Martin",
    obligationsCount: 2,
    documentsCount: 2
  },
  {
    id: "51111111-1111-4111-8111-111111111112",
    name: "Extintor recepcion",
    assetType: "Extintor",
    status: "active",
    locationName: "Nave principal",
    responsibleName: "Marta Ruiz",
    obligationsCount: 1,
    documentsCount: 1
  },
  {
    id: "51111111-1111-4111-8111-111111111113",
    name: "Elevador hidraulico",
    assetType: "Maquinaria",
    status: "active",
    locationName: "Nave principal",
    responsibleName: "Luis Martin",
    obligationsCount: 1,
    documentsCount: 1
  },
  {
    id: "51111111-1111-4111-8111-111111111114",
    name: "Compresor",
    assetType: "Maquinaria",
    status: "active",
    locationName: "Nave principal",
    responsibleName: "Luis Martin",
    obligationsCount: 0,
    documentsCount: 0
  },
  {
    id: "51111111-1111-4111-8111-111111111115",
    name: "Dominio web",
    assetType: "Digital",
    status: "active",
    locationName: "Empresa",
    responsibleName: "Ana Garcia",
    obligationsCount: 1,
    documentsCount: 1
  }
];

export const demoObligations = [
  {
    id: "61111111-1111-4111-8111-111111111111",
    title: "ITV de la furgoneta Ford Transit",
    typeName: "ITV",
    assetName: "Furgoneta Ford Transit",
    locationName: "Nave principal",
    responsibleName: "Luis Martin",
    dueDate: offsetDate(7),
    status: "active" as ObligationStatus,
    priority: "high" as ObligationPriority,
    recurrenceEnabled: true,
    recurrenceUnit: "years" as const,
    recurrenceInterval: 1
  },
  {
    id: "61111111-1111-4111-8111-111111111112",
    title: "Seguro de la furgoneta",
    typeName: "Seguro",
    assetName: "Furgoneta Ford Transit",
    locationName: "Nave principal",
    responsibleName: "Ana Garcia",
    dueDate: offsetDate(-5),
    status: "active" as ObligationStatus,
    priority: "critical" as ObligationPriority,
    recurrenceEnabled: true,
    recurrenceUnit: "years" as const,
    recurrenceInterval: 1
  },
  {
    id: "61111111-1111-4111-8111-111111111113",
    title: "Revision de extintor recepcion",
    typeName: "Extintor",
    assetName: "Extintor recepcion",
    locationName: "Nave principal",
    responsibleName: "Marta Ruiz",
    dueDate: offsetDate(30),
    status: "active" as ObligationStatus,
    priority: "medium" as ObligationPriority,
    recurrenceEnabled: true,
    recurrenceUnit: "years" as const,
    recurrenceInterval: 1
  },
  {
    id: "61111111-1111-4111-8111-111111111114",
    title: "Certificado SSL",
    typeName: "Certificado SSL",
    assetName: "Dominio web",
    locationName: "Empresa",
    responsibleName: "Ana Garcia",
    dueDate: offsetDate(7),
    status: "active" as ObligationStatus,
    priority: "high" as ObligationPriority,
    recurrenceEnabled: true,
    recurrenceUnit: "months" as const,
    recurrenceInterval: 3
  },
  {
    id: "61111111-1111-4111-8111-111111111115",
    title: "Mantenimiento del elevador",
    typeName: "Mantenimiento preventivo",
    assetName: "Elevador hidraulico",
    locationName: "Nave principal",
    responsibleName: "Luis Martin",
    dueDate: offsetDate(90),
    status: "active" as ObligationStatus,
    priority: "medium" as ObligationPriority,
    recurrenceEnabled: true,
    recurrenceUnit: "months" as const,
    recurrenceInterval: 6
  }
].map((obligation) => ({
  ...obligation,
  computedStatus: getObligationStatus({ dueDate: obligation.dueDate, status: obligation.status })
}));

export const demoDocuments = [
  {
    id: "71111111-1111-4111-8111-111111111111",
    fileName: "itv-ford-transit.pdf",
    documentType: "ITV",
    assetName: "Furgoneta Ford Transit",
    obligationTitle: "ITV de la furgoneta Ford Transit",
    expirationDate: offsetDate(7),
    sizeBytes: 420000,
    mimeType: "application/pdf"
  },
  {
    id: "71111111-1111-4111-8111-111111111112",
    fileName: "poliza-seguro.pdf",
    documentType: "Seguro",
    assetName: "Furgoneta Ford Transit",
    obligationTitle: "Seguro de la furgoneta",
    expirationDate: offsetDate(-5),
    sizeBytes: 390000,
    mimeType: "application/pdf"
  },
  {
    id: "71111111-1111-4111-8111-111111111113",
    fileName: "certificado-ssl.pdf",
    documentType: "Certificado",
    assetName: "Dominio web",
    obligationTitle: "Certificado SSL",
    expirationDate: offsetDate(7),
    sizeBytes: 180000,
    mimeType: "application/pdf"
  }
];

export const demoNotifications = [
  {
    id: "81111111-1111-4111-8111-111111111111",
    title: "Seguro vencido",
    message: "El seguro de la furgoneta requiere atencion.",
    severity: "critical",
    createdAt: new Date().toISOString()
  },
  {
    id: "81111111-1111-4111-8111-111111111112",
    title: "ITV en 7 dias",
    message: "La ITV de la furgoneta vence pronto.",
    severity: "warning",
    createdAt: new Date().toISOString()
  }
];

export const demoActivity = [
  {
    id: "91111111-1111-4111-8111-111111111111",
    action: "obligation.created",
    label: "Obligacion creada",
    detail: "ITV de la furgoneta Ford Transit",
    createdAt: new Date().toISOString()
  },
  {
    id: "91111111-1111-4111-8111-111111111112",
    action: "document.uploaded",
    label: "Documento subido",
    detail: "poliza-seguro.pdf",
    createdAt: new Date().toISOString()
  }
];
