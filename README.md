# MedSpa Growth Engine

A fully automated client acquisition and retention operating system for independent MedSpas and aesthetic clinics. Built on n8n + Gmail + Google Sheets — no proprietary software, no per-seat fees.

---

## How to launch this (read in order)

If you're taking MGE live for the first time, read these four docs in order:

1. **`DEPLOYMENT_GUIDE.md`** — click-by-click walkthrough from zero to `https://medspagrowthengine.com` being live. Domain, hosting, SSL, pro email, DNS. Written for someone who has never deployed anything.
2. **`SECURITY_GUIDE.md`** — what protects what, and what breaks if you skip a step. Read this before you send a single cold email.
3. **`operations/AI_OPERATOR_OS.md`** — the AI operating layer that runs your day-to-day (finding leads, drafting outreach, prepping calls, etc.). Section 0 makes you pick a runtime.
4. **`LAUNCH_CHECKLIST.md`** — the terse task list. Use this once you've read the two guides above and just want to check off items as you complete them.

**When your first client closes:** `setup/Setup_Guide.md` walks you through installing MGE for that specific clinic.

---

## What It Does

Handles every client touchpoint automatically: inquiry capture, booking confirmation, appointment reminders, no-show recovery, post-treatment follow-up, review generation, referral asks, VIP retention, and weekly performance reporting.

**The clinic owner's entire day-to-day is two actions:**
1. Click **📧 Confirm** when a new appointment is added → client gets an instant booking confirmation
2. Click **✅ Complete** when treatment is done → review request + referral ask schedule automatically

Everything else runs on its own.

---

## The 8-Workflow Stack

| # | File | Trigger | What It Does |
|---|------|---------|--------------|
| 1 | `1_MSG_Lead_Inquiry_Intake.json` | Webhook (intake form submit) | Captures inquiry, sends personalised service info email, alerts clinic, logs to CRM |
| 2 | `2_MSG_Appointment_Follow_Up.json` | Daily 9am | 48hr reminders, 24hr reminders, no-show recovery, post-treatment check-ins, inquiry follow-ups |
| 3 | `3_MSG_Review_Referral.json` | Webhook (appointment complete) | Review request + referral ask 24hrs after appointment |
| 4 | `4_MSG_VIP_Retention.json` | Monthly 1st | Re-engages 60/90/180-day lapsed clients, seasonal promos to active clients |
| 5 | `5_MSG_Weekly_Performance_Report.json` | Every Monday 8am | Performance email to clinic owner: revenue, no-shows, at-risk clients, review rate |
| 6 | `6_MSG_Booking_Confirmation.json` | Webhook (dashboard button) | Sends booking confirmation email when clinic clicks Confirm in dashboard |
| 7 | `7_MSG_Error_Handler.json` | Any workflow error | Emails the clinic owner + logs to Activity Log whenever any workflow fails |
| 8 | `8_MSG_Status_Update.json` | Webhook (dashboard kanban + bulk action) | Persists kanban drag-drop and bulk Mark VIP actions back to the Clients sheet |

**Security & reliability baked in:** all four webhooks (1, 3, 6, 8) require an `X-Webhook-Secret` header and reject unauthenticated calls. All date math is clinic-timezone-aware. Workflow 2 marks every send BEFORE firing, preventing duplicate reminder emails on re-runs. Workflow 7 catches errors from every other workflow and emails the owner.

---

## The Full Client Journey

```
New inquiry (website / Instagram / Google)
        ↓
[Workflow 1] → CRM entry → personalised service info email (instant) → clinic alert
        ↓
Client books → clinic clicks 📧 Confirm in dashboard
        ↓
[Workflow 6] → booking confirmation email (instant)
        ↓
[Workflow 2] → 48hr reminder → 24hr reminder
        ↓
Appointment day
        ↓  (if no-show)
[Workflow 2] → no-show recovery email
        ↓  (if completed) clinic clicks ✅ Complete in dashboard
[Workflow 3] → post-treatment check-in → review request (24hrs later) → referral ask
        ↓
[Workflow 4] ← monthly, re-engages lapsed clients, sends seasonal promos
[Workflow 5] ← every Monday, performance report to clinic owner
```

