# Frontend Map

This is the map of visible screens and what each file owns.

## Runtime Pages

| Area | File | Purpose | Preview |
|---|---|---|---|
| Landing page | `landing/index.html` | Public sales page for MedSpa Growth Engine | `http://127.0.0.1:8765/landing/index.html` |
| Booking page | `booking/index.html` | Contact/booking handoff, currently using a prefilled email flow | `http://127.0.0.1:8765/booking/index.html` |
| Dashboard | `dashboard/index.html` | Client operating dashboard: overview, pipeline, clients, analytics, settings | `http://127.0.0.1:8765/dashboard/index.html` |
| Onboarding | `onboarding/index.html` | Guided system setup walkthrough | `http://127.0.0.1:8765/onboarding/index.html` |
| Intake form | `setup/Client_Intake_Form.html` | Clinic-facing lead intake form that posts to Workflow 1 | Open directly or deploy as static HTML |
| System check | `tools/system-check.html` | Operator QA tool for config, sheet, and webhook readiness | `http://127.0.0.1:8765/tools/system-check.html` |
| Day-of brief | `tools/day-of-brief.html` | Utility view for daily clinic operation | `http://127.0.0.1:8765/tools/day-of-brief.html` |
| Privacy | `legal/privacy.html` | Public privacy page | `http://127.0.0.1:8765/legal/privacy.html` |
| Terms | `legal/terms.html` | Public terms page | `http://127.0.0.1:8765/legal/terms.html` |
| One-pager | `outreach/One_Pager.html` | Public sales one-pager | `http://127.0.0.1:8765/outreach/One_Pager.html` or `/one-pager` on Netlify |
| ROI calculator | `outreach/ROI_Calculator.html` | Modeled recovery opportunity calculator | `http://127.0.0.1:8765/outreach/ROI_Calculator.html` or `/roi-calculator` on Netlify |
| Case-study page | `outreach/Case_Study.html` | Proof-style sales page without fake testimonials | `http://127.0.0.1:8765/outreach/Case_Study.html` or `/case-study` on Netlify |

## Dashboard Sections

| Section | What It Must Do |
|---|---|
| Overview | Show KPIs, urgent alerts, recent activity, and quick operational context. |
| Pipeline | Show lead/client stages; drag-drop must write back through Workflow 8 when configured. |
| Clients | List and filter clients, export selected rows, bulk Mark VIP, and send confirmations. |
| Analytics | Show revenue/service/performance views based on Google Sheet data. |
| Settings | Store clinic details, Sheet connection, webhook URLs, launch checklist, backup/restore, profile settings, and app preferences. |
| Recovery Assistant | Answer dashboard questions, build task lists, guide next actions, draft copy, and prepare confirmed workflow actions. |

## Local Preview Login

If a local preview browser already has an unknown old account, the login screen shows local-only recovery tools:

- Demo email: `admin@medspagrowthengine.local`
- Demo passcode: `MedSpa2026!`
- `Use local demo admin` creates/signs into that local account.
- `Reset local login` clears only local browser users and session.

These tools only display on localhost, 127.0.0.1, or file previews.

## Shared Frontend Rules

- Public pages should use `assets/brand-tokens.css` for shared colors and fonts.
- Public pages should load `assets/theme.js` when they need the shared dark/light toggle.
- The dashboard remains a self-contained single-file app for easy handoff.
- Any user-facing button must either navigate, save, export, open a tool, or trigger a configured workflow.
- Mobile must keep tap targets at least `44px` high where practical.
- Do not add blank placeholder pages. If a view exists, it needs to be useful.

## Local Preview Command

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Then open the preview URLs listed above.
