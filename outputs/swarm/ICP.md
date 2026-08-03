# Ideal Customer Profile — MedSpa Growth Engine (MGE)

> **Hand-off brief for the next agent.** This document is everything you need to scrape and qualify leads for this campaign without context from prior sessions. Read it top to bottom before firing a single tool call. The product, the buyer, the market, the scrape parameters, the disqualifiers, and the output schema are all here.

---

## TL;DR — one-paragraph snapshot

You're scraping leads for **MedSpa Growth Engine (MGE)**, a productized done-for-you automation system sold by **Bibek Bhandari** (solo operator, not an agency, sends from `vibekb.1234@gmail.com`). Setup fee $3,500 one-time, monthly retainer $1,000 all-in. Built on n8n + Google Sheets + Gmail. Eight automated workflows handle inquiry intake, 48hr/24hr appointment reminders, no-show recovery, post-visit review-asks, 60/90/180-day re-engagement for lapsed clients, and a Monday performance email. Clinic owner spends ~5 minutes per week. Most clinics cover the setup fee from no-show recovery alone in 4–6 weeks.

The buyer is a **woman who owns and personally operates an independent MedSpa with 1–3 providers**, doing $200K–$800K/year, in a major North American metro, who is the lead injector AND the de-facto front-desk and is silently losing 20–25% of her bookings to no-shows. She doesn't have an ops manager. She doesn't have a marketing team. She has 100–600 Google reviews and is the kind of operator where "the front desk is also the boss."

**Source of truth: Google Maps via Apify Compass actor** (`compass/crawler-google-places`). Filter to medspas with 4+ stars in the target metros and pull 12–15 per neighborhood query. Stay away from chains (multiple locations under same brand), MD-led plastic surgery practices that just have a med spa attached, and high-volume franchises (Naked MD, Skin Spa New York, etc.). The sweet spot is single-location, owner-operated, women-owned, 50–500 reviews.

---

## The Product (MGE) — so you understand what's being sold

MGE is **8 n8n workflows + 1 Google Sheet + 1 self-hosted dashboard** that automate the silent-loss tasks every MedSpa knows about but doesn't have time to do. Owner gets:

| # | What it does | When it fires |
|---|--------------|---------------|
| 1 | Captures every inquiry from the intake form, sends a personalized service email, alerts the clinic | Webhook on form submit |
| 2 | 48hr + 24hr appointment reminders, no-show recovery, post-visit check-ins, 3-day inquiry follow-ups | Daily 9am cron |
| 3 | Review request + referral ask 24h after every completed appointment | Webhook on "mark complete" |
| 4 | Re-engages lapsed clients at 60/90/180 days; sends seasonal promos | Monthly on the 1st |
| 5 | Weekly performance report to the owner (revenue, no-shows, at-risk clients, review rate) | Monday 8am cron |
| 6 | Booking confirmation email when the clinic confirms an appointment | Webhook on dashboard button |
| 7 | Catches errors from any of the above and emails the owner if something breaks | On any workflow failure |
| 8 | Persists kanban drag-drop and bulk Mark VIP from the dashboard | Webhook on dashboard action |

The dashboard is the clinic owner's daily interface — opens in Chrome, two action buttons (📧 Confirm, ✅ Complete), kanban view, ⌘K command palette, embedded "Coral" assistant chatbot, light/dark themes, mobile responsive.

**Pricing:** $3,500 one-time setup. $1,000/month all-in retainer (covers hosting, maintenance, support — Bibek absorbs the n8n + Apify costs). Clinic provides their Google account; everything else is Bibek's stack.

**Positioning for cold email:** This is a peer-to-peer pitch from a solo operator who built a useful thing. Not "we offer," not "my agency," not "our team." It's "I built this," "I noticed," "I keep seeing." Bibek signs his full name, no title.

