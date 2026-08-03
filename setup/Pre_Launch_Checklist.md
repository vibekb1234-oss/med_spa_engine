# MedSpa Growth Engine - Pre-Launch Checklist

Keep this simple. Do not launch a clinic until every item below is checked.

## Client Inputs

- Clinic name, sender email, booking link, Google review link, timezone.
- Treatment menu and any treatment prep notes they want included.
- Current appointment volume, average treatment value, rough no-show estimate.
- Current Google review count.
- Confirmed permission to email clients and leads.
- Approved referral/discount language.

## Data Rules

- Store only operational data in Sheets: contact info, service interest, appointment status, visit count, spend, lead source, review/referral flags.
- Do not store medical history, consent forms, prescriptions, before/after photos, payment card data, or detailed clinical notes.
- Use service categories in emails, not sensitive medical language.
- Add opt-out handling before sending reactivation or promotional campaigns at scale.

## Technical Setup

- Google Sheet created from `MedSpa_Engine.gs`.
- Clients tab includes `Opted Out` and `Last Promo Month`.
- Appointments tab includes `24hr Reminder Sent`.
- Google Sheets API key is restricted to the dashboard URL/referrer and Google Sheets API only.
- Unique webhook secret generated for this clinic.
- n8n Gmail OAuth and Google Sheets OAuth connected.
- All 8 workflows imported and activated.
- Error workflow configured for Workflows 1-6 and 8.
- Dashboard settings saved.
- Dashboard backup exported.

## Smoke Tests

- Submit test intake form and confirm client row, client email, clinic alert, and activity log.
- Send booking confirmation from dashboard.
- Mark test appointment complete and confirm review/referral workflow accepts the webhook.
- Drag or update one client status in the dashboard and confirm it persists.
- Run follow-up workflow with demo data and confirm duplicate-send flags are respected.
- Trigger or simulate one workflow error and confirm owner alert/log entry.
- Review one weekly report email for broken fields.

## Go-Live Rules

- Start with a small live batch if importing existing clients.
- Monitor the first 7 days daily.
- Review all outbound copy with the clinic before activating retention/promotional sends.
- Any custom booking-system integration, SMS, ads, website edits, or new workflow is separate scope.

