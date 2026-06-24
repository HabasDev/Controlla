export const COMPANY_ROLES = ["owner", "admin", "manager", "member", "viewer"] as const;
export type CompanyRole = (typeof COMPANY_ROLES)[number];

export const COMPANY_MEMBER_STATUSES = ["active", "invited", "disabled"] as const;
export type CompanyMemberStatus = (typeof COMPANY_MEMBER_STATUSES)[number];

export const ASSET_STATUSES = ["active", "inactive", "retired"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const OBLIGATION_STATUSES = ["active", "completed", "cancelled", "expired"] as const;
export type ObligationStatus = (typeof OBLIGATION_STATUSES)[number];

export const OBLIGATION_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export type ObligationPriority = (typeof OBLIGATION_PRIORITIES)[number];

export const FREQUENCY_UNITS = ["days", "weeks", "months", "years"] as const;
export type FrequencyUnit = (typeof FREQUENCY_UNITS)[number];

export const REMINDER_CHANNELS = ["email", "in_app"] as const;
export type ReminderChannel = (typeof REMINDER_CHANNELS)[number];

export const NOTIFICATION_SEVERITIES = ["info", "warning", "critical"] as const;
export type NotificationSeverity = (typeof NOTIFICATION_SEVERITIES)[number];

export const SUBSCRIPTION_PLANS = ["free", "starter", "business", "enterprise"] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export type ActionResult<T = undefined> =
  | {
      ok: true;
      data?: T;
      message?: string;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
