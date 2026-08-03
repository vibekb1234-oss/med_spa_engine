# Supabase Setup - MedSpa Growth Engine

This folder contains the launch schema for the optional Supabase auth/profile foundation.

## Environment Variables

Set these in Vercel project settings:

```text
SUPABASE_PROJECT_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_PUBLIC_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
SUPABASE_DB_PASSWORD=store-this-in-supabase-vercel-only-never-browser-code
VERCEL_PROJECT_NAME=medspa-growth-engine
PRODUCTION_DOMAIN=https://your-domain.com
```

Only `SUPABASE_PROJECT_URL` and `SUPABASE_ANON_PUBLIC_KEY` are returned to the browser by `/api/public-env`. The database password and service-role keys must never be exposed to HTML, JavaScript, screenshots, or public docs.

## Install SQL

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `launch/supabase/schema.sql`.
4. Confirm RLS is enabled on:
   - `profiles`
   - `business_profiles`
   - `backend_configs`
   - `onboarding_records`
   - `activity_logs`
5. In Authentication settings, enable the sign-in methods you want:
   - Email/password
   - Magic link
   - Google OAuth
6. Add redirect URLs:
   - `https://YOUR_DOMAIN/auth/callback`
   - `http://127.0.0.1:8765/auth/callback` for local testing if needed

## Active Subscription Tiers

The SQL seeds `subscription_plans` with active Starter, Growth, Pro, and Enterprise tiers. Profiles reference those tiers through the `profiles.tier` field, while `profiles.subscription_status` controls whether the dashboard is usable.

The browser may read active plan rows after login, but users cannot upgrade themselves by editing protected profile fields. Tier/status changes should come from the operator, Stripe/billing webhook, or another secure server-side process.
## Profile Model

The dashboard can use these fields to adapt per user:

- `tier`: `starter`, `growth`, `pro`, `enterprise`
- `subscription_status`: `trialing`, `active`, `past_due`, `paused`, `cancelled`
- `deployment_status`: `pending`, `kickoff_scheduled`, `in_deployment`, `live`, `paused`, `churned`

Users can update safe identity fields. Protected commercial fields should be changed only by the operator, billing webhook, or secure backend process.

## Safe Client-Side Profile Read

```js
const { data: { user } } = await supabase.auth.getUser();
const { data: profile } = await supabase
  .from('profiles')
  .select('name,email,company_name,phone,tier,subscription_status,deployment_status')
  .eq('user_id', user.id)
  .single();
```

## Safe Client-Side Profile Update

```js
await supabase
  .from('profiles')
  .update({ name, company_name, phone, last_seen_at: new Date().toISOString() })
  .eq('user_id', user.id);
```

Do not let users update `tier`, `subscription_status`, `deployment_status`, or `role` from the browser.

## Per-Client Backend Config

Each client gets one `backend_configs` row. It can store non-secret routing/config values such as sheet IDs and webhook URLs. Keep actual secrets in approved backend tools, n8n credentials, Vercel environment variables, or Supabase vault/server-side processes.

Do not store service-role keys in this table.
