# MedSpa Growth Engine Operations OS

This folder is the business operating system around the finished product build. Use it to find, sell, deliver, and retain clients without turning MGE into a heavy SaaS operation.

## Read First

**`AI_OPERATOR_OS.md`** — the authoritative operating layer. Every other file in this folder is either a template it references or an SOP for a specific phase. If you only read one file, read this.

## Operating Principle

MedSpa Growth Engine is a niche managed automation offer for independent aesthetic clinics. The goal is not volume SaaS — it's a small number of high-quality clients delivered through the same repeatable system every time.

## File Map

### Operator (start here)
| File | Purpose |
|---|---|
| `AI_OPERATOR_OS.md` | ★ The authoritative operator brief — runtime binding, roles, quality gates, phases, launch gate |
| `AI_LEAD_RESEARCH_AND_PERSONALIZATION.md` | Research fields, pain hypotheses, prompt templates, and the no-generic-outreach gate |
| `AI_COMMUNICATION_SYSTEM.md` | Reply triage taxonomy and escalation rules |
| `AI_PIPELINE_WORKFLOWS.md` | Concrete lead-to-client Sheet/n8n workflow blueprints |

### Templates (import these)
| File | Purpose |
|---|---|
| `AI_LEAD_PIPELINE_TEMPLATE.csv` | Lead tracker schema — import to Sheets/Notion/Airtable |
| `AI_AUTOPILOT_SETUP_CHECKLIST.csv` | Owner-side setup prerequisites |
| `AI_CALL_BRIEF_TEMPLATE.md` | Pre-call research + demo prep template |
| `MASTER_TASKS.csv` | ★ Canonical task board — this is the only task board. Import to your tool of choice |

### SOPs (phase-specific runbooks)
| File | Purpose |
|---|---|
| `GTM_FUNNEL_OS.md` | Full funnel from lead source to retained client |
| `LEAD_FINDING_SOP.md` | Weekly lead sourcing playbook |
| `SALES_CLOSING_SOP.md` | Discovery, demo, objection handling, follow-up, close |
| `DELIVERY_SOP.md` | Day-by-day install from paid client to go-live |
| `RETENTION_SUCCESS_SOP.md` | Monthly reporting, support boundaries, churn prevention, upsells |

### Tracking + review
| File | Purpose |
|---|---|
| `TASK_TRACKER.md` | Narrative task board — read alongside MASTER_TASKS.csv |
| `SCORECARD.md` | Weekly owner metrics and launch readiness scorecard |
| `GROWTH_OPERATOR_REVIEW_RESPONSE.md` | Strategic response to growth-operator review + updated positioning |

### Parked
| File | Purpose |
|---|---|
| `parked/AI_ADS_FUNNEL_SYSTEM.md` | Phase 8 — do not open until first paying client + proven outbound hooks |
| `parked/*.merged .deleted .inlined` | Superseded files. Content lives in `AI_OPERATOR_OS.md` or the SOPs |

## Weekly Rhythm (solo operator)

| Day | Focus | Output |
|---|---|---|
| Monday | Lead list + outreach prep | 50–100 qualified clinics added to tracker |
| Tuesday | Outbound + follow-up | New conversations started, old replies chased |
| Wednesday | Demo calls + proposal follow-up | Calls booked, proposals sent, decisions requested |
| Thursday | Delivery work | Client installs, QA, handoff, fixes |
| Friday | Reporting + retention | Client update emails, internal scorecard, next-week priorities |

The AI's always-on queues (see `AI_OPERATOR_OS.md` section 5) run every day. This rhythm is the owner's focus block, not the AI's schedule.

## AI Operator Rhythm

| Cadence | AI output | Owner output |
|---|---|---|
| Daily | Inbox brief, hot replies, follow-ups due, delivery blockers, client health risks | Calls, approvals, sensitive replies, client trust moments |
| Weekly | Lead list, scored prospects, outreach queue, sales pipeline review, client report summary | Market choice, campaign approval, close decisions, launch approvals |
| Monthly | Retention review, churn-risk scan, offer improvement ideas, upsell timing | Success calls, renewal decisions, pricing/package decisions |

## Autopilot Launch Order

1. Pick a runtime (A/B/C — see `AI_OPERATOR_OS.md` section 0)
2. Import `AI_LEAD_PIPELINE_TEMPLATE.csv` and `MASTER_TASKS.csv`
3. Connect inbox, calendar, and set compliance rules
4. Test lead research + personalization on 10 leads
5. Approve first campaign
6. Turn on outreach queue with send limits
7. Turn on reply triage and daily owner brief
8. Turn on call prep and proposal follow-up
9. Turn on delivery/client success monitoring
10. Turn on ads (Phase 8) only after outbound hooks prove traction

## Client-state single source of truth

Client state lives in the **Clients** tab of the per-clinic Google Sheet (managed by the dashboard). The AI Operator layer READS this Sheet — it does not create a parallel client database. If you need a field the Sheet doesn't have, add it to the Sheet, not to a new table.

The `AI_LEAD_PIPELINE_TEMPLATE.csv` is for LEADS (pre-close). Once a lead becomes a paying client, they move into the per-clinic Sheet as a Client and stop appearing in the lead pipeline.

## Non-Negotiables

- No fake case studies
- No guaranteed revenue claims
- No custom build scope without a paid change request
- No dashboard exposed publicly without hosting-level protection
- No client launch without restricted API key, unique webhook secret, OAuth connected, and Workflow 7 error handling wired
