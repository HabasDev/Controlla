create extension if not exists "pgcrypto";

do $$ begin
  create type public.company_role as enum ('owner', 'admin', 'manager', 'member', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.company_member_status as enum ('active', 'invited', 'disabled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.asset_status as enum ('active', 'inactive', 'retired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.frequency_unit as enum ('days', 'weeks', 'months', 'years');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.obligation_status as enum ('active', 'completed', 'cancelled', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.obligation_priority as enum ('low', 'medium', 'high', 'critical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.reminder_channel as enum ('email', 'in_app');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_severity as enum ('info', 'warning', 'critical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.delivery_status as enum ('pending', 'sent', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscription_plan as enum ('free', 'starter', 'business', 'enterprise');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  tax_id varchar(32),
  timezone text not null default 'Europe/Madrid',
  logo_url text,
  industry text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.company_role not null default 'member',
  status public.company_member_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_members_company_user_unique unique (company_id, user_id)
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  address text,
  city text,
  postal_code varchar(16),
  country text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  name text not null,
  asset_type text not null,
  internal_reference text,
  serial_number text,
  description text,
  status public.asset_status not null default 'active',
  responsible_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.obligation_types (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  name text not null,
  category text not null,
  description text,
  default_frequency_unit public.frequency_unit,
  default_frequency_value integer,
  icon text,
  is_system_template boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint obligation_types_frequency_positive check (default_frequency_value is null or default_frequency_value > 0)
);

create table if not exists public.obligations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  obligation_type_id uuid not null references public.obligation_types(id) on delete restrict,
  title text not null,
  description text,
  status public.obligation_status not null default 'active',
  priority public.obligation_priority not null default 'medium',
  responsible_user_id uuid references auth.users(id) on delete set null,
  start_date date,
  due_date date not null,
  recurrence_enabled boolean not null default false,
  recurrence_unit public.frequency_unit,
  recurrence_interval integer,
  auto_create_next boolean not null default false,
  completed_at timestamptz,
  completed_by uuid references auth.users(id) on delete set null,
  last_completed_date date,
  next_due_date date,
  estimated_cost numeric(12, 2),
  actual_cost numeric(12, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint obligations_recurrence_valid check (
    recurrence_enabled = false
    or (recurrence_unit is not null and recurrence_interval is not null and recurrence_interval > 0)
  )
);

create table if not exists public.reminder_rules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  obligation_id uuid not null references public.obligations(id) on delete cascade,
  days_before_due integer not null,
  channel public.reminder_channel not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reminder_rules_days_range check (days_before_due between -30 and 365),
  constraint reminder_rules_obligation_days_channel_unique unique (obligation_id, days_before_due, channel)
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  obligation_id uuid references public.obligations(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  uploaded_by uuid not null references auth.users(id) on delete restrict,
  file_name text not null,
  storage_path text not null unique,
  mime_type text not null,
  size_bytes integer not null,
  document_type text,
  expiration_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_size_positive check (size_bytes > 0)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  obligation_id uuid references public.obligations(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  severity public.notification_severity not null default 'info',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  channel public.reminder_channel not null,
  recipient text not null,
  status public.delivery_status not null default 'pending',
  provider_message_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  constraint notification_deliveries_unique_recipient unique (notification_id, channel, recipient)
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan public.subscription_plan not null default 'free',
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_members_user_idx on public.company_members(user_id);
create index if not exists company_members_company_idx on public.company_members(company_id);
create index if not exists locations_company_idx on public.locations(company_id);
create index if not exists assets_company_idx on public.assets(company_id);
create index if not exists assets_location_idx on public.assets(location_id);
create index if not exists assets_responsible_idx on public.assets(responsible_user_id);
create index if not exists obligation_types_company_idx on public.obligation_types(company_id);
create unique index if not exists obligation_types_system_name_idx on public.obligation_types(lower(name)) where company_id is null;
create index if not exists obligations_company_idx on public.obligations(company_id);
create index if not exists obligations_due_date_idx on public.obligations(company_id, due_date);
create index if not exists obligations_asset_idx on public.obligations(asset_id);
create index if not exists obligations_status_idx on public.obligations(status);
create index if not exists reminder_rules_company_idx on public.reminder_rules(company_id);
create index if not exists documents_company_idx on public.documents(company_id);
create index if not exists documents_obligation_idx on public.documents(obligation_id);
create index if not exists documents_asset_idx on public.documents(asset_id);
create index if not exists notifications_user_unread_idx on public.notifications(user_id, read_at);
create unique index if not exists notifications_obligation_type_user_idx on public.notifications(obligation_id, type, user_id);
create index if not exists notification_deliveries_status_idx on public.notification_deliveries(status);
create index if not exists activity_logs_company_created_idx on public.activity_logs(company_id, created_at desc);
create index if not exists activity_logs_entity_idx on public.activity_logs(entity_type, entity_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'companies',
    'company_members',
    'locations',
    'assets',
    'obligation_types',
    'obligations',
    'reminder_rules',
    'documents',
    'subscriptions'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

create or replace function public.is_company_member(company_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_members cm
    where cm.company_id = company_uuid
      and cm.user_id = auth.uid()
      and cm.status = 'active'
  );
$$;

create or replace function public.has_company_role(company_uuid uuid, allowed_roles public.company_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_members cm
    where cm.company_id = company_uuid
      and cm.user_id = auth.uid()
      and cm.status = 'active'
      and cm.role = any(allowed_roles)
  );
$$;

create or replace function public.can_access_notification(notification_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.notifications n
    where n.id = notification_uuid
      and (
        n.user_id = auth.uid()
        or public.has_company_role(n.company_id, array['owner', 'admin']::public.company_role[])
      )
  );
$$;

create or replace function public.storage_company_id(object_name text)
returns uuid
language sql
immutable
as $$
  select case
    when object_name ~ '^companies/[0-9a-fA-F-]{36}/documents/.+'
      then split_part(object_name, '/', 2)::uuid
    else null
  end;
$$;

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.locations enable row level security;
alter table public.assets enable row level security;
alter table public.obligation_types enable row level security;
alter table public.obligations enable row level security;
alter table public.reminder_rules enable row level security;
alter table public.documents enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_deliveries enable row level security;
alter table public.activity_logs enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "profiles_select_visible" on public.profiles;
create policy "profiles_select_visible"
on public.profiles for select
using (
  id = auth.uid()
  or exists (
    select 1
    from public.company_members viewer
    join public.company_members target
      on target.company_id = viewer.company_id
    where viewer.user_id = auth.uid()
      and viewer.status = 'active'
      and target.user_id = profiles.id
      and target.status = 'active'
  )
);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "companies_select_member" on public.companies;
create policy "companies_select_member"
on public.companies for select
using (public.is_company_member(id));

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
on public.companies for insert
with check (auth.uid() is not null);

drop policy if exists "companies_update_admin" on public.companies;
create policy "companies_update_admin"
on public.companies for update
using (public.has_company_role(id, array['owner', 'admin']::public.company_role[]))
with check (public.has_company_role(id, array['owner', 'admin']::public.company_role[]));

drop policy if exists "companies_delete_owner" on public.companies;
create policy "companies_delete_owner"
on public.companies for delete
using (public.has_company_role(id, array['owner']::public.company_role[]));

drop policy if exists "company_members_select_member" on public.company_members;
create policy "company_members_select_member"
on public.company_members for select
using (public.is_company_member(company_id));

drop policy if exists "company_members_insert_admin" on public.company_members;
create policy "company_members_insert_admin"
on public.company_members for insert
with check (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));

drop policy if exists "company_members_update_admin" on public.company_members;
create policy "company_members_update_admin"
on public.company_members for update
using (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]))
with check (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));

drop policy if exists "company_members_delete_admin" on public.company_members;
create policy "company_members_delete_admin"
on public.company_members for delete
using (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));

drop policy if exists "locations_select_member" on public.locations;
create policy "locations_select_member" on public.locations for select using (public.is_company_member(company_id));
drop policy if exists "locations_insert_manager" on public.locations;
create policy "locations_insert_manager" on public.locations for insert with check (public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[]));
drop policy if exists "locations_update_manager" on public.locations;
create policy "locations_update_manager" on public.locations for update using (public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])) with check (public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[]));
drop policy if exists "locations_delete_admin" on public.locations;
create policy "locations_delete_admin" on public.locations for delete using (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));

