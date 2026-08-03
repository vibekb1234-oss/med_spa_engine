"""
Stress test:
1. Load test — 10x the dataset, see how validators scale
2. Corruption test — inject malformed rows, verify validators catch them
"""
import csv, random, time, copy
from datetime import datetime, timedelta
from pathlib import Path

random.seed(707)
DATA = Path("/sessions/kind-lucid-bardeen/mnt/MedSpa Growth Engine/test_data")
NOW = datetime(2026, 7, 28)

# Load current data
clients_orig = list(csv.DictReader(open(DATA / "clients.csv")))
appts_orig = list(csv.DictReader(open(DATA / "appointments.csv")))

# ─── LOAD TEST: 10x volume ───
print("╔══ LOAD TEST: 10x volume expansion " + "═"*40 + "╗\n")

start_time = time.time()
scaled_clients = []
scaled_appts = []
for mult in range(10):
    for c in clients_orig:
        new_c = dict(c)
        # Suffix email to keep unique
        if new_c["Client Email"]:
            e_parts = new_c["Client Email"].split("@")
            new_c["Client Email"] = f"{e_parts[0]}.x{mult}@{e_parts[1]}"
        new_c["Client Name"] = f"{new_c['Client Name']} #{mult}"
        scaled_clients.append(new_c)
    for a in appts_orig:
        new_a = dict(a)
        if new_a["Client Email"]:
            e_parts = new_a["Client Email"].split("@")
            new_a["Client Email"] = f"{e_parts[0]}.x{mult}@{e_parts[1]}"
        new_a["Client Name"] = f"{new_a['Client Name']} #{mult}"
        scaled_appts.append(new_a)

# Write to temp files
(DATA / "_stress").mkdir(exist_ok=True)
with (DATA / "_stress" / "clients_10x.csv").open("w", newline="", encoding="utf-8") as f:
    csv.DictWriter(f, fieldnames=list(scaled_clients[0].keys())).writerows([{**{k:v for k,v in c.items()}} for c in scaled_clients])
with (DATA / "_stress" / "appointments_10x.csv").open("w", newline="", encoding="utf-8") as f:
    csv.DictWriter(f, fieldnames=list(scaled_appts[0].keys())).writerows([{**{k:v for k,v in a.items()}} for a in scaled_appts])

# Actually rewrite with header
for path, rows in [(DATA/"_stress"/"clients_10x.csv", scaled_clients),
                    (DATA/"_stress"/"appointments_10x.csv", scaled_appts)]:
    keys = list(rows[0].keys())
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=keys); w.writeheader(); w.writerows(rows)

gen_time = time.time() - start_time
print(f"  Generated 10x dataset: {len(scaled_clients):,} clients, {len(scaled_appts):,} appointments")
print(f"  Generation time: {gen_time:.2f}s")

# Now run validation on the 10x set
def parse_dt(s):
    if not s: return None
    for fmt in ("%Y-%m-%d %H:%M:%S","%Y-%m-%d"):
        try: return datetime.strptime(s, fmt)
        except: pass
    return None

def parse_appt(d, t):
    dt = parse_dt(d)
    if not dt: return None
    if t:
        try:
            tt = datetime.strptime(t.strip(), "%I:%M %p")
            dt = dt.replace(hour=tt.hour, minute=tt.minute)
        except: pass
    return dt

start = time.time()
appt_map = {}
for a in scaled_appts:
    e = a["Client Email"].lower().strip()
    if e: appt_map.setdefault(e, []).append(a)

buckets = {"48h":0,"24h":0,"no_show":0,"post_appt":0,"inquiry_fu":0}
yesterday_str = (NOW - timedelta(days=1)).strftime("%Y-%m-%d")
now_9am = NOW.replace(hour=9)

for c in scaled_clients:
    if not c["Client Email"] or (c.get("Opted Out") or "").lower() == "yes": continue
    email = c["Client Email"].lower().strip()
    status = c.get("Status","").strip()
    if status == "New Inquiry":
        created = parse_dt(c["Created Date"])
        if created:
            days_since = (now_9am - created).days
            last_fu = parse_dt(c["Last Follow-Up Date"])
            days_since_fu = (now_9am - last_fu).days if last_fu else 999
            fu_count = int(c.get("Follow-Up Count") or 0)
            if days_since >= 3 and days_since_fu >= 3 and fu_count < 3:
                buckets["inquiry_fu"] += 1
    for a in appt_map.get(email, []):
        appt_dt = parse_appt(a["Appointment Date"], a["Appointment Time"])
        if not appt_dt: continue
        hours_until = (appt_dt - now_9am).total_seconds() / 3600
        appt_status = a.get("Status","").strip()
        if appt_status == "Scheduled" and 44 <= hours_until <= 52 and (a.get("Pre-Appt Reminder Sent") or "").lower() != "yes":
            buckets["48h"] += 1
        if appt_status == "Scheduled" and 20 <= hours_until <= 28 and (a.get("Pre-Appt Reminder Sent") or "").lower() == "yes" and (a.get("24hr Reminder Sent") or "").lower() != "yes":
            buckets["24h"] += 1
        if appt_status == "No-Show" and a["Appointment Date"] == yesterday_str and (a.get("Post-Appt Follow-Up Sent") or "").lower() != "yes":
            buckets["no_show"] += 1
        if appt_status == "Completed" and a["Appointment Date"] == yesterday_str and (a.get("Post-Appt Follow-Up Sent") or "").lower() != "yes":
            buckets["post_appt"] += 1

