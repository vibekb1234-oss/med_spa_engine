# Revenue Leak Audit Confirmation + Reminder Workflow

## Workflow Summary

This workflow reduces no-shows for the `Revenue Leak Audit` Calendly event.

It is not a nurture sequence and not a sales sequence. The prospect has already booked. The only job is to confirm the booking, set expectations, make joining easy, and send calm reminders before the call.

Calendly event:

- Name: `Revenue Leak Audit`
- URL: `https://calendly.com/medspaagrowth/revenue-leak-audit`
- Duration: `30 minutes`

## Imported Workflows

Import both n8n workflows:

- `workflows/18_Calendly_Revenue_Leak_Audit_Reminders.json`
- `workflows/19_Calendly_Revenue_Leak_Audit_Reminder_Dispatcher.json`

Workflow 18 receives Calendly webhooks and creates reminder rows.

Workflow 19 runs every minute, sends due reminder rows, and updates the log.

## Required Environment Variables

Set these in n8n:

```text
MEDSPA_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
MEDSPA_SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
MEDSPA_BOOKING_TIMEZONE=America/Toronto
```

Do not use the Supabase anon key for these workflows. These tables are server-side only.

## Required Credentials

In n8n:

- Gmail OAuth credential named `MedSpa Gmail`
- Supabase access through HTTP Request nodes using env vars above

Replace the placeholder Gmail credential ID after importing Workflow 19.

## Calendly Webhook

Create a Calendly webhook for:

- `invitee.created`
- `invitee.canceled`

Point it to:

```text
https://YOUR_N8N_DOMAIN/webhook/medspa-calendly-revenue-leak-audit-reminders
```

## Reminder Schedule

All scheduling is stored in UTC.

Displayed email time is formatted using the invitee/event timezone when available.

| Reminder | Scheduled For | Rule |
|---|---:|---|
| Confirmation | Immediately | Always scheduled on valid booking |
| 3 days before | Event start minus 3 days | Skipped if already too late |
| 1 day before | Event start minus 1 day | Skipped if already too late |
| 30 minutes before | Event start minus 30 minutes | Skipped if already too late |
| 15 minutes before | Event start minus 15 minutes | Skipped if already too late |

The dispatcher never sends after the event start time.

## Reschedule + Cancellation Logic

Calendly reschedules usually produce a cancel event for the old invitee and a created event for the new time.

For every valid Calendly event:

1. Upsert the booking by `calendly_invitee_id`.
2. Cancel any existing pending reminders for that booking.
3. If the event is cancelled, stop there.
4. If scheduled, rebuild the reminder rows from the current event start time.
5. Upsert reminder rows by `(booking_id, reminder_type)` to prevent duplicates.

## Data Objects

### `audit_bookings`

Stores the booked audit.

Important fields:

- `calendly_event_id`
- `calendly_invitee_id`
- `first_name`
- `email`
- `clinic_name`
- `event_start_time`
- `event_end_time`
- `event_timezone`
- `meeting_link`
- `status`
- `raw_payload`

### `audit_reminder_logs`

Stores reminder state.

Important fields:

- `booking_id`
- `reminder_type`
- `scheduled_for`
- `sent_at`
- `status`
- `provider_message_id`
- `error_message`

Statuses:

- `scheduled`
- `sent`
- `skipped`
- `cancelled`
- `failed`

## Email Copy

The emails are intentionally calm, lightweight, and direct.

They include:

- MedSpa Growth Engine branding
- Event date and time
- Join Audit button
- Clear meeting link
- No hype
- No guaranteed revenue language
- No newsletter-style template

## QA Test Cases

Run these before activating:

1. Book an audit 5+ days away.
   - Expected: confirmation, 3-day, 1-day, 30-minute, and 15-minute logs are created.

2. Book an audit 20 hours away.
   - Expected: confirmation, 30-minute, and 15-minute logs are scheduled. 3-day and 1-day are skipped.

3. Book an audit 20 minutes away.
   - Expected: confirmation and 15-minute reminder only if still before event start.

4. Send the same Calendly payload twice.
   - Expected: no duplicate booking and no duplicate reminder rows.

5. Cancel a booking.
   - Expected: pending reminders become `cancelled`.

6. Reschedule a booking.
   - Expected: old pending reminders are cancelled and the new schedule is rebuilt from the new time.

7. Remove the meeting link in a test payload.
   - Expected: reminder is marked `failed`, not sent.

8. Let a reminder become due after the event start time.
   - Expected: reminder is marked `skipped`.

## Activation Checklist

- Supabase schema has been applied.
- n8n env vars are set.
- Gmail credential is connected.
- Workflow 18 webhook URL is added to Calendly.
- Workflow 18 is active.
- Workflow 19 is active.
- A test booking creates reminder rows.
- A test due reminder sends and marks `sent`.
- A test cancellation marks pending reminders `cancelled`.

