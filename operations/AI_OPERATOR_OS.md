# AI Operator OS — MedSpa Growth Engine

The always-on operating layer for finding leads, closing them, delivering the install, and retaining clients. This is Bibek's Jarvis. It does not replace the product (the 10 client workflows + dashboard) — it runs the *business* around the product.

**Read this file first. Everything else in `operations/` is either a template it references, or an SOP for a specific phase.**

---

## 0 · Runtime binding — what actually runs the AI

Before any of the roles below can do anything, the AI needs a runtime. Pick ONE and use it consistently. Do not stack three of these at once.

| Runtime | When to pick it | What runs | Cost |
|---|---|---|---|
| **A. Claude in Cowork (default for launch)** | You have zero paying clients. You want to iterate fast without wiring anything. | Copy the prompt from the relevant AI role, paste the lead row or reply thread, keep the output. Do it once a day. | $20/mo Anthropic Pro or Claude Cowork |
| **B. n8n + OpenAI node (upgrade after 3 paying clients)** | You have recurring cadence and want cron-driven daily briefs and lead enrichment. | A new n8n workflow calls the OpenAI/Anthropic node with the prompt from a role, writes back to a Sheet. | ~$0 marginal (existing n8n cloud + API pay-as-you-go) |
| **C. Manual only (fallback)** | Everything is on fire. You want to do outreach by hand for a week. | You use `AI_LEAD_RESEARCH_AND_PERSONALIZATION.md` prompts inside ChatGPT/Claude web UI. No infra. | $0 |

**Default at launch: A.** Do not build runtime B until you have proven the prompt structure with real replies from at least 3 clinics. The moment you start building n8n plumbing for AI enrichment before the copy has proven itself, you're burning setup time on a spec.

**Non-runtime dependencies you must have regardless of A/B/C:**
- Sending inbox (Gmail Workspace with SPF/DKIM/DMARC once you have the domain)
- Calendly / Cal.com booking link
- Lead sheet (see `AI_LEAD_PIPELINE_TEMPLATE.csv`)
- Task board (see `MASTER_TASKS.csv` — the single canonical board; ignore any other task board files)
- Approved send limit per day (start at 20 cold sends/day, ramp to 50)

---

## 1 · North Star

MedSpa Growth Engine sells one mechanism:

**Lost Revenue Recovery OS for MedSpas.**

Every AI-drafted message, every call brief, every proposal should point to the seven leaks the product actually closes:

- Missed consults
- Slow inquiry follow-up
- No-shows and late cancels
- Cold leads
- Lapsed VIP clients
- Inconsistent review and referral asks
- Weak owner visibility

Never lead with "AI automations", "chatbots", "CRM", or "we automate anything". Those phrases sound like every other agency and get filtered by the sharp clinic owners you actually want.

---

## 2 · Operating model

| Area | AI handles | Owner handles |
|---|---|---|
| Lead finding | Sources, enriches, scores, organizes | Approves markets and quality bar |
| Outreach | Drafts messages, follow-ups, replies, variants | Approves first campaigns and sensitive replies |
| Sales | Builds call briefs, objection prep, recap emails | Takes the call, decides offer and price |
| Ads | Drafts hooks, creatives, targeting | Approves spend, claims, final creative |
| Onboarding | Access checklists, kickoff notes, missing-info chases | Payment, contracts, trust moments |
| Delivery | Scope-to-tasks, QA drafts, update drafts | Credential-sensitive setup and go-live approval |
| Monitoring | Watches reports, errors, health signals | Handles escalations and client conversations |
| Retention | Weekly wins, monthly summaries, upsell ideas, churn flags | Runs success calls and renewal decisions |

---

## 3 · Autopilot levels