drop policy if exists "assets_select_member" on public.assets;
create policy "assets_select_member" on public.assets for select using (public.is_company_member(company_id));
drop policy if exists "assets_insert_allowed" on public.assets;
create policy "assets_insert_allowed" on public.assets for insert with check (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or (public.is_company_member(company_id) and responsible_user_id = auth.uid())
);
drop policy if exists "assets_update_allowed" on public.assets;
create policy "assets_update_allowed" on public.assets for update using (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or responsible_user_id = auth.uid()
) with check (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or responsible_user_id = auth.uid()
);
drop policy if exists "assets_delete_admin" on public.assets;
create policy "assets_delete_admin" on public.assets for delete using (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));

drop policy if exists "obligation_types_select_visible" on public.obligation_types;
create policy "obligation_types_select_visible" on public.obligation_types for select using (company_id is null or public.is_company_member(company_id));
drop policy if exists "obligation_types_insert_manager" on public.obligation_types;
create policy "obligation_types_insert_manager" on public.obligation_types for insert with check (company_id is not null and public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[]));
drop policy if exists "obligation_types_update_manager" on public.obligation_types;
create policy "obligation_types_update_manager" on public.obligation_types for update using (company_id is not null and public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])) with check (company_id is not null and public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[]));
drop policy if exists "obligation_types_delete_admin" on public.obligation_types;
create policy "obligation_types_delete_admin" on public.obligation_types for delete using (company_id is not null and public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));

