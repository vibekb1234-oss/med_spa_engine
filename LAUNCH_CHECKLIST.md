# Launch Checklist

Pre-flight gates before MedSpa Growth Engine goes public. Work top to bottom. Nothing here is optional unless explicitly marked.

---

## A — Operator setup (one-time, before any prospect sees the site)

### A.1 Domain + hosting
- [ ] Buy `medspagrowthengine.com` (or your final domain) — Cloudflare Registrar / Namecheap / Porkbun
- [ ] Set up Netlify, Vercel, or Cloudflare Pages — point at the repo or a `dist/` build
- [ ] Connect domain DNS to host — A/AAAA or CNAME per host's instructions
- [ ] Force HTTPS in host settings
- [ ] Set up apex → www redirect (or the reverse) — pick one canonical
- [ ] Add `/landing/`, `/booking/`, `/onboarding/`, `/legal/privacy.html`, `/legal/terms.html` to host routing (or use `/landing/index.html` as the root index)
- [ ] Deploy the public bundle only: `assets/`, `landing/`, `booking/`, and `legal/`. Keep `dashboard/`, `setup/`, `tools/`, `onboarding/`, `system/`, `operations/`, `workflows/`, raw internal docs, and temporary outputs off the open internet unless the route is protected by host-level access control.
- [ ] Verify all internal links resolve (no `mailto:hello@example.com` orphans)

### A.2 Email infrastructure
- [ ] Set up `bibek@medspagrowthengine.com` (Google Workspace, $7/mo) — never send from a free Gmail when going pro
- [ ] Configure SPF, DKIM, and DMARC records on the sending domain
- [ ] Warm the sender for 14 days before any outreach blast (3 emails day 1, 5 day 2, ramping up)
- [ ] Set up a separate "alerts" inbox or label for Workflow 7 (error handler) notifications
- [ ] Update `vibekb.1234@gmail.com` references in `legal/privacy.html` and `legal/terms.html` to the new domain email once warm

### A.3 Booking
- [x] Booking page uses a revenue leak snapshot request form instead of an embedded scheduler.
- [x] Form posts to Netlify when hosted and falls back to a prefilled email draft if local preview or hosted submission fails.
- [ ] Test the booking flow end-to-end yourself with a second email after deployment.
- [ ] Optional upgrade: add Calendly, Cal.com, SavvyCal, or Tidycal only if you want prospects to self-schedule instead of receiving three personal time options.

### A.4 Form handling
- [x] Booking form ships with Netlify form submission plus a working `mailto:` fallback to the current operator inbox. Prospects can reach you on day one.
- [ ] (Optional upgrade) Swap Netlify Forms for Formspree, Resend, or a dedicated n8n webhook only if you want deeper routing/CRM logic.

### A.5 Legal review
- [ ] Read `legal/privacy.html` and `legal/terms.html` end-to-end
- [ ] Have a lawyer in your jurisdiction review them (priority clauses: warranties, liability, compliance, disputes, governing law)
- [ ] Update the placeholder jurisdictions, retention periods, and operator details
- [ ] Confirm the "Last updated" date is current

### A.6 Analytics + monitoring
- [ ] Add Plausible or simple-analytics to landing/booking pages (avoid GA — privacy-friendly is on-brand)
- [ ] Set up uptime monitoring on the booking page (UptimeRobot free tier)
- [ ] Set up a Slack or Telegram channel for Workflow 7 error alerts to forward into

### A.7 Branding finish
- [ ] Replace `BB` initials avatar in `booking/index.html` with a real photo
- [ ] Verify `assets/og-image.svg` looks correct in LinkedIn/Twitter post previews — convert to PNG (1200×630) if needed for older platforms
- [ ] Verify `assets/favicon.svg` renders on Safari (some Safari versions still need an `.ico` fallback)

---

## B — System hardening (before your first paid client)

### B.1 Security
- [ ] Generate a fresh `WEBHOOK_SECRET` for every clinic install (never reuse across clients)
- [ ] Put `dashboard/`, `setup/`, and `tools/` behind hosting-level access control before public launch (Cloudflare Access, Netlify/Vercel password protection, or equivalent). The in-browser passcode is a convenience gate, not a server-side auth boundary.
- [ ] In Google Cloud Console, create a per-client API key restricted to:
  - Sheets API only
  - HTTP referrer set to the dashboard's actual domain
  - Never use an unrestricted key in production
- [ ] Verify `dashboard/index.html` rejects login attempts after 5 failed passcodes
- [ ] Verify the SHA-256 passcode hash is not logged anywhere visible (browser console, server logs)
- [ ] Confirm OAuth scopes in n8n are minimum-needed (no Gmail "modify all" if you only send)

### B.2 Idempotency + reliability
- [ ] Manually trigger Workflow 2 (Appointment Follow-Up) twice — confirm no duplicate emails sent
- [ ] Force an error in any workflow — confirm Workflow 7 (Error Handler) emails and logs
- [ ] Drag a kanban card in the dashboard — confirm Workflow 8 (Status Update) persists to the Sheet
- [ ] Restart n8n — confirm scheduled triggers come back online
- [ ] Test webhook authentication: send a request without `X-Webhook-Secret` → must return 401/403

### B.3 Backup
- [ ] Export the dashboard config (Settings → System → Export config) and store the JSON file
- [ ] Download all 8 configured n8n workflow JSONs and archive them in the client's folder
- [ ] Set Google Sheets to auto-snapshot weekly via Apps Script trigger
- [ ] Document the restore process in the client's runbook

