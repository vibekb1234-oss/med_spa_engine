# Workflow Map

The backend is intentionally light: Google Sheets + Gmail + n8n. There is no SaaS database layer. These workflows are the automation engine.

## Workflow Inventory

| # | File | Trigger | Owns | Dashboard Dependency |
|---:|---|---|---|---|
| 1 | `workflows/1_MSG_Lead_Inquiry_Intake.json` | Webhook: `/webhook/msg-lead-intake` | New lead intake, client row creation, service-info email, clinic alert, activity log | Intake form URL in Settings |
| 2 | `workflows/2_MSG_Appointment_Follow_Up.json` | Daily schedule | Inquiry follow-ups, appointment reminders, no-show recovery | Sheet data only |
| 3 | `workflows/3_MSG_Review_Referral.json` | Webhook: `/webhook/msg-appointment-complete` | Mark complete, review request, referral prompt, activity logging | Mark complete URL in Settings |
| 4 | `workflows/4_MSG_VIP_Retention.json` | Monthly schedule | client reactivation and seasonal promos | Sheet data only |
| 5 | `workflows/5_MSG_Weekly_Performance_Report.json` | Weekly schedule | Weekly performance report email | Sheet data only |
| 6 | `workflows/6_MSG_Booking_Confirmation.json` | Webhook: `/webhook/msg-booking-confirmation` | Booking confirmation email | Booking confirmation URL in Settings |
| 7 | `workflows/7_MSG_Error_Handler.json` | n8n error workflow | Failure alerts and Activity Log error rows | Must be selected as error workflow for 1-6 and 8 |
| 8 | `workflows/8_MSG_Status_Update.json` | Webhook: `/webhook/msg-status-update` | Dashboard writes for status updates and bulk VIP actions | Status update URL in Settings |
| 10 | `workflows/10_MSG_Revenue_Recovery_Prioritization.json` | Weekly schedule | Weekly Revenue Recovery List: scans clients/appointments, scores opportunities, ranks next actions | `Revenue Recovery List` tab |

## Webhook Secret

The same webhook secret must be used in:

- `setup/Workflow_Configurator.html`
- n8n configured workflow files
- Dashboard Settings
- Intake form URL parameter or defaults
- `setup/MedSpa_Engine.gs`

Header name:

```text
X-Webhook-Secret
```

## Workflow Ownership Rules

- Workflow JSON files are templates. Do not paste real clinic credentials into committed workflow files.
- Any new write action from the dashboard should go through Workflow 8 unless it is clearly appointment-completion or booking-confirmation behavior already owned by Workflows 3 or 6.
- Workflow 7 must stay wired as the error workflow. Otherwise failures become silent and the dashboard looks healthier than the system really is.
- Workflows 1-9 are the client-facing Revenue Recovery engine.
- Workflow 10 is the prioritization layer that turns raw clients and appointments into a weekly action list.
- Workflows 18-21 are internal sales, audit, and assistant infrastructure.

