# MedSpa Growth Engine Asset Registry

This is the master map for the build. Use it when you need to find, update, hand off, or audit any asset in the system.

## Core Positioning

| Asset | File | Owns |
|---|---|---|
| Offer and copy bible | `outreach/Offer_And_Copy_Bible.md` | Flagship mechanism, offer ladder, landing copy, email copy, DM copy, VSL, objections, pricing script, copy rules |
| Offer tiers | `outreach/Offer_Tiers.md` | Recovery Core, Revenue Recovery Engine, Local Dominance, front-end offers, scope boundaries |
| Copy asset map | `system/COPY_AND_OFFER_ASSETS.md` | Where all sales/copy files live and what claims are allowed |
| Managed OS package | `MANAGED_OS_PACKAGE.md` | Productized-service packaging and delivery boundary |
| GTM guardrails | `GTM_LAUNCH_GUARDRAILS.md` | Safe positioning, conservative claims, launch sales rules |

## Public Website Assets

| Asset | File | Owns |
|---|---|---|
| Landing page | `landing/index.html` | Public sales page and proof screenshots |
| Booking page | `booking/index.html` | Revenue leak snapshot request and contact handoff |
| One-pager HTML | `outreach/One_Pager.html` | Visual sales one-pager |
| One-pager Markdown | `outreach/One_Pager.md` | Text sales one-pager |
| Case-study page | `outreach/Case_Study.html` | Proof-style sales asset without fake testimonials |
| ROI calculator | `outreach/ROI_Calculator.html` | Modeled recovery opportunity calculator |
| Privacy page | `legal/privacy.html` | Public privacy page |
| Terms page | `legal/terms.html` | Public terms page |

## Design Assets

| Asset | File | Owns |
|---|---|---|
| Design system overview | `design/README.md` | Design philosophy and extension rules |
| Tokens | `design/Tokens.md` | Fonts, colors, spacing, radii, shadows, themes |
| Components | `design/Components.md` | Dashboard and public UI components |
| Patterns | `design/Patterns.md` | Navigation, responsive, state, assistant, theme patterns |
| Roadmap | `design/Roadmap.md` | Shipped, next, backlog, out-of-scope |
| Shared token CSS | `assets/brand-tokens.css` | Public-page CSS variables and shared theme tokens |
| Theme controller | `assets/theme.js` | Dark/light mode behavior |
| Quick design map | `system/DESIGN_ASSETS.md` | Operator-facing design summary |
| Favicon | `assets/favicon.svg` | Browser icon |
| OG image | `assets/og-image.svg` | Social preview image |
| Dashboard proof screenshot | `assets/dashboard-overview.png` | Landing-page expandable proof screenshot |
| Pipeline proof screenshot | `assets/dashboard-pipeline.png` | Landing-page expandable proof screenshot |
| Settings proof screenshot | `assets/dashboard-settings.png` | Landing-page expandable proof screenshot |

## Dashboard And Client OS Assets

| Asset | File | Owns |
|---|---|---|
| Dashboard app | `dashboard/index.html` | Client operating dashboard, auth gate, pipeline, clients, analytics, settings, assistant |
| Email preview | `dashboard/Email_Preview.html` | Client-facing email template preview |
| Legacy dashboard archive | `dashboard/legacy/README.md` | Do-not-deploy archive notes |
| Frontend map | `system/FRONTEND_MAP.md` | Visible pages, dashboard sections, preview URLs |
| AI assistant map | `system/AI_AGENT_MAP.md` | Recovery Assistant behavior, safe actions, optional AI webhook |

## Workflow And Backend Assets

| Asset | File | Owns |
|---|---|---|
| Workflow map | `system/WORKFLOW_MAP.md` | 8 workflow inventory, triggers, ownership |
| Workflow 1 | `workflows/1_MSG_Lead_Inquiry_Intake.json` | Lead intake |
| Workflow 2 | `workflows/2_MSG_Appointment_Follow_Up.json` | Reminders, no-show recovery, inquiry follow-up |
| Workflow 3 | `workflows/3_MSG_Review_Referral.json` | Mark complete, reviews, referrals |
| Workflow 4 | `workflows/4_MSG_VIP_Retention.json` | VIP/lapsed-client retention |
| Workflow 5 | `workflows/5_MSG_Weekly_Performance_Report.json` | Weekly report |
| Workflow 6 | `workflows/6_MSG_Booking_Confirmation.json` | Booking confirmation |
| Workflow 7 | `workflows/7_MSG_Error_Handler.json` | Error handling |
| Workflow 8 | `workflows/8_MSG_Status_Update.json` | Dashboard status writes |
| Google Apps Script | `setup/MedSpa_Engine.gs` | Sheet-side helper script |
| Workflow configurator | `setup/Workflow_Configurator.html` | Setup helper for workflow URLs and secrets |

