# Client Data Import SOP

**How to import a new clinic's existing CRM data into their MGE Sheet without breaking anything.**

Total time per clinic: **45-60 minutes**, mostly waiting on the clinic to export.

---

## The reality check first

Clinic owners will NOT abandon Fresha / Jane / Mindbody / Boulevard / Square Appointments to use your MGE Sheet as their booking system. Those tools are their operational backbone.

**MGE runs PARALLEL to their existing CRM.** Their CRM stays the source of truth for bookings + payments. MGE Sheet is the marketing/follow-up/reactivation layer that syncs client data from their CRM periodically.

Three sync patterns (pick one per clinic — see `CRM_SYNC_STRATEGY.md`):

| Pattern | When | Effort | Live-ness |
|---|---|---|---|
| **A. Manual CSV upload** | Every clinic on day 1 | You do 5 min/week or auto-schedule | 7-day lag OK |
| **B. Zapier middleware** | After first client, add-on service | 30 min setup, $20/mo per clinic | Near real-time |
| **C. Direct API** | Enterprise clinics only | Multi-hour per CRM, custom | Real-time |

**Default for first 3 clinics: Pattern A.** Prove the concept before wiring integrations.

---

## Day 0 — the initial import (one-time)

### Step 1. Ask the clinic for their CRM export (10 min setup, 24-48h wait)

Send this exact email:

```
Subject: MGE onboarding — one export I need from you

Hi [Owner Name],

To load your existing client history into your MedSpa Growth Engine dashboard, I need one export from your current booking system. This is a one-time thing.

Which system do you use? (Fresha / Jane / Mindbody / Boulevard / Square Appointments / other)

Once I know, I'll send you the exact click-path (usually 3-5 clicks in their admin panel). You'll get back one CSV file. Send it to me via WeTransfer (link: wetransfer.com — free, secure, auto-expires) — not plain email.

What I'll be doing with it:
1. Import your last 2 years of client contacts (name, email, phone, service history, last visit date, total spend)
2. Import your existing unsubscribe list so anyone who opted out of your marketing before ALSO stays opted out in MGE
3. Set a 14-day "quiet period" so the reactivation workflow doesn't accidentally blast 200 lapsed clients on day 1

Turnaround: I need the CSV within 48 hours of your kickoff call so we stay on your launch timeline.

— Bibek
```

### Step 2. Fetch the CRM-specific export instructions

Once they reply with the CRM name, send them the specific click-path from the cheat sheet below.

### Step 3. Receive the CSV

They send via WeTransfer. Download to `C:\Users\user\OneDrive\Desktop\Client Imports\[Clinic Name]\` — a folder OUTSIDE the MGE repo (never commit client data locally either).

### Step 4. Run the CRM Import Mapper (10 min)

1. Open the clinic's MGE Google Sheet
2. Extensions → Apps Script
3. Verify `CRM_Import_Mapper.gs` is present (from `setup/`). If not, paste it in.
4. Change the CONFIG block at top:
   - `SOURCE_CRM` = `'fresha'` / `'jane'` / `'mindbody'` / `'boulevard'` / `'square'` / `'generic'`
   - `IMPORT_MODE` = `'dry_run'` for the first run (previews the import, writes NOTHING)
   - `CLINIC_TZ` = their timezone
5. Save
6. Upload the CSV to Google Drive (`MGE_Imports/[Clinic]/original.csv`)
7. In the script, change `CSV_FILE_ID` to the file ID from the URL after upload
8. Run `importFromCRM()` (dry_run mode)
9. Read the dry-run report in the Apps Script log:
   ```
   DRY RUN — 234 rows detected
     — Would ADD:     198 new client rows
     — Would UPDATE:  32 existing rows (email matched)
     — Would SKIP:    4 rows (invalid email)
     — Opt-outs found: 12 clients marked opted_out=Yes
     — Historical revenue: $184,320 across 892 visits
   ```
10. If numbers look right, change `IMPORT_MODE` to `'apply'` and run again. This time it writes.
11. Verify the Activity Log has a new "CRM_IMPORT_COMPLETE" entry.

### Step 5. Set the quiet-period flag (2 min)

Open the Config tab of the Sheet. Fill in these fields:

- `import_quiet_until`: today + 14 days (ISO format like `2026-08-24`). During this window, W4 Client Reactivation will SKIP all sends — gives the imported clients time to naturally see any recent marketing before we hit them with a "we miss you" email.
- `import_source_crm`: `fresha` / `jane` / `etc.` (for future reference)
- `import_date`: today's date
- `import_baseline_client_count`: the number of clients in the Clients tab right after import (baseline for growth tracking)

### Step 6. Verify + report to clinic

Do the 6-point verification:

- [ ] Clients tab row count ≈ imported CSV row count minus duplicates and skips
- [ ] Spot-check 5 random client rows against the source CSV — data matches
- [ ] All Opted Out = Yes rows from the source CSV are marked Opted Out = Yes in MGE Sheet
- [ ] Historical revenue in Analytics dashboard shows a reasonable total (not $0, not $10M)
- [ ] W4 Client Reactivation manually executed → shows 0 emails sent (quiet period active)
- [ ] Sample lapsed client's row shows a plausible Last Visit Date

Then send the clinic:

```
Import complete. Loaded [N] clients from your Fresha export.