**The pain it solves (in order of magnitude):**
1. **No-show drain.** Industry baseline is 20–25% no-show rate. On a $300K/yr indie clinic that's $8–12K/quarter walking out the door silently. Two automated reminders take that to 3–5%.
2. **Reviews left on the table.** A clinic with 200 happy clients and 47 Google reviews is doing $0 marketing on its single biggest growth lever. Auto review-ask 24h after every visit closes the gap fast.
3. **Lapsed clients drift.** Someone gets Botox in March, doesn't book for May (it's needed), nobody nudges, they get it elsewhere by July. The 60/90/180-day re-engagement catches them.
4. **Inquiries die in the DMs.** A new lead messages on Instagram or fills a website form and doesn't hear back for hours. By then they've booked elsewhere. A 30-second auto-response with service info + "let's book" buys back that lost time.
5. **The front desk is the owner.** All of the above is currently the front desk's job, but in an indie clinic the front desk is the same person who's injecting Botox and ordering inventory. Automating it isn't replacing anyone — it's offloading the silent-loss tasks no human is actually doing today.

---

## The ICP — narrowest possible definition

### One-sentence ICP

> A woman who personally injects Botox, owns the clinic, has 100–600 Google reviews, runs out of a single location with 1–3 providers, is in a major North American metro, and is the de-facto front desk on top of being the lead injector.

### Firmographic filters (apply ALL of these)

| Field | Value | Why |
|-------|-------|-----|
| Business type | Independent medspa / aesthetic clinic | The product fits this, not chains |
| Locations | Exactly 1 | If they have 2+ locations they have ops infrastructure |
| Provider count | 1–3 (lead injector + maybe 1–2 nurse practitioners) | Sweet spot for "front desk is the owner" |
| Annual revenue | $200K–$800K | Below = can't afford the retainer; above = they have ops staff |
| Google review count | 50–600 | Below 50 = too new, no signal; above 600 = mature ops |
| Google rating | ≥4.5 | They care about quality |
| Has working website | Yes | Required for personalization research |
| Has online booking visible | Optional but preferred | Signal they're tech-receptive |
| Owner-operator | Strong yes | The pitch lands hardest when the owner runs the front desk |
| Geography | Toronto, Vancouver, Miami, NYC, LA, Chicago, Atlanta, Dallas, Phoenix, Houston, Boston, Seattle, San Diego, Calgary, Montreal | Major metros, English-speaking, dense medspa markets |
| Primary services | Botox, fillers, laser hair removal, microneedling, HydraFacial, body contouring, PRP, IV therapy | The automation templates speak this language out of the box |
| Spoken languages on site | English (Spanish, Mandarin, Cantonese OK as secondary) | Email body is English |

### Demographic / psychographic preferences (signals, not filters)

These don't disqualify if absent, but presence is a strong positive signal:

- **Women-owned.** ~80% of medspa owners are women. Bibek's tone matches better with this audience.
- **Latino-, Black-, LGBTQ+-, or AAPI-owned.** Strong indicator of a tight indie operator who built the clinic from scratch.
- **Founder's name in the brand** (e.g., "Chadia Ali MedSpa," "Beauty Villa Vergara"). Signals owner-operator vs. chain.
- **5-star or 4.9-star average.** Signals an operator who personally cares. The 4.6-rating clinics are also high-priority because they almost certainly have a no-show recovery problem dragging the average down.
- **Brand name has personality** (e.g., "No Filter Medical Spa," "Plumpitupp," "Let Them Notice"). Indie founder vibe.

### Anti-ICP — explicit exclusions

**Do not scrape, or drop after scraping if you see these signals:**

- Multi-location chains (Naked MD, Skin Spa New York, Dolce Medical Spa, Restore Hyper Wellness, Ideal Image, Sona MedSpa, Skin Renewal MD, etc.). Easy tell: their "Locations" page lists 3+ cities.
- Plastic surgery clinics with a med spa attached. Look for "Plastic Surgery" or "Cosmetic Surgery" as the primary category. They have ops staff, in-house marketing, and bigger budgets than MGE matches.
- Dermatology practices doing aesthetics on the side. Same reasoning — they're medical practices first, not medspas.
- Day spas / nail salons / massage spas that listed themselves as medspa. Filter category to "Medical spa" or "Skin care clinic" primarily.
- Hair-removal-only or laser-only single-service clinics. Not enough service surface for the retention engine to compound.
- Wellness / IV-drip lounges. Different buyer, different pain.
- Dentists with a med spa offering. Different buyer entirely.
- Anyone "permanently closed" or "temporarily closed" on Google.
- Anyone with <10 reviews (no signal) or <4.0 rating (red flag).
- Franchises (Glo30, Massage Envy, European Wax Center).
- Locations that share the same suite/floor/address as another scraped result (likely a co-located chain or a hub).

