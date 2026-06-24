import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

export const companyRoleEnum = pgEnum("company_role", ["owner", "admin", "manager", "member", "viewer"]);
export const companyMemberStatusEnum = pgEnum("company_member_status", ["active", "invited", "disabled"]);
export const assetStatusEnum = pgEnum("asset_status", ["active", "inactive", "retired"]);
export const frequencyUnitEnum = pgEnum("frequency_unit", ["days", "weeks", "months", "years"]);
export const obligationStatusEnum = pgEnum("obligation_status", ["active", "completed", "cancelled", "expired"]);
export const obligationPriorityEnum = pgEnum("obligation_priority", ["low", "medium", "high", "critical"]);
export const reminderChannelEnum = pgEnum("reminder_channel", ["email", "in_app"]);
export const notificationSeverityEnum = pgEnum("notification_severity", ["info", "warning", "critical"]);
export const deliveryStatusEnum = pgEnum("delivery_status", ["pending", "sent", "failed"]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["free", "starter", "business", "enterprise"]);

const timestamps = () => ({
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  ...timestamps()
});

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  legalName: text("legal_name"),
  taxId: varchar("tax_id", { length: 32 }),
  timezone: text("timezone").default("Europe/Madrid").notNull(),
  logoUrl: text("logo_url"),
  industry: text("industry"),
  ...timestamps()
});

export const companyMembers = pgTable(
  "company_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    role: companyRoleEnum("role").default("member").notNull(),
    status: companyMemberStatusEnum("status").default("active").notNull(),
    ...timestamps()
  },
  (table) => ({
    companyUserIdx: uniqueIndex("company_members_company_user_idx").on(table.companyId, table.userId),
    userIdx: index("company_members_user_idx").on(table.userId),
    companyIdx: index("company_members_company_idx").on(table.companyId)
  })
);

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    address: text("address"),
    city: text("city"),
    postalCode: varchar("postal_code", { length: 16 }),
    country: text("country"),
    notes: text("notes"),
    ...timestamps()
  },
  (table) => ({
    companyIdx: index("locations_company_idx").on(table.companyId)
  })
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    locationId: uuid("location_id").references(() => locations.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    assetType: text("asset_type").notNull(),
    internalReference: text("internal_reference"),
    serialNumber: text("serial_number"),
    description: text("description"),
    status: assetStatusEnum("status").default("active").notNull(),
    responsibleUserId: uuid("responsible_user_id"),
    ...timestamps()
  },
  (table) => ({
    companyIdx: index("assets_company_idx").on(table.companyId),
    locationIdx: index("assets_location_idx").on(table.locationId),
    responsibleIdx: index("assets_responsible_idx").on(table.responsibleUserId)
  })
);

export const obligationTypes = pgTable(
  "obligation_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    defaultFrequencyUnit: frequencyUnitEnum("default_frequency_unit"),
    defaultFrequencyValue: integer("default_frequency_value"),
    icon: text("icon"),
    isSystemTemplate: boolean("is_system_template").default(false).notNull(),
    ...timestamps()
  },
  (table) => ({
    companyIdx: index("obligation_types_company_idx").on(table.companyId),
    nameCompanyIdx: uniqueIndex("obligation_types_name_company_idx").on(table.name, table.companyId)
  })
);

export const obligations = pgTable(
  "obligations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    locationId: uuid("location_id").references(() => locations.id, { onDelete: "set null" }),
    assetId: uuid("asset_id").references(() => assets.id, { onDelete: "set null" }),
    obligationTypeId: uuid("obligation_type_id")
      .notNull()
      .references(() => obligationTypes.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    description: text("description"),
    status: obligationStatusEnum("status").default("active").notNull(),
    priority: obligationPriorityEnum("priority").default("medium").notNull(),
    responsibleUserId: uuid("responsible_user_id"),
    startDate: date("start_date", { mode: "string" }),
    dueDate: date("due_date", { mode: "string" }).notNull(),
    recurrenceEnabled: boolean("recurrence_enabled").default(false).notNull(),
    recurrenceUnit: frequencyUnitEnum("recurrence_unit"),
    recurrenceInterval: integer("recurrence_interval"),
    autoCreateNext: boolean("auto_create_next").default(false).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    completedBy: uuid("completed_by"),
    lastCompletedDate: date("last_completed_date", { mode: "string" }),
    nextDueDate: date("next_due_date", { mode: "string" }),
    estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 }),
    actualCost: numeric("actual_cost", { precision: 12, scale: 2 }),
    notes: text("notes"),
    ...timestamps()
  },
  (table) => ({
    companyIdx: index("obligations_company_idx").on(table.companyId),
    dueDateIdx: index("obligations_due_date_idx").on(table.companyId, table.dueDate),
    assetIdx: index("obligations_asset_idx").on(table.assetId),
    statusIdx: index("obligations_status_idx").on(table.status)
  })
);

