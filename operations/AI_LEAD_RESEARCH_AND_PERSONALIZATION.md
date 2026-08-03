# AI Lead Research And Personalization System

This file prevents generic outreach. Every lead must be researched before messaging so the first touch feels specific to that clinic, their likely leakage point, and the solution MedSpa Growth Engine provides.

## Research Objective

For every clinic, answer:

1. What do they sell?
2. How does a new lead contact or book?
3. Where might revenue leak before or after booking?
4. What proof signal shows they are active enough to buy?
5. What is the best opening angle?

## Research Sources

Use public, permission-safe sources first:

- Clinic website.
- Booking page.
- Google Business Profile.
- Google reviews and recency.
- Instagram profile and recent posts.
- Facebook page.
- LinkedIn owner/manager profile.
- Meta Ads Library.
- Local medspa directories.

Do not scrape private pages, logged-in systems, patient portals, or anything that requires bypassing access controls.

## Research Fields

| Field | What to capture | Example |
|---|---|---|
| service_focus | Main treatments | Botox, filler, laser, facials, body contouring |
| booking_path | How leads book | Website form, phone, Mindbody, Boulevard, Vagaro |
| lead_friction | What makes booking harder | Long form, no instant confirmation, no follow-up shown |
| review_signal | Review count and recency | 84 reviews, last review 3 months ago |
| social_signal | Active posts or offers | Promoting consultation offer on Instagram |
| ad_signal | Running ads or offers | Meta ad for new-client injectable special |
| owner_signal | Decision maker route | Founder listed on website/LinkedIn |
| suspected_leak | Main pain hypothesis | Cold IG leads not followed up after interest |
| personalization_line | First-line observation | Saw your new-client Botox offer links straight to booking |
| first_touch_angle | Message hook | Missed consult follow-up |

## Pain Hypothesis Menu

Choose one primary pain. Do not cram all pains into one message.

| Signal | Likely pain | Offer angle |
|---|---|---|
| Booking link but no visible follow-up | Cold leads drop before booking | New inquiry recovery |
| Promotions on Instagram | Paid/social leads may go cold | Lead follow-up layer |
| High-ticket services | One missed consult is expensive | Missed consult recovery |
| Many reviews but old recency | Review asks are inconsistent | Review/referral workflow |
| Botox/filler/laser services | Repeat cycle exists | VIP/lapsed-client reactivation |
| Phone-heavy booking | Missed calls and slow follow-up | Speed-to-lead recovery |
| No-show policy shown strongly | No-shows are painful | No-show recovery |
| Owner posts actively | Owner likely cares about growth | Owner visibility dashboard |

## Fit Score

Score 0 to 10.

| Factor | Points |
|---|---|
| Clear medspa/aesthetic clinic | 0 to 2 |
| Premium repeat treatments | 0 to 2 |
| Active acquisition signal | 0 to 2 |
| Visible contact route | 0 to 2 |
| Clear recovery leak | 0 to 2 |

Pursue now:

- Fit score 7+
- Contact route found
- Real personalization line exists

Nurture:

- Fit score 5 to 6
- Some signals but weak contact route or unclear urgency

Disqualify:

- Fit score below 5
- Not a real medspa/aesthetic clinic
- No contact route
- Enterprise chain needing procurement

## Personalization Rules

Every first-touch message must include:

- One observed fact.
- One likely business implication.
- One clear solution angle.
- One low-friction CTA.

Structure:

```text
Saw [specific observation].

That usually creates [specific leakage risk] for medspas.

We install [specific recovery layer].

Worth me sending [small next step]?
```

## Message Examples

### Missed Consult Angle

```text
Saw your site pushes new clients into a consult request before they can book treatment.

That is usually where medspas lose people if follow-up is slow or manual.

We install a recovery layer around the booking process so missed consults, no-shows, and cold leads get followed up consistently.

Worth me sending the 4-leak map?
```

### Lapsed VIP Angle

```text
Saw you offer repeat-cycle treatments like Botox and filler.

The easy leak is not always new leads. It is clients who should be back on a treatment cycle but never get chased properly.

We install VIP/lapsed-client recovery workflows around the clinic's current booking process.

Want me to send the quick map?
```

### Review/Referral Angle

```text
Saw your reviews are strong, but recent review activity looks lighter than it could be.

For medspas, the review ask usually gets missed when the team is busy.

We install the post-treatment review and referral flow so it happens consistently.

Worth a look?
```

## Research Prompt

Use this prompt for each lead:

```text
You are researching an independent medspa prospect for MedSpa Growth Engine.

Goal: identify the most likely lost-revenue leak and write a specific first-touch angle.

Use only the supplied public notes. Do not invent facts.

Lead data:
- Clinic:
- Location:
- Website notes:
- Booking path:
- Google review notes:
- Instagram/social notes:
- Ads/offers:
- Services:
- Contact route:

Return JSON:
{
  "fit_score": 0,
  "urgency_score": 0,
  "primary_leak": "",
  "supporting_signals": [],
  "personalization_line": "",
  "first_touch_angle": "",
  "bad_fit_reason": "",
  "missing_research": [],
  "recommended_status": "Research Needed"
}
```

## Outreach Draft Prompt

```text
Write a short first-touch message for an independent medspa owner.

Rules:
- Use the personalization line.
- Mention only one primary leak.
- Position MedSpa Growth Engine as the recovery layer around their existing booking process.
- Do not mention AI unless useful.
- No guaranteed revenue, bookings, reviews, or medical claims.
- Keep it under 95 words.
- End with a low-friction CTA.

Lead:
- Clinic:
- Personalization line:
- Primary leak:
- Supporting signal:
- CTA:
```

## Quality Rejection Reasons

Reject a message when:

- It could be sent to any clinic.
- It starts with a fake compliment.
- It uses "AI automation" as the main pitch.
- It lists too many features.
- It has no observed fact.
- It makes a guarantee.
- It is overlong.
- It asks for a call too early.
