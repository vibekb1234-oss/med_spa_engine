# MedSpa Growth Engine - Simple Launch Guardrails

Use this before selling or deploying a clinic. It keeps the offer credible without turning delivery into a huge compliance project.

## 1. The Clean V1 Positioning

Sell this as a client follow-up and retention system, not as a medical platform.

Best framing:
- "Automates inquiry follow-up, appointment reminders, review requests, referral asks, lapsed-client reactivation, and owner reporting."
- "Works alongside your current booking system."
- "Built on Gmail, Google Sheets, and n8n so there are no new seats for the clinic team."

Avoid:
- "HIPAA-compliant" unless a lawyer or compliance vendor has signed off.
- "Guaranteed revenue" or fixed performance promises.
- "Fully integrates with Jane/Fresha/Mindbody" unless that integration is actually built for that client.
- Storing diagnosis, treatment notes, before/after photos, or sensitive medical history in Sheets.

## 2. Claim Rules

Use claims as modeled ranges unless you have verified client data.

Allowed:
- "We model ROI from your actual appointment volume and no-show rate."
- "Most clinics care about three numbers: no-shows, reviews, and repeat bookings."
- "If the system prevents only 3-5 missed appointments per month, it can often cover the monthly retainer."
- "Results depend on volume, offer, staff usage, consent, and the current booking process."

Needs proof before using:
- Specific no-show reduction percentages.
- Specific review conversion rates.
- Named client results.
- "Pays for itself in 30 days."
- "400+ reviews per year."

## 3. Compliance Basics

This is not legal advice. For each clinic, confirm their local rules before launch.

Minimum safeguards:
- Only send to clients who gave permission to be contacted.
- Include a simple opt-out line in marketing or reactivation emails.
- Keep sensitive medical details out of email subject lines and Sheets.
- Use service categories, not private clinical notes.
- Do not promise medical outcomes in automated messages.
- Use review requests that ask for honest feedback, not only positive reviews.
- Make referral incentives clear and local-law friendly.
- Restrict the Google Sheets API key before entering it into the dashboard.
- Use a unique webhook secret per clinic.
- Export a dashboard backup after setup.

## 4. V1 Data Policy

Store:
- Name, email, phone, service interest, appointment date, appointment status, visit count, spend, review/referral flags, lead source.

Do not store:
- Medical history, contraindications, photos, treatment consent forms, prescriptions, detailed clinical notes, payment card data, government IDs.

If a clinic wants those records, keep them inside their existing booking/EHR system.

## 5. Client Fit Rules

Good fit:
- Independent clinic with 1-3 providers.
- At least 15 appointments per week.
- Existing client base and Google Business Profile.
- Owner feels no-shows, reviews, and repeat bookings are leaking revenue.
- Uses Gmail/Google Workspace or is willing to create a clinic Gmail.

Weak fit:
- Brand-new clinic with no client base.
- Franchise or chain with centralized approvals.
- Clinic that already has deep CRM automations.
- Clinic unwilling to authorize Gmail/Sheets or use basic consent language.

## 6. Simple Delivery Checklist

Before kickoff:
- Capture current no-show estimate, appointment volume, review count, booking system, and preferred tone.
- Confirm what messages the clinic is allowed to send.
- Confirm whether discounts/referral credits are allowed in their jurisdiction.
- Collect Google review link, booking link, clinic timezone, sender email, and treatment menu.

Before launch:
- Test all four webhook-protected flows.
- Submit one intake form.
- Confirm one booking email.
- Mark one appointment complete.
- Trigger one status update from the dashboard.
- Confirm no duplicate reminder flags.
- Confirm opt-out rows are skipped.
- Confirm weekly report renders.
- Confirm dashboard backup is exported.

After launch:
- Monitor for 7 days.
- Review no-shows, pending inquiries, review requests, and lapsed-client sends.
- Make only copy/timing tweaks unless the client approves a scope change.

## 7. Default Offer Boundary

Included:
- Setup, configuration, workflow import, Gmail/Sheets OAuth, dashboard setup, intake form link, test run, handoff, 30 days of bug fixes.

Retainer includes:
- Monitoring, copy tweaks, seasonal campaign updates, monthly reporting review, light workflow maintenance.

Bill separately:
- Custom booking-system API integrations.
- SMS sending.
- Website redesign.
- Paid ads.
- New CRM migration.
- Multi-location reporting.
- HIPAA/legal review.
- New automations outside the 8-workflow system.