## Data, Security, And Integration Assets

| Asset | File | Owns |
|---|---|---|
| Data map | `system/DATA_AND_STORAGE.md` | Google Sheet tabs, localStorage keys, data boundaries |
| Integrations and secrets | `system/INTEGRATIONS_AND_SECRETS.md` | OAuth, webhooks, API keys, secrets policy |
| Security guardrails | `system/SECURITY_LAUNCH_GUARDRAILS.md` | Public/private boundary and launch security rules |
| Architecture | `ARCHITECTURE.md` | System architecture overview |
| Netlify config | `netlify.toml` | Static hosting config |

## Setup And Delivery Assets

| Asset | File | Owns |
|---|---|---|
| Setup guide | `setup/Setup_Guide.md` | Client install steps |
| Pre-launch checklist | `setup/Pre_Launch_Checklist.md` | Launch readiness checks |
| Google Sheets schema | `setup/Google_Sheets_Schema.md` | Sheet tabs and columns |
| Client onboarding form doc | `setup/Client_Onboarding_Form.md` | Intake requirements |
| Client intake form | `setup/Client_Intake_Form.html` | Public/clinic-facing intake |
| Client handoff email | `setup/Client_Handoff_Email.html` | Handoff copy |
| Onboarding app | `onboarding/index.html` | Guided setup walkthrough |
| Delivery SOP | `operations/DELIVERY_SOP.md` | Day-by-day fulfillment |
| Retention SOP | `operations/RETENTION_SUCCESS_SOP.md` | Monthly success and retention |
| Sales closing SOP | `operations/SALES_CLOSING_SOP.md` | Discovery, demo, objections, close |

## Sales And Lead Assets

| Asset | File | Owns |
|---|---|---|
| AI autopilot control center | `operations/AI_AUTOPILOT_CONTROL_CENTER.md` | Always-on AI operator levels, queues, handoffs, quality gates, and safety rules |
| AI autopilot build sequence | `operations/AI_AUTOPILOT_BUILD_SEQUENCE.md` | Phase-by-phase implementation path for live autopilot |
| AI autopilot setup checklist | `operations/AI_AUTOPILOT_SETUP_CHECKLIST.csv` | Owner dependencies, automation readiness, sending, research, and safety checklist |
| AI growth operator OS | `operations/AI_GROWTH_OPERATOR_OS.md` | AI-operated acquisition, sales, delivery, monitoring, and retention command layer |
| AI pipeline workflows | `operations/AI_PIPELINE_WORKFLOWS.md` | Lead sourcing, outreach, reply triage, call prep, close, onboarding, monitoring workflow blueprints |
| AI lead research and personalization | `operations/AI_LEAD_RESEARCH_AND_PERSONALIZATION.md` | Research fields, pain hypotheses, no-generic-outreach standard, and prompt templates |
| AI ads funnel system | `operations/AI_ADS_FUNNEL_SYSTEM.md` | Paid ad launch rules, ad angles, funnel flow, and ad review cadence |
| AI communication system | `operations/AI_COMMUNICATION_SYSTEM.md` | Lead/client message rules, reply classification, escalation, and weekly update templates |
| AI client DFY/DWY system | `operations/AI_CLIENT_DFY_DWY_SYSTEM.md` | Client-side DFY/DWY split, monitoring loops, weekly reporting, and retention boundaries |
| AI operator task board | `operations/AI_OPERATOR_TASK_BOARD.csv` | Importable AI task board for lead gen, outreach, sales, ads, delivery, retention |
| AI lead pipeline template | `operations/AI_LEAD_PIPELINE_TEMPLATE.csv` | Importable lead tracker schema for sourcing, scoring, outreach, and follow-up |
| AI call brief template | `operations/AI_CALL_BRIEF_TEMPLATE.md` | Sales-call research, demo route, objections, and close prep |
| AI daily brief template | `operations/AI_DAILY_BRIEF_TEMPLATE.md` | Daily owner action brief for AI-operated growth and delivery |
| GTM funnel OS | `operations/GTM_FUNNEL_OS.md` | Lead source to retained client funnel |
| Lead finding SOP | `operations/LEAD_FINDING_SOP.md` | Weekly lead sourcing |
| Cold email sequence | `outreach/Cold_Email_Sequence.md` | 5-email outbound campaign |
| LinkedIn DM sequence | `outreach/LinkedIn_DM_Sequence.md` | Social prospecting |
| Discovery script | `outreach/Discovery_Call_Script.md` | Call flow |
| Demo walkthrough | `outreach/Demo_Walkthrough.md` | Live demo structure |
| Follow-up copy | `outreach/Post_Call_Follow_Up.md` | Post-call follow-up |
| Treatment copy library | `outreach/Treatment_Copy_Library.md` | Service-specific copy snippets |
| Seasonal calendar | `outreach/Seasonal_Campaign_Calendar.md` | Monthly campaign angles |
| Lead exports | `swarm-output/*.csv` | Sourced/enriched prospect lists |
| Campaign workbook | `MASTER_email_campaign.xlsx` | Email campaign tracking |