---

## Geographic targeting strategy

### Markets already covered (134 leads in current pool)

- **Toronto, ON, Canada** — 37 leads (Scarborough, Etobicoke, Old Toronto, York)
- **Miami, FL, USA** — 33 leads (Brickell, Downtown, Coral Way, Miami Beach, Coral Gables)
- **Vancouver, BC, Canada** — 32 leads (West Side, Downtown, Richmond, Burnaby)
- **Los Angeles, CA, USA** — 18 leads (Encino, Woodland Hills, Beverly Hills, Santa Monica)
- **New York, NY, USA** — 14 leads (Manhattan: UES, UWS, Flatiron, Harlem, CPW)

### Markets to add next, in priority order

These are the highest-density US/Canada markets I haven't fully covered. Run 12–15 per locationQuery, separate query per neighborhood for tighter geographic clustering:

**Tier 1 (do these first):**
1. **Atlanta, GA** — Buckhead, Midtown, Sandy Springs, Alpharetta
2. **Dallas, TX** — Uptown, Park Cities, Plano, Frisco
3. **Phoenix, AZ** — Scottsdale (priority), Paradise Valley, Arcadia
4. **Houston, TX** — River Oaks, Memorial, The Woodlands

**Tier 2 (after Tier 1):**
5. **Chicago, IL** — Lincoln Park, Wicker Park, West Loop, Gold Coast (skip South Side — different market)
6. **Boston, MA** — Back Bay, Newton, Cambridge, Brookline
7. **Seattle, WA** — Capitol Hill, Bellevue, Kirkland
8. **San Diego, CA** — La Jolla, Del Mar, Carlsbad

**Tier 3 (Canada):**
9. **Calgary, AB** — Beltline, Mission, Kensington
10. **Montreal, QC** — Westmount, NDG, Plateau (medspa scene smaller; English-speaking density needed)
11. **Ottawa, ON** — Glebe, Westboro

**Tier 4 (large but tougher market fit — last):**
12. **Brooklyn, NY** — Williamsburg, Park Slope (different market dynamic from Manhattan; many are nail salons in disguise)
13. **Long Island, NY** — Roslyn, Garden City, Huntington
14. **Fort Lauderdale, FL** — Las Olas, Wilton Manors

**Markets to deprioritize:**
- Smaller cities (population <500K) — too few qualified leads per query.
- Rural / suburban-only markets — the "no-show pain at scale" doesn't match.
- Hyper-premium tiny markets (Aspen, Hamptons) — buyers are different.

### Per-metro saturation check

When you've pulled 30+ qualified leads from a metro, **stop adding neighborhoods in that metro**. Diminishing returns. Move to the next metro on the list.

---

## Scraping playbook

### Tool of choice: Apify Compass actor

**Tool name:** `mcp__Apify__compass--crawler-google-places`

**Standard call parameters (use these exactly):**

```json
{
  "searchStringsArray": ["medspa"],
  "locationQuery": "Atlanta, Georgia, USA",
  "maxCrawledPlacesPerSearch": 15,
  "scrapeContacts": false,
  "skipClosedPlaces": true,
  "placeMinimumStars": "four",
  "language": "en"
}
```

**Why these settings:**

- `searchStringsArray: ["medspa"]` — the term that actually pulls medspas, not skincare or surgery clinics. Some operators use `["medspa", "aesthetic clinic", "botox clinic"]` to triple-cover, but it scrambles the geographic centroid and adds noise. Stick with `medspa` unless coverage is thin.
- `maxCrawledPlacesPerSearch: 15` — gets the top-ranked 15 in the geographic centroid. Beyond 15, results drift to adjacent neighborhoods you didn't ask for.
- `scrapeContacts: false` — turning this on (visits each website to grab emails) makes the actor slow and pushes runs past the 60s MCP timeout. Skip it. We get emails from website-fetch research downstream.
- `skipClosedPlaces: true` — removes the "permanently closed" graveyard.
- `placeMinimumStars: "four"` — drops sub-4-star clinics. We don't email anyone with <4.5 anyway.
- `language: "en"` — keeps results to English-speaking clinics.

### Memory budget (Apify)

