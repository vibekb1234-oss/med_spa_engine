# MedSpa Growth Engine System Assets

This folder is the operator map for the whole build. It does not add any runtime complexity. It exists so the system can be edited, re-skinned, handed off, or rebuilt for another niche without hunting through every HTML file.

## Read Order

1. `ASSET_REGISTRY.md` - master map for design, website, dashboard, workflow, sales, delivery, security, and launch assets.
2. `DESIGN_ASSETS.md` - fonts, colors, gradients, spacing, radii, icons, and theme rules.
3. `FRONTEND_MAP.md` - every visible page, its job, source file, and preview URL.
4. `WORKFLOW_MAP.md` - all 8 n8n workflows, triggers, webhooks, and what each workflow owns.
5. `DATA_AND_STORAGE.md` - Google Sheet tabs, dashboard localStorage keys, and client data boundaries.
6. `INTEGRATIONS_AND_SECRETS.md` - API keys, webhook secrets, OAuth, and what must stay private.
7. `SECURITY_LAUNCH_GUARDRAILS.md` - public/private deployment boundary, access control, secrets, and data rules.
8. `COPY_AND_OFFER_ASSETS.md` - sales copy, offer docs, outreach assets, and where messaging lives.
9. `LAUNCH_OPERATIONS.md` - launch checks, daily operation, backup, and handoff rhythm.
10. `AI_AGENT_MAP.md` - dashboard Recovery Assistant behavior, safe actions, and optional n8n AI webhook.
11. `../operations/README.md` - sales, lead finding, closing, delivery SOPs, retention, scorecards, and task tracking.

## Source Of Truth Rules

- Design values live in `design/Tokens.md` and `assets/brand-tokens.css`.
- Dashboard app tokens are scoped inside `dashboard/index.html` because the dashboard is a single-file app.
- Public page tokens are shared through `assets/brand-tokens.css`.
- Workflow behavior lives in `workflows/*.json`; setup instructions live in `setup/Setup_Guide.md`.
- Google Sheets remains the clinic data source. The dashboard is a renderer and control panel.
- Secrets are never committed with real values. Use placeholders in files and paste real values during setup.
- Public hosting must not expose the dashboard or operator tools unless the route is behind host-level access control.

## Folder Ownership

| Folder | Owns | Runtime? |
|---|---|---|
| `landing/` | Public sales landing page | Yes |
| `booking/` | Booking/contact handoff page | Yes |
| `dashboard/` | Client-facing operating dashboard | Yes |
| `onboarding/` | Operator onboarding/setup walkthrough | Yes |
| `tools/` | System check and utility tools | Yes |
| `setup/` | Setup scripts, forms, configurator, handoff docs | Mixed |
| `workflows/` | n8n workflow templates | Imported into n8n |
| `assets/` | Shared visual assets and public CSS tokens | Yes |
| `design/` | Design system documentation | No |
| `outreach/` | Sales, proof, and campaign assets | Mixed |
| `operations/` | GTM, delivery, retention, and task-tracking operating system | No |
| `legal/` | Public legal pages | Yes |
| `system/` | System asset registry and maintenance map | No |