drop policy if exists "obligations_select_member" on public.obligations;
create policy "obligations_select_member" on public.obligations for select using (public.is_company_member(company_id));
drop policy if exists "obligations_insert_allowed" on public.obligations;
create policy "obligations_insert_allowed" on public.obligations for insert with check (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or (public.is_company_member(company_id) and responsible_user_id = auth.uid())
);
drop policy if exists "obligations_update_allowed" on public.obligations;
create policy "obligations_update_allowed" on public.obligations for update using (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or responsible_user_id = auth.uid()
) with check (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or responsible_user_id = auth.uid()
);
drop policy if exists "obligations_delete_admin" on public.obligations;
create policy "obligations_delete_admin" on public.obligations for delete using (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));

drop policy if exists "reminder_rules_select_member" on public.reminder_rules;
create policy "reminder_rules_select_member" on public.reminder_rules for select using (public.is_company_member(company_id));
drop policy if exists "reminder_rules_manage_manager" on public.reminder_rules;
create policy "reminder_rules_manage_manager" on public.reminder_rules for all using (public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])) with check (public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[]));

drop policy if exists "documents_select_member" on public.documents;
create policy "documents_select_member" on public.documents for select using (public.is_company_member(company_id));
drop policy if exists "documents_insert_allowed" on public.documents;
create policy "documents_insert_allowed" on public.documents for insert with check (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or (public.is_company_member(company_id) and uploaded_by = auth.uid())
);
drop policy if exists "documents_update_allowed" on public.documents;
create policy "documents_update_allowed" on public.documents for update using (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or uploaded_by = auth.uid()
) with check (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or uploaded_by = auth.uid()
);
drop policy if exists "documents_delete_allowed" on public.documents;
create policy "documents_delete_allowed" on public.documents for delete using (
  public.has_company_role(company_id, array['owner', 'admin', 'manager']::public.company_role[])
  or uploaded_by = auth.uid()
);

drop policy if exists "notifications_select_owner" on public.notifications;
create policy "notifications_select_owner" on public.notifications for select using (
  user_id = auth.uid()
  or public.has_company_role(company_id, array['owner', 'admin']::public.company_role[])
);
drop policy if exists "notifications_insert_service_member" on public.notifications;
create policy "notifications_insert_service_member" on public.notifications for insert with check (public.is_company_member(company_id));
drop policy if exists "notifications_update_owner" on public.notifications;
create policy "notifications_update_owner" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "notification_deliveries_select_accessible" on public.notification_deliveries;
create policy "notification_deliveries_select_accessible" on public.notification_deliveries for select using (public.can_access_notification(notification_id));
drop policy if exists "notification_deliveries_insert_accessible" on public.notification_deliveries;
create policy "notification_deliveries_insert_accessible" on public.notification_deliveries for insert with check (public.can_access_notification(notification_id));
drop policy if exists "notification_deliveries_update_admin" on public.notification_deliveries;
create policy "notification_deliveries_update_admin" on public.notification_deliveries for update using (public.can_access_notification(notification_id)) with check (public.can_access_notification(notification_id));

