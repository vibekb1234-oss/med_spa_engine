# Calendly Setup - Revenue Leak Audit

## Event

Name: `Revenue Leak Audit`

Duration: `30 minutes`

Slug: `revenue-leak-audit`

URL: `https://calendly.com/medspaagrowth/revenue-leak-audit`

Primary booking page: `/book`

## Event Description

Use this in Calendly:

```text
During this 30-minute Revenue Leak Audit, we will review how your medspa currently handles lead follow-up, consultation conversion, no-show recovery, rebooking, and patient reactivation.

This is a working audit focused on finding revenue leakage in your current process, not a software demo.

You do not need to prepare anything in detail. If you know roughly how leads, consultations, and patient follow-up are currently handled, that is enough.
```

## Invitee Questions

Required:

- Name
- Email
- Phone
- Clinic name

Optional:

- City / state
- Approximate leads per month
- Approximate consultations per month
- Biggest follow-up or revenue leakage issue

## Confirmation Page

Use the standard Calendly confirmation page.

Do not auto-redirect after booking.

Optional link:

- Label: `What To Expect During Your Audit`
- URL: `https://YOUR-DOMAIN.com/thanks`

## Webhook

Create a Calendly webhook for:

- `invitee.created`
- `invitee.canceled`

Point it to the n8n production webhook after importing:

```text
https://YOUR_N8N_DOMAIN/webhook/medspa-calendly-revenue-leak-audit-reminders
```

Store the webhook signing key in n8n as:

```text
MEDSPA_CALENDLY_WEBHOOK_SIGNING_KEY
```

## Reminder Ownership

Calendly sends the calendar invite and meeting link. n8n sends the branded MedSpa Growth Engine reminder emails.

Google/Calendly calendar invite emails cannot be fully styled. The branded HTML emails are sent from n8n/Gmail.

## Production Reminder Workflow

Use the complete confirmation/reminder workflow here:

```text
launch/calendly/Revenue_Leak_Audit_Reminder_Workflow.md
```

Import these n8n workflows:

```text
workflows/18_Calendly_Revenue_Leak_Audit_Reminders.json
workflows/19_Calendly_Revenue_Leak_Audit_Reminder_Dispatcher.json
```

Workflow 18 receives Calendly booking/cancel events and writes UTC-safe reminder rows.

Workflow 19 runs every minute, sends due reminders, and marks each row as `sent`, `skipped`, or `failed`.
