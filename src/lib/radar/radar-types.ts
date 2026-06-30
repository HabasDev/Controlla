import type { ComputedObligationStatus } from "@/lib/date/obligations";
import type { ObligationPriority } from "@/types";

export type RadarObligation = {
  id: string;
  title: string;
  dueDate: string;
  assetName?: string | null;
  typeName?: string | null;
  priority?: ObligationPriority;
  computedStatus?: ComputedObligationStatus;
};

export type RadarStatusCategory =
  | "expired"
  | "today"
  | "soon"
  | "month"
  | "midTerm"
  | "future"
  | "unknown";

export type RadarPoint = RadarObligation & {
  daysUntilDue: number;
  radius: number;
  angle: number;
  x: number;
  y: number;
  color: string;
  size: number;
  urgencyLabel: string;
  statusCategory: RadarStatusCategory;
  titleLabel: string;
};
