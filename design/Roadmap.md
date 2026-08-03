# MGE Roadmap

Improvements ranked by impact and effort. **No new automations.** The 7 n8n workflows are the line. Everything here lives in the dashboard layer (or supporting HTML tools).

**Impact:** ⭐ minor · ⭐⭐ noticeable · ⭐⭐⭐ transformative
**Effort:** ◐ <1 day · ◑ 1–3 days · ● 1 week · ●● 2+ weeks

---

## LAUNCH-READY STATE (May 2026)

The system is shippable from the operator side. What's done and what's pending Bibek's hand:

**Done (Claude's side):**
- All 8 workflows wired, secured, idempotent
- Dashboard with first-run setup, kanban persistence, bulk actions, backup/restore
- Public landing page (`landing/index.html`)
- Demo booking page (`booking/index.html`) with Calendly placeholder + contact-form fallback
- Client onboarding wizard (`onboarding/index.html`) — 7 steps, progress saved locally
- Privacy + Terms (`legal/privacy.html`, `legal/terms.html`) — needs lawyer review before first paid client
- Shared brand-tokens, favicon, OG image
- Full ARCHITECTURE.md and LAUNCH_CHECKLIST.md

**Pending Bibek's hand (cannot be done from Claude's side):**
- Domain purchase + DNS + hosting account
- Calendly account + event setup + embed code paste
- Form handler endpoint (Formspree / Resend / n8n webhook URL)
- Workspace email seat for `bibek@medspagrowthengine.com`
- Real photo to replace `BB` initials in booking page
- Lawyer review of legal pages
- First paying clinic (cold outreach work)

See `LAUNCH_CHECKLIST.md` for the full pre-flight gate list.

---

## SHIPPED

The first build hits all of these.

- **Five-page app shell** (Overview, Pipeline, Clients, Analytics, Settings) — ⭐⭐⭐ ●●
- **Auth + roles** with first-run setup, SHA-256 passcodes, 8h session timeout, optional Google/Apple OAuth — ⭐⭐⭐ ●
- **Live Google Sheets integration** with background polling, manual sync, status pulse — ⭐⭐⭐ ●
- **Kanban Pipeline page** with drag-drop → webhook POST + optimistic UI + snap-back on failure — ⭐⭐⭐ ●
- **Clients data table** with sort, filter, search, dossier drill-down — ⭐⭐ ◑
- **Analytics page** with period selector, conversion funnel, revenue line chart, stage time bars, activity heatmap — ⭐⭐⭐ ●
- **⌘K command palette** searching clients, appointments, pages, system actions — ⭐⭐⭐ ◑
- **Notifications dropdown** from activity log + urgency triggers + stale entities — ⭐⭐ ◑
- **Quick-add menu** linking to supporting tools (intake form, configurator) — ⭐ ◐
- **Embedded assistant** ("Coral") with 5-category intent matcher + chip suggestions — ⭐⭐⭐ ●
- **Theme toggle** (dark default, light alternative), both WCAG AA — ⭐⭐ ◑
- **Compact density** for high-volume sheets — ⭐ ◐
- **Mobile responsive** — sidebar drawer, kanban horizontal snap, full-screen chat — ⭐⭐⭐ ●
- **Webhook secret** required on every webhook call (matches the workflow auth I added) — ⭐⭐⭐ ◐
- **System check tool** (`tools/system-check.html`) — config completeness, sheet schema, webhook reachability — ⭐⭐ ◑

---

## NEXT — top 5 (do these first)

1. **Inline appointment scheduling on the dossier** — ⭐⭐⭐ ●
   Right now the dashboard shows appointments but you have to add new rows in the Sheet. A "+ Schedule appointment" button on the client dossier opens a small modal that appends to the Appointments tab and POSTs to the booking-confirmation webhook in one step.

2. **Bulk actions on Clients table** — ⭐⭐⭐ ◑
   Select multiple rows → bulk mark VIP, bulk re-engagement nudge, bulk export. The most common piece of feedback we'd expect from clinic owners with 200+ active clients.

3. **Activity heatmap → drill-down** — ⭐⭐ ◑
   Clicking a heatmap cell ("Tuesday 2pm") filters the Clients page to people whose appointments fall in that window. Already-rendered cell, just needs a click handler + page navigation.

4. **VIP-only view in Pipeline** — ⭐⭐ ◐
   Toggle that filters every kanban column to VIP-flagged clients only. Useful for the clinic owner's morning briefing.

