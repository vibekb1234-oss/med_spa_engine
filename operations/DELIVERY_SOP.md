# Delivery SOP

## Delivery Timeline

| Day | Milestone | Done when |
|---|---|---|
| Day 0 | Sales handoff | Scope, price, promised outcomes, and exclusions captured. |
| Day 1 | Intake + access | Google Workspace, n8n, review link, timezone, services, and owner email received. |
| Day 2 | Sheet + Apps Script | Sheet tabs created, Apps Script installed, secret generated. |
| Day 3 | Workflow import | Workflows 1-10 configured/imported, credentials connected. |
| Day 4 | Dashboard setup | Dashboard account, settings, webhooks, API key, and launch checklist configured. |
| Day 5 | QA | Intake, booking confirmation, mark complete, status update, and error handler tested. |
| Day 6 | Client handoff | Walkthrough completed, backup exported, support rules explained. |
| Day 7 | First report | Weekly report confirmed, improvement backlog started. |

## Sales Handoff Checklist

- Client name and clinic name
- Package purchased
- Setup fee and monthly retainer
- Primary pain
- Promised deliverables
- Exclusions
- Launch target date
- Decision maker
- Main operator/staff contact

## Intake Checklist

- Google Workspace access
- Google Sheet owner account
- n8n workspace
- Clinic owner email
- Clinic timezone
- Services list
- Booking link
- Google review link
- Existing lead sources
- Existing no-show/cancellation rules

## Build Checklist

- Create Google Sheet using `setup/Google_Sheets_Schema.md`.
- Install `setup/MedSpa_Engine.gs`.
- Generate unique webhook secret.
- Configure workflows with `setup/Workflow_Configurator.html`.
- Import workflows 1-10.
- Connect Google Sheets and Gmail credentials.
- Set Workflow 7 as the error handler.
- Set dashboard API key, Sheet ID, webhook URLs, and secret.
- Run `tools/system-check.html`.

## QA Checklist

- Submit intake form with configured webhook and secret.
- Confirm new client appears in Sheet.
- Confirm Workflow 1 sends inquiry email.
- Mark appointment complete from dashboard.
- Confirm Workflow 3 can send review/referral.
- Drag client status in pipeline.
- Confirm Workflow 8 writes status to Sheet.
- Force a workflow error.
- Confirm Workflow 7 logs and emails the error.
- Export dashboard backup after successful QA.

## Handoff Checklist

- Show owner dashboard Overview.
- Show Pipeline.
- Show Clients.
- Show Analytics.
- Show Settings and launch checks.
- Explain what the owner owns: Sheet, Gmail, n8n, dashboard config.
- Explain support boundaries.
- Send handoff email from `setup/Client_Handoff_Email.html`.

## Rollback

If a launch fails:

1. Pause affected n8n workflow.
2. Stop sending traffic to intake form.
3. Export dashboard backup.
4. Review n8n execution logs.
5. Fix credentials, webhook secret, or Sheet schema.
6. Re-run QA checklist before reactivating.
