import type { ReminderChannel } from "@/types";

export const DEFAULT_REMINDER_DAYS = [90, 30, 15, 7, 1, 0, -7] as const;

export type ReminderRuleTemplate = {
  daysBeforeDue: number;
  channel: ReminderChannel;
  enabled: boolean;
};

export type ReminderCandidate = {
  companyId: string;
  obligationId: string;
  userId: string;
  daysBeforeDue: number;
  channel: ReminderChannel;
};

export type ExistingReminderNotification = {
  obligationId: string | null;
  userId: string;
  type: string;
};

export function buildReminderType(daysBeforeDue: number, channel: ReminderChannel) {
  return `obligation_due_${daysBeforeDue}_${channel}`;
}

export function buildDefaultReminderRules(channels: ReminderChannel[] = ["email", "in_app"]): ReminderRuleTemplate[] {
  return DEFAULT_REMINDER_DAYS.flatMap((daysBeforeDue) =>
    channels.map((channel) => ({
      daysBeforeDue,
      channel,
      enabled: true
    }))
  );
}

export function isDuplicateReminderNotification(
  existing: ExistingReminderNotification[],
  candidate: ReminderCandidate
) {
  const type = buildReminderType(candidate.daysBeforeDue, candidate.channel);

  return existing.some(
    (notification) =>
      notification.obligationId === candidate.obligationId &&
      notification.userId === candidate.userId &&
      notification.type === type
  );
}
