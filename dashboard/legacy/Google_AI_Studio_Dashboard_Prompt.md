# Google AI Studio Build — MedSpa Growth Engine Dashboard

## How to Use
1. Go to **aistudio.google.com** → click **Build**
2. Paste the full prompt below
3. Click Generate → Download the HTML file
4. Replace `YOUR_GOOGLE_SHEETS_API_KEY` and `YOUR_MEDSPA_SHEET_ID`
5. Open in Chrome or host on GitHub Pages / Firebase Hosting

---

## The Prompt

Build me a single self-contained HTML file — no external files, no build step, everything inline — that serves as a real-time client retention dashboard for an independent MedSpa or aesthetic clinic owner.

### Data Source
Fetch from Google Sheets API v4 (REST). Endpoints:

**Clients sheet:**
```
https://sheets.googleapis.com/v4/spreadsheets/YOUR_MEDSPA_SHEET_ID/values/Clients?key=YOUR_GOOGLE_SHEETS_API_KEY
```

**Appointments sheet:**
```
https://sheets.googleapis.com/v4/spreadsheets/YOUR_MEDSPA_SHEET_ID/values/Appointments?key=YOUR_GOOGLE_SHEETS_API_KEY
```

**Activity Log sheet:**
```
https://sheets.googleapis.com/v4/spreadsheets/YOUR_MEDSPA_SHEET_ID/values/Activity%20Log?key=YOUR_GOOGLE_SHEETS_API_KEY
```

Row 1 of each sheet is the header. Parse accordingly.

---

### Clients Column Mapping
| Column | Header |
|--------|--------|
| A | Client Email |
| B | Client Name |
| C | Phone Number |
| D | Service Interest |
| E | Lead Source |
| F | Referral Name |
| G | Status |
| H | Total Visits |
| I | Total Spend |
| J | Last Visit Date |
| K | Next Appointment |
| L | Last Follow-Up Date |
| M | Follow-Up Count |
| N | Review Requested |
| O | Review Left |
| P | Referral Asked |
| Q | VIP Status |
| R | Notes |
| S | Created Date |
| T | Opted Out |

### Appointments Column Mapping
| Column | Header |
|--------|--------|
| A | Client Email |
| B | Client Name |
| C | Service |
| D | Provider |
| E | Appointment Date |
| F | Appointment Time |
| G | Status |
| H | Pre-Appt Reminder Sent |
| I | Post-Appt Follow-Up Sent |
| J | Review Request Sent |
| K | Revenue |
| L | Notes |

