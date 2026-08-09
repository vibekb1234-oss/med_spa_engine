# MedSpa Growth Engine — Complete Setup Guide

**Estimated setup time: 30–45 minutes** (assumes you do the n8n OAuth steps during setup rather than pre-provisioning them).

Everything in this system is built. You're connecting accounts, pasting values into one configurator, and flipping switches.

---

## What You Need Before Starting

- A Google account for the clinic (Gmail + Google Sheets — all free)
- An n8n cloud account (~$20/month) at [n8n.io](https://n8n.io) — the $20 is paid by you, the operator; the clinic never sees n8n
- The clinic's Google Review link from their Google Business Profile
- The clinic's IANA timezone (e.g. `America/New_York`, `America/Los_Angeles`, `Europe/London`)

Before a real launch, review `../GTM_LAUNCH_GUARDRAILS.md` and `Pre_Launch_Checklist.md`. Keep sensitive medical details, before/after photos, consent forms, payment cards, and clinical notes out of Google Sheets and automated emails.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**
2. Rename it: **MedSpa Growth Engine**
3. **Extensions → Apps Script**
4. Delete all existing code in the editor
5. Open `setup/MedSpa_Engine.gs` from this folder, copy the whole file, paste into the Apps Script editor
6. **Fill in the constants at the top:**
   ```
   const N8N_WEBHOOK_COMPLETE = 'https://YOUR_N8N_DOMAIN/webhook/msg-appointment-complete';
   const GOOGLE_REVIEW_LINK   = 'https://g.page/r/XXXX/review';
   const CLINIC_NAME          = 'Your Clinic Name';
   const CLINIC_EMAIL         = 'hello@yourclinic.com';
   const BOOKING_SYSTEM_URL   = 'https://...'; // optional
   const WEBHOOK_SECRET       = 'paste the same secret used in Step 4';
   const CLINIC_TIMEZONE      = 'America/New_York';
   ```
   You'll fill in the N8N webhook URL in Step 6 and the webhook secret in Step 4. Everything else you can fill now.
7. Save the script (Ctrl+S) → click **Run** → select `onOpen` → approve permissions
8. Back to your Sheet → **refresh the page** — the **MedSpa ⚡** menu appears
9. Click **MedSpa ⚡ → Setup → ✅ Create All Tabs & Headers**

All 4 tabs (Clients, Appointments, Revenue Recovery List, Activity Log) are created with correct headers, column widths, dropdown validation, and colour formatting.

**Get your Sheet ID** from the URL bar:
```
https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SHEET_ID/edit
```

---

## Step 2 — Get Your Google Review Link

1. Search the clinic name on Google, click the Google Business listing
2. Click **Get more reviews** → copy the link (looks like `https://g.page/r/XXXX/review`)

---

## Step 3 — Get a Google Sheets API Key (for the dashboard) — AND RESTRICT IT

1. [console.cloud.google.com](https://console.cloud.google.com) → create a project
2. **APIs & Services → Library** → search **Google Sheets API** → Enable
3. **APIs & Services → Credentials → Create Credentials → API Key**
4. **CRITICAL — restrict the key before using it:**
   - Click the key → **Application restrictions** → select **HTTP referrers** → add the URL (or `file://` path) where the dashboard will open
   - **API restrictions** → select **Restrict key** → tick **Google Sheets API** only
   - Without these restrictions anyone who opens the dashboard in a browser can copy the key from DevTools and read the clinic's entire client database.

---

## Step 4 — Set Up n8n

1. Sign up at [n8n.io](https://n8n.io) (~$20/month) or self-host
2. **Settings → Credentials**:
   - Add **Google Sheets OAuth2 API** → follow the OAuth flow for the clinic's Google account
   - Add **Gmail OAuth2 API** → OAuth flow, grant send + read access
3. **Copy both credential IDs** (visible in the URL when editing the credential)
4. **Generate a webhook secret now** — open `setup/Workflow_Configurator.html` in Chrome and click **🔐 Generate random secret**. Copy the value; you'll paste it into Apps Script (Step 1), the dashboard (Step 8), and the configurator (Step 5). This secret gates the four webhooks — any request missing the `X-Webhook-Secret: <value>` header is rejected.

---

## Step 5 - Configure & Download Workflow Files

Open `setup/Workflow_Configurator.html` in Chrome. Fill in:

| Field | Source |
|-------|--------|
| Google Sheet ID | Step 1 |
| Google Sheets Credential ID | Step 4 |
| Gmail Credential ID | Step 4 |
| Clinic Gmail Address | the clinic's email |
| Clinic Name | displayed in every email |
| Google Review Link | Step 2 |
| Webhook Secret | Step 4 (or click Generate) |
| Clinic Timezone | IANA tz (`America/New_York`, `America/Los_Angeles`, etc.) |

Drag in the JSON files from `workflows/` that you are deploying. Core client delivery uses Workflows 1-10. Calendly audit booking uses Workflows 18-20. GPT dashboard assistant mode uses Workflow 21. Click **Configure & Download** to generate import-ready files.

---

## Step 6 - Import, Wire, and Activate Workflows in n8n

Import the configured workflows you are deploying.

1. **Workflow 1** (Lead Intake) — Active ON → copy webhook URL (ends in `/webhook/msg-lead-intake`)
2. **Workflow 2** (Follow-Up Engine) — Active ON (runs daily 9am)
3. **Workflow 3** (Review & Referral) — Active ON → copy webhook URL (ends in `/webhook/msg-appointment-complete`)
4. **Workflow 4** (Client Reactivation) — Active ON (runs monthly 1st at 10am)
5. **Workflow 5** (Weekly Report) — Active ON (runs Mondays 8am)
6. **Workflow 6** (Booking Confirmation) — Active ON → copy webhook URL (ends in `/webhook/msg-booking-confirmation`)
7. **Workflow 7** (Error Handler) — Active ON. Then:
   - Open **each** of Workflows 1–6 + 8 → click the gear icon (workflow settings) → **Error workflow** dropdown → select **7 — MSG Error Handler**. This tells n8n to email the clinic owner (and log to the Activity Log) any time a workflow fails.
8. **Workflow 8** (Status Update) — Active ON → copy webhook URL (ends in `/webhook/msg-status-update`). This is the workflow that lets the dashboard's kanban drag-drop and "bulk Mark VIP" actually persist back to the Sheet.

9. **Workflow 9** (Reply Triage AI Classifier) - Active ON if Gmail reply monitoring is included. Requires Anthropic credential.
10. **Workflow 10** (Revenue Recovery Prioritization) - Active ON. Runs Mondays 7:30am and writes the weekly `Revenue Recovery List`.
11. **Workflow 18** (Calendly Revenue Leak Audit Scheduler) - Active ON if using Calendly audit bookings. Copy webhook URL into Calendly.
12. **Workflow 19** (Calendly Reminder Dispatcher) - Active ON if using audit reminders. Requires Supabase env vars in n8n.
13. **Workflow 20** (AI Audit Prep Agent) - Active ON if using GPT call prep. Requires `MEDSPA_OPENAI_API_KEY` in n8n.
14. **Workflow 21** (Recovery Assistant Agent) - Active ON if using GPT dashboard assistant mode. Copy its webhook URL into dashboard Settings -> System -> AI agent webhook URL.

For Workflows 20 and 21, keep the OpenAI API key in n8n environment variables only: `MEDSPA_OPENAI_API_KEY`. Optional: set `MEDSPA_OPENAI_MODEL` to override the default model.
**Now go back to your Apps Script** and paste the Workflow 3 webhook URL into the `N8N_WEBHOOK_COMPLETE` constant. Also paste the webhook secret into `WEBHOOK_SECRET` if you haven't already. Save.

---

## Step 7 — Set Up the Client Intake Form

`setup/Client_Intake_Form.html` is now parameter-driven — one deployed copy can serve many clinics. The form reads configuration from URL parameters:

```
intake.html?webhook=https://your-n8n-domain/webhook/msg-lead-intake&secret=YOUR_WEBHOOK_SECRET&clinic=Luxe%20Aesthetics&source=Website%20Form
```

Deployment options:
- Upload to GitHub Pages (free, 2 minutes)
- Any host: Netlify, Vercel, or embed in Webflow/Wix/Squarespace via iframe
- Link from Instagram bio, Google Business Profile, website footer

**The `secret` param must match your Webhook Secret** — otherwise Workflow 1 rejects the submission.

Alternative: edit the defaults at the top of the HTML file (the URL params still override).

---

## Step 8 — Open the Dashboard

1. Open `dashboard/index.html` in Chrome (the new five-page build with kanban, command palette, embedded assistant, and bulk actions). The legacy first-generation dashboard is preserved at `dashboard/legacy/medspa_dashboard.html` if you ever need it.
2. **First-run setup** appears — enter clinic name, your name, your email, and a passcode. You become the admin.
3. After login: **Settings → System** in the sidebar. Enter:
   - **Google Sheets API Key** (from Step 3 — restrict it!)
   - **MedSpa Sheet ID** (from Step 1)
   - **Webhook Secret** (same value as everywhere else)
   - **Lead intake URL** (Workflow 1 webhook)
   - **Mark complete URL** (Workflow 3 webhook)
   - **Booking confirmation URL** (Workflow 6 webhook)
   - **Status update URL** (Workflow 8 webhook — required for kanban drag-drop and bulk Mark VIP)
   - Clinic name, email, Google review link, IANA timezone
4. **Save all settings**. The dashboard fetches data immediately and starts polling every 5 minutes.
5. **Run a backup right away** — Settings → System → Backup & restore → Export. Save it. If browser data ever clears, this restores everything.

Bookmark the dashboard in Chrome for daily access.

---

## Step 9 — Test the System

### Test Workflow 1 (New Inquiry)
Submit the Client Intake Form. Within 30 seconds:
- New row in Clients sheet (Status: New Inquiry)
- Service-info email lands in the test inbox
- Clinic alert email lands in the clinic inbox
- New row in Activity Log

### Test Workflow 7 (Error Handler)
In n8n, open Workflow 1, manually break a credential (e.g. rename the Sheet ID temporarily), fire the webhook, then restore it. The Error Handler should email the clinic owner within seconds.

### Dashboard with demo data
1. **MedSpa ⚡ → Setup → 🎭 Load Demo Data** in the Sheet
2. Refresh the dashboard — tables populate
3. Before going live for a real client: **MedSpa ⚡ → Setup → 🗑️ Clear Demo Data**

### Test Workflow 3 (Mark Appointment Complete)
In the Appointments sheet, add a test row (Status: Scheduled). Click the row. **MedSpa ⚡ → Daily Operations → ✅ Mark Appointment as Complete** → confirm. The webhook fires (with X-Webhook-Secret), review email schedules for +24h.

---

## Step 10 — Day-to-Day Clinic Workflow

| When | What happens |
|------|-------------|
| Someone fills the intake form | Automatic — Workflow 1 |
| You book a new appointment | Dashboard → Appointments → click **📧 Confirm** |
| Appointment completed | Dashboard → Appointments → click **✅ Complete** |
| Every morning at 9am (clinic tz) | Workflow 2 — reminders, no-show recovery, inquiry follow-ups |
| Every Monday, 7:30am | Workflow 10 — Revenue Recovery List / next best opportunities |
| Every month, 1st at 10am | Workflow 4 — client reactivation + seasonal promos |
| Every Monday, 8am | Workflow 5 — weekly performance report email |
| Any workflow fails | Workflow 7 emails the owner + logs to Activity Log |

---

## Placeholders Quick Reference

| Placeholder | Where it appears | Filled in by |
|-------------|-----------------|--------------|
| `YOUR_MEDSPA_SHEET_ID` | All workflows that read/write Sheets | Configurator |
| `YOUR_GSHEETS_CREDENTIAL_ID` | All workflows that read/write Sheets | Configurator |
| `YOUR_GMAIL_CREDENTIAL_ID` | All workflows that send email | Configurator |
| `YOUR_CLINIC_EMAIL@gmail.com` | Workflows 1–7 | Configurator |
| `YOUR_CLINIC_NAME` | Workflows 1–6 | Configurator |
| `YOUR_GOOGLE_REVIEW_LINK` | Workflow 3 | Configurator |
| `YOUR_WEBHOOK_SECRET` | Workflows 1, 3, 6, 8 | Configurator |
| `YOUR_CLINIC_TIMEZONE` | Workflows 2, 4, 5, 10 | Configurator |
| `WEBHOOK_SECRET` | `MedSpa_Engine.gs` | You (paste value manually) |
| `CLINIC_TIMEZONE` | `MedSpa_Engine.gs` | You (paste value manually) |
| `N8N_WEBHOOK_COMPLETE` | `MedSpa_Engine.gs` | You (after Step 6) |
| URL params (`webhook`, `secret`, `clinic`, `source`) | `Client_Intake_Form.html` | In the intake link |
| Dashboard Settings (API key, webhooks, secret, etc.) | Dashboard UI | You in Step 8 |

---

## Troubleshooting

**"Unauthorized: invalid or missing X-Webhook-Secret" in n8n executions**
The caller (intake form, dashboard, or Apps Script) isn't sending the same secret that's baked into the workflow. Check that all four places — Configurator, intake form URL, dashboard Settings, Apps Script `WEBHOOK_SECRET` — have the identical string.

**Workflow 2 runs fine but the 24hr email goes out twice**
Confirm the new `24hr Reminder Sent` column exists in the Appointments tab (re-run **MedSpa ⚡ → Setup → ✅ Create All Tabs & Headers** if you created the sheet from an older version of `MedSpa_Engine.gs`).

**Dashboard shows "Set Webhook Secret in Settings first."**
The Confirm / Mark Complete buttons won't fire without the secret. Paste it into Dashboard → Settings → Save.

**Workflow 4 sent the same client two re-engagement emails in one month**
Check that the Clients tab has the new `Last Promo Month` column. The workflow now marks this column after each send and skips anyone already contacted this calendar month.

---

## Pricing Reference

| Item | Amount |
|------|--------|
| Setup fee | $3,500 – $5,000 (one-time) |
| Monthly retainer | $1,000 – $1,500/month (all-in — covers hosting, maintenance, support) |
| Your n8n cost | ~$20/month |
| Margin | 97%+ |