---

## File Structure

System asset registry: see `system/README.md` for the organized map of design assets, frontend pages, workflows, data/storage, integrations/secrets, copy/offer assets, and launch operations.

```
MedSpa Growth Engine/
├── landing/
│   └── index.html                 ← Public marketing site (the primary URL)
│
├── booking/
│   └── index.html                 ← Demo booking page — prefilled email request form
│
├── onboarding/
│   └── index.html                 ← 7-step setup wizard for new clinic clients
│
├── dashboard/
│   ├── index.html                 ← Clinic owner's daily interface (the app)
│   ├── Email_Preview.html         ← All 13+ emails rendered — use for sales demos
│   └── legacy/                    ← First-generation dashboard kept as a fallback
│
├── legal/
│   ├── privacy.html               ← Privacy policy (review with a lawyer before launch)
│   └── terms.html                 ← Terms of service (review with a lawyer before launch)
│
├── assets/
│   ├── brand-tokens.css           ← Shared design tokens for all public pages
│   ├── favicon.svg                ← Site favicon
│   └── og-image.svg               ← Open Graph / social preview image
│
├── workflows/
│   ├── 1_MSG_Lead_Inquiry_Intake.json
│   ├── 2_MSG_Appointment_Follow_Up.json
│   ├── 3_MSG_Review_Referral.json
│   ├── 4_MSG_VIP_Retention.json
│   ├── 5_MSG_Weekly_Performance_Report.json
│   ├── 6_MSG_Booking_Confirmation.json
│   ├── 7_MSG_Error_Handler.json
│   └── 8_MSG_Status_Update.json
│
├── setup/
│   ├── MedSpa_Engine.gs           ← ONE Google Apps Script to paste and run
│   ├── Client_Intake_Form.html    ← Self-hosted inquiry capture form
│   ├── Workflow_Configurator.html ← Enter 8 values, download all configured workflows
│   ├── Setup_Guide.md             ← Full step-by-step setup (20–30 min)
│   ├── Pre_Launch_Checklist.md    ← Lightweight client go-live checklist
│   ├── Client_Onboarding_Form.md  ← Post-sale intake
│   └── Client_Handoff_Email.html  ← Email to send the client on go-live day
│
├── outreach/
│   ├── One_Pager.html             ← Designed proposal page (send after discovery calls)
│   ├── ROI_Calculator.html        ← Discovery-call ROI model
│   ├── Cold_Email_Sequence.md     ← 5-email outreach sequence
│   ├── Discovery_Call_Script.md   ← 20-min sales call script with objection handling
│   ├── LinkedIn_DM_Sequence.md    ← LinkedIn outreach sequence
│   ├── Demo_Walkthrough.md        ← 12-minute demo flow
│   ├── Offer_Tiers.md             ← Core, Growth, and Local Dominance packaging
│   ├── Treatment_Copy_Library.md  ← MedSpa-specific copy blocks
│   ├── Seasonal_Campaign_Calendar.md
│   └── Case_Study.html            ← Illustrative projection — clearly labeled as such
│
├── tools/
│   ├── system-check.html          ← Self-running diagnostic page
│   └── day-of-brief.html          ← Printable today's-brief
│
├── design/
│   ├── Tokens.md                  ← Single source of truth for design tokens
│   ├── Components.md
│   ├── Patterns.md
│   ├── Roadmap.md
│   └── README.md
│
├── outputs/swarm/
│   ├── ICP.md                     ← Full ICP brief — can be handed to another agent
│   ├── 1_raw_leads.csv            ← 134 qualified leads across 5 metros
│   └── 2_lead_briefs.csv          ← 50 personalization hooks
│
├── ARCHITECTURE.md                ← System architecture, data flow, secrets map, failure modes
├── LAUNCH_CHECKLIST.md            ← Pre-flight gates before going public
├── MANAGED_OS_PACKAGE.md          ← Non-SaaS package map and delivery model
├── GTM_LAUNCH_GUARDRAILS.md       ← Positioning, proof, compliance, and scope rules
└── README.md                      ← This file
```

