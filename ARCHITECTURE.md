# MedSpa Growth Engine — System Architecture

A complete map of how the system is wired: what runs where, how data flows, where secrets live, and what fails when.

---

## 1. One-sentence summary

A clinic's existing Gmail and Google Sheets become the operational backbone; n8n orchestrates 8 workflows on top of them; a self-hosted dashboard is the clinic owner's daily UI; four webhook endpoints stitch them all together with a shared secret.

---

## 2. Component map

```
                     ┌──────────────────────────────────────┐
                     │       CLINIC OWNER'S BROWSER          │
                     │                                       │
                     │   dashboard/index.html  (static)      │
                     │   - Login (SHA-256 hashed)            │
                     │   - 5 pages: Overview/Pipeline/       │
                     │     Clients/Analytics/Settings        │
                     │   - Kanban drag-drop                  │
                     │   - Bulk actions                      │
                     │   - Embedded chatbot (Coral)          │
                     └──────────────────────────────────────┘
                              │            │            │
                  reads via   │   POSTs    │   POSTs    │   POSTs
                 Sheets API   │   to       │   to       │   to
                 (API key)    │   wh #6    │   wh #8    │   wh ??
                              ▼            ▼            ▼
       ┌──────────────────┐  ┌────────────────────────────────────────┐
       │  GOOGLE SHEETS    │◀─┤            N8N CLOUD INSTANCE          │
       │  (per-clinic)     │  │  (clinic's account, ~$20/mo)           │
       │                   │  │                                        │
       │  Tabs:            │  │  Workflows (all active):               │
       │  - Clients        │  │  1. Lead Inquiry Intake    [webhook]   │
       │  - Appointments   │  │  2. Appointment Follow-Up  [daily 9am] │
       │  - Activity Log   │  │  3. Review & Referral      [webhook]   │
       │                   │  │  4. Client Reactivation          [monthly]   │
       │  Dashboard local  │  │  5. Weekly Report          [Mon 8am]   │
       │                   │  │  6. Booking Confirmation   [webhook]   │
       │  Apps Script:     │  │  7. Error Handler          [trigger]   │
       │  - MedSpa_Engine  │  │  8. Status Update          [webhook]   │
       │  - Custom menu    │  │                                        │
       │  - Setup helper   │  │  Credentials (OAuth2):                 │
       │  - Webhook calls  │──┤  - Google Sheets                       │
       │                   │  │  - Gmail                               │
       └──────────────────┘  └────────────────────────────────────────┘
                                        │              │
                                        ▼              ▼
                              ┌───────────────────────────────┐
                              │       GOOGLE WORKSPACE         │
                              │   (clinic's existing account)  │
                              │   - Gmail (sender = clinic)    │
                              │   - Drive (Sheet storage)      │
                              └───────────────────────────────┘
                                        ▲
                                        │ Intake form POST (Workflow 1)
                                        │
                              ┌───────────────────────────────┐
                              │  CLIENT INTAKE FORM (public)   │
                              │  setup/Client_Intake_Form.html │
                              │  Hosted alongside dashboard    │
                              └───────────────────────────────┘
```

---

## 3. Data flow — the four critical paths

### 3.1 New inquiry → personalized response
```
Prospect submits intake form
   ↓ POST + X-Webhook-Secret
n8n Workflow 1 (Lead Inquiry Intake)
   ↓ writes new row
Google Sheet → Clients tab
   ↓ Gmail send via OAuth
Personalized service-info email to prospect
   ↓ Gmail send via OAuth
Clinic alert email to owner
   ↓ writes log row
Google Sheet → Activity Log
```

### 3.2 Booking confirmed → confirmation email
```
Clinic owner clicks "📧 Confirm" in dashboard
   ↓ POST + X-Webhook-Secret
n8n Workflow 6 (Booking Confirmation)
   ↓ reads appointment row
Google Sheet → Appointments tab
   ↓ Gmail send via OAuth
Booking confirmation email to client
   ↓ writes log row
Google Sheet → Activity Log
```

### 3.3 Daily reminder + recovery cycle
```
n8n cron triggers Workflow 2 at 9am clinic-tz
   ↓ reads all relevant appointments
Google Sheet → Appointments tab
   ↓ for each → check "24hr Reminder Sent" flag
   ↓ if not sent → mark flag FIRST, then send (idempotency)
Multiple Gmail sends:
   - 48hr reminders
   - 24hr final reminders
   - Same-day no-show recovery
   - Next-day post-treatment check-ins
   - Inquiry follow-up nudges
   ↓ writes log rows
Google Sheet → Activity Log
```

### 3.4 Kanban drag → status persistence
```
Clinic owner drags client card across kanban columns in dashboard
   ↓ optimistic UI update + POST + X-Webhook-Secret
n8n Workflow 8 (Status Update)
   ↓ validates status enum
   ↓ writes update
Google Sheet → Clients tab (new status)
   ↓ writes log row
Google Sheet → Activity Log
   ↓ HTTP 200 back to dashboard
Dashboard confirms persist (or rolls back UI on 4xx/5xx)
```

---

## 4. Where the secrets live

