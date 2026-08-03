# Test Data — MedSpa Growth Engine

Realistic data for stress-testing the 8 workflows, dashboard, and AI operator layer BEFORE onboarding any real client. All dates are relative to **2026-07-28** (today) so the time-sensitive triggers actually fire when you load it.

## What's in this folder

| File | Rows | Purpose |
|---|---:|---|
| `clients.csv` | 59 | Every client status × lifecycle stage the system knows about |
| `appointments.csv` | 113 | Every workflow trigger case + historical volume for analytics |
| `activity_log.csv` | 160 | 14 days of past workflow actions across all 8 workflows |
| `webhook_samples_workflow_1_lead_intake.json` | 10 payloads | Every intake edge case incl. security tests (XSS/SQLi/no-auth) |
| `webhook_samples_workflow_3_review_referral.json` | 3 payloads | Completion flows: single-visit, returning, opted-out |
| `webhook_samples_workflow_6_booking_confirmation.json` | 2 payloads | Standard + same-day confirmations |
| `webhook_samples_workflow_8_status_update.json` | 4 payloads | Drag, bulk, invalid-status tests |
| `reply_samples.json` | 9 classes × 25+ examples | AI reply-triage training/testing data |

---

## Coverage matrix — what the data exercises

### Client statuses (Clients.csv)

