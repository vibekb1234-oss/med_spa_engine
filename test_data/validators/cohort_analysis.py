"""
Cohort retention curves — verify the dataset shows realistic MoM retention.
For each month clients were acquired, what % still visited within 90 days?
"""
import csv
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict

DATA = Path("/sessions/kind-lucid-bardeen/mnt/MedSpa Growth Engine/test_data")
NOW = datetime(2026, 7, 28)

clients = list(csv.DictReader(open(DATA / "clients.csv")))
appts = list(csv.DictReader(open(DATA / "appointments.csv")))

def parse_dt(s):
    if not s: return None
    for fmt in ("%Y-%m-%d %H:%M:%S","%Y-%m-%d"):
        try: return datetime.strptime(s, fmt)
        except: pass
    return None

# Group appointments by client_email
by_email = defaultdict(list)
for a in appts:
    if a["Status"] != "Completed": continue
    dt = parse_dt(a["Appointment Date"])
    if dt: by_email[a["Client Email"].lower()].append(dt)

# For each client, cohort_month = the month of their first appointment
cohort = defaultdict(list)  # month → list of client emails
for e, dates in by_email.items():
    first = min(dates)
    cohort_month = first.strftime("%Y-%m")
    cohort[cohort_month].append((e, dates))

print("╔══ COHORT RETENTION ANALYSIS " + "═"*45 + "╗\n")
print(f"{'Cohort':<10} {'Size':>5} {'M1 ret':>7} {'M3 ret':>7} {'M6 ret':>7} {'M12 ret':>8} {'Avg visits/client':>18}")
print("─" * 80)

for month in sorted(cohort.keys())[-12:]:
    entries = cohort[month]
    size = len(entries)
    if size == 0: continue

    first_dt = datetime.strptime(month + "-01", "%Y-%m-%d")
    m1_cutoff = first_dt + timedelta(days=30)
    m3_cutoff = first_dt + timedelta(days=90)
    m6_cutoff = first_dt + timedelta(days=180)
    m12_cutoff = first_dt + timedelta(days=365)

    # Only measure if we've had time to observe (skip cohorts too recent)
    if NOW < m1_cutoff: continue

    m1_returned = sum(1 for e,dates in entries if any(m1_cutoff < d < m1_cutoff + timedelta(days=60) for d in dates))
    m3_returned = sum(1 for e,dates in entries if any(m3_cutoff < d < m3_cutoff + timedelta(days=90) for d in dates)) if NOW >= m3_cutoff else None
    m6_returned = sum(1 for e,dates in entries if any(m6_cutoff < d < m6_cutoff + timedelta(days=90) for d in dates)) if NOW >= m6_cutoff else None
    m12_returned = sum(1 for e,dates in entries if any(m12_cutoff < d < m12_cutoff + timedelta(days=90) for d in dates)) if NOW >= m12_cutoff else None

    avg_visits = sum(len(dates) for e,dates in entries) / size

    fmt_pct = lambda n: f"{round(n/size*100)}%" if n is not None else "—"

    print(f"{month:<10} {size:>5} {fmt_pct(m1_returned):>7} {fmt_pct(m3_returned):>7} {fmt_pct(m6_returned):>7} {fmt_pct(m12_returned):>8} {avg_visits:>17.1f}")

# Overall averages
total_cohorts_meaningful = [c for m,c in cohort.items() if len(c) >= 5]
if total_cohorts_meaningful:
    all_clients_flat = [(e, dates) for c in total_cohorts_meaningful for e, dates in c]
    avg_visits_all = sum(len(dates) for e,dates in all_clients_flat) / len(all_clients_flat)
    print(f"\n  Overall average visits per client: {avg_visits_all:.2f}")

# Client lifecycle distribution
print("\n╔══ CLIENT LIFECYCLE DISTRIBUTION " + "═"*45 + "╗")
lifecycle = defaultdict(int)
for c in clients:
    v = int(c.get("Total Visits") or 0)
    if v == 0: bucket = "0 visits (inquiry only)"
    elif v == 1: bucket = "1 visit (trial)"
    elif v <= 3: bucket = "2-3 visits (trying it out)"
    elif v <= 7: bucket = "4-7 visits (established)"
    elif v <= 15: bucket = "8-15 visits (loyal)"
    else: bucket = "16+ visits (VIP power user)"
    lifecycle[bucket] += 1

total_clients = sum(lifecycle.values())
for bucket, n in sorted(lifecycle.items()):
    pct = n/total_clients*100
    bar = "█" * int(pct/2)
    print(f"  {bucket:<32} {n:>4} ({pct:>4.1f}%) {bar}")

# Revenue distribution
print("\n╔══ CLIENT SPEND DISTRIBUTION (LTV analysis) " + "═"*30 + "╗")
spend_buckets = defaultdict(int)
for c in clients:
    s = float(c.get("Total Spend") or 0)
    if s == 0: b = "$0 (no visits yet)"
    elif s < 500: b = "$1-499 (first purchase)"
    elif s < 2000: b = "$500-1999 (repeat)"
    elif s < 5000: b = "$2000-4999 (loyal)"
    elif s < 10000: b = "$5000-9999 (high value)"
    else: b = "$10000+ (elite)"
    spend_buckets[b] += 1

for b, n in sorted(spend_buckets.items()):
    pct = n/total_clients*100
    bar = "█" * int(pct/2)
    print(f"  {b:<30} {n:>4} ({pct:>4.1f}%) {bar}")

# Payer concentration (Pareto)
sorted_clients = sorted(clients, key=lambda c: float(c.get("Total Spend") or 0), reverse=True)
total_rev = sum(float(c.get("Total Spend") or 0) for c in clients)
if total_rev > 0:
    top10 = sum(float(c.get("Total Spend") or 0) for c in sorted_clients[:int(len(clients)*0.1)])
    top20 = sum(float(c.get("Total Spend") or 0) for c in sorted_clients[:int(len(clients)*0.2)])
    print(f"\n  Revenue concentration:")
    print(f"    Top 10% of clients drive: {top10/total_rev*100:.1f}% of revenue (${top10:,.0f} of ${total_rev:,.0f})")
    print(f"    Top 20% of clients drive: {top20/total_rev*100:.1f}% of revenue")
    print(f"    (Healthy MedSpa Pareto: top 20% should drive 60-80% of revenue)")