---

## Tech Stack

| Tool | Role | Cost |
|------|------|------|
| n8n cloud | Automation backbone - runs client workflows, Calendly audit workflows, and the GPT assistant agent | ~$20/month |
| Gmail (OAuth2) | All client + owner email communication | Free |
| Google Sheets | Client CRM + appointment tracker + activity log | Free |
| `dashboard/index.html` | Clinic owner's daily interface | Free (self-hosted) |
| `Client_Intake_Form.html` | Inquiry capture form | Free (self-hosted) |

**Your total cost: ~$20/month.** Everything else is free Google services.

---

## Delivery Model

This is a **done-for-you** system. You set it up for the client — they never touch n8n.

1. Create a Google Sheet for the client → paste `MedSpa_Engine.gs` → run setup
2. Create client's n8n account → add Google Sheets OAuth2 + Gmail OAuth2 credentials
3. Open `setup/Workflow_Configurator.html` -> enter the setup values -> configure the workflow JSON files you are deploying -> import them to n8n
4. Activate the core workflows -> copy Workflow 1, 3, 6, 8, and optional Workflow 21 webhook URLs
5. Open `dashboard/index.html` in Chrome -> first-run setup creates the admin -> Settings -> System -> enter API key, Sheet ID, webhook secret, webhook URLs, and optional Workflow 21 AI agent URL
6. Send `Client_Handoff_Email.html` to the client — they're live

**The one step requiring the client's presence:** authorizing Gmail OAuth2 and Google Sheets OAuth2 in n8n (requires their Google login). Do this on a 10-minute screen share.

Full instructions: `setup/Setup_Guide.md`

Before selling or launching a clinic, review:
- `LAUNCH_CHECKLIST.md` — operator pre-flight gates before going public
- `ARCHITECTURE.md` — full system architecture, data flow, secrets, and failure modes
- `MANAGED_OS_PACKAGE.md` — the non-SaaS package map and delivery model
- `GTM_LAUNCH_GUARDRAILS.md` — simple positioning, proof, compliance, and scope rules
- `setup/Pre_Launch_Checklist.md` — lightweight client go-live checklist
- `outputs/swarm/ICP.md` — full ICP brief for ongoing lead scraping

Sales and value assets:
- `landing/index.html` — primary public landing page for the MedSpa offer
- `outreach/ROI_Calculator.html` — discovery-call ROI model
- `outreach/Offer_Tiers.md` — Core, Growth, and Local Dominance packaging
- `outreach/Demo_Walkthrough.md` — 12-minute demo flow
- `outreach/Treatment_Copy_Library.md` — medspa-specific copy blocks
- `outreach/Seasonal_Campaign_Calendar.md` — monthly campaign ideas for retainers
- `setup/Client_Onboarding_Form.md` — simple post-sale intake

---

## Pricing This System

| | Amount |
|-|--------|
| Setup fee | $3,000 – $5,000 (one-time) |
| Monthly retainer | $1,000 – $1,500/month |
| Your tool cost | ~$20/month |
| Margin | 97%+ |

---

## Target Client Profile

- Independent MedSpas or aesthetic clinics (not chains)
- 1–3 providers / injectors
- 50–300 active clients
- Owner is the primary injector — too busy to do marketing manually
- Revenue: $200K–$800K/year
- Pain: no-shows, no repeat bookings, no Google reviews, no referral system

---

## Services This Works For

Botox / Dysport · Dermal fillers · Laser hair removal · HydraFacial · Chemical peels · Microneedling · Body contouring · IV therapy / wellness