Quick summary:
  • [X] active clients (last visit within 60 days)
  • [Y] at-risk clients (60-90 days since last visit)
  • [Z] lapsed clients (90+ days since last visit)
  • [W] respected your existing opt-outs
  • Total historical revenue: $[R]
  • Total past visits: [V]

I've set a 14-day "quiet period" so the Client Reactivation workflow won't email your past clients until [DATE]. This gives you a chance to preview what the system will send before it goes to your real client base.

Log into your dashboard to spot-check: [DASHBOARD URL]

Any questions or corrections, reply here.

— Bibek
```

---

## Day 14+ — end of quiet period

On the day the quiet period ends:

1. Confirm the clinic has previewed the reactivation email templates
2. Confirm they've told you about any specific clients to exclude ("Dr. Kim's mother — never email her")
3. For those exceptions, manually set `Opted Out = Yes` in their Clients row
4. Delete the `import_quiet_until` value from Config (or set it to today)
5. Next monthly W4 run (1st of the month) will now email eligible clients

---

## Ongoing sync — Pattern A (manual CSV upload, weekly)

For clinics that don't want the Zapier subscription:

### Weekly rhythm (Fridays 3pm — 15 min)

1. Ask clinic to export the last 7 days of new/updated clients from their CRM
2. They send CSV via WeTransfer
3. You run `CRM_Import_Mapper.gs` in `'incremental'` mode (only adds NEW clients or updates last-visit dates on existing)
4. Post to Activity Log
5. If W4 fires this weekend, the new data is included

Bibek's time cost: **~15 min/week per clinic** — fine for 5 clinics, hair-on-fire at 15.

### When to move to Pattern B (Zapier)

- Clinic is on your 3rd month
- Clinic is Growth tier or Dominance tier
- You're spending >30 min/week on their weekly sync alone
- Their client base is growing >10 new clients/week (weekly sync becomes stale)

---

## Ongoing sync — Pattern B (Zapier middleware)

**Setup: one-time, 30 min per clinic. Cost: $20/mo Zapier subscription (they pay).**

Best for: any clinic on Growth or Dominance tier.

Concept: Zapier watches their CRM for new/updated clients → auto-appends to their MGE Sheet.

Recipes per CRM:

### Fresha → MGE Sheet
- **Trigger:** Fresha "New Client" (via Zapier's Fresha app if available, otherwise via Fresha webhook)
- **Action:** Google Sheets "Create Spreadsheet Row"
- **Sheet:** their MGE Sheet
- **Tab:** Clients
- **Field mapping:** see `CRM_FIELD_MAPPINGS.md`

### Jane → MGE Sheet
- Jane has a native Zapier integration
- Trigger: "New Client Created"
- Same action + mapping

### Boulevard → MGE Sheet
- Boulevard doesn't have Zapier natively — use their webhook
- Setup: Boulevard admin → Integrations → Webhooks → point at a Zapier webhook URL
- Zapier receives webhook → parses → writes to Sheet

### Mindbody → MGE Sheet
- Mindbody has Zapier integration
- Trigger: "New Client" OR "Appointment Scheduled" (pick per clinic preference)

### Square Appointments → MGE Sheet
- Square has Zapier integration
- Trigger: "New Customer"
- Note: Square doesn't include treatment/service history — you'll only get name/email/phone. Fine for lead intake, less useful for lifetime spend tracking.

### For the appointment sync (parallel need):

Same pattern but different trigger:
- Trigger: "New Appointment" / "Appointment Completed"
- Action: Append row to Appointments tab in their MGE Sheet
- Field mapping: date, time, service, provider, status, revenue

---

## Ongoing sync — Pattern C (direct API)

**Skip until you have a specific clinic paying for it. Costs multi-hour per CRM to build. Only worth it for enterprise clinics.**

Custom code touching each CRM's API directly. Do only when:
- Clinic is paying $2,500+/mo Local Dominance tier
- They've specifically requested real-time sync (not weekly)
- You have concrete ROI on the build vs sticking with Zapier

---

## Common gotchas

### 1. Email duplicates
Their CRM might have the same client twice under two email addresses (personal vs work). The import mapper dedupes by email — both will import as separate rows. You'll have to manually merge if this matters.

### 2. Phone-only clients
Some clinics have walk-in clients captured with phone but no email. These import as `Client Email = phone_ONLY_[phone]@no-email.local` — a sentinel so the row is trackable but W1/W4 skip them (no valid email to send to).

### 3. Historical opt-outs
Clinics using paid email tools (Mailchimp, Klaviyo) have unsubscribe lists there, not in the CRM. Ask the clinic:

> "Do you have any current unsubscribe list from Mailchimp/Klaviyo/Constant Contact? If yes, export that as a CSV and send along with the main client export. I'll merge them so anyone who opted out of your marketing before ALSO stays opted out in MGE."

Failing to do this = re-emailing people who told you to stop = CAN-SPAM / CASL / GDPR violation.

### 4. Bad phone number formats
Their CRM might have phones like `4155551234` or `+1 (415) 555-1234` or `415.555.1234`. Import mapper normalizes to `(415) 555-1234` format.

### 5. Names with commas / apostrophes
CSVs with unquoted commas break naive parsers. The import mapper uses proper CSV parsing (respects quotes and escapes).

### 6. Bounced emails from CRM
The CRM might not track bounces. Any imported email will get bounced on first W1 send. This is normal — W7 error handler catches it. But you'll see maybe 5-10% bounces on first newsletter after import. Expected.

### 7. "Deceased client" edge case
Sadly happens. Some CRMs have a "deceased" flag; most don't. Ask the clinic:

> "Any clients we shouldn't ever email — for reasons like passed away, moved out of country, DNC list? Send me the list of emails and I'll flag them opted-out before we go live."

### 8. HIPAA-adjacent fields
NEVER import: diagnosis, prescription, allergies, medical notes, before/after photos.
ALWAYS import: name, contact, service categories, appointment dates, revenue.

The MGE Sheet is not HIPAA-covered and importing PHI would put you AND the clinic in violation.

### 9. Same-email family members
Two Fosters share `family@fosters.com`. Import mapper dedupes by email → only ONE Foster row imported. Ask clinic if this matters — often it does. Fix by having them add a `+family2` alias like `family+jenn@fosters.com` before export.

---

## CRM CSV field mapping cheat sheet

### Fresha export
Fresha admin → Reports → Clients → Export CSV

Their columns → MGE Sheet columns:
| Fresha | MGE |
|---|---|
| First Name + Last Name | Client Name |
| Email | Client Email |
| Phone | Phone Number |
| Total Sales | Total Spend |
| Total Bookings | Total Visits |
| Last Booking Date | Last Visit Date |
| Newsletter Opt-Out (Yes/No) | Opted Out |
| Category / Service | Service Interest |
| Notes | Notes |

### Jane export
Jane admin → Patients → Export

| Jane | MGE |
|---|---|
| Full Name | Client Name |
| Email | Client Email |
| Primary Phone | Phone Number |
| Total Revenue | Total Spend |
| Total Appointments | Total Visits |
| Last Appointment | Last Visit Date |
| Marketing Consent (True/False → inverse) | Opted Out |
| Discipline / Service | Service Interest |

### Mindbody export
Mindbody admin → Reports → Client List → Export

| Mindbody | MGE |
|---|---|
| Client Name | Client Name |
| Email | Client Email |
| Home Phone / Mobile Phone | Phone Number |
| Total Revenue | Total Spend |
| Visit Count | Total Visits |
| Last Visit | Last Visit Date |
| Email Opt In (No → Yes for Opted Out) | Opted Out |

### Boulevard export
Boulevard admin → Clients → Export All → CSV

| Boulevard | MGE |
|---|---|
| First Name + Last Name | Client Name |
| Primary Email | Client Email |
| Mobile Phone | Phone Number |
| Total Spent | Total Spend |
| Total Visits | Total Visits |
| Last Visit Date | Last Visit Date |
| Marketing Consent | Opted Out (inverse) |
| Tags | Service Interest (if applicable) |

### Square Appointments export
Square Dashboard → Customers → Export

| Square | MGE |
|---|---|
| Customer Name | Client Name |
| Email Address | Client Email |
| Phone Number | Phone Number |
| — (Square doesn't track spend easily) | Total Spend (leave blank) |
| — | Total Visits (leave blank) |
| — | Last Visit Date (leave blank) |
| Reference ID | (ignored) |

For Square imports, historical data is thin — you'll have contact info but not spend/visit history. Set clinic expectations accordingly.

### Generic CSV (any other CRM)
The mapper has a `'generic'` mode. Requires the CSV to have AT MINIMUM these column headers (case-insensitive, order flexible):

- One of: `email`, `client email`, `email address`
- One of: `name`, `client name`, `full name`, or (`first name` + `last name`)
- Optional: `phone`, `total spend`, `total visits`, `last visit date`, `opted out`, `service interest`

Missing columns get sensible defaults. Import proceeds.

---

## Data quality metrics to report to the clinic

After every import, tell the clinic:

- Import success rate: % of source rows that landed in MGE Sheet
- Email validity: % of imported rows with valid email format
- Duplicate rate: % of source rows dropped as duplicates
- Opt-out preserve rate: % of source opt-outs that carried over (should be 100%)
- Historical revenue captured: $ total from imported appointments
- "Data completeness" score: 0-100 based on how many fields were populated per row

This transparency builds trust and surfaces issues early ("only 60% of your rows had valid emails — is your CRM allowing bad email formats at input?").

---

## Alternate scenarios

### Clinic doesn't have a CRM
Some solo injectors track clients in a paper book or a notes app. Import via:
1. Their existing spreadsheet if any
2. Otherwise skip import — start fresh from day 1
3. Client base grows organically via intake form
4. In 90 days they have a real dataset

### Clinic has multiple CRMs (bad situation)
E.g., Fresha for new bookings, Mailchimp for their newsletter list, notes-app for VIPs. Import from each source separately, dedupe by email, mark provenance in `Notes` field. Painful but doable.

### Clinic refuses to export their data
Some legal-cautious clinics won't share their client list until contract is signed. Fine — start MGE with an empty Sheet, run for 30 days on new inquiries only, then import their history in month 2 once trust is built.
