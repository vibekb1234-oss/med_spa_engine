# Pre-Handoff QA Checklist

Run this before a prospect, client, or operator receives final access.

## Public Website

- [ ] `/` loads the landing page.
- [ ] `/book` loads the booking page.
- [ ] `/privacy` and `/terms` load.
- [ ] Header stays fixed.
- [ ] Mobile drawer works at 390px width.
- [ ] Light/dark theme works.
- [ ] All CTA buttons route somewhere real.
- [ ] Screenshot carousel images load and expand.
- [ ] No visible placeholder text.
- [ ] No horizontal overflow at mobile width.

## Auth

- [ ] `/login` loads with one Back to site control.
- [ ] `/signup` loads and uses absolute asset paths.
- [ ] `/reset` loads.
- [ ] `/auth/callback` loads.
- [ ] Auth pages are noindex/no-store.
- [ ] Missing Supabase env shows a safe setup error.
- [ ] No service-role key is present in frontend files.

## Dashboard

- [ ] Local preview works with `?preview=1`.
- [ ] Production dashboard redirects unauthenticated users to `/login`.
- [ ] Sidebar works on desktop.
- [ ] Mobile sidebar/drawer works.
- [ ] Tables/cards do not overflow mobile.
- [ ] Settings includes profile, connections, webhooks, automation/security/preferences/subscription/deployment status.
- [ ] Buttons perform real action, open real tool, scroll to a real section, or show locked state.
- [ ] Theme toggle is visible and not overlapping.

## Backend And Security

- [ ] Supabase `schema.sql` has been run.
- [ ] RLS is enabled for all launch tables.
- [ ] Users can only read/update own profile/config records.
- [ ] Protected subscription/deployment fields are not user-editable from browser.
- [ ] Vercel env vars are set.
- [ ] CSP does not block Supabase auth.
- [ ] Dashboard API key is restricted.
- [ ] Webhook secret rejects unauthenticated calls.
- [ ] Public pages do not expose internal docs, workflow JSON secrets, or client data.

## Workflow QA

- [ ] Workflow 1 lead intake tested.
- [ ] Workflow 2 appointment follow-up tested for duplicate prevention.
- [ ] Workflow 3 review/referral tested.
- [ ] Workflow 4 VIP retention tested with demo row.
- [ ] Workflow 5 weekly report tested.
- [ ] Workflow 6 booking confirmation tested.
- [ ] Workflow 7 error handler tested.
- [ ] Workflow 8 dashboard status update tested.

## Handoff

- [ ] Dashboard config backup exported.
- [ ] Client has support route.
- [ ] Weekly report timing confirmed.
- [ ] Scope exclusions reviewed.
- [ ] Owner action items documented.