| Status/Scenario | Row count | What it tests |
|---|---:|---|
| Brand new inquiries (0-2 days) | 4 | Workflow 1 fresh intake |
| Inquiry needing 1st follow-up (3-5 days old) | 3 | Workflow 2 inquiry follow-up trigger |
| Inquiry on 2nd follow-up | 2 | Follow-Up Count > 0 branch |
| Inquiry on 3rd follow-up (final) | 2 | Follow-Up Count = 2, no further sends |
| Inquiry opted out | 1 | Suppression logic |
| Booked (upcoming) | 5 | Pipeline kanban Booked column |
| Recent completed (3-14 days) | 6 | Post-appt + review flow |
| Lapsed 60 days | 4 | Workflow 4 60-day trigger |
| Lapsed 90 days | 3 | Workflow 4 90-day trigger |
| Lapsed 180 days | 3 | Workflow 4 180-day winback |
| VIP active (5+ visits, recent) | 5 | VIP-only Pipeline view |
| VIP lapsing (60+ days no visit) | 2 | High-value churn risk |
| Returning client eligible for referral ask | 2 | Workflow 3 referral branch |
| Referral-sourced client | 1 | Lead Source = Referral |
| Multi-service high-value | 1 | Package client analytics |
| Special chars (María O'Brien-González) | 1 | Unicode / apostrophe / hyphen |
| Very long name | 1 | UI truncation |
| International phone | 1 | Format validation |
| Missing optional fields | 1 | Nullable field handling |
| Bounced email | 1 | Bad-email suppression |
| Ancient client (600+ days) | 1 | Historical data handling |
| Same-day booking | 1 | Same-day flow |
| Family (same phone, different names) | 2 | Non-unique phone edge |
| Duplicate email (existing client re-submit) | 1 | Dedupe via appendOrUpdate |
| Consultation-only (undecided service) | 1 | No specific service |
| Opted out after review request | 1 | Post-relationship suppression |
| High review-rate cluster | 3 | Review conversion analytics |

### Appointment statuses (appointments.csv)

Every case Workflow 2 must handle:

| Case | Row count | Trigger |
|---|---:|---|
| CASE A: 48hr reminder due (46-52hrs out) | 2 | `pre_reminder=False`, appt in +2 days |
| CASE B: 24hr reminder due (48hr already sent) | 1 | `pre_reminder=True, r24=False`, appt in +1 day |
| CASE C: Both reminders already sent | 1 | Idempotency — no re-send |
| CASE D: Today's appointments | 1 | In-progress or awaiting outcome |
| CASE E: No-show yesterday | 1 | Post no-show recovery due |
| CASE F: Completed yesterday, no post-appt yet | 3 | Post-treatment check-in trigger |
| CASE G: Completed yesterday, post-appt already sent | 1 | Idempotency |
| CASE H: Completed 3-7 days ago | 3 | Historical, no action |
| VIP visit history | ~40 | Analytics revenue curves |
| Historical no-shows (last 90 days) | 6 | No-show rate metric |
| Cancelled appointments | 5 | Cancelled ≠ No-Show separation |
| Rescheduled (Cancelled + new booking) | 1 | Same client, two rows |
| Same-day multi-appointment (consult+treatment) | 2 | Staff capacity |
| Lapsed client historical visits | ~15 | Revenue trend before lapse |
| Weekend appointment | 1 | Cron/weekly logic |
| Early morning (7am) | 1 | Time edge |
| Late evening (7pm) | 1 | Time edge |

Status breakdown across all 113 rows: **Completed 93, Scheduled 8, No-Show 7, Cancelled 5**.

### Activity log (activity_log.csv)

160 events across the last 14 days:

- Workflow 1 (Lead Intake): 42 events — inquiries, service info emails, clinic alerts
- Workflow 2 (Follow-Up): 54 events — 48hr, 24hr, no-show recovery, post-appt, inquiry follow-ups
- Workflow 3 (Review/Referral): 14 events — review requests + referral asks
- Workflow 4 (VIP Retention): 16 events — 60/90/180-day + seasonal (monthly cadence)
- Workflow 5 (Weekly Report): 3 events — last 3 Mondays
- Workflow 6 (Booking Confirmation): 10 events — owner clicks
- Workflow 7 (Error Handler): 3 events — realistic warnings (rate limit, timeout, quota)
- Workflow 8 (Status Update): 18 events — kanban drags + bulk actions

### Reply samples for AI reply triage

`reply_samples.json` covers all 9 classes from `operations/AI_COMMUNICATION_SYSTEM.md`:

- **HOT** — explicit ready-to-book replies (3 examples)
- **WARM** — curious, needs info (4 examples)
- **OBJECTION** — real blockers to overcome (4 examples)
- **NOT_NOW** — wrong timing, nurture (3 examples)
- **REFERRAL** — knows someone (2 examples)
- **UNSUBSCRIBE** — hard-stop (4 examples)
- **BAD_FIT** — wrong ICP (3 examples)
- **COMPLAINT** — escalate to owner (3 examples)
- **AUTO_REPLY** — OOO / autoresponders (do NOT engage) (2 examples)

Use these to test that Claude/OpenAI classifies replies correctly per the AI Operator system.

---

## How to load into your demo Google Sheet

### Method 1 — Direct paste (fastest)

1. Open your MGE Demo Google Sheet (from `DEPLOYMENT_MANUAL.md` Chapter 7)
2. Open `clients.csv` in Excel or a text editor
3. Select all → copy → in the Sheet, click cell A1 of the **Clients** tab → paste
4. Repeat with `appointments.csv` → **Appointments** tab
5. Repeat with `activity_log.csv` → **Activity Log** tab

The header row matches what `MedSpa_Engine.gs` sets up, so column alignment is automatic.

### Method 2 — File Import

1. Sheet → File → Import → Upload → drag `clients.csv`
2. Import location: **Replace current sheet** (only for the Clients tab)
3. Separator type: Comma
4. Convert text to numbers/dates: Yes
5. Import
6. Repeat for `appointments.csv` and `activity_log.csv` (each to its own tab)

---

## Verification checklist — what to confirm after loading

After loading the CSVs, open your dashboard at `dashboard/index.html`:

### Overview page
- [ ] KPI cards show non-zero values (Active clients, Completed treatments, At-risk, etc.)
- [ ] Recent activity feed shows entries from `activity_log.csv`
- [ ] "This week" numbers reflect the recent completions

### Pipeline page (kanban)
- [ ] **New Inquiry** column has ~12 cards (4+3+2+2+1)
- [ ] **Booked** column has ~5-7 cards
- [ ] **Completed** column has ~15+ cards
- [ ] **VIP** column has ~7 cards (5 active + 2 lapsing)
- [ ] **Lapsed** virtual view shows lapsed clients
- [ ] Drag a card between columns → check the Sheet updates (proves Workflow 8)

### Clients page
- [ ] Search "María" → finds María O'Brien-González (unicode works)
- [ ] Sort by Total Spend descending → the $24k multi-service client is #1
- [ ] Filter by Status = VIP → 7 rows
- [ ] Filter by Opted Out = Yes → 2 rows
- [ ] Bulk select 3 clients → Mark VIP → check Sheet updates

### Analytics page
- [ ] Revenue chart shows history (from historical completed appointments)
- [ ] No-show rate = 7/(93+7) ≈ 7% (realistic clinic metric)
- [ ] Review rate ≈ 50-60% (based on Review Left = Yes count)
- [ ] Stage-days panel labeled as "Reference benchmarks" (not fake analytics)

### Settings
- [ ] All 4 webhook URLs configured
- [ ] API key + Sheet ID + Webhook Secret present
- [ ] "Sync now" button works and returns fresh data

---

## Trigger the workflows against the data

Once loaded, manually trigger each workflow in n8n to see them process real-looking data:

### Workflow 2 (Appointment Follow-Up) — the biggest test

1. n8n → open Workflow 2 → click **Execute Workflow**
2. Expected outcome (based on 2026-07-28):
   - 2 emails sent: 48hr reminders (CASE A × 2)
   - 1 email sent: 24hr reminder (CASE B)
   - 1 email sent: no-show recovery (CASE E)
   - 3 emails sent: post-appt check-ins (CASE F × 3)
   - 3+ emails sent: inquiry follow-ups (Scenarios 2 + 3 + 4)
   - Total: ~10-12 emails from one manual run
3. Check n8n execution log → each sub-branch executed
4. Check your test inbox → emails arrive
5. Re-run immediately → **should send ZERO new emails** (idempotency test: Pre-Appt Reminder Sent = Yes prevents re-send)

### Workflow 4 (VIP Retention) — monthly cadence test

1. Execute Workflow 4 manually
2. Expected: emails to 4 lapsed-60 + 3 lapsed-90 + 3 lapsed-180 + 5-6 active VIPs (seasonal promo)
3. Total: ~15 emails
4. Re-run same day → **zero new sends** (Last Promo Month set to current month)

### Workflow 5 (Weekly Report)

1. Execute Workflow 5 manually
2. Expected: 1 email to bibek@ with:
   - Revenue for last 7 days from Completed appointments in that window
   - New client count
   - No-show rate
   - Top 8 at-risk clients (lapsed 60-90 days)
   - Review-request-vs-review-left breakdown

### Webhooks (Workflows 1, 3, 6, 8) — POST test

Use Postman, Insomnia, or curl to POST the payloads from `webhook_samples_workflow_1_lead_intake.json`:

```bash
curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook/msg-lead-intake \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: YOUR_SECRET" \
  -d @webhook_samples_workflow_1_lead_intake.json
```

Verify:
- Standard payloads (samples 1-4) create rows in Clients tab
- EDGE sample 7 (duplicate) UPDATES existing row instead of creating new
- EDGE sample 8 (missing secret) returns 401/403
- EDGE samples 9-10 (SQLi/XSS) store data safely (no execution)

---

## What this data does NOT cover (deliberately)

- **PHI (Protected Health Information)** — no diagnoses, prescriptions, treatment notes, photos. MGE is explicitly NOT HIPAA-covered.
- **Payment data** — no card numbers, no invoice IDs. MGE is not the source of payment truth.
- **Real people** — all names are synthetic. Any resemblance to actual MedSpa clients is coincidental.
- **Real clinic operational data** — the demo clinic ("MGE Demo") doesn't exist. Do NOT reuse this data for a real client install — generate fresh per-clinic data.

---

## Regenerating this data

The generator scripts live in this session's sandbox (they were deterministic — `random.seed(42/43/44)`). To regenerate:

1. Re-run the three Python scripts from the deployment session, OR
2. Ask Claude to regenerate with different seeds for more variety, OR
3. Ask Claude to add specific scenarios you find missing

The generators are documented in the sandbox at `/tmp/gen_testdata.py`, `/tmp/gen_appts.py`, `/tmp/gen_activity.py`, `/tmp/gen_webhook_samples.py`.

---

## The critical test — does the system pass all cases?

Load the data, execute Workflows 2, 4, 5 back to back, POST each webhook sample. Then run this final check:

- [ ] No workflow errored in n8n
- [ ] No duplicate emails sent (idempotency intact)
- [ ] All expected trigger cases produced emails
- [ ] All EDGE cases handled gracefully (no crashes, no duplicates, malicious payloads stored as text)
- [ ] Dashboard reflects all new activity within 30 seconds
- [ ] Weekly report numbers match what you'd calculate by hand from the CSVs

**If all check, the system is validated end-to-end.** You can onboard your first paying clinic with confidence that every workflow trigger has been tested against realistic data.
