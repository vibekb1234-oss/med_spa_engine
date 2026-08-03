# AI Pipeline Workflows

These are the practical workflows for turning MedSpa Growth Engine into an AI-operated client acquisition and delivery machine.

Use Google Sheets or Airtable as the first control center. Use n8n, Make, Zapier, or scripts for automation only where it saves real time. Keep approval points clear.

## Shared Tables

### Leads

| Field | Purpose |
|---|---|
| lead_id | Unique lead key |
| clinic_name | Prospect clinic |
| city_state | Market |
| website | Website URL |
| instagram | Social URL |
| google_profile | Google listing URL |
| owner_or_contact | Decision maker if known |
| contact_route | Email, form, IG, LinkedIn, phone |
| services | Botox, filler, laser, facial, weight loss, etc. |
| review_count | Google review count |
| review_recency | Recent review signal |
| booking_method | Booking link or request path |
| suspected_leak | Main recovery angle |
| fit_score | 1 to 10 |
| urgency_score | 1 to 10 |
| status | New, Approved, Contacted, Replied, Booked, Closed, Nurture, Disqualified |
| next_action | What should happen next |

### Outreach Log

| Field | Purpose |
|---|---|
| event_id | Unique touch key |
| lead_id | Linked lead |
| channel | Email, Instagram, LinkedIn, form, call |
| touch_number | 1 to 5 |
| message_hook | Main angle |
| sent_at | Send timestamp |
| next_follow_up_at | Due date |
| response_status | No reply, Replied, Bounced, Unsubscribed |

### Replies

| Field | Purpose |
|---|---|
| reply_id | Unique reply key |
| lead_id | Linked lead |
| raw_reply | Prospect response |
| classification | Hot, Warm, Objection, Not now, Referral, Unsubscribe, Bad fit |
| suggested_response | AI-drafted reply |
| owner_needed | Yes or no |
| due_at | Response deadline |

### Call Briefs

| Field | Purpose |
|---|---|
| call_id | Unique call key |
| lead_id | Linked lead |
| call_time | Scheduled time |
| clinic_snapshot | Short clinic summary |
| leak_hypothesis | Main pain to validate |
| questions | Call questions |
| demo_route | What to show |
| recommended_offer | Package recommendation |
| next_step | Close path |

### Clients

| Field | Purpose |
|---|---|
| client_id | Unique client key |
| clinic_name | Client clinic |
| package | Sold package |
| payment_status | Deposit, paid, overdue |
| intake_status | Missing, partial, complete |
| delivery_status | Not started, building, QA, live |
| reporting_status | Active, missing, blocked |
| health_status | Healthy, watch, risk |
| next_owner_action | What needs owner attention |

## Workflow 1: Lead Finder

Trigger:

- Manual weekly growth block.
- Optional: CSV dropped into a lead intake folder.

Inputs:

- Target city or region.
- Lead source.
- Service focus, such as Botox, filler, laser, body contouring, or weight loss.

Steps:

1. Pull clinics from source.
2. Remove chains, salons without medspa services, and clinics with no contact route.
3. Capture website, Google listing, Instagram, booking path, review count, and owner route.
4. Add suspected leak.
5. Score fit and urgency.
6. Mark status as New or Approved.

Output:

- Updated Leads table.
- Daily summary of leads approved, weak fits removed, and strongest lead angles.

Failure handling:

- If no contact route exists, mark as Research Needed.
- If source quality drops below 30 percent approved, change city/source.

Human handoff:

- Owner approves the first 20 leads from a new market before outreach starts.

## Workflow 2: Outreach Generator And Approval Queue

Trigger:

- Lead status becomes Approved.

Inputs:

- Lead row.
- Offer bible.
- Cold email and DM sequences.

Steps:

1. Select the strongest hook from suspected leak.
2. Draft first-touch email or DM.
3. Draft touches 2 to 5.
4. Add messages to approval queue.
5. Set next follow-up dates.

Output:

- Outreach Log rows prepared.
- Approved messages ready for sending.

Failure handling:

- If the lead lacks enough context, return to Research Needed.
- If copy uses guarantees or fake proof, block approval.

Human handoff:

- Owner approves the first campaign per channel before live sending.

## Workflow 3: Outreach Sender And Follow-Up Queue

Trigger:

- Outreach event is approved and due.

Inputs:

- Approved outreach event.
- Contact route.

Steps:

1. Send via Gmail, LinkedIn, Instagram, or manual website form task.
2. Log sent timestamp.
3. Schedule next touch.
4. Stop sequence if reply, bounce, opt-out, or bad fit.

Output:

- Updated Outreach Log.
- Follow-up tasks.

Failure handling:

- Bounce: mark invalid.
- No contact route: create manual research task.
- Opt-out: mark unsubscribe and never contact again.

Human handoff:

- Manual send where platform policies or account safety require human action.

## Workflow 4: Reply Triage

Trigger:

- New reply lands in Gmail, DM inbox, or manual tracker.

Inputs:

- Raw reply.
- Lead row.
- Previous touches.

Steps:

1. Classify reply.
2. Draft response.
3. Decide whether owner is needed.
4. Update lead status.
5. If hot or warm, suggest booking path.

Output:

- Reply row.
- Suggested response.
- Owner task if needed.

Failure handling:

- Ambiguous reply: mark Owner Review.
- Legal, medical, or complaint language: owner review only.
- Unsubscribe: stop all outreach.

Human handoff:

- Owner replies personally for hot leads, pricing questions, complaints, and sales-call scheduling when trust matters.

## Workflow 5: Call Prep

Trigger:

- Lead status becomes Demo Booked.

Inputs:

- Lead row.
- Clinic website and social notes.
- Reply history.

Steps:

1. Build clinic snapshot.
2. Pick the strongest revenue leak hypothesis.
3. Create five questions to validate pain.
4. Prepare objection responses.
5. Recommend package and demo route.
6. Draft pre-call confirmation and post-call recap shell.

Output:

- Call brief.
- Owner pre-call note.

Failure handling:

- If call data is missing, create a "confirm details" task.

Human handoff:

- Owner takes the call and confirms the actual pain, authority, timeline, and price fit.

## Workflow 6: Proposal And Close Follow-Up

Trigger:

- Call status becomes Demo Completed and fit is confirmed.

Inputs:

- Call notes.
- Package recommendation.
- Pricing rules.

Steps:

1. Draft call recap.
2. Draft recommended package.
3. Draft payment next step.
4. Schedule follow-up touches until yes, no, or nurture.
5. Create sales handoff if closed.

Output:

- Proposal notes.
- Follow-up sequence.
- Sales handoff row when paid.

Failure handling:

- If prospect asks for custom scope, route to owner.
- If not now, create nurture date.

Human handoff:

- Owner approves final pricing, discounting, contract language, and payment request.

## Workflow 7: Client Onboarding And Delivery Board

Trigger:

- Payment status becomes Paid Setup.

Inputs:

- Sales handoff.
- Client intake.
- Existing delivery SOP.

Steps:

1. Create client row.
2. Generate access checklist.
3. Create delivery tasks.
4. Draft kickoff email.
5. Track blockers.
6. Prepare QA checklist.

Output:

- Client delivery board.
- Missing access list.
- Kickoff message.

Failure handling:

- Missing access after 48 hours: send reminder.
- Credentials problem: owner review.
- Scope creep: stop and create change-request note.

Human handoff:

- Owner handles sensitive access, client calls, and final go-live approval.

## Workflow 8: Client Monitoring And Retention

Trigger:

- Client is live.
- Weekly reporting cycle starts.

Inputs:

- Workflow status.
- Dashboard summary.
- Weekly performance report.
- Client communications.

Steps:

1. Check workflow errors.
2. Confirm weekly report sent.
3. Summarize wins and stuck points.
4. Flag churn risk.
5. Suggest one improvement.
6. Draft client update.

Output:

- Weekly client summary.
- Churn-risk status.
- Owner action item.

Failure handling:

- If report does not send, create P0 fix task.
- If workflow errors repeat, create QA task.
- If client is silent for 14 days, create check-in task.

Human handoff:

- Owner handles save calls, renewal calls, upsells, complaints, and strategic changes.

## Workflow 9: Ads Funnel Builder

Trigger:

- Outbound angles show reply or call-booking traction.

Inputs:

- Winning hooks.
- Landing page.
- Booking page.
- Offer bible.

Steps:

1. Turn winning outbound hooks into ad concepts.
2. Draft 3 ad angles.
3. Draft 3 short video scripts.
4. Draft landing page test section.
5. Draft retargeting messages.
6. Produce daily ad review checklist.

Output:

- Ad concept sheet.
- Creative scripts.
- Funnel test plan.

Failure handling:

- If ads make hard revenue claims, block.
- If no outbound angle has traction, keep ads paused.

Human handoff:

- Owner approves spend, creative, targeting, and claims before launch.

## Automation Priority

Build automation in this order:

1. Lead tracker and scoring.
2. Outreach queue and follow-up dates.
3. Reply triage and call brief generator.
4. Sales handoff and delivery task board.
5. Weekly client health report.
6. Ads funnel generator.

This gives the fastest path to money without making the backend heavy.

## Always-On Watchdog

Add a watchdog workflow once the core workflows exist.

Trigger:

- Runs every morning.

Checks:

- Leads stuck in Research Needed for more than 24 hours.
- Leads Approved without first touch.
- Contacted leads with missing next follow-up date.
- Replies without classification.
- Demo Booked leads without call brief.
- Proposal Sent leads without next follow-up.
- Paid clients without delivery board.
- Live clients without weekly report.
- Client risks not escalated.

Output:

- Daily owner brief.
- AI work queue.
- P0 blockers.

Failure handling:

- If any table cannot be read, alert owner.
- If a workflow has not run in 24 hours, create a P0 ops task.
- If send volume exceeds limit, pause outreach queue.
