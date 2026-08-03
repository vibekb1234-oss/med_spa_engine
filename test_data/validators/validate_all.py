"""
Full validation suite: Workflow 4, Workflow 5, data integrity, dashboard KPIs.
Runs in one pass, produces a consolidated report.
"""
import csv
from datetime import datetime, timedelta
from pathlib import Path
from collections import Counter, defaultdict

NOW = datetime(2026, 7, 28, 9, 0, 0)
DATA = Path("/sessions/kind-lucid-bardeen/mnt/MedSpa Growth Engine/test_data")

def parse_dt(s):
    if not s: return None
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try: return datetime.strptime(s, fmt)
        except: pass
    return None

clients = list(csv.DictReader(open(DATA / "clients.csv")))
appts = list(csv.DictReader(open(DATA / "appointments.csv")))

# ====================================================================
# WORKFLOW 4 SIMULATION (VIP Retention — monthly)
# ====================================================================
print("╔══ WORKFLOW 4 SIMULATION (VIP Retention) " + "═"*30 + "╗")

current_month = NOW.strftime("%Y-%m")  # "2026-07"
d60 = (NOW - timedelta(days=60)).strftime("%Y-%m-%d")
d90 = (NOW - timedelta(days=90)).strftime("%Y-%m-%d")
d180 = (NOW - timedelta(days=180)).strftime("%Y-%m-%d")

w4 = {"LAPSED_60": [], "LAPSED_90": [], "LAPSED_180": [], "SEASONAL": []}
for c in clients:
    if not c["Client Email"]: continue
    if (c.get("Opted Out") or "").lower() == "yes": continue
    if (c.get("Status") or "") == "New Inquiry": continue

    last_visit = parse_dt(c["Last Visit Date"])
    if not last_visit: continue

    last_visit_str = last_visit.strftime("%Y-%m-%d")
    last_promo = c.get("Last Promo Month") or ""
    if last_promo == current_month: continue  # already contacted this month

    if last_visit_str <= d180: w4["LAPSED_180"].append(c["Client Name"])
    elif last_visit_str <= d90: w4["LAPSED_90"].append(c["Client Name"])
    elif last_visit_str <= d60: w4["LAPSED_60"].append(c["Client Name"])
    else: w4["SEASONAL"].append(c["Client Name"])

total_w4 = 0
for k, names in w4.items():
    print(f"[{k}] {len(names)} emails")
    for n in names[:8]: print(f"  → {n}")
    if len(names) > 8: print(f"  … +{len(names)-8} more")
    total_w4 += len(names)
print(f"\nW4 TOTAL: {total_w4} emails")

# ====================================================================
# WORKFLOW 5 SIMULATION (Weekly Performance Report)
# ====================================================================
print("\n╔══ WORKFLOW 5 SIMULATION (Weekly Report) " + "═"*30 + "╗")

d7 = NOW - timedelta(days=7)
d14 = NOW - timedelta(days=14)
d60_dt = NOW - timedelta(days=60)
d90_dt = NOW - timedelta(days=90)

last_week_appts = [a for a in appts if parse_dt(a["Appointment Date"]) and d7 <= parse_dt(a["Appointment Date"]) <= NOW]
prev_week_appts = [a for a in appts if parse_dt(a["Appointment Date"]) and d14 <= parse_dt(a["Appointment Date"]) < d7]

completed = [a for a in last_week_appts if a["Status"] == "Completed"]
no_shows = [a for a in last_week_appts if a["Status"] == "No-Show"]
prev_completed = [a for a in prev_week_appts if a["Status"] == "Completed"]

revenue = sum(float(a["Revenue"] or 0) for a in completed)
prev_revenue = sum(float(a["Revenue"] or 0) for a in prev_completed)
no_show_rate = round(len(no_shows) / len(last_week_appts) * 100) if last_week_appts else 0

new_clients = [c for c in clients if parse_dt(c["Created Date"]) and parse_dt(c["Created Date"]) >= d7]
active_clients = [c for c in clients if c["Status"] in ("Booked","Completed","VIP")]
vip_clients = [c for c in clients if c["VIP Status"] == "VIP"]