export const reminderRules = pgTable(
  "reminder_rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    obligationId: uuid("obligation_id")
      .notNull()
      .references(() => obligations.id, { onDelete: "cascade" }),
    daysBeforeDue: integer("days_before_due").notNull(),
    channel: reminderChannelEnum("channel").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    ...timestamps()
  },
  (table) => ({
    obligationDaysChannelIdx: uniqueIndex("reminder_rules_obligation_days_channel_idx").on(
      table.obligationId,
      table.daysBeforeDue,
      table.channel
    ),
    companyIdx: index("reminder_rules_company_idx").on(table.companyId)
  })
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    obligationId: uuid("obligation_id").references(() => obligations.id, { onDelete: "set null" }),
    assetId: uuid("asset_id").references(() => assets.id, { onDelete: "set null" }),
    uploadedBy: uuid("uploaded_by").notNull(),
    fileName: text("file_name").notNull(),
    storagePath: text("storage_path").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    documentType: text("document_type"),
    expirationDate: date("expiration_date", { mode: "string" }),
    notes: text("notes"),
    ...timestamps()
  },
  (table) => ({
    companyIdx: index("documents_company_idx").on(table.companyId),
    obligationIdx: index("documents_obligation_idx").on(table.obligationId),
    assetIdx: index("documents_asset_idx").on(table.assetId),
    storagePathIdx: uniqueIndex("documents_storage_path_idx").on(table.storagePath)
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    obligationId: uuid("obligation_id").references(() => obligations.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    severity: notificationSeverityEnum("severity").default("info").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    userUnreadIdx: index("notifications_user_unread_idx").on(table.userId, table.readAt),
    obligationTypeIdx: uniqueIndex("notifications_obligation_type_user_idx").on(
      table.obligationId,
      table.type,
      table.userId
    )
  })
);

export const notificationDeliveries = pgTable(
  "notification_deliveries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    notificationId: uuid("notification_id")
      .notNull()
      .references(() => notifications.id, { onDelete: "cascade" }),
    channel: reminderChannelEnum("channel").notNull(),
    recipient: text("recipient").notNull(),
    status: deliveryStatusEnum("status").default("pending").notNull(),
    providerMessageId: text("provider_message_id"),
    errorMessage: text("error_message"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    notificationChannelRecipientIdx: uniqueIndex("notification_deliveries_unique_recipient_idx").on(
      table.notificationId,
      table.channel,
      table.recipient
    ),
    statusIdx: index("notification_deliveries_status_idx").on(table.status)
  })
);

export const activityLogs = pgTable(
  "activity_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    actorUserId: uuid("actor_user_id"),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    action: text("action").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    companyCreatedIdx: index("activity_logs_company_created_idx").on(table.companyId, table.createdAt),
    entityIdx: index("activity_logs_entity_idx").on(table.entityType, table.entityId)
  })
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    plan: subscriptionPlanEnum("plan").default("free").notNull(),
    status: text("status").default("inactive").notNull(),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    ...timestamps()
  },
  (table) => ({
    companyIdx: uniqueIndex("subscriptions_company_idx").on(table.companyId),
    stripeSubscriptionIdx: uniqueIndex("subscriptions_stripe_subscription_idx").on(table.stripeSubscriptionId)
  })
);

export const companiesRelations = relations(companies, ({ many, one }) => ({
  members: many(companyMembers),
  locations: many(locations),
  assets: many(assets),
  obligations: many(obligations),
  documents: many(documents),
  subscription: one(subscriptions)
}));

export const companyMembersRelations = relations(companyMembers, ({ one }) => ({
  company: one(companies, {
    fields: [companyMembers.companyId],
    references: [companies.id]
  }),
  profile: one(profiles, {
    fields: [companyMembers.userId],
    references: [profiles.id]
  })
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  company: one(companies, {
    fields: [locations.companyId],
    references: [companies.id]
  }),
  assets: many(assets),
  obligations: many(obligations)
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  company: one(companies, {
    fields: [assets.companyId],
    references: [companies.id]
  }),
  location: one(locations, {
    fields: [assets.locationId],
    references: [locations.id]
  }),
  obligations: many(obligations),
  documents: many(documents)
}));

export const obligationTypesRelations = relations(obligationTypes, ({ one, many }) => ({
  company: one(companies, {
    fields: [obligationTypes.companyId],
    references: [companies.id]
  }),
  obligations: many(obligations)
}));

export const obligationsRelations = relations(obligations, ({ one, many }) => ({
  company: one(companies, {
    fields: [obligations.companyId],
    references: [companies.id]
  }),
  location: one(locations, {
    fields: [obligations.locationId],
    references: [locations.id]
  }),
  asset: one(assets, {
    fields: [obligations.assetId],
    references: [assets.id]
  }),
  type: one(obligationTypes, {
    fields: [obligations.obligationTypeId],
    references: [obligationTypes.id]
  }),
  reminderRules: many(reminderRules),
  documents: many(documents)
}));

export const reminderRulesRelations = relations(reminderRules, ({ one }) => ({
  obligation: one(obligations, {
    fields: [reminderRules.obligationId],
    references: [obligations.id]
  }),
  company: one(companies, {
    fields: [reminderRules.companyId],
    references: [companies.id]
  })
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  company: one(companies, {
    fields: [documents.companyId],
    references: [companies.id]
  }),
  obligation: one(obligations, {
    fields: [documents.obligationId],
    references: [obligations.id]
  }),
  asset: one(assets, {
    fields: [documents.assetId],
    references: [assets.id]
  })
}));

export const notificationsRelations = relations(notifications, ({ one, many }) => ({
  company: one(companies, {
    fields: [notifications.companyId],
    references: [companies.id]
  }),
  obligation: one(obligations, {
    fields: [notifications.obligationId],
    references: [obligations.id]
  }),
  deliveries: many(notificationDeliveries)
}));

export const notificationDeliveriesRelations = relations(notificationDeliveries, ({ one }) => ({
  notification: one(notifications, {
    fields: [notificationDeliveries.notificationId],
    references: [notifications.id]
  })
}));

export type Profile = typeof profiles.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type CompanyMember = typeof companyMembers.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type ObligationType = typeof obligationTypes.$inferSelect;
export type Obligation = typeof obligations.$inferSelect;
export type ReminderRule = typeof reminderRules.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
