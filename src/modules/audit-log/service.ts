import { getDb } from "@/db";
import { activityLogs } from "@/db/schema";

export type ActivityAction =
  | "obligation.created"
  | "obligation.updated"
  | "obligation.completed"
  | "obligation.cancelled"
  | "document.uploaded"
  | "document.deleted"
  | "asset.created"
  | "asset.updated"
  | "member.invited"
  | "member.role_changed"
  | "company.updated";

export async function createActivityLog(input: {
  companyId: string;
  actorUserId: string | null;
  entityType: string;
  entityId: string;
  action: ActivityAction;
  metadata?: Record<string, unknown>;
}) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db.insert(activityLogs).values({
    companyId: input.companyId,
    actorUserId: input.actorUserId,
    entityType: input.entityType,
    entityId: input.entityId,
    action: input.action,
    metadata: input.metadata ?? {}
  });
}