| Level | Mode | AI can do | Owner involvement |
|---|---|---|---|
| 0 | Manual Assist | Research, draft, summarize (nothing else) | Owner runs every action manually |
| 1 | Draft Autopilot | Build lead lists, research, write messages, queue follow-ups | Owner approves every send |
| 2 | Controlled Send | Send approved sequences within daily limits, stop on replies/opt-outs | Owner reviews daily brief and hot replies |
| 3 | Sales Assist | Triage replies, book-call prompts, call briefs, recaps, proposal drafts | Owner takes calls, approves offers |
| 4 | Delivery Assist | Build delivery boards, check blockers, draft client updates | Owner handles credentials and go-live |
| 5 | Retention Monitor | Weekly reports, error checks, churn-risk alerts, upsell timing | Owner handles save calls and strategic changes |

**Default launch mode: Level 1.** Do not move up until:
- The first campaign has been reviewed and doesn't sound generic
- Bounce/opt-out handling is proven
- Daily send limits are set
- Owner is reading the daily brief every morning

Move up one level at a time. Never skip.

---

## 4 · Human approval rules

AI can move fast, not recklessly. Human approval is required before:

- Sending the first version of any new outbound campaign
- Sending high-volume outreach from a live mailbox
- Launching paid ads or increasing spend
- Making revenue, legal, compliance, medical, or guarantee claims
- Offering a discount, custom build, or custom integration
- Handling passwords, OAuth credentials, API keys, or client secrets
- Finalizing contracts, invoices, refunds, payment terms
- Marking a client install as live

AI must never:

- Ask for or store patient health information
- Invent testimonials, results, case studies, or client names
- Promise revenue, reviews, appointments, medical results, or compliance outcomes
- Expose dashboard links, Sheet IDs, webhook URLs, or secrets in public docs

---

## 5 · Always-on queues

The AI's job is to keep these queues clean. Each has an SLA — miss the SLA, escalate to Owner Needed.

| Queue | SLA | Escalation trigger |
|---|---|---|
| Research Needed | Same day | Older than 24h |
| Message Waiting Approval | Same day | Older than 24h |
| Follow-Up Due | Same day | Overdue by 1 day |
| Reply Needs Triage | Same day | Older than 6h for Hot |
| Owner Needed | 24h | 48h stale |
| Call Brief Needed | Before call | Missing 4h before call |
| Proposal Follow-Up Due | 3-day cadence | Overdue by 2 days |
| Delivery Blocked | 24h | Blocker older than 48h |
| Client Risk | Same day | Escalate immediately |

---

## 6 · Lead quality gate

No lead moves into outreach unless it has:

- Clinic name
- Location
- Website or social profile
- Contact route (email, contact form, DM)
- Service category
- At least one real observation from website, reviews, social, booking path, or ads
- A suspected revenue leak
- Fit score
- Recommended first-touch angle

If any of these are missing, status stays `Research Needed`.

---

## 7 · Outreach quality gate

No message is approved unless it passes ALL checks:

- References a real observation
- Names one likely business pain
- Connects that pain to the Lost Revenue Recovery OS
- Short enough to read in under 20 seconds
- Has one clear next step
- Does not sound like a mass template
- Does not guarantee results
- Includes opt-out handling where required

**Bad message** (blocked):
> We help medspas automate their business with AI. Are you free for a call?

**Good message** (approved):
> I saw you push consultations from Instagram into a booking link, but there's no obvious follow-up path for people who don't book right away. We install a recovery layer for medspas so missed consults, no-shows, and lapsed clients get followed up consistently. Worth me sending the 4-leak map?

Full research prompts and examples: `AI_LEAD_RESEARCH_AND_PERSONALIZATION.md`.

---

## 8 · AI roles

