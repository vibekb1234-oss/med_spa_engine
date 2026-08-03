# MGE Interaction Patterns

How the components from `Components.md` come together at the screen and flow level. If you're tempted to invent a new flow, check first whether a pattern here already covers it.

---

## Page layouts

### [01] Overview

Single-column flow with three vertical sections.

```
[ KPI grid — 4 tiles, 1×4 desktop, 2×2 tablet, 1×4 stacked mobile ]

[ Critical Alerts panel (full width, panel--bordered) ]

[ Two-column row: Appointments Today  |  Activity Stream ]
```

The 4 KPIs are the fixed anchor — `Active Clients`, `Treatments-Month`, `No-Show Rate`, `Awaiting Reply`. Each has a 7-day sparkline derived from Activity Log.

Critical Alerts surfaces:
1. Today's and tomorrow's unconfirmed appointments
2. New inquiries 7+ days old without follow-up
3. Workflow failures from Activity Log (`Action Type = "Workflow Error"`)

Activity Stream pulls last 12 entries from Activity Log, oldest at bottom. Each row links to the relevant client dossier.

### [02] Pipeline (kanban)

6 columns horizontally: **New Inquiry · Booked · Completed · VIP · At-Risk · Lapsed**.

- Each column has a sticky header with the stage name + count, e.g. `BOOKED · 0014`.
- Cards stack vertically inside, scrollable independently.
- Drag-and-drop between columns triggers a status update — optimistic UI, with snap-back on webhook failure.
- Click a card → drill into the client dossier (in-place page swap, not a modal).
- On mobile: horizontal scroll snap, one column visible at a time, with chevron indicators showing more columns either side.

### [03] Clients

Single panel with the data table inside. Above the table: filter row.

- Filters (left): status dropdown, date range (created), text search input.
- Actions (right): "Add Client" button (opens intake form in new tab), "Export CSV" link.
- Table columns: Name · Email · Status · Total Visits · Last Visit · VIP · Actions.
- Click row → drill into dossier.
- Sort: any column. Multi-sort with `Shift+click`. Sort persists in URL hash (`#sort=lastVisit:desc`).

### [04] Analytics

5 sections vertically:

1. **Period selector** (segmented control: 7D · 30D · 90D · YTD · All) + "Compare to previous" toggle.
2. **4 KPI tiles** with trend deltas (% change vs comparison period).
3. **Two-column row:** Conversion funnel SVG (left) + Revenue line chart for last 6 months (right).
4. **Avg days per stage** — horizontal bar chart, one bar per pipeline stage.
5. **Activity heatmap** (day-of-week × hour-of-day) + two distribution panels (lead source pie · service mix bars) + Top 5 clients by visits table.

### [05] Settings

Tabs: Profile · Users · System · About.

- **Profile** — current user's name, role, density preference, theme preference, sign out.
- **Users** — registry table; admins see all rows + "Add user" button + role permissions matrix; non-admins see only their own row.
- **System** — masked sheet ID/API key with reveal-on-click; n8n webhook table with reachability indicators (green/amber/red); OAuth client IDs for Google + Apple Sign In.
- **About** — build version, link to README, keyboard shortcut reference, license credits.

---

## Navigation pattern

- **Primary navigation** lives in the sidebar — 5 items, never more.
- **Secondary navigation** within a page is via tabs at the top of the page body (only Settings uses this).
- **Tertiary navigation** for drill-downs (e.g. into a client dossier) uses a `← Back to <Page>` link at the top-left of the drilled-in view, NOT a breadcrumb. We have one level of drill-down, so a breadcrumb would be overkill.
- The active sidebar item gets the `--accent` indicator. Active drill-down does not change the sidebar — the back link tells the user where they came from.

---

## Drill-down pattern

When clicking into a primary or secondary entity:

1. Page body fades out (opacity 0, 120ms).
2. Body content swaps to the dossier (no URL change for now — the URL hash gets updated to `#client=<id>` for shareability and so back-button works).
3. Body fades in.
4. The `← Back to <Page>` link appears in the top-left of the body.

Browser back button restores the previous page. The page-level state (search filters, scroll position) is preserved.

---

## Auth flow

### First run
1. App detects no users in `mge_users` localStorage.
2. Shows a centered setup card: clinic name + admin name + admin email + passcode (twice) + optional Google/Apple OAuth buttons (only shown if OAuth client IDs configured).
3. Submitting creates the admin user, hashes the passcode (SHA-256 via Web Crypto API), persists, and logs in.

### Login
1. Operator enters email + passcode (or clicks Google/Apple).
2. Hash matched against `mge_users` → success → write session token to `mge_session`.
3. Session is valid 8 hours; the sidebar footer shows a live countdown.
4. At 7h45m a toast warns "Session expires in 15 minutes — extend?" with an extend button.
5. At 8h00m, if not extended: auto-logout, return to login screen, retain unsaved input where possible.

### Logout
- Clears `mge_session` only.
- Other state (`mge_config`, `mge_preferences`, `mge_users`, `mge_notifications_seen`) persists.

### Roles
| Role | Can see | Can do |
|------|---------|--------|
| ADMIN | All pages | All actions, manage users, edit System settings |
| INJECTOR | All pages | Mark Complete, Send Confirmation, edit own profile |
| FRONT_DESK | Overview, Pipeline, Clients | Mark Complete, Send Confirmation |
| VIEWER | Overview, Pipeline, Clients | Read-only |

Role gating happens at three layers: sidebar nav (hidden links), page render (return early with empty state if unauthorized), and action buttons (disabled with tooltip).

---

## Density pattern

