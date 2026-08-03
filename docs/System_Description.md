# System Description

MedSpa Growth Engine is a managed Lost Revenue Recovery OS for independent medspas and aesthetic clinics.

It helps clinics recover revenue from operational leaks that happen after demand already exists:

- Missed consults
- Slow inquiry follow-up
- No-shows and late cancellations
- Cold leads that never book
- Lapsed VIP clients
- Inconsistent review requests
- Weak referral asks
- Poor owner visibility

## What The Client Gets

- Public-facing intake/booking flow
- Private owner dashboard
- Google Sheet CRM/data layer
- 8 n8n workflow templates
- Gmail sending via OAuth
- Google Apps Script helper
- Weekly performance report
- Recovery Assistant and task support where enabled
- Setup, QA, and handoff process

## What It Does Not Do

- It does not replace the clinic's booking system.
- It does not store medical records.
- It does not guarantee revenue, reviews, or bookings.
- It does not act as legal, medical, or compliance advice.

## Core Stack

- Static public frontend hosted on Vercel or Netlify
- Protected dashboard route
- Supabase auth/profile foundation where deployed
- Google Sheets for client-level operational data
- Google Apps Script for Sheet-side helpers
- n8n for workflow automation
- Gmail OAuth for email sending
- Webhook secret for dashboard/workflow calls

## Offer Positioning

The pitch is not generic AI automation. The pitch is:

> We install the recovery layer around your current booking process so missed consults, no-shows, cold leads, reviews, referrals, VIP reactivation, and weekly owner reporting are handled consistently.