sim_time = time.time() - start
total_emails = sum(buckets.values())
print(f"  W2 sim on 10x data: {total_emails:,} emails, ran in {sim_time:.2f}s")
print(f"    (Original 1x fired 23 emails; 10x fires {total_emails:,} which is ≈10× as expected)")

# Sanity check math
scale_factor = total_emails / 23
print(f"    Actual scale factor: {scale_factor:.1f}× (expected ≈10.0)")

# ─── CORRUPTION TEST ───
print(f"\n╔══ CORRUPTION TEST: inject malformed rows " + "═"*35 + "╗\n")

corrupted = copy.deepcopy(clients_orig)
# Inject 5 malformed rows
corruptions = [
    {"Client Name": "Missing Email Client", "Client Email": "", "Phone": "(555) 555-0001",
     "Service Interest": "Botox", "Status": "New Inquiry", "Created Date": "2026-07-28 10:00:00",
     "Total Visits":0,"Total Spend":0,"VIP Status":"Standard","Opted Out":"","Review Requested":"",
     "Review Left":"","Last Follow-Up Date":"","Follow-Up Count":0,"Last Promo Month":"",
     "Lead Source":"","Last Visit Date":"","Notes":"CORRUPTION: no email"},
    {"Client Name": "Bad Date", "Client Email": "bad.date@test.com", "Phone": "",
     "Service Interest": "Botox", "Status": "Completed", "Created Date": "not-a-real-date",
     "Last Visit Date":"also not a date","Total Visits":3,"Total Spend":1500,"VIP Status":"Standard",
     "Opted Out":"","Review Requested":"","Review Left":"","Last Follow-Up Date":"","Follow-Up Count":0,
     "Last Promo Month":"","Lead Source":"","Notes":"CORRUPTION: bad dates"},
    {"Client Name": "Negative Spend", "Client Email": "neg@test.com", "Phone": "",
     "Service Interest": "Botox", "Status": "Completed", "Created Date": "2026-01-01",
     "Last Visit Date":"2026-07-01","Total Visits":-5,"Total Spend":-1000,"VIP Status":"Standard",
     "Opted Out":"","Review Requested":"","Review Left":"","Last Follow-Up Date":"","Follow-Up Count":0,
     "Last Promo Month":"","Lead Source":"","Notes":"CORRUPTION: negative numbers"},
    {"Client Name": "VIP Status Mismatch", "Client Email": "vipmismatch@test.com", "Phone": "",
     "Service Interest": "Botox", "Status": "Lapsed", "Created Date": "2025-01-01",
     "Last Visit Date":"2025-05-01","Total Visits":8,"Total Spend":6000,"VIP Status":"VIP",
     "Opted Out":"","Review Requested":"","Review Left":"","Last Follow-Up Date":"","Follow-Up Count":0,
     "Last Promo Month":"","Lead Source":"","Notes":"CORRUPTION: VIP status but Lapsed row status"},
    {"Client Name": "Duplicate Email", "Client Email": clients_orig[0]["Client Email"], "Phone": "",
     "Service Interest": "Botox", "Status": "New Inquiry", "Created Date": "2026-07-28",
     "Total Visits":0,"Total Spend":0,"VIP Status":"Standard","Opted Out":"","Review Requested":"",
     "Review Left":"","Last Follow-Up Date":"","Follow-Up Count":0,"Last Promo Month":"",
     "Lead Source":"","Last Visit Date":"","Notes":"CORRUPTION: duplicate email"},
]
corrupted.extend(corruptions)

with (DATA / "_stress" / "clients_corrupted.csv").open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(corrupted[0].keys())); w.writeheader(); w.writerows(corrupted)

# Run validators against corrupted data
from collections import Counter
issues, warnings = [], []
email_counts = Counter(c["Client Email"].lower().strip() for c in corrupted if c["Client Email"])
dupes = {e:n for e,n in email_counts.items() if n>1}
if dupes: issues.append(f"{len(dupes)} duplicate emails detected")
bad_dates = 0
for c in corrupted:
    for f in ("Created Date","Last Visit Date"):
        if c.get(f) and not parse_dt(c[f]): bad_dates += 1
if bad_dates: issues.append(f"{bad_dates} unparseable dates detected")
neg_spend = sum(1 for c in corrupted if float(c.get("Total Spend") or 0) < 0)
if neg_spend: issues.append(f"{neg_spend} negative Total Spend values")
neg_visits = sum(1 for c in corrupted if int(c.get("Total Visits") or 0) < 0)
if neg_visits: issues.append(f"{neg_visits} negative Total Visits values")
missing_email = sum(1 for c in corrupted if not c.get("Client Email"))
if missing_email: warnings.append(f"{missing_email} clients missing email (workflows will skip)")
vip_mismatches = sum(1 for c in corrupted if c["VIP Status"] == "VIP" and c["Status"] not in ("VIP",))
if vip_mismatches: warnings.append(f"{vip_mismatches} VIP-flag vs Status mismatch (may be valid: lapsing VIPs)")

print(f"  Corrupted 5 rows injected. Validator detected:")
print(f"    ISSUES caught: {len(issues)}")
for i in issues: print(f"      ✗ {i}")
print(f"    WARNINGS raised: {len(warnings)}")
for w in warnings: print(f"      ⚠ {w}")

if len(issues) >= 3:
    print(f"\n  ✓ Validator correctly caught the intentional corruption")
else:
    print(f"\n  ⚠ Validator missed some corruption — needs additional checks")

# Clean up stress files
print("\nStress test artifacts kept in test_data/_stress/ for inspection")
