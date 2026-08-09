# Client Deployment Runbook

Use this runbook for every MedSpa Growth Engine client install.

## 1. Sales Handoff

Capture:

- Clinic name
- Owner/contact name
- Sold tier
- Setup fee and monthly retainer
- Scope exclusions
- Launch target date
- Booking system
- Current pain: missed consults, no-shows, cold leads, reviews, referrals, lapsed VIP clients

Do not start delivery until setup fee is paid and scope is clear.

## 2. Account And Access

Required from client:

- Google Workspace/Gmail access for OAuth screen share
- Google review link
- Booking link
- Services/treatment menu
- Clinic timezone
- Approved sending name/signature
- Any compliance or wording restrictions

Operator creates:

- Google Sheet from schema
- n8n workflow import
- Per-client webhook secret
- Restricted Google Sheets API key
- Protected dashboard route
- Dashboard config backup

## 3. Build

1. Configure Google Sheet tabs from `setup/Google_Sheets_Schema.md`.
2. Install `setup/MedSpa_Engine.gs`.
3. Generate unique webhook secret.
4. Configure Workflows 1-10 through `setup/Workflow_Configurator.html`.
5. Import workflows into n8n.
6. Connect Google Sheets OAuth and Gmail OAuth.
7. Set Workflow 7 as the error handler.
8. Configure dashboard Settings.
9. Run `tools/system-check.html`.

## 4. QA

Must pass before go-live:

- Lead intake webhook creates client/activity rows.
- Booking confirmation webhook sends test email.
- Appointment complete webhook marks status and review/referral flow.
- Status update webhook persists dashboard changes.
- Error handler catches a forced workflow error.
- Dashboard config backup exports successfully.
- API key is restricted to Sheets API and dashboard domain.
- Dashboard route is protected at hosting level.

## 5. Handoff

Deliver:

- Dashboard URL
- Support boundaries
- Weekly report schedule
- What the clinic should update manually
- What the automation handles
- How to report issues
- First 14-day monitoring plan

## 6. Retainer

Weekly:

- Confirm report sent.
- Review workflow errors.
- Check no-show/cold-lead/VIP recovery movement.
- Send summary.

Monthly:

- Review client health.
- Recommend one improvement.
- Flag upsell only if it solves a real leak.
