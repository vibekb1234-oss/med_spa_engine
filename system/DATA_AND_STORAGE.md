# Data And Storage

The system uses Google Sheets as the live clinic database. The dashboard keeps only configuration, preferences, session state, and cached UI state in the browser.

## Google Sheet Tabs

| Tab | Purpose |
|---|---|
| `Clients` | Client CRM, lead status, service interest, contact info, VIP status, follow-up flags, spend/visit totals. |
| `Appointments` | Scheduled/completed/no-show appointment rows, appointment revenue, reminders, completion flow. |
| `Activity Log` | Automation events, errors, email actions, workflow actions, audit trail. |

Schema documentation:

- `setup/Google_Sheets_Schema.md`
- `setup/MedSpa_Engine.gs`
- `setup/Setup_Guide.md`

## Dashboard Browser Storage

| Key | Stores | Notes |
|---|---|---|
| `mge_users` | Dashboard user profiles/passcode hashes | Local to the browser. Not a SaaS auth store. |
| `mge_session` | Active local dashboard session | Invalid sessions are cleared safely on load. |
| `mge_config` | Clinic settings, Sheet ID, API key, webhook URLs, optional AI agent webhook, launch checks | Export backup after setup. |
| `mge_preferences` | Theme, density, user preferences | Used for dark/light mode and display choices. |
| `mge_notifications_seen` | Notification read state | UI-only state. |
| `mge_active_route` | Last dashboard section | UI convenience. |
| `mge_saved_filters` | Saved client filters | UI convenience. |
| `mge_assistant_tasks` | Recovery Assistant open/completed tasks | Local task queue for client/operator guidance. |

## Data Boundary

Do keep in the Sheet:

- Client name, email, phone
- Service interest
- Appointment date/time/status
- Public operational notes needed for follow-up
- Review/referral state
- Revenue totals needed for reporting

Do not keep in the Sheet:

- Medical records
- Consent forms
- Treatment photos
- Payment cards
- Clinical notes
- Sensitive health details that are not needed for marketing operations

## Backup Rule

After a client setup is complete:

1. Dashboard Settings -> System -> Backup & restore -> Export.
2. Save the backup with the client name and setup date.
3. Re-export after changing Sheet IDs, webhook URLs, clinic identity, or launch checklist state.