drop policy if exists "activity_logs_select_member" on public.activity_logs;
create policy "activity_logs_select_member" on public.activity_logs for select using (public.is_company_member(company_id));
drop policy if exists "activity_logs_insert_member" on public.activity_logs;
create policy "activity_logs_insert_member" on public.activity_logs for insert with check (public.is_company_member(company_id));

drop policy if exists "subscriptions_select_member" on public.subscriptions;
create policy "subscriptions_select_member" on public.subscriptions for select using (public.is_company_member(company_id));
drop policy if exists "subscriptions_update_owner" on public.subscriptions;
create policy "subscriptions_update_owner" on public.subscriptions for update using (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[])) with check (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));
drop policy if exists "subscriptions_insert_owner" on public.subscriptions;
create policy "subscriptions_insert_owner" on public.subscriptions for insert with check (public.has_company_role(company_id, array['owner', 'admin']::public.company_role[]));

insert into public.obligation_types (name, category, description, default_frequency_unit, default_frequency_value, icon, is_system_template)
values
  ('ITV', 'Vehiculos', 'Inspeccion tecnica periodica de vehiculos.', 'years', 1, 'car', true),
  ('Seguro', 'Seguros', 'Renovacion o revision de polizas.', 'years', 1, 'shield', true),
  ('Extintor', 'Seguridad', 'Revision periodica de extintores.', 'years', 1, 'flame', true),
  ('Revision electrica', 'Instalaciones', 'Revision legal o preventiva de instalaciones electricas.', 'years', 5, 'zap', true),
  ('Revision de aire acondicionado', 'Mantenimiento', 'Revision periodica de climatizacion.', 'years', 1, 'fan', true),
  ('Formacion PRL', 'Personal', 'Formacion obligatoria de prevencion de riesgos laborales.', 'years', 1, 'graduation-cap', true),
  ('Licencia', 'Legal', 'Renovacion o seguimiento de licencias.', 'years', 1, 'badge-check', true),
  ('Certificado', 'Legal', 'Gestion de certificados con caducidad.', 'years', 1, 'file-check', true),
  ('Contrato', 'Contratos', 'Seguimiento de renovaciones contractuales.', 'years', 1, 'file-signature', true),
  ('Dominio web', 'Digital', 'Renovacion de dominios web.', 'years', 1, 'globe', true),
  ('Certificado SSL', 'Digital', 'Renovacion de certificados SSL.', 'months', 3, 'lock', true),
  ('Mantenimiento preventivo', 'Mantenimiento', 'Planificacion de mantenimiento recurrente.', 'months', 6, 'wrench', true)
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'company-documents',
  'company-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "documents_storage_select_member" on storage.objects;
create policy "documents_storage_select_member"
on storage.objects for select
using (
  bucket_id = 'company-documents'
  and public.is_company_member(public.storage_company_id(name))
);

drop policy if exists "documents_storage_insert_allowed" on storage.objects;
create policy "documents_storage_insert_allowed"
on storage.objects for insert
with check (
  bucket_id = 'company-documents'
  and public.has_company_role(public.storage_company_id(name), array['owner', 'admin', 'manager', 'member']::public.company_role[])
);

drop policy if exists "documents_storage_update_allowed" on storage.objects;
create policy "documents_storage_update_allowed"
on storage.objects for update
using (
  bucket_id = 'company-documents'
  and public.has_company_role(public.storage_company_id(name), array['owner', 'admin', 'manager']::public.company_role[])
)
with check (
  bucket_id = 'company-documents'
  and public.has_company_role(public.storage_company_id(name), array['owner', 'admin', 'manager']::public.company_role[])
);

drop policy if exists "documents_storage_delete_allowed" on storage.objects;
create policy "documents_storage_delete_allowed"
on storage.objects for delete
using (
  bucket_id = 'company-documents'
  and public.has_company_role(public.storage_company_id(name), array['owner', 'admin', 'manager']::public.company_role[])
);
