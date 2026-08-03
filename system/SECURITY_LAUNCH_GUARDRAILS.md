# Security Launch Guardrails

MedSpa Growth Engine is a lightweight managed operating system, not a heavy SaaS app. That keeps delivery simple, but the security boundary must be handled deliberately.

## Production Rule

The public deployment should serve only:

- `landing/`
- `booking/`
- `legal/`
- public assets required by those pages

The dashboard, setup tools, workflow files, operations docs, and internal system files are blocked in `netlify.toml`. The dashboard must only be shared behind host-level access control such as:

- Netlify password protection or Netlify Identity
- Cloudflare Access
- Vercel password protection
- a private client portal controlled by the operator

The dashboard's browser passcode is a convenience gate for the app UI. It is not a replacement for host-level access control.

## Data Boundary

The live clinic database is Google Sheets. The dashboard reads and writes through restricted browser keys and n8n workflows.

Do not store:

- medical records
- clinical photos
- treatment notes
- diagnosis details
- payment card data
- social security numbers or national ID numbers

The intended data is operational: client name, contact details, booking status, appointment timing, recovery stage, review/referral status, and outreach notes.

## Secret Rules

- Google API key: restrict to Google Sheets API only and the exact dashboard referrer.
- Webhook secret: use a unique secret per clinic.
- n8n credentials: keep OAuth credentials inside n8n, never in the repo.
- Backups: dashboard backups include users, API keys, webhook URLs, and secrets. Store them privately.
- AI agent: browser sends only a small dashboard context packet to the optional n8n AI webhook. Do not send PHI.

## Launch Gate

Before a real client is added, Settings -> System -> Launch readiness must show every check complete:

- dashboard host access protection
- restricted Google API key
- n8n OAuth connected
- workflow error handling wired
- demo data cleared
- privacy/terms reviewed

If any item is incomplete, the system can still be demoed locally, but it should not hold real clinic data.