Each run consumes 4096MB on the Apify side. Free tier total is 8192MB → you can only run **one or two in parallel**. The $29 Personal plan brings the cap to 32GB → up to **6–8 in parallel**. Confirm tier before launching parallel batches.

If you get the error "By launching this job you will exceed the memory limit," wait 60 seconds and retry. The previous run is still running on Apify's side.

### Per-metro scrape sequence

For each Tier 1/2/3 metro:

```
1. locationQuery: "<City>, <State/Province>, <Country>"   (broad city pull, 15 results)
2. locationQuery: "<Neighborhood 1>, <City>, <State>, <Country>"   (12 results)
3. locationQuery: "<Neighborhood 2>, <City>, <State>, <Country>"   (12 results)
```

Three queries per metro = ~35 leads per metro before deduplication. After dedup expect 25–30 unique qualified leads per metro.

### Dedup rule

Two leads are duplicates if **either**:
- Same `placeId` (definite)
- Same `phone` AND name fuzzy-match >80% (likely)
- Same `address` and name fuzzy-match >70% (probable)

When deduping, keep the one with more reviews (it's the canonical listing).

---

## Per-lead data schema

For every lead that survives the filter, capture **these fields** in the master CSV:

| Column | Type | Required | Source | Notes |
|--------|------|----------|--------|-------|
| `id` | string | yes | generated | Format: `<MetroLetter><NN>` e.g. `T11`, `M03`, `V07`, `L20`, `N14`, `A01` (Atlanta) |
| `name` | string | yes | Apify `title` | Clean of emoji, special chars |
| `city_area` | string | yes | derived | Major metro: Toronto / Miami / Vancouver / LA / NYC / Atlanta / Dallas / Phoenix / Chicago / Houston |
| `state` | string | yes | Apify `state` | ON, FL, BC, CA, NY, GA, TX, AZ, IL |
| `country` | string | yes | Apify `countryCode` | CA or US |
| `neighborhood` | string | yes | Apify `neighborhood` | Free-text, used for personalization |
| `website` | string | preferred | Apify `website` | Drop trailing UTM params |
| `phone` | string | preferred | Apify `phone` | Used for dedup and follow-up |
| `rating` | float | yes | Apify `totalScore` | |
| `reviews` | int | yes | Apify `reviewsCount` | Critical signal |
| `category` | string | yes | Apify `categoryName` | Drop if not Medical spa, Facial spa, Skin care clinic |
| `address` | string | yes | Apify `address` | Used for dedup and personalization |
| `placeId` | string | yes | Apify `placeId` | Dedup key |
| `women_owned` | bool | preferred | Apify `additionalInfo.From the business` | Strong personalization signal |
| `latino_owned` | bool | optional | Apify `additionalInfo.From the business` | Personalization signal |
| `lgbtq_owned` | bool | optional | Apify `additionalInfo.From the business` | Personalization signal |
| `black_owned` | bool | optional | Apify `additionalInfo.From the business` | Personalization signal |
| `online_scheduling` | bool | optional | Apify `additionalInfo.Amenities` | Tech-receptive signal |
| `membership` | bool | optional | Apify `additionalInfo.Amenities` | Mature retention signal |

Save the master file to: `outputs/swarm/1_raw_leads.csv`

---

## Quality scoring rubric

Score each lead 0–10 and bucket. Only **bucket A and B** get the deep research + personalized email treatment. Bucket C stays in the database for a future second wave.

### Score components (0–10 total)

| Signal | Weight | Score |
|--------|-------:|-------|
| 100–600 reviews (sweet-spot size) | 3 | 3 if in range, 1 if below, 1 if above |
| Rating ≥4.7 | 2 | 2 if ≥4.7, 1 if 4.5–4.7, 0 if <4.5 |
| Has working website | 2 | 2 yes, 0 no |
| Owner-operator signals (founder name in brand, women-owned, single location, "I" voice on site) | 2 | 0–2 cumulative |
| Independent (not chain — no other branches in the brand) | 1 | 1 yes, 0 no |
| Primary category = Medical spa | -1 if missing | 1 yes, -1 if "Day spa" / "Massage spa" / "Plastic surgery" |

### Buckets

- **Bucket A (8–10):** Top-tier. Deep research + custom email. Highest priority for the WORDSMITH stage.
- **Bucket B (6–7):** Strong. Standard hook from lead data + email.
- **Bucket C (4–5):** Database only. Don't email yet. Re-evaluate in a second wave.
- **Bucket D (0–3):** Drop. Wrong fit.

Aim for **roughly 50% of leads in Buckets A+B** combined per metro. If a metro is producing >70% Bucket C+D, the search query is wrong (probably picking up day spas or chains) — adjust the query.

---

## Personalization signal map — what hooks emerge from each data point

For the WORDSMITH stage, these are the strongest hooks the data unlocks. Each one anchors the email opening line.

| Signal in data | Hook the email opens with |
|----------------|---------------------------|
| 500+ reviews at ≥4.8 | "noticed you've built X reviews at Y stars on [street] — that's elite-tier for an independent in [neighborhood], which means the retention work is done, just unscripted" |
| 100–300 reviews at 5 stars | "noticed your perfect 5-star average across X reviews — that's the operator-cares-about-every-client signal, exactly the kind of clinic where the auto review-ask compounds the fastest" |
| 100–500 reviews but rating <4.7 | "noticed your X reviews on [street] — and the rating sitting at Y (vs the 4.9s nearby) usually traces to a couple of no-show recovery moments that didn't land. The 24hr-reminder layer typically fixes that" |
| Women-owned | "the women-owned indie model is exactly where the front desk is also the owner, and that's where two-button automation lifts the most weight" |
| Latino-/Black-/LGBTQ+-owned | reference the community-led founder energy explicitly |
| Founder's name in brand | "noticed the founder's name in the brand — solo-founder energy, the kind of clinic where the front desk and the owner are the same person" |
| Single-location small footprint (suite number, inside another building, "Phenix Salon Suites" type) | "noticed you're a solo-suite operator — every no-show shows up loudly when the clinic IS the owner" |
| Online scheduling tool visible | "noticed you've got online scheduling but no auto-confirmation email — that's the moment most clinics lose 4–6% of bookings" |
| Multilingual (Spanish, Cantonese, etc.) | reference the multi-cultural patient base and the specific automation language support |
| New brand / <100 reviews | "you're at the size where the auto review-ask flow turns X reviews into 200 inside a year" |
| Premium street (Wilshire, Park Ave, Ventura, Bloor, Robson, Brickell) | reference the specific street, the tier of competition there, and how retention is the moat in chain-saturated corridors |

The hook is the most important field in the brief. **A great hook is more important than 10 mediocre data points.** If you're cranking out hooks that all feel templated, stop and add a website-fetch research pass for that batch.

---

## Volume + pacing rules

### Per scraping session

- Target: **40–60 new leads per session**, across 3–4 metros or 8–12 neighborhoods.
- Don't exceed 100 new leads per session — token budget for downstream research suffers.
- Always save to `1_raw_leads.csv` before moving to research. If the session crashes, leads are preserved.

### Per email send batch

- First send batch: **10 emails immediately + 40 drafts in Gmail** (matches Bibek's chosen send mode).
- Daily send cap from `vibekb.1234@gmail.com`: **10/day** (warming a fresh personal Gmail).
- Total send window: spread 50 emails over 5 days. Anything faster trips Gmail's spam filter.

### Per follow-up sequence

After first send:
- Day 4: follow-up #1 (short, value-led, no pitch)
- Day 8: follow-up #2 (different angle — referral question or content share)
- Day 14: follow-up #3 ("last note from me on this" — soft close)

Reply rate target: **5%** on the first email. **8–12%** cumulative across the sequence.

---

## Concrete examples — qualified vs disqualified, with reasoning

### ✅ Qualified examples (would email)

1. **Bare Beauty Clinic** — Etobicoke, Toronto. 359 reviews, 4.9 stars, single location on Lake Shore Blvd. Women-owned in Apify metadata. Independent (no other locations under "Bare Beauty Clinic" in their Google profile). **Bucket A**. Hook: "359 reviews at 4.9 on Lake Shore — exceptional for an indie on the Etobicoke strip."

2. **Chadia Ali MedSpa** — Miami Beach. 108 reviews, 5 stars, founder's name in brand, women-owned. Single location on 5th St. **Bucket A**. Hook: "noticed the founder's name in the brand and 108 reviews at 5 stars — solo-founder / brand-is-the-owner pattern."

3. **Reign Medispa** — Richmond, BC. 113 reviews, 4.9 stars, women-owned, multi-service (Acupuncture, Chinese Medicine, Facial, Laser, Skin care). Single location on Number 3 Rd. **Bucket A** (multi-cultural Richmond market is a personalization angle).

4. **Glow Aesthetic Center Med Spa** — Encino. 1,378 reviews, 5 stars. Independent. Top-tier signal but EDGE CASE: review count above 600 sweet spot. Still **Bucket A** because the rating is perfect and they're clearly an indie monster operator. Hook leans on "top 1% Valley aesthetics."

5. **No Filter Medical Spa** — Downtown Miami. 196 reviews, 4.9 stars, LGBTQ+-owned. Single location, distinctive brand name. **Bucket A**. Hook references the LGBTQ+-owned community indie positioning.

### ❌ Disqualified examples (would skip)

1. **NakedMD Med Spa Beverly Hills** — 513 reviews, 4.9 stars. Looks tempting until you check their website — they have **5 locations across LA**. **Drop. Chain.**

2. **Skin Spa New York Miami Beach** — multi-location chain (NYC + Miami). 69 reviews. **Drop. Chain.**

3. **Dolce Medical Spa Miami** — 1,090 reviews, 5 stars. Looks A-tier. Check the URL: `mia.dolcemedicalspas.com` (notice the `mia.` subdomain). They have **multiple locations across Florida**. **Drop. Chain.**

4. **Pure Dermatology & Skin Surgery Center: Parrish Sadeghi, MD** — 471 reviews, 4.9. Looks great. But the primary category is **Dermatologist**, not Medical spa. They're a dermatology practice with aesthetics on the side. **Drop. Wrong buyer.**

5. **Levi Michael J DPM** — appeared in Santa Monica scrape. Category: **Podiatrist**. Total false positive from Google Maps' loose match. **Drop. Not a medspa.**

6. **Dental Spa** (Pacific Palisades) — appeared in earlier LA scrape. Category: **Dentist**. **Drop.**

7. **Tre'Bella Nail & Spa** (Chicago) — categorized as "Nail salon" but Google included it in medspa search. **Drop.**

8. **Express Med Spa Chicago Mount Greenwood** — 118 reviews, 4.9 stars. Looks good until you check the URL: `expressmedspas.com/medical-spa-chicago-mount-greenwood-il/` — the URL pattern reveals **multiple locations** (multi-city brand). **Drop. Chain.**

9. **Rejuvenation Med Clinic** (Toronto) — 292 reviews but rating is 4.2 and the website has obvious chain templating. Phone goes to a 1-855 number. **Drop. Chain or franchise.**

10. **Body Logic LA** (Beverly Hills) — 9 reviews, no website, no phone listed, possibly inside another clinic's space. Too thin. **Drop. Insufficient signal.**

---

## How to spot a chain in the scraped data (most common false-positive)

1. **Toll-free phone numbers** (1-855, 1-877, 1-800) → almost always chain or franchise.
2. **URL with location subdomain** (`mia.brand.com`, `chicago.brand.com`, `brand.com/locations/...`) → chain.
3. **`/locations/`, `/find-a-location/`, `/our-clinics/` paths** in the website URL → chain.
4. **Same brand name in 2+ scraped results across different cities** → chain.
5. **Generic templated About page** (no founder bio, no founder photo, no founder voice) → chain.
6. **Google Maps "Identifies as women-owned" / "Latino-owned" flag is missing on multi-location brands** — chains rarely fill this.
7. **Reviews mention "the company" / "the team" / "this location" rather than a specific person's name** → chain.
8. **Brand name reads like a corporate product** ("Express," "Premier," "Elite," "National," "American") → 90% chain.
9. **Address inside a strip mall medical complex with 5+ medspas at the same suite address** → corporate co-located.
10. **Brand on RealSelf or Healthgrades with "Locations" tab** → chain.

---

## Output format

### Master leads file: `outputs/swarm/1_raw_leads.csv`

```csv
id,name,city_area,state,country,neighborhood,website,phone,rating,reviews,category,address,placeId,women_owned,latino_owned,lgbtq_owned,black_owned,online_scheduling,membership,quality_score,bucket,notes
A01,Buckhead Aesthetics,Atlanta,GA,US,Buckhead,https://buckheadaesthetics.com/,(404) 555-1212,4.9,287,Medical spa,"3344 Peachtree Rd NE, Atlanta, GA 30326",ChIJ...,true,false,false,false,true,true,9,A,women-owned solo Buckhead
...
```

### Companion files (other agents will produce these later, but you may seed them):

- `outputs/swarm/2_lead_briefs.csv` — per-lead personalization hooks (top 50)
- `outputs/swarm/3_email_drafts.csv` — final personalized cold emails (one per Bucket A/B lead)
- `outputs/swarm/4_send_log.csv` — what was sent vs. drafted vs. failed
- `outputs/swarm/5_inbox_report.csv` — reply classifications

### Status file (you maintain this): `outputs/swarm/SCRAPE_LOG.md`

After each scrape session, append a short note:

```markdown
## 2026-04-28 — Atlanta + Dallas + Phoenix + Houston run
- Atlanta: 14 raw, 9 qualified (Bucket A: 4, B: 5)
- Dallas: 12 raw, 8 qualified (Bucket A: 3, B: 5)
- Phoenix: 15 raw, 11 qualified (Bucket A: 6, B: 5) — Scottsdale corridor strong
- Houston: 12 raw, 6 qualified — many false positives (laser-only chains)
- Total new in pool: 34
- Cumulative pool size: 168 leads
- Notes: Scottsdale outperformed Phoenix proper; consider running Scottsdale-only next time.
```

---

## Hand-off note for the next agent

You're picking this up from where the previous session left off:

- **Pool size at handoff:** 134 leads in `1_raw_leads.csv` (the metros listed above are all done; don't re-scrape them).
- **Next priority:** Tier 1 metros — Atlanta, Dallas, Phoenix, Houston.
- **What's already running:** A Chicago run completed (15 raw leads pulled, mostly South Side — they're noisier than Lincoln Park / Wicker Park; you may want to redo Chicago with neighborhood-specific queries before counting that batch as done).
- **What's NOT done yet:** Tier 2 (Boston, Seattle, San Diego), Tier 3 (Calgary, Montreal), Tier 4.
- **Do NOT spawn 5+ parallel research agents that each fan out to 13 webfetches simultaneously.** Anthropic API rate-limits will throttle them. If you do per-lead website research, batch by 1–2 agents at a time, ~10 leads each, sequentially.
- **Apify upgrade status:** Bibek upgraded to the $29 Personal plan during this session. The plan upgrade was intermittent — sometimes the actor accepted parallel runs, sometimes it returned 8192MB cap errors. If parallel doesn't work, fall back to sequential.

### Your prompt to start the next session

> "Read `outputs/swarm/ICP.md` top to bottom. Then read `outputs/swarm/1_raw_leads.csv` to see what's already in the pool. Then scrape **Atlanta, Dallas, Phoenix, and Houston** (15 leads each, 4 parallel runs if Apify memory allows). After each run, dedupe against the existing pool, score with the rubric in the ICP, and append qualified leads to `1_raw_leads.csv`. Update `SCRAPE_LOG.md`. Stop and report back when those 4 metros are done — don't proceed to Tier 2 without checking in first."

---

## Quick reference card (print this if you're building from a phone)

| Question | Answer |
|----------|--------|
| What's the offer? | $3,500 setup + $1,000/mo MGE automation system |
| Who's the buyer? | Woman-owned independent MedSpa, 1–3 providers, 100–600 reviews, $200K–$800K/yr |
| What city first? | Atlanta, then Dallas, Phoenix, Houston |
| Apify actor? | `compass/crawler-google-places` |
| Standard search term? | `["medspa"]` |
| Min stars? | 4.0 |
| Per-query result count? | 12–15 |
| Chain detection? | Toll-free phone, location subdomain, "Locations" tab, generic About page |
| Dedup key? | `placeId` first, then phone+name fuzzy |
| Output file? | `outputs/swarm/1_raw_leads.csv` |
| Sender? | Bibek Bhandari, `vibekb.1234@gmail.com` |
| Tone? | Solo individual, peer-to-peer, "I built this" |
