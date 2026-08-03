# Recovery Assistant Map

The dashboard includes a built-in Recovery Assistant. It is designed as a client-facing operator inside `dashboard/index.html`, not as an exposed SaaS backend.

## Purpose

The assistant helps clinic users understand what to do next inside the dashboard:

- Explain dashboard sections.
- Summarize recovery opportunities.
- Show live metrics from loaded dashboard data.
- Navigate to the right page.
- Find clients.
- Draft safe follow-up language.
- Prepare approved actions such as marking VIP or sending booking confirmations.
- Check launch readiness.

## Current Mode

The assistant works locally in the browser first. It can answer common dashboard questions and prepare safe actions without any external AI call.

Built-in local capabilities:

- `what should I do today`
- `show recovery pulse`
- `check launch readiness`
- `build tasks for today`
- `show tasks`
- `create task to ...`
- `complete task 1`
- `show stale inquiries`
- `show at-risk clients`
- `show lapsed clients`
- `find [client name]`
- `mark [client name] as VIP`
- `send confirmation to [client name]`
- `draft a lapsed client message`
- `open pipeline/settings/analytics/clients`

Actions that change data require confirmation in the chat before they run.

## Task Assisting

The assistant has a local task queue stored in browser storage. It can:

- Create tasks manually from user instructions.
- Build a task list from the current dashboard state.
- Create setup-gap tasks from launch readiness.
- Create recovery tasks from stale inquiries, upcoming appointments, and at-risk clients.
- List open tasks.
- Complete tasks by number.

This is intentionally local and lightweight. It is for client/operator task guidance, not a replacement for a full project-management system.

## Optional AI Webhook

Settings -> System includes an optional field:

`AI agent webhook URL`

If this is set, unmatched questions are sent to n8n with a small dashboard context packet. The browser does not store or expose an OpenAI API key.

Recommended flow:

Dashboard Recovery Assistant
-> n8n webhook
-> AI model node inside n8n
-> response text back to dashboard

The dashboard sends `X-Webhook-Secret` when the normal webhook secret is configured.

## Context Packet

The dashboard can send:

- Current page
- Clinic name
- Active clients
- New inquiries
- Stale inquiries
- Awaiting replies
- At-risk clients
- Lapsed clients
- VIP clients
- 30-day no-show rate
- Appointments inside 48 hours
- 7-day recovery pulse
- Launch gaps
- Allowed action names

It should not send:

- Medical records
- Clinical notes
- Payment details
- API keys
- Full Sheet contents unless intentionally scoped

## Safety Rules

- No clinical advice.
- No diagnosis or treatment recommendations.
- No guarantees of revenue.
- No sending emails without confirmation.
- No changing client state without confirmation.
- No exposing secrets.
- No medical record handling.

## Future Upgrade Path

1. Keep built-in local assistant as the default.
2. Add an n8n Recovery Assistant workflow for free-form questions.
3. Add a strict tool router inside n8n if advanced actions are needed.
4. Keep all write actions behind confirmation.
