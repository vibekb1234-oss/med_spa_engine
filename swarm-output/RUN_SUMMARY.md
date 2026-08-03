# MedSpa Growth Engine — Lead Pool MASTER Sheet

**Generated:** 2026-04-30
**Total unique leads:** 1101
**Source:** Multi-wave WebSearch swarm (Apify firewalled, sandbox proxy blocks BBB/Google)
**Pipeline:** Sub-agents via Anthropic WebSearch tool, parallel dispatch across 4 waves

## Pool Stats
| Metric | Count |
|--------|-------|
| Total unique leads | 1101 |
| Tier A (campaign-ready: has email or phone) | 63 |
| Tier B (needs email enrichment) | 1037 |
| Tier C (low signal) | 1 |

## Country Split
- USA: 903
- Canada: 198

## Top 15 Cities
  - Beverly Hills: 27
  - New York: 27
  - Miami: 26
  - Dallas: 24
  - Atlanta: 24
  - Los Angeles: 23
  - Scottsdale: 20
  - San Diego: 19
  - Toronto: 19
  - Austin: 19
  - Manhattan: 16
  - Bellevue: 16
  - Tampa: 16
  - Houston: 15
  - Ottawa: 14

## Specialty / Vertical Mix (top 10)
  - general: 883
  - iv-lounge: 32
  - weight-loss: 30
  - hair-restoration: 27
  - mens: 27
  - longevity: 24
  - hrt: 21
  - concierge: 12
  - sexual-wellness: 9
  - pelvic-floor: 7

## Wave Distribution
- W1: 512
- W3: 238
- W4: 207
- W2: 144

## Files
- **`MASTER_medspa_leads.csv`** — flat CSV, normalized schema, ready for Instantly upload (Tier A leads)
- **`MASTER_medspa_leads.xlsx`** — same data with 6 organized tabs:
  - Summary (this overview)
  - All Leads (sortable, color-coded tier)
  - Tier A — Send Now (campaign-ready)
  - Tier B — Enrich First (needs Apollo people_match)
  - Specialty Index
  - City Breakdown
- **`MASTER_all_niches.xlsx`** — cross-niche overview with all 3 niches combined

## Recommended Next Steps
1. **Apollo enrichment pass** — run `apollo_local_enricher.py` (in Mortgage folder, reusable for CPA/MedSpa) on Tier B leads to attach owner emails (1 credit per match, 100 credits available)
2. **Cold-email batch generation** — feed Tier A + newly-enriched Tier B into `/cold-email` agent swarm (same pattern as Mortgage's 573-email campaign in `Mortgage Pipeline Machine/swarm-output/run-batch2/`)
3. **Instantly.ai upload** — drop the master CSV into a 4-step sequence (cold → Day 3 bump → Day 7 angle → Day 14 break-up)
4. **Reply capture** — use existing MPM Workflow #10 pattern, adapted for the new niche

## Known Gaps
- WebSearch result snippets rarely include direct contact data → email/phone coverage is currently 5%
- Apollo `mixed_people/api_search` blocked behind paid plan; `people_match` works on free plan (1 credit each)
- Apify monthly cap exceeded; will reset next billing cycle for higher-fidelity Google Maps scraping with `scrapeContacts: true`