at_risk = []
for c in clients:
    lv = parse_dt(c["Last Visit Date"])
    if not lv or (c.get("Opted Out") or "").lower() == "yes": continue
    if d90_dt < lv <= d60_dt and c["Status"] not in ("Lapsed","New Inquiry"):
        at_risk.append(c["Client Name"])

lapsed = []
for c in clients:
    lv = parse_dt(c["Last Visit Date"])
    if not lv or (c.get("Opted Out") or "").lower() == "yes": continue
    if (lv <= d90_dt or c["Status"] == "Lapsed") and c["Status"] != "New Inquiry":
        lapsed.append(c["Client Name"])

pending_inquiries = sum(1 for c in clients if c["Status"] == "New Inquiry")
reviews_requested = sum(1 for c in clients if c.get("Review Requested") == "Yes")
reviews_left = sum(1 for c in clients if c.get("Review Left") == "Yes")
review_rate = round(reviews_left / reviews_requested * 100) if reviews_requested else 0

print(f"""
Week: {d7.strftime('%b %d')} - {NOW.strftime('%b %d, %Y')}

  Completed treatments:  {len(completed)}
  No-shows:              {len(no_shows)}
  No-show rate:          {no_show_rate}%
  Revenue this week:     ${revenue:,.0f}
  Revenue prev week:     ${prev_revenue:,.0f}
  Trend:                 {'▲' if revenue >= prev_revenue else '▼'} {'+' if revenue >= prev_revenue else ''}{round((revenue-prev_revenue)/prev_revenue*100) if prev_revenue > 0 else '—'}%
  New clients this week: {len(new_clients)}
  Active clients:        {len(active_clients)}
  VIP clients:           {len(vip_clients)}
  At-risk (60-90d):      {len(at_risk)}
  Lapsed (90d+):         {len(lapsed)}
  Pending inquiries:     {pending_inquiries}
  Review rate:           {review_rate}% ({reviews_left}/{reviews_requested})
""")

# ====================================================================
# DATA INTEGRITY VALIDATOR
# ====================================================================
print("╔══ DATA INTEGRITY VALIDATION " + "═"*45 + "╗\n")

issues = []
warnings = []

# 1. Every appointment's email should exist in clients
client_emails = {c["Client Email"].lower().strip() for c in clients}
orphan_appts = [a for a in appts if a["Client Email"].lower().strip() not in client_emails]
if orphan_appts:
    issues.append(f"{len(orphan_appts)} appointments reference client emails not in Clients tab")
    for a in orphan_appts[:3]: print(f"  ORPHAN: {a['Client Name']} <{a['Client Email']}>")
else:
    print("✓ All appointments cross-reference to existing clients")

# 2. Duplicate emails in clients
email_counts = Counter(c["Client Email"].lower().strip() for c in clients if c["Client Email"])
dupes = {e: n for e, n in email_counts.items() if n > 1}
if dupes:
    warnings.append(f"{len(dupes)} client emails appear more than once")
    for e, n in list(dupes.items())[:3]: print(f"  DUPE: {e} ({n} rows)")
else:
    print("✓ No duplicate client emails")

# 3. Invalid dates
bad_dates = 0
for c in clients:
    for field in ("Created Date","Last Visit Date","Last Follow-Up Date"):
        if c[field] and not parse_dt(c[field]):
            bad_dates += 1; issues.append(f"Bad date {field}={c[field]} on {c['Client Name']}")
if bad_dates == 0: print("✓ All client dates parse")
else: print(f"⚠ {bad_dates} unparseable client dates")

# 4. Status consistency — VIP status should match Status column
vip_mismatches = [c for c in clients if c["VIP Status"] == "VIP" and c["Status"] != "VIP"]
if vip_mismatches:
    warnings.append(f"{len(vip_mismatches)} clients have VIP Status='VIP' but Status column ≠ 'VIP' (edge case: lapsing VIPs are valid)")
    for c in vip_mismatches[:3]: print(f"  VIP-STATUS: {c['Client Name']} status={c['Status']}")
else:
    print("✓ VIP flag consistent with Status column")

# 5. Completed clients should have Last Visit Date
completed_no_visit = [c for c in clients if c["Status"] == "Completed" and not c["Last Visit Date"]]
if completed_no_visit:
    issues.append(f"{len(completed_no_visit)} 'Completed' clients missing Last Visit Date")
    for c in completed_no_visit[:3]: print(f"  MISSING-VISIT: {c['Client Name']}")
