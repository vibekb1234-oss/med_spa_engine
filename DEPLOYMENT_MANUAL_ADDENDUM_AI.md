# Deployment Manual Addendum — AI Agent Layer

**Read this after `DEPLOYMENT_MANUAL.md` Chapter 7 (Demo n8n instance).**

You now have 3 AI-orchestrated workflows on top of the base 8. This chapter sets up the Anthropic credential once, deploys the new W9, and confirms all AI features route correctly.

## What the AI layer adds

| Workflow | Before | After AI |
|---|---|---|
| **W1 — Lead Intake** | Static template email based on service dropdown | AI writes a personalized email referencing the specific inquiry message; also scores each lead 0-100 as HOT/WARM/COOL so you know who to call first |
| **W4 — Client Reactivation** | 4 static winback templates (60d/90d/180d/seasonal) | AI writes a personalized paragraph referencing each client's actual service history for every send |
| **W9 — Reply Triage (NEW)** | — didn't exist | Gmail-triggered classifier. Every incoming client reply is auto-labeled HOT / WARM / OBJECTION / NOT_NOW / REFERRAL / UNSUBSCRIBE / BAD_FIT / COMPLAINT / AUTO_REPLY, opt-outs auto-flagged in Sheet, complaints emergency-alert the owner, hot leads push to top of daily brief |
| **W20 — Audit Prep Agent (OPTIONAL)** | Manual pre-call prep | GPT generates an internal Revenue Leak Audit brief from the Calendly booking payload: likely leaks, questions to ask, risk flags, recommended first system, and next best action |

**Total cost per clinic per month: ~$0.22** (Claude Haiku is very cheap)

## Setup — takes 10 minutes

### Step 1. Get an Anthropic API key

1. Go to https://console.anthropic.com
2. Sign up (free) with `bibek@medspagrowthengine.com`
3. Settings → API Keys → **Create Key** — name it `MGE Production`
4. Copy the `sk-ant-...` value into Bitwarden as "Anthropic API Key"
5. Load $5 of credits (Settings → Billing → Add credit). $5 covers ~2500 AI calls at Haiku pricing — enough for ~10 clinics × 3 months at their expected volume.

### Step 2. Create the Header Auth credential in n8n

1. n8n → **Credentials** → **New**
2. Search "Header Auth" → select **Header Auth API**
3. Fill in:
   - **Name:** `Anthropic API Key`
   - **Header Name:** `x-api-key`
   - **Header Value:** paste the `sk-ant-...` key
4. Save
5. Copy the credential ID from the URL after saving (looks like `LxYz9AbC3DeF`) → save to Bitwarden as "Anthropic n8n Cred ID"

### Step 3. Configure workflows with the new placeholder

Open `setup/Workflow_Configurator.html` in Chrome. There's a NEW field:

- **Anthropic API Credential ID** ? paste the ID from Step 2 if importing W1, W4, or W9

Leave blank only if you are not importing the Anthropic-powered workflow files. If W1, W4, or W9 are imported, the credential should be present before activation.

Click **Download configured workflows** and re-import all 9 JSONs into n8n.

### Step 4. Deploy W9 (the new Reply Triage)

1. In n8n → Workflows → Import → upload `9_MSG_Reply_Triage.json`
2. Open it → verify the Gmail trigger uses your Gmail OAuth cred
3. Activate the workflow (top-right toggle)
4. Test by sending an email to `bibek@medspagrowthengine.com` from a personal inbox that says "yes send me a time to book"
5. Wait 60 seconds → check n8n Executions view → the trigger should have fired → check the log to see the classification (should be `HOT`)
6. Check bibek@ inbox → you should see a "🔥 HOT REPLY" alert email from the workflow

### Step 5. Test the AI intake

Curl-test the W1 webhook with a personalized message:

```bash
curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook/msg-lead-intake \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: YOUR_SECRET" \
  -d '{
    "clientName": "Sarah Test",
    "clientEmail": "sarah.test.YOUR-personal@gmail.com",
    "phone": "(415) 555-0000",
    "serviceInterest": "Botox",
    "leadSource": "Website",
    "message": "Hi! I got recommended by my sister Emma. I want to start with a small amount of Botox for my forehead lines — I have a wedding in 6 weeks and want to know if I have enough time to see results."
  }'
```

