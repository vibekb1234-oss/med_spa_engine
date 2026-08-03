# Integrations And Secrets

This file lists every external connection and where it is configured. Keep the system simple: no hidden backend, no secret sprawl.

## Required Integrations

| Integration | Used By | Required Value |
|---|---|---|
| Google Sheets API | Dashboard read access | Restricted browser API key + Sheet ID |
| Google Sheets OAuth | n8n workflow write/read actions | n8n credential ID |
| Gmail OAuth | n8n email sending | n8n credential ID |
| n8n webhooks | Intake, appointment complete, booking confirmation, status update | Four production webhook URLs |
| Google Business Profile | Review request flow | Clinic review link |

## Optional Integrations

| Integration | Used By | Required Value |
|---|---|---|
| n8n AI agent webhook | Dashboard Recovery Assistant fallback | Webhook URL stored in Settings -> System |

## Secret And Config Locations

| Value | Where It Goes |
|---|---|
| Google Sheets API key | Dashboard Settings -> System |
| Google Sheet ID | Dashboard Settings, Workflow Configurator, Apps Script |
| Google Sheets credential ID | Workflow Configurator |
| Gmail credential ID | Workflow Configurator |
| Webhook secret | Workflow Configurator, Dashboard Settings, Intake form, Apps Script |
| Lead intake webhook URL | Dashboard Settings, intake form deployment |
| Mark complete webhook URL | Dashboard Settings, Apps Script |
| Booking confirmation webhook URL | Dashboard Settings |
| Status update webhook URL | Dashboard Settings |
| AI agent webhook URL | Dashboard Settings, optional Recovery Assistant fallback |
| Review link | Workflow Configurator, Dashboard Settings, Apps Script |

## API Key Rule

The dashboard API key must be restricted in Google Cloud:

- Application restriction: HTTP referrer for the final hosted dashboard URL, or the approved local file/localhost path during testing.
- API restriction: Google Sheets API only.

If the key is not restricted, anyone with browser access can inspect it.

## Dashboard Access Rule

The dashboard must be protected by host-level access control before it holds real clinic data. Use Netlify password protection, Netlify Identity, Cloudflare Access, Vercel password protection, or a private client portal.

The in-browser passcode helps manage dashboard users after the app loads. It does not stop someone from downloading a publicly hosted static file, so it is not enough by itself for production.

The public Netlify config blocks `/dashboard/*`, `/tools/*`, `/onboarding/*`, `/system/*`, `/operations/*`, `/workflows/*`, and internal root files. If you intentionally deploy the dashboard for a client, do it on a protected dashboard domain or protected route.

## Backup Rule

Dashboard backup JSON files include users, API keys, webhook URLs, and secrets. Treat them like credentials:

- store them privately
- do not send them through public chat/email
- rotate the webhook secret if a backup is exposed

## Placeholder Rule

Committed files should only contain placeholders such as:

- `YOUR_MEDSPA_SHEET_ID`
- `YOUR_GSHEETS_CREDENTIAL_ID`
- `YOUR_GMAIL_CREDENTIAL_ID`
- `YOUR_WEBHOOK_SECRET`
- `YOUR_CLINIC_EMAIL@gmail.com`
- `YOUR_CLINIC_NAME`
- `YOUR_GOOGLE_REVIEW_LINK`

Real client values belong in n8n, Google Cloud, Apps Script, dashboard Settings, and the private setup backup.
