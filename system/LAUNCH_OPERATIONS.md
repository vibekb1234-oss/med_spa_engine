# Launch Operations

This file is the quick operator runbook once the assets are organized.

## Pre-Launch Checks

Use these files together:

- `LAUNCH_CHECKLIST.md`
- `LAUNCH_READINESS_REPORT.md`
- `setup/Pre_Launch_Checklist.md`
- `tools/system-check.html`
- Dashboard Settings -> System -> Launch readiness checklist

Required before a real client launch:

- Google Sheets API key is restricted.
- Google OAuth credentials are connected in n8n.
- Workflows 1-10 are configured and imported.
- Workflows 1, 3, 6, and 8 webhook URLs are saved in dashboard Settings.
- Workflow 7 is selected as the error workflow for Workflows 1-6 and 8.
- Demo data is cleared.
- Privacy/terms/contact details are reviewed.
- Dashboard backup is exported.

## Daily Use

| Role | Page | Action |
|---|---|---|
| Clinic/operator | Dashboard Overview | Check urgent alerts, daily activity, and key numbers. |
| Clinic/operator | Pipeline | Move leads/clients through stages. |
| Clinic/operator | Clients | Search clients, export, send confirmations, mark VIP. |
| Clinic/operator | Analytics | Review service mix, revenue, retention, and campaign performance. |
| Operator | Settings | Keep Sheet, webhook, clinic, and launch state clean. |

## Maintenance Rhythm

| Frequency | Action |
|---|---|
| Daily | Check dashboard alerts and Activity Log errors. |
| Weekly | Confirm Workflow 10 generated the Revenue Recovery List, then confirm Workflow 5 report sent and scan results. |
| Monthly | Review client reactivation flow and seasonal promo copy. |
| After setup changes | Export dashboard backup. |
| Before sending traffic | Re-run system check and test intake form. |

## Change Control

When making future edits:

1. Update the source file.
2. Update the matching `system/*.md` map if ownership or config changes.
3. If design tokens changed, update `design/Tokens.md`.
4. If workflow behavior changed, update `system/WORKFLOW_MAP.md` and `setup/Setup_Guide.md`.
5. Preview the affected page locally.