else:
    print("✓ All Completed clients have Last Visit Date")

# 6. Total Visits should be > 0 for Completed/VIP
zero_visits = [c for c in clients if c["Status"] in ("Completed","VIP") and int(c.get("Total Visits") or 0) == 0]
if zero_visits:
    warnings.append(f"{len(zero_visits)} Completed/VIP clients have Total Visits = 0")
else:
    print("✓ All Completed/VIP clients have visit counts")

# 7. Total Spend consistency vs visits (rough sanity — >$0 spend if visits > 0)
spend_mismatch = [c for c in clients if int(c.get("Total Visits") or 0) > 0 and float(c.get("Total Spend") or 0) == 0]
if spend_mismatch:
    warnings.append(f"{len(spend_mismatch)} clients have visits but $0 spend (may be intentional for Consultations)")
else:
    print("✓ Visit counts and spend align")

# 8. Appointment dates should not be > 1 year in future
future_far = [a for a in appts if parse_dt(a["Appointment Date"]) and parse_dt(a["Appointment Date"]) > NOW + timedelta(days=365)]
if future_far:
    warnings.append(f"{len(future_far)} appointments dated >1 year in future")
else:
    print("✓ No unreasonable future dates")

# 9. Completed appointments should have revenue
zero_rev_completed = [a for a in appts if a["Status"] == "Completed" and float(a.get("Revenue") or 0) == 0 and "Consult" not in a.get("Service","") and "Analysis" not in a.get("Service","")]
if zero_rev_completed:
    warnings.append(f"{len(zero_rev_completed)} Completed non-consultation appointments have $0 revenue")
else:
    print("✓ All revenue-generating appointments have revenue")

# 10. Opted-out clients should not have any recent activity
optouts = [c for c in clients if (c.get("Opted Out") or "").lower() == "yes"]
print(f"\nOpt-outs: {len(optouts)} clients (workflows must suppress these)")

print(f"\n─── Integrity summary ───")
print(f"ISSUES:   {len(issues)}")
print(f"WARNINGS: {len(warnings)}")
if issues: [print(f"  ✗ {i}") for i in issues]
if warnings: [print(f"  ⚠ {w}") for w in warnings]
if not issues and not warnings:
    print("✓ CLEAN — no issues, no warnings")

# ====================================================================
# DASHBOARD KPI SIMULATION — Overview page
# ====================================================================
print(f"\n╔══ DASHBOARD OVERVIEW KPIs (simulated) " + "═"*35 + "╗\n")

print(f"  Active clients:            {len(active_clients)}")
print(f"  Treatments last 30 days:   {sum(1 for a in appts if a['Status']=='Completed' and parse_dt(a['Appointment Date']) and parse_dt(a['Appointment Date']) >= NOW - timedelta(days=30))}")
print(f"  At-risk clients:           {len(at_risk)}")
print(f"  VIP clients:               {len(vip_clients)}")
print(f"  Pending inquiries:         {pending_inquiries}")
print(f"  Revenue (30d):             ${sum(float(a['Revenue'] or 0) for a in appts if a['Status']=='Completed' and parse_dt(a['Appointment Date']) and parse_dt(a['Appointment Date']) >= NOW - timedelta(days=30)):,.0f}")
print(f"  Revenue (all time):        ${sum(float(a['Revenue'] or 0) for a in appts if a['Status']=='Completed'):,.0f}")
print(f"  Total appointments:        {len(appts)}")
print(f"  No-show rate (last 30d):   {round(sum(1 for a in appts if a['Status']=='No-Show' and parse_dt(a['Appointment Date']) and parse_dt(a['Appointment Date']) >= NOW - timedelta(days=30)) / max(sum(1 for a in appts if parse_dt(a['Appointment Date']) and parse_dt(a['Appointment Date']) >= NOW - timedelta(days=30)), 1) * 100)}%")

# Pipeline kanban counts
status_counts = Counter(c["Status"] for c in clients)
print(f"\n  Pipeline columns:")
for s in ["New Inquiry","Booked","Completed","VIP","Lapsed"]:
    print(f"    {s:15s} {status_counts.get(s,0)} cards")