## Operations And Tracking Assets

| Asset | File | Owns |
|---|---|---|
| Operations README | `operations/README.md` | Business operating system overview |
| Task tracker | `operations/TASK_TRACKER.md` | Master task board |
| Master tasks CSV | `operations/MASTER_TASKS.csv` | Importable task tracker |
| Scorecard | `operations/SCORECARD.md` | Weekly owner scorecard |
| Launch checklist | `LAUNCH_CHECKLIST.md` | Overall launch checklist |
| Launch readiness report | `LAUNCH_READINESS_REPORT.md` | Launch audit summary |
| Launch operations | `system/LAUNCH_OPERATIONS.md` | Daily launch operation, backup, handoff |


## Launch Infrastructure Assets

| Asset | File | Owns |
|---|---|---|
| Vercel config | `vercel.json` | Clean URLs, route rewrites, security headers, noindex/no-store headers |
| Vercel deploy ignore | `.vercelignore` | Keeps internal docs, setup files, workflows, lead data, and legacy files out of public deploy |
| Public env endpoint | `api/public-env.js` | Exposes only Supabase project URL and anon public key to browser code |
| Login page | `auth/login.html` | Premium auth entry with password, magic link, and Google OAuth hooks |
| Signup page | `auth/signup.html` | Client account creation and profile metadata capture |
| Reset page | `auth/reset.html` | Password reset request flow |
| Auth callback | `auth/callback.html` | Supabase magic-link/OAuth callback route |
| Auth styles/script | `auth/auth.css`, `auth/auth.js` | Shared auth theme, Supabase client bootstrap, theme toggle |
| Supabase schema | `launch/supabase/schema.sql` | Profiles, business profiles, backend configs, onboarding, activity logs, RLS |
| Supabase setup guide | `launch/supabase/README.md` | Env vars, SQL runbook, profile examples, redirect URL setup |
| Tier delivery matrix | `operations/Tier_Delivery_Matrix.md` | Starter/Growth/Pro scope, subscription states, locked feature behavior |
| Client deployment runbook | `operations/Client_Deployment_Runbook.md` | Paid-client install, QA, handoff, retainer process |
| Pre-handoff QA checklist | `operations/Pre_Handoff_QA_Checklist.md` | Public, auth, dashboard, backend, workflow, and handoff QA gates |
| System description | `docs/System_Description.md` | Plain-English system overview and stack |
| Handoff guide | `docs/Handoff_Guide.md` | Routes, private assets, required values, restore notes |
| Launch prompts | `prompts/Launch_Ready_Project_Phased_Prompts.md` | Phased continuation prompts for launch execution |
## Utility Assets

| Asset | File | Owns |
|---|---|---|
| System check | `tools/system-check.html` | Local QA and configuration checks |
| Day-of brief | `tools/day-of-brief.html` | Daily operator brief |
| System description | `System_Description.html` | High-level visual system description |
| Root README | `README.md` | Project-level overview |

## Current Asset Health

- Offer/copy is aligned around the **Lost Revenue Recovery OS for MedSpas**.
- Public pages use the sharpened recovery copy and leak-snapshot CTA.
- Design tokens are documented in `design/` and shared public tokens live in `assets/`.
- System architecture, frontend, workflows, data, integrations, security, launch ops, and AI assistant behavior are mapped in `system/`.
- Sales, lead finding, closing, delivery, retention, task tracking, and scorecards live in `operations/` and `outreach/`.
- Dashboard and operator tools must remain behind protected hosting before live client use.