| Role | Output | Prompt lives in |
|---|---|---|
| Lead Finder | 50–100 qualified leads per weekly block, each with contact route and suspected leak | `LEAD_FINDING_SOP.md` |
| Lead Researcher | Services, review count, booking path, social activity, owner route, leak hypothesis, fit score | `AI_LEAD_RESEARCH_AND_PERSONALIZATION.md` |
| Offer Copywriter | First-touch email, DM, follow-ups, ad hooks, VSL bullets, landing test copy | `AI_LEAD_RESEARCH_AND_PERSONALIZATION.md` |
| Outreach Manager | Next-touch queue, reply status, unsubscribe list, call booking prompts, daily summary | This file, section 5 |
| Reply Triage Agent | Hot/Warm/Objection/Not now/Referral/Unsubscribe/Bad fit + suggested response + owner-needed flag | `AI_COMMUNICATION_SYSTEM.md` |
| Call Prep Analyst | Clinic snapshot, most likely leak, questions, numbers to collect, objections expected, demo path, recommended offer, close next step | `AI_CALL_BRIEF_TEMPLATE.md` |
| Delivery Coordinator | Delivery task board, missing-access list, client kickoff message, QA checklist, handoff summary | `DELIVERY_SOP.md` |
| Client Success Operator | Weekly wins report, workflow error summary, recovery activity notes, churn-risk flag, upsell timing signal | `RETENTION_SUCCESS_SOP.md` — see integration note below |

**Integration note — Weekly Client Report:** Workflow 5 (`5_MSG_Weekly_Performance_Report.json`) ALREADY sends a report to the clinic owner every Monday 8am. The Client Success Operator does NOT re-send the same report — its job is to read what Workflow 5 sent, add narrative colour, flag risks Workflow 5 can't see, and draft a personal note from Bibek that goes out once a month. Two different outputs, one audience.

---

## 9 · Daily owner brief

The owner gets one brief every morning. Format:

```text
Date:
Revenue priority (one action):
Calls today:
Hot replies:
Follow-ups due:
New leads researched yesterday:
Messages waiting approval:
Delivery/client blockers:
Client health risks:
AI completed:
Owner needed:
```

Runtime A: paste the previous day's activity into Claude in Cowork with the prompt "Generate the MGE daily owner brief using this data. Follow the format in AI_OPERATOR_OS.md section 9."

Runtime B: n8n workflow triggered at 7am reads yesterday's Sheet rows, calls the AI node, writes the brief to a "Daily Brief" tab and emails it to Bibek.

---

## 10 · Weekly growth brief

One brief every Sunday night, format:

- Leads sourced
- Leads approved
- First touches sent
- Follow-ups sent
- Replies (by class)
- Calls booked
- Proposals sent
- Closed revenue
- Delivery status per active client
- Client health status per active client
- What to fix next week

---

## 11 · Key metrics

| Metric | Target |
|---|---|
| Qualified leads added | 50–100 per week |
| First-touch sends | 40–80 per week |
| Follow-up completion | 90%+ |
| Reply classification time | Same day |
| Call brief readiness | Before every call |
| Proposal send time | Same day after fit call |
| Delivery blocker age | Under 48h |
| Client weekly report sent | Every week |
| Workflow errors unresolved | Zero at weekly review |

---

## 12 · Weekly rhythm (solo operator)

| Day | Focus | Output |
|---|---|---|
| Monday | Lead list + outreach prep | 50–100 qualified clinics added to tracker |
| Tuesday | Outbound + follow-up | New conversations started, old replies chased |
| Wednesday | Demo calls + proposal follow-up | Calls booked, proposals sent, decisions requested |
| Thursday | Delivery work | Client installs, QA, handoff, fixes |
| Friday | Reporting + retention | Client update emails, internal scorecard, next-week priorities |

Note: the always-on queues (section 5) run every day. This rhythm is Bibek's focus block, not the AI's schedule.

---

## 13 · Build order (Phases 1–7)

Build the autopilot in this sequence. Do not skip ahead. Do not do all seven in parallel.

### Phase 1 · Control Center
**Goal:** One place for leads, outreach, replies, calls, clients, briefs.
**Build:** Import `AI_LEAD_PIPELINE_TEMPLATE.csv` into a Sheet. Add Outreach Log, Replies, Call Briefs tabs.
**Done when:** Every lead has status + next action. Every contacted lead has next follow-up date. Every reply has a class. Every booked call has a brief.