| Secret | Stored in | Used by | Rotation rule |
|---|---|---|---|
| `WEBHOOK_SECRET` | Apps Script constant + n8n workflow credentials + dashboard Settings localStorage | All 4 webhook calls between dashboard/Apps Script/n8n | Rotate per-client install. Never reuse across clinics. |
| Google Sheets API key | Dashboard Settings localStorage | Direct browser reads of public Sheet ranges | Restricted to Sheets API + HTTP referrer = dashboard domain |
| Sheet ID | Dashboard Settings localStorage + n8n workflow nodes + Apps Script bound to Sheet | All Sheet reads/writes | Static for life of clinic |
| Google Sheets OAuth credential | n8n credential store (per-clinic n8n) | All workflows that touch Sheets | OAuth refresh handled by n8n; revoke from Google Account if compromised |
| Gmail OAuth credential | n8n credential store (per-clinic n8n) | All workflows that send email | Same as above |
| Dashboard admin passcode | Browser localStorage (SHA-256 hashed) | Dashboard login | Owner controls via Settings → Account |
| 4 webhook URLs (#1, #3, #6, #8) | Dashboard Settings localStorage + intake form embed | Routing from frontend to n8n | Regenerate by toggling the webhook node in n8n |

**Plain-text handling:** raw passcodes are never persisted. The dashboard stores the API key, webhook URLs, and webhook secret in browser localStorage for the clinic operator, so each install must use a restricted Sheets API key, a per-client webhook secret, and a trusted browser profile.

---

## 5. Trust boundaries

- **Public, untrusted:** `landing/`, `booking/`, `legal/`. Anyone on the internet can hit these. The public booking page uses a prefilled email handoff until you connect a scheduler or form endpoint.
- **Clinic-owned/static embed:** `setup/Client_Intake_Form.html`. This posts directly to n8n with `X-Webhook-Secret`, so deploy it only on a clinic-controlled page or replace it with a small server-side proxy before using it as a broad public form.
- **Authenticated, semi-trusted:** `dashboard/` after login. Holds API key and webhook secret in localStorage. Compromise of one browser = compromise of one clinic's data.
- **Service-to-service, authenticated:** all dashboard↔n8n and Apps Script↔n8n calls use `X-Webhook-Secret`. n8n rejects requests without it.
- **OAuth-scoped, fully trusted:** n8n↔Google Workspace. Scopes are minimum-needed (Sheets read/write, Gmail send).

---

## 6. Failure modes — what fails when

| Failure | Symptom | Recovery |
|---|---|---|
| n8n cloud down | Workflows don't fire. No emails sent. Webhooks 5xx. | Wait for provider. Workflow 7 won't fire either — set up external uptime monitor to catch this. |
| Google API down | Sheet reads fail. Workflows error. | Wait. Workflow 7 emails Bibek. |
| Gmail OAuth refresh fails | Sending workflows error. Inbound webhooks still process. | Re-auth Gmail credential in n8n. Workflow 7 catches it first. |
| Webhook secret rotated only on one side | Dashboard kanban silently fails to persist. | Restore secret on both sides; check dashboard browser console for 401s. |
| API key restricted incorrectly | Dashboard shows empty data. | Verify referrer/API restrictions in Google Cloud Console. |
| Sheet renamed or moved | Dashboard breaks. Workflows error. | Update Sheet ID in dashboard Settings + n8n workflow nodes. |
| Apps Script unauthorized | `setupMedSpaEngine` fails on re-run. | Re-authorize via Apps Script editor. |
| Browser localStorage cleared | Dashboard config gone. | Restore from the exported config JSON (Settings → System → Import). |
| Forgot dashboard passcode | Owner locked out. | Clear `mge_admin_hash` from localStorage to trigger first-run again. |
| First time setup forgot a webhook URL | One of the 4 button paths in dashboard silently does nothing. | Settings → System → re-enter URLs. Check `tools/system-check.html`. |
| Duplicate reminder emails | "Mark before send" failed. | Check Workflow 2 — ensure "24hr Reminder Sent" Sheets update runs BEFORE Gmail Send. |

---

## 7. Scaling notes

- **One clinic = one Sheet + one n8n instance.** Multi-tenant is intentionally rejected. It makes data boundaries explicit, keeps each clinic's data in their own Google Workspace, and avoids the migration nightmare of a shared SaaS backend.
- **Per-clinic cost scales linearly.** ~$20/mo n8n + $0 Google (under free quotas at MGE volumes). At 30+ clinics, consider self-hosted n8n on a $5/mo VPS to drop costs.
- **Email volume sanity check:** 100 active clients × 3 emails/week ≈ 300/week ≈ 1,200/month per clinic. Gmail's free Workspace seat allows up to 2,000 sends/day. Plenty of headroom.

---

## 8. What the system is NOT

- Not a booking platform. Jane/Fresha/Mindbody/Square stay as the booking source of truth.
- Not an EHR. No medical records, no photos, no diagnoses ever enter the Sheet.
- Not HIPAA-covered. The Client warrants no PHI in the data they push to the Sheet.
- Not SMS-capable in the v1 scope. SMS is a separately-scoped add-on (Twilio + opt-in flows).
- Not a SaaS. There is no shared backend. Cancellations don't lose data — the clinic owns the Sheet and the n8n workflows.

---

## 9. Update cadence

This document tracks the architecture as-deployed. Whenever a workflow is added, a credential changes, or a webhook is renamed, update sections 2, 3, and 4. The diagram in section 2 is the canonical mental model — keep it true.