5. **Annotated screenshots in the empty state for first-run** — ⭐⭐ ◑
   Right now the empty state says "Add your first client". A 4-step inline tour with screenshots cuts time-to-first-value materially.

---

## BACKLOG

Worth doing, no urgency.

- **Print-optimized "Day-of brief"** — single-page printable with today's appointments, alerts, blockers. ⭐⭐ ◑
- **CSV import on Clients page** — for clinics migrating from another system. ⭐⭐ ◑
- **Dossier export as PDF** — for sharing client history with another provider. ⭐ ●
- **Saved filters on Clients page** — name a filter combo, recall it from a dropdown. ⭐ ◑
- **Activity log export with date range** — already accessible in Sheets, but inline export saves a tab switch. ⭐ ◐
- **Multi-clinic switcher** — for operators running this for multiple clinics. Adds a clinic selector in the topbar that switches `mge_config` payloads. ⭐⭐⭐ ●
- **Provider performance breakdown in Analytics** — revenue, retention, no-show rate per provider. Requires the Provider column to be populated, which today is loose. ⭐⭐ ●
- **Customer Lifetime Value column on Clients** — Total Spend exists; add an inferred LTV per client. ⭐ ◐
- **In-dossier email composer** — write and send a one-off email from the dashboard via Gmail API. Touches OAuth scope; needs review. ⭐⭐ ●
- **Search-as-you-type on the global ⌘K palette across appointments by date** — currently search is by client name only. ⭐ ◐
- **Notification preferences per role** — admins want everything; viewers want nothing. ⭐ ◐
- **Color-coded provider chip in kanban cards** — differentiates Botox specialists vs facialists at a glance. ⭐ ◐
- **Stale-stale alerts** (>14 days in any non-terminal stage, not just New Inquiry) — escalates the urgency model. ⭐⭐ ◐

---

## DEFERRED

Worth thinking about but the design isn't settled. Don't build until the questions are answered.

- **In-dashboard message thread per client.** Threading replies to the various automated emails and surfacing them in the dossier is enormous value, but: (a) Gmail API + the necessary scopes are heavy, (b) the threading model needs schema design (do messages live in their own sheet tab or in Activity Log?), (c) where does the line sit between "concierge" and "we're a CRM now"? Resolve scope before building.
- **AI-generated client notes summary on the dossier.** "Coral, summarize this client" → 3-line summary of last 5 visits + sentiment from any feedback. Nice, but needs an LLM call and we're avoiding external API dependencies. If we do it, it should be on-device (Web ML) — needs a feasibility spike.
- **Mobile-first appointment confirmation flow for clients.** A QR-coded confirm/reschedule link that lands on a mobile-optimized page. Touches the workflow layer (would need a 7th workflow) — out of scope per the no-new-automations rule unless we revisit.
- **Two-way Google Calendar sync.** Pulls confirmed appointments into the clinic owner's calendar. Same problem — needs a workflow + OAuth scopes. Defer.
- **Forecasting on Analytics.** "If trends continue, you'll do $X next month." Easy to build, hard to be right about. Worth doing only with a clearly-scoped model and a "this is a projection" disclaimer.

---

## OUT-OF-SCOPE — explicitly not on the roadmap

- **Native iOS / Android apps.** The dashboard is mobile-responsive and runs in Safari/Chrome. A native app would be a separate product line.
- **Multi-tenant SaaS conversion.** MGE is a productized service, not a SaaS. Each clinic gets its own deployed copy. Multi-tenant changes the privacy and pricing model entirely.
- **Replacing the underlying n8n workflows with custom code.** n8n is a deliberate choice — it lets the operator extend the system without redeploying the dashboard. If we replace n8n, we own a backend.
- **In-dashboard payment processing.** Stripe is a separate problem. Card data anywhere near the dashboard would expose it (and the operator) to PCI scope unnecessarily.
- **Replacing Google Sheets as the data backend.** It's the cheap, transparent, exportable, owner-controlled storage layer. The moment we move to a database, we own data residency, backups, and migrations. Not worth the trade.
- **Built-in patient charting / SOAP notes.** Aesthetic clinics often have a separate EHR. Trying to be the EHR puts us in HIPAA scope. Not our line.
- **Email marketing campaigns inside the dashboard.** Mailchimp / Klaviyo exist. The dashboard's job is operational follow-up, not broadcast marketing.