### Status Values & Colours
- New Inquiry → light blue (#cfe2f3)
- Booked → light yellow (#fff2cc)
- Completed → light green (#d9ead3)
- No-Show → light red (#f4cccc)
- Lapsed → light grey (#efefef)
- VIP → gold (#ffd966)

### VIP Status Colours
- Standard → white
- VIP → gold (#ffd966)
- Lapsed → grey (#efefef)

---

### Visual Design
- Elegant, beauty-industry aesthetic: deep rose/pink sidebar (#9d174d) with white text
- Main content: white (#ffffff) with soft pink-tinted cards (#fdf4ff)
- Accent: rose (#be185d) for highlights and CTAs
- Secondary: purple (#7c3aed) for charts
- Font: system-ui, -apple-system, sans-serif
- Rounded corners (border-radius: 12px on cards)
- Subtle box shadows
- Responsive (1280px+ desktop)

---

### Pages / Sections (sidebar navigation)

#### 1. Dashboard (default)
**KPI Cards Row:**
- Total Active Clients (Status = Booked or Completed, excluding Lapsed/New Inquiry)
- Total Client Lifetime Value (sum of Total Spend, all clients)
- Appointments This Month (count from Appointments sheet where Appointment Date is current month)
- Revenue This Month (sum of Revenue from Appointments where Status = Completed, current month)
- No-Show Rate This Month (No-Show count / total scheduled × 100, current month)
- Review Conversion Rate (Review Left = Yes / Review Requested = Yes × 100)

**At-Risk Clients Panel (orange-bordered):**
Clients where Last Visit Date was 60–90 days ago AND Status ≠ Lapsed. Show: Client Name | Last Visit | Service | Days Since Visit (in bold orange). Title: "⚠️ Due for Re-booking (60–90 days)"

**Lapsed Clients Panel (red-bordered):**
Clients where Last Visit Date was 90+ days ago OR Status = Lapsed. Show same columns but in red. Title: "🔴 Lapsed Clients (90+ days)"

**Today's Appointments:**
From Appointments tab, show all appointments where Appointment Date = today. Columns: Time | Client Name | Service | Provider | Status. Colour-code status column.

**Recent Activity Feed:**
Last 10 rows from Activity Log, newest first. Show: Timestamp (formatted "Mar 17 · 9:41am") | Client Email | Action Type (colour-coded pill) | Details.

---

#### 2. Client Table
Full sortable, filterable table.

Columns: Client Name | Status (colour badge) | Service Interest | Total Visits | Total Spend ($) | Last Visit | VIP Status (badge) | Review Left | Actions

Features:
- Search by name/email
- Filter by Status (multi-select), VIP Status, Service Interest
- Sort any column
- Click row → opens Client Detail Modal

**Client Detail Modal (slide-in from right):**
- Name, email (copy button), phone (copy button)
- All fields in 2-column grid
- Total Visits as large number with star badge if VIP
- Last Visit Date + Next Appointment
- Status as large colour badge
- Notes in editable-looking textarea (display only)
- Appointments history (mini-table of past visits from Appointments sheet)
- Close (X) top right

---

#### 3. Appointments
**Stats Row:**
- Scheduled Today
- Completed This Month
- No-Shows This Month
- No-Show Rate (%)

**Full Appointments Table:**
Columns: Client Name | Service | Provider | Date | Time | Status (badge) | Revenue | Reminders Sent | Review Sent

Filter by: Status, Provider, Date range (this week / this month / last month)

---

#### 4. Analytics
Load Chart.js from CDN: https://cdn.jsdelivr.net/npm/chart.js

**Charts:**
1. **Monthly Revenue Trend** — bar chart, last 12 months from Appointments (sum Revenue by month, Status = Completed)
2. **Monthly Appointments** — line chart, total appointments per month for last 12 months
3. **No-Show Rate Trend** — line chart, no-show rate % per month for last 12 months
4. **Client Status Breakdown** — doughnut chart (New Inquiry / Booked / Completed / No-Show / Lapsed)
5. **Service Mix** — doughnut chart (count by Service Interest)
6. **Lead Source Distribution** — doughnut chart (count by Lead Source)
7. **Review Collection Rate** — single stat card: "X% of completed appointments resulted in a review request"
8. **Client Retention** — bar chart showing: New Clients vs Returning Clients per month (returning = Total Visits > 1)

All charts: white card, 12px border-radius, soft shadow.

---

#### 5. No-Show Recovery
Dedicated view for managing no-shows.

**Stats:** No-Shows This Month | No-Shows This Week | Revenue Lost This Month (no-shows × average appointment revenue) | Recovery Rate (no-shows who rebooked / total no-shows)

**No-Show Table:**
All appointments with Status = No-Show. Columns: Client Name | Service | Appointment Date | Days Ago | Post-Appt Email Sent | Rebooked (derive from: does this client have a later Scheduled appointment?)

Highlight rows where no recovery email was sent in orange.

---

#### 6. Settings
Form saving to localStorage:
- Clinic Name (used in header greeting)
- Owner Name
- Clinic Email
- Google Sheets API Key
- MedSpa Sheet ID
- Average Appointment Revenue (used in no-show revenue calculation, default $300)
- Save Settings button

On load: read from localStorage. If API Key or Sheet ID missing, show banner: "⚠️ Please configure your API Key and Sheet ID in Settings."

---

### Technical Requirements

1. **Single file** — all CSS, JS, HTML inline. Only Chart.js from CDN.
2. **Auto-refresh** — every 5 minutes. Show "Last updated: X minutes ago" in header.
3. **Loading states** — animated skeleton grey blocks while fetching.
4. **Error handling** — non-blocking toast if API fails: "Could not refresh data."
5. **localStorage** — persist settings + last active tab.
6. **Format currency** as $X,XXX (no decimals for whole amounts).
7. **Format dates** as "Mar 17, 2026".
8. **Mobile** — sidebar collapses to hamburger on < 768px.
9. **Page title**: "MedSpa Growth Engine — Clinic Dashboard"
10. **Favicon**: 💎 emoji favicon

### Header Bar
- Left: "💎 MedSpa Growth Engine" logo text
- Centre: current date + "Good morning/afternoon, [Clinic Name]"
- Right: last updated timestamp + 🔄 refresh button

### Empty States
- No at-risk clients: "✅ All clients are up to date!"
- No appointments today: "No appointments scheduled for today."
- No no-shows this month: "✅ Zero no-shows this month — great retention!"

### Footer
"MedSpa Growth Engine — Built with n8n + Google Sheets + AI"

### Colour Theme Summary
Primary: #be185d (rose)
Secondary: #7c3aed (purple)
Sidebar: #9d174d (deep rose)
Background: #fdf4ff (pale lavender-pink)
Cards: #ffffff
Text: #1f2937
Muted: #6b7280
