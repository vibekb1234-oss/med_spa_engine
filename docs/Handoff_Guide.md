# Handoff Guide

This guide explains what the operator should hand to a client or future maintainer after setup.

## Public Routes

- `/` landing page
- `/book` revenue leak snapshot page
- `/privacy`
- `/terms`
- `/login`
- `/signup`
- `/reset`
- `/dashboard` protected dashboard

## Private Assets

Do not expose these publicly without protection:

- `dashboard/`
- `setup/`
- `tools/`
- `operations/`
- `system/`
- `workflows/`
- `swarm-output/`
- raw markdown docs
- exported dashboard backups

## Required Client Values

- Clinic name
- Clinic email
- Clinic phone
- Timezone
- Booking URL
- Google review link
- Services/treatments
- Sending identity
- Compliance wording restrictions

## Required Operator Values

- Restricted Google Sheets API key
- Google Sheet ID
- n8n webhook URLs
- Webhook secret
- Gmail OAuth credential
- Google Sheets OAuth credential
- Dashboard protected URL
- Dashboard backup JSON

## Final Handoff Package

- Dashboard URL
- Support contact
- Weekly reporting cadence
- Scope boundaries
- Escalation path
- First 30-day monitoring schedule
- Known limitations and add-on opportunities

## Restore Notes

1. Restore Google Sheet from backup/snapshot.
2. Import archived n8n workflow JSON files.
3. Reconnect OAuth credentials.
4. Restore dashboard config backup.
5. Rotate webhook secret if any backup was exposed.
6. Run system check before resuming live sends.