- Default density. Compact density toggled per-user in Settings → Profile.
- Compact reduces vertical rhythm by 25% via `data-density="compact"` attribute selectors in CSS.
- Use compact when the user has high-volume sheets (>500 clients). The default is comfortable for ≤300 clients.
- Sparkline / icon sizes do NOT change between densities — only padding and row heights.

---

## Theme pattern

- Two themes: dark (default), light.
- Toggled per-user via the topbar sun/moon icon, persists to `mge_preferences`.
- Both themes are equally first-class — every component renders correctly in both, and contrast is verified WCAG AA in both.
- Theme switch is instant; no animation (avoids flash-of-wrong-theme on intermediate frames).
- The system DOES respect `prefers-color-scheme` on first run only — once the user has explicitly set a theme, MGE uses that.

---

## Empty-data pattern

When a sheet tab is empty or filtered to nothing:
1. Show the panel chrome with the section header.
2. Inside the body: empty-state component (icon + title + sub + optional CTA).
3. CTAs are concrete, not abstract: "Add your first client" not "Get started".

When the sheet ISN'T empty but the filter returns nothing:
- Title: "No matches"
- Sub: "No clients match the current filters."
- CTA: "Clear filters" (resets to default).

---

## Loading pattern

Three tiers of feedback for async operations:

1. **<300ms** — no indicator. Most cached reads. Optimistic UI for kanban moves.
2. **300ms – 2s** — inline spinner inside the button OR skeleton rectangles in panels.
3. **>2s** — full-page loading state OR a top-of-page progress bar (rare; reserved for first-load).

The status pulse in the topbar always reflects current state regardless of which tier is active.

---

## Error pattern

- **Action errors** (webhook failed, network error) → toast with action-specific copy, "Retry" button on the toast itself.
- **Field validation errors** → inline below the field, red helper text.
- **Page-level errors** (sheet unreachable, schema mismatch) → centered error state replacing the page body, with a "Run system check" link to `tools/system-check.html`.
- **Critical errors** (auth flow broken, localStorage corrupted) → modal with copy explaining the issue and a "Reset MGE" button (clears all localStorage, requires confirmation).

Error messages never blame the user. "We couldn't reach the sheet" not "You entered the wrong sheet ID".

---

## Toast pattern

- Used for transient feedback only. Not a place to put information the user might want again.
- Auto-dismisses after 4 seconds. Click anywhere on the toast to keep it open; click X to dismiss.
- Stack from bottom — newer toasts push older ones up. Max 3 visible; older ones are dropped silently.
- Toasts are not persistent — refreshing the page clears them. Persistent feedback belongs in the activity log.

---

## Assistant flow (chatbot — "Coral")

The assistant is opinionated about its scope: it knows the dashboard's data and the user's settings, and it's friendly. It does not pretend to be ChatGPT.

### Intent categories

1. **Navigation** — "show pipeline", "go to settings", "open analytics", "home" → navigate + brief confirm.
2. **Search** — "find Olivia", "where is Sarah Mitchell", "look up emma.t@demo.com" → list matches with cards; clicking opens dossier.
3. **Live data** — "how many active clients", "what's my no-show rate", "who's at risk", "top clients", "appointments today" → answer from cached sheet data with the relevant number formatted in `--font-mono`.
4. **System knowledge** — "what is a stale inquiry", "how does the booking confirmation work", "what's my role", "what does VIP mean", "what's the webhook secret for" → canned explanatory copy referencing the actual documented behaviour.
5. **General conversation** — greetings, time/date, simple math, 5+ medspa-themed jokes, encouragement, weather (graceful "I don't know — try weather.com"), goodbye, identity ("I'm Coral, your MGE concierge").

### Suggestion chips
Below the input, 3–4 chips that change with context:
- On open: "How are we doing today?" · "Show me at-risk clients" · "Tell me a joke"
- After search result: "Open dossier" · "Mark complete" · "Send a reminder"
- After live-data answer: "Show the chart" · "Export this" · "Drill in"

### Tone
Warm, brief, professional. Never long-winded. Uses the operator's first name on first message of a session. Uses `--font-mono` for numbers, dates, and IDs.

### Fallback
On unknown query: "I didn't quite catch that. Try: <chip 1>, <chip 2>, <chip 3>." Never silent.

### Privacy
The assistant runs entirely client-side. It does not POST chat messages anywhere. It reads only from the cached sheet snapshot and from `mge_users` for the operator's name.

---

## Sync pattern

- Background poll every 5 minutes per page. Manual "Force Sync" button on Overview.
- Each sync: parallel fetch of all sheet tabs → merge into in-memory state → re-render visible page.
- Status pulse in topbar reflects sync state.
- If a sync fails: keep previous data visible, set pulse to amber, log to console, no toast (avoids noise).
- If 3 consecutive syncs fail: show a persistent inline alert at the top of every page with "Run system check" link.

---

## Configuration pattern

All configuration lives in `mge_config` localStorage. Settings → System edits this object. The four pieces of config:

1. `apiKey` — Google Sheets API key
2. `sheetId` — the MedSpa sheet
3. `webhookSecret` — same value as in n8n
4. `webhooks` — object mapping name → URL (lead-intake, appointment-complete, booking-confirmation)

Plus optional:
5. `googleClientId` — for Google Sign In
6. `appleClientId` — for Apple Sign In
7. `clinicName`, `clinicEmail`, `reviewLink`, `clinicTimezone` — for display and downstream tools

The dashboard refuses to render any data page if `apiKey` and `sheetId` are not both set — Overview shows a setup nudge instead.
