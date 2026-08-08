-- MedSpa Growth Engine launch schema
-- Run this in Supabase SQL Editor after creating the project.
-- Keep service-role keys out of frontend code. This schema expects browser code to use anon key + RLS.

create extension if not exists pgcrypto;

do $$ begin
  create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'paused', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.deployment_status as enum ('pending', 'kickoff_scheduled', 'in_deployment', 'live', 'paused', 'churned');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.subscription_tier as enum ('starter', 'growth', 'pro', 'enterprise');
exception when duplicate_object then null;
end $$;

create table if not exists public.subscription_plans (
  tier public.subscription_tier primary key,
  name text not null,
  monthly_price_usd integer,
  setup_price_usd integer,
  is_active boolean not null default true,
  feature_summary text not null,
  features jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.subscription_plans (tier, name, monthly_price_usd, setup_price_usd, feature_summary, features)
values
  ('starter', 'Starter Recovery OS', 800, 3000, 'Core dashboard, intake, basic client portal, system check, and recovery workflow visibility.', '["Dashboard access", "Lead intake", "Basic client portal", "System check", "No-show and review workflow visibility"]'),
  ('growth', 'Growth Recovery OS', 1500, 5000, 'Starter plus partner/referral layer, daily brief, reporting, and stronger retention operations.', '["Everything in Starter", "Partner/referral portal", "Daily brief", "Weekly reporting", "Retention and reactivation workflows"]'),
  ('pro', 'Pro Recovery OS', 2000, 7000, 'Growth plus AI assistant, advanced automations, deeper analytics, and renewal/retention support.', '["Everything in Growth", "AI operator assistant", "Advanced automations", "Deeper analytics", "Renewal and VIP retention layer"]'),
  ('enterprise', 'Enterprise Recovery OS', null, null, 'Custom multi-location recovery operations with deeper workflow and reporting coverage.', '["Everything in Pro", "Custom multi-location setup", "Custom workflow routing", "Executive reporting", "Priority operator support"]')
on conflict (tier) do update set
  name = excluded.name,
  monthly_price_usd = excluded.monthly_price_usd,
  setup_price_usd = excluded.setup_price_usd,
  is_active = true,
  feature_summary = excluded.feature_summary,
  features = excluded.features,
  updated_at = now();
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text not null,
  company_name text,
  phone text,
  tier public.subscription_tier not null default 'starter',
  subscription_status public.subscription_status not null default 'trialing',
  deployment_status public.deployment_status not null default 'pending',
  role text not null default 'client_admin' check (role in ('client_admin','client_staff','operator','viewer')),
  avatar_url text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  clinic_name text,
  clinic_email text,
  clinic_phone text,
  city text,
  state_region text,
  country text default 'US',
  timezone text default 'America/New_York',
  booking_system text,
  booking_url text,
  review_link text,
  primary_services text[] default '{}',
  average_treatment_value numeric(12,2),
  monthly_inquiries integer,
  monthly_appointments integer,
  no_show_rate numeric(5,2),
  lapsed_client_count integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.backend_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  google_sheet_id text,
  dashboard_origin text,
  lead_intake_webhook_url text,
  mark_complete_webhook_url text,
  booking_confirmation_webhook_url text,
  status_update_webhook_url text,
  ai_agent_webhook_url text,
  n8n_instance_label text,
  webhook_secret_hint text,
  config_status text not null default 'not_configured' check (config_status in ('not_configured','partial','configured','paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.onboarding_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kickoff_scheduled_at timestamptz,
  intake_completed boolean not null default false,
  oauth_connected boolean not null default false,
  sheet_created boolean not null default false,
  workflows_imported boolean not null default false,
  error_workflow_wired boolean not null default false,
  dashboard_configured boolean not null default false,
  qa_passed boolean not null default false,
  launch_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.activity_logs (
  id bigint generated by default as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  event_source text not null default 'dashboard',
  severity text not null default 'info' check (severity in ('info','warning','error','success')),
  message text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists business_profiles_updated_at on public.business_profiles;
create trigger business_profiles_updated_at before update on public.business_profiles for each row execute function public.set_updated_at();
drop trigger if exists backend_configs_updated_at on public.backend_configs;
create trigger backend_configs_updated_at before update on public.backend_configs for each row execute function public.set_updated_at();
drop trigger if exists onboarding_records_updated_at on public.onboarding_records;
create trigger onboarding_records_updated_at before update on public.onboarding_records for each row execute function public.set_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, email, name, company_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'phone'
  ) on conflict (user_id) do nothing;

  insert into public.business_profiles (user_id, clinic_name, clinic_email, clinic_phone)
  values (new.id, new.raw_user_meta_data->>'company_name', coalesce(new.email, ''), new.raw_user_meta_data->>'phone')
  on conflict (user_id) do nothing;

  insert into public.backend_configs (user_id)
  values (new.id) on conflict (user_id) do nothing;

  insert into public.onboarding_records (user_id)
  values (new.id) on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_profile_for_new_user();

alter table public.subscription_plans enable row level security;
alter table public.profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.backend_configs enable row level security;
alter table public.onboarding_records enable row level security;
alter table public.activity_logs enable row level security;

-- Subscription plans: visible to signed-in users so dashboard tier states are backed by Supabase.
drop policy if exists "subscription_plans_read_authenticated" on public.subscription_plans;
create policy "subscription_plans_read_authenticated" on public.subscription_plans for select using (auth.role() = 'authenticated' and is_active = true);
-- Profiles: clients can read their own profile and update only safe self-service fields.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);

drop policy if exists "profiles_update_safe_own" on public.profiles;
create policy "profiles_update_safe_own" on public.profiles for update using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and tier = (select tier from public.profiles p where p.user_id = auth.uid())
  and subscription_status = (select subscription_status from public.profiles p where p.user_id = auth.uid())
  and deployment_status = (select deployment_status from public.profiles p where p.user_id = auth.uid())
  and role = (select role from public.profiles p where p.user_id = auth.uid())
);

-- Client-owned tables.
drop policy if exists "business_profiles_own_all" on public.business_profiles;
create policy "business_profiles_own_all" on public.business_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "backend_configs_select_own" on public.backend_configs;
create policy "backend_configs_select_own" on public.backend_configs for select using (auth.uid() = user_id);

drop policy if exists "backend_configs_update_own_safe" on public.backend_configs;
create policy "backend_configs_update_own_safe" on public.backend_configs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "backend_configs_insert_own" on public.backend_configs;
create policy "backend_configs_insert_own" on public.backend_configs for insert with check (auth.uid() = user_id);

drop policy if exists "onboarding_records_select_own" on public.onboarding_records;
create policy "onboarding_records_select_own" on public.onboarding_records for select using (auth.uid() = user_id);

drop policy if exists "activity_logs_select_own" on public.activity_logs;
create policy "activity_logs_select_own" on public.activity_logs for select using (auth.uid() = user_id);

drop policy if exists "activity_logs_insert_own" on public.activity_logs;
create policy "activity_logs_insert_own" on public.activity_logs for insert with check (auth.uid() = user_id);

create index if not exists idx_activity_logs_user_created on public.activity_logs(user_id, created_at desc);
create index if not exists idx_profiles_subscription on public.profiles(subscription_status, tier, deployment_status);
create index if not exists idx_subscription_plans_active on public.subscription_plans(is_active);

-- Operator note:
-- Protected commercial fields such as tier, subscription_status, deployment_status, and role
-- should be changed only from Supabase dashboard, server-side scripts, Stripe webhooks, or service-role backend jobs.

-- Revenue Leak Audit booking/reminder state.
-- Server-side only. n8n should access these tables with a service role key.

do $$ begin
  create type public.audit_booking_status as enum ('scheduled', 'cancelled', 'rescheduled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.audit_reminder_type as enum ('confirmation', 'three_day', 'one_day', 'thirty_minute', 'fifteen_minute');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.audit_reminder_status as enum ('scheduled', 'sent', 'skipped', 'cancelled', 'failed');
exception when duplicate_object then null;
end $$;

create table if not exists public.audit_bookings (
  id uuid primary key default gen_random_uuid(),
  calendly_event_id text,
  calendly_invitee_id text,
  first_name text,
  email text not null,
  clinic_name text,
  event_start_time timestamptz,
  event_end_time timestamptz,
  event_timezone text,
  meeting_link text,
  status public.audit_booking_status not null default 'scheduled',
  raw_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_reminder_logs (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.audit_bookings(id) on delete cascade,
  reminder_type public.audit_reminder_type not null,
  scheduled_for timestamptz,
  sent_at timestamptz,
  status public.audit_reminder_status not null default 'scheduled',
  provider_message_id text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists audit_bookings_updated_at on public.audit_bookings;
create trigger audit_bookings_updated_at before update on public.audit_bookings for each row execute function public.set_updated_at();

drop trigger if exists audit_reminder_logs_updated_at on public.audit_reminder_logs;
create trigger audit_reminder_logs_updated_at before update on public.audit_reminder_logs for each row execute function public.set_updated_at();

alter table public.audit_bookings enable row level security;
alter table public.audit_reminder_logs enable row level security;

create index if not exists idx_audit_bookings_status_start on public.audit_bookings(status, event_start_time);
create index if not exists idx_audit_bookings_email on public.audit_bookings(email);
create unique index if not exists idx_audit_bookings_calendly_invitee_unique on public.audit_bookings(calendly_invitee_id);
create index if not exists idx_audit_reminder_logs_status_scheduled on public.audit_reminder_logs(status, scheduled_for);
create index if not exists idx_audit_reminder_logs_booking_type on public.audit_reminder_logs(booking_id, reminder_type);
create unique index if not exists idx_audit_reminder_logs_booking_type_unique on public.audit_reminder_logs(booking_id, reminder_type);

-- No public policies are intentionally added for audit_bookings or audit_reminder_logs.
-- These tables store booking/reminder operations and should only be accessed server-side.