Check the sarah.test@ inbox. The email you receive should:
- Reference the wedding in 6 weeks (proves AI ran)
- Reference the sister recommendation
- Sound like a person wrote it, not a template

Check bibek@ inbox — you'll see the "🔥 HOT lead" alert with the AI's score + reasoning.

If the email is generic instead, the AI failed → fallback template served. Check the n8n execution log for the `AI Personalize + Score` node.

### Step 6. Verify W4 personalization (optional — only fires monthly)

W4 runs on the 1st of each month. To test manually:
1. n8n → Workflow 4 → **Execute Workflow** button
2. Check the winback emails sent to your test client rows → each should reference the specific past service
3. If AI failed → fallback text kicks in (same generic template as before, no personalization)

## Cost breakdown per clinic per month

| Workflow | Calls/month | Cost/call | Monthly |
|---|---:|---:|---:|
| W1 — Lead intake | ~30 inquiries | $0.002 | $0.06 |
| W4 — client reactivation | ~40 winback sends | $0.002 | $0.08 |
| W9 — Reply triage | ~50 incoming replies | $0.001 | $0.05 |
| Buffer for testing | 30 calls | $0.001 | $0.03 |
| **TOTAL per clinic** | | | **~$0.22/mo** |

At $1,000-1,500/mo retainer, this is a rounding error. Absorb into your margin OR make AI features a Pro-tier add-on for pricing differentiation.

## Fallback behavior — what happens if AI fails

Every AI node has `continueOnFail: true` set. Each has a downstream `Merge AI + Fallback` node that catches the failure and reverts to the pre-AI template. Nothing breaks — the workflow just runs without AI enhancement.

Common failure modes:
- **Anthropic API 429 (rate limit)** — auto-recovers on next call. Rare at MGE volumes.
- **Anthropic API 401** — credential misconfigured. Check the Header Auth entry, ensure Header Name = `x-api-key` exactly.
- **Anthropic API timeout** — 15-second timeout set in workflow. If Claude is slow, fallback fires.
- **Claude returns invalid JSON** — parser catches it, fallback fires. Rare on Haiku but possible on complex prompts.

## Optional — disable AI per-clinic

If you sign a Starter-tier clinic who does not want AI features, do not activate the Anthropic-powered versions of W1, W4, or W9 until the credential is configured.

The fallback logic protects against API errors, timeouts, and invalid AI JSON after the workflow is configured. It should not be treated as a replacement for a missing n8n credential.
## Optional — enable GPT audit prep

Workflow 20 is intentionally separate from the reminder sender.

Use it if you want every booked Revenue Leak Audit to have a prep brief before the call.

n8n env vars:

```text
MEDSPA_OPENAI_API_KEY=YOUR_OPENAI_KEY
MEDSPA_OPENAI_MODEL=gpt-5-mini
```

The workflow uses the OpenAI Responses API with `store=false`.

Do not let the GPT agent decide reminder timing, cancellations, or send eligibility. Those stay deterministic in Workflows 18 and 19.

## What NOT to build with AI (following the mortgage-chat lesson)

I resisted the temptation to AI-ify these:
- **W2 Follow-Up** — the reminder emails are transactional. AI-personalizing them adds complexity without meaningful conversion lift. Static templates are right here.
- **W3 Review request** — same reason. The ask is short and standardized.
- **W6 Booking confirmation** — transactional, must be predictable.
- **W5 Weekly report** — the numbers themselves ARE the value. AI narrative could be added later but not P0.
- **W7 Error handler** — needs to be deterministic, no AI.
- **W8 Status update** — pure data write, no NLP.

The 3 workflows that DO get AI are exactly the ones with meaningful text-generation payoff: personalized intake (drives conversion), personalized winback (drives retention), reply classification (drives safety + speed).

## Follow the mortgage-chat rule

**Do not build the reply classifier upgrades before you have real replies to classify.** Ship W1 + W4 with AI first (they fire on outbound sends you're already doing). Watch replies come back. When you have 10 real replies, THEN turn on W9 with confidence that it's calibrated to actual patterns.

Best sequence:
1. **Today:** Enable W1 + W4 with AI (touches your outbound flow only)
2. **Send first cold outreach batch** (the 21 verified Miami leads in `leads/leads_verified_emails.csv`)
3. **Get 3-5 replies over 3 days**
4. **Look at actual reply patterns** — do they need classification, or are they all "yes let's talk"?
5. **Then activate W9** calibrated to what you actually saw