### Phase 2 · Research Engine
**Goal:** No generic outreach leaves the system.
**Build:** Wire the research prompt from `AI_LEAD_RESEARCH_AND_PERSONALIZATION.md`. Add the Research Needed queue.
**Done when:** 10 sample leads researched, no invented facts, every first-touch uses one real observation.

### Phase 3 · Outreach Queue
**Goal:** Messages and follow-ups happen on time.
**Build:** First-touch generator. Follow-up generator. Approval queue. Send limits. Bounce and unsubscribe handling.
**Done when:** First campaign approved. Test sends log correctly. Follow-up dates populate. Opt-out stops all future touches.

### Phase 4 · Reply Triage
**Goal:** Hot replies surfaced fast.
**Build:** Gmail/DM/manual reply intake. Classification. Suggested response. Owner-needed flag. Daily brief.
**Done when:** All 7 reply classes route correctly.

### Phase 5 · Sales Assist
**Goal:** Owner enters every call prepared.
**Build:** Call brief generator. Demo route generator. Post-call recap draft. Proposal follow-up tracker.
**Done when:** Every booked call gets a brief. Every completed call gets next step + follow-up date.

### Phase 6 · Delivery Assist
**Goal:** Closed client becomes clean install.
**Build:** Sales handoff. Delivery board. Missing-access tracker. QA checklist. Kickoff draft.
**Done when:** Paid client creates tasks automatically. Missing access is chased. Go-live requires QA checklist.

### Phase 7 · Client Success Autopilot
**Goal:** Clients see value, risks caught early.
**Build:** Monthly narrative report (on top of Workflow 5's weekly). Error monitor. Health score. Churn-risk alerts. Monthly improvement ideas.
**Done when:** Every live client gets monthly narrative. Error alerts create tasks. Churn-risk clients escalate to owner.

**Phase 8 — Ads Autopilot — is parked in `operations/parked/AI_ADS_FUNNEL_SYSTEM.md` until at least one paying client exists.** No ad spend until outbound proves the hooks.

---

## 14 · Launch readiness gate

The AI Operator layer is live-ready when:

- Runtime is picked (A, B, or C) and documented in this file
- Lead tracker exists in Sheets
- Research gate works (10 sample leads passed)
- Outreach approval queue works
- Send limits configured
- Unsubscribe handling tested
- Reply triage works
- Daily owner brief works
- Call brief generator works
- Delivery board works
- Client weekly report cadence confirmed (Workflow 5 sends it)
- Secrets are not stored in public files or browser-only storage

---

## 15 · Owner-only setup dependencies

The AI cannot do these. Owner must provide before anything runs:

- Sending email account
- Domain/inbox setup (SPF/DKIM/DMARC)
- Calendar booking link
- Outreach compliance preference (CAN-SPAM, CASL if targeting Canada)
- Target cities/markets
- Approved daily send limit
- Approved offer/pricing
- Payment link or invoice process
- Client contract or engagement letter
- n8n / Sheets access if running Runtime B

Once these are done, the AI operator runs the day-to-day and only calls in the owner when needed.

---

## 16 · Non-negotiables

- No fake case studies
- No guaranteed revenue claims
- No custom build scope without paid change request
- No dashboard exposed publicly without hosting-level protection
- No client launch without restricted API key, unique webhook secret, OAuth connected, Workflow 7 error handling wired

---

*Companion files: `AI_LEAD_RESEARCH_AND_PERSONALIZATION.md`, `AI_COMMUNICATION_SYSTEM.md`, `AI_CALL_BRIEF_TEMPLATE.md`, `AI_LEAD_PIPELINE_TEMPLATE.csv`, `AI_PIPELINE_WORKFLOWS.md`, `LEAD_FINDING_SOP.md`, `SALES_CLOSING_SOP.md`, `DELIVERY_SOP.md`, `RETENTION_SUCCESS_SOP.md`, `MASTER_TASKS.csv`, `SCORECARD.md`.*