### B.4 Documentation
- [ ] `setup/Setup_Guide.md` — re-read after every system change, keep it current
- [ ] `ARCHITECTURE.md` — verify the diagram matches reality
- [ ] `MANAGED_OS_PACKAGE.md` and `GTM_LAUNCH_GUARDRAILS.md` — review against current pricing/scope
- [ ] Update `README.md` if the file tree has changed

---

## C — Sales readiness

### C.1 Discovery + demo
- [ ] Rehearse `outreach/Demo_Walkthrough.md` until you can run it without notes
- [ ] Run the ROI calculator against three made-up clinics (low-volume, mid, high) to know the failure modes
- [ ] Prepare answers for: "How is this different from Boulevard / Moxie / Aesthetic Record?" and "What about HIPAA?"

### C.2 Outreach pipeline
- [ ] Confirm `outputs/swarm/ICP.md` matches your current ideal-client thinking
- [ ] Confirm 134 leads in `outputs/swarm/1_raw_leads.csv` are still valid (manual sanity check on 5 random ones)
- [ ] Draft the first email batch using `outputs/swarm/2_lead_briefs.csv` hooks
- [ ] Schedule the first 10 sends manually — never blast a cold list day-one

### C.3 First-client guardrails
- [ ] Have a written engagement letter (one page is fine) signed before any work
- [ ] Collect the setup fee before configuring workflows
- [ ] Schedule the OAuth screen share within 48 hours of payment
- [ ] Block 5 hours in your calendar for the install — interruptions during OAuth are painful

---

## D — Compliance + legal (region-specific)

### D.1 Anti-spam
- [ ] Every automated email has a working unsubscribe link
- [ ] Honor unsubscribes within 10 days (the system flags `opt_out=true` in the Clients sheet)
- [ ] Include the clinic's physical address in every marketing email (CAN-SPAM requirement)
- [ ] If serving Canadian clinics: confirm CASL express-consent requirements

### D.2 Privacy
- [ ] Privacy policy is linked from every page (footer link verified on landing, booking, onboarding, dashboard)
- [ ] Cookie banner — if you ship analytics that drop cookies (Plausible doesn't, GA does)
- [ ] Confirm no PHI fields exist anywhere in the Google Sheet schema

### D.3 Industry
- [ ] Confirm with first clinic Client that their booking platform's TOS allows automated outbound email (some EHRs restrict this)
- [ ] If the clinic uses an EHR with patient-data-sharing rules (Aesthetic Record, Symplast), confirm the workflow data stays out of medical scope

---

## E — Go-live (the day of launch)

### E.1 Pre-launch (T-24 hours)
- [ ] Run `tools/system-check.html` — every row green
- [ ] Final lint of the landing/booking/onboarding pages - no broken links, no visible placeholder text in public pages
- [ ] Verify SSL certificate is valid for all routes
- [ ] Test page load on iPhone Safari, Android Chrome, desktop Chrome, desktop Firefox

### E.2 Launch (T-0)
- [ ] Flip DNS or remove the "coming soon" page
- [ ] Post to LinkedIn (use `outreach/LinkedIn_DM_Sequence.md` headline as starting point)
- [ ] Send first 10 cold emails to the warmest leads in `outputs/swarm/1_raw_leads.csv`
- [ ] Monitor inbox for 4 hours — first replies need immediate attention

### E.3 Post-launch (T+24 hours)
- [ ] Check uptime monitor — no incidents
- [ ] Check form submissions arrived correctly
- [ ] Check that test demo bookings made it onto your calendar
- [ ] Send first daily update to `vibekb.1234@gmail.com` if you have one — note any friction points

### E.4 Post-launch (T+7 days)
- [ ] Read all incoming replies — categorize as: hot, warm, cold-but-replied, unsubscribe
- [ ] Adjust outreach copy based on what worked and what didn't
- [ ] Update `outputs/swarm/2_lead_briefs.csv` with notes from real conversations
- [ ] Schedule follow-up sends for any warm/cold-but-replied leads

---

## F — Known gaps Bibek must close personally

These cannot be done from Claude's side:

- [ ] **Domain purchase + DNS setup** — needs your card and your account
- [ ] **Hosting account** — needs your card and your account
- [ ] **Calendly link** — needs you to create the account and configure the event
- [ ] **Form handler endpoint** — Formspree/Resend/n8n webhook URL — paste it into `booking/index.html`
- [ ] **Workspace email** — `bibek@medspagrowthengine.com` needs Google Workspace seat
- [ ] **Real photo** — replace `BB` initials in booking page
- [ ] **First paying clinic** — no checklist closes this; outreach + sales call work does
- [ ] **Lawyer review of Privacy + Terms** — required before first paid Client
- [ ] **Real testimonials** — current landing page uses "managed automation package" framing instead of a fake quote, which is correct; replace once you have a real client willing to be cited

---

## Done means

The launch checklist is done when:
1. A stranger can land on `/landing/`, read the page, click "Map my clinic's leaks", land on `/booking/`, submit the leak snapshot request, and receive a reply with time options or a booking link.
2. You can send a cold email at 9am Monday and have the prospect read a polished page that matches the email's tone by 9:01am Monday.
3. Your first paid Client can complete `/onboarding/` without DMing you for help.

If any of those three is broken, you are not launched.
