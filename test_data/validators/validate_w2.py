"""Simulator for Workflow 2 (Appointment Follow-Up) — corrected reporter."""
import csv, json
from datetime import datetime, timedelta
from pathlib import Path
from collections import Counter

NOW = datetime(2026, 7, 28, 9, 0, 0)
DATA = Path("/sessions/kind-lucid-bardeen/mnt/MedSpa Growth Engine/test_data")

def parse_dt(s):
    if not s: return None
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try: return datetime.strptime(s, fmt)
        except: pass
    return None

def parse_appt(d, t):
    if not d: return None
    dt = parse_dt(d)
    if not dt: return None
    if t:
        try:
            tt = datetime.strptime(t.strip(), "%I:%M %p")
            dt = dt.replace(hour=tt.hour, minute=tt.minute)
        except: pass
    return dt

clients = list(csv.DictReader(open(DATA / "clients.csv")))
appts = list(csv.DictReader(open(DATA / "appointments.csv")))

appt_map = {}
for a in appts:
    e = a["Client Email"].lower().strip()
    if not e: continue
    appt_map.setdefault(e, []).append(a)

buckets = {"REMINDER_48H":[], "REMINDER_24H":[], "NO_SHOW":[], "INQUIRY_FU":[], "POST_APPT":[]}
today_str = NOW.strftime("%Y-%m-%d")
yesterday_str = (NOW - timedelta(days=1)).strftime("%Y-%m-%d")

for c in clients:
    if not c["Client Email"]: continue
    if (c.get("Opted Out") or "").lower() == "yes": continue
    email = c["Client Email"].lower().strip()
    status = (c.get("Status") or "").strip()

    if status == "New Inquiry":
        created = parse_dt(c["Created Date"])
        if created:
            days_since = (NOW - created).days
            last_fu = parse_dt(c["Last Follow-Up Date"])
            days_since_fu = (NOW - last_fu).days if last_fu else 999
            fu_count = int(c["Follow-Up Count"] or 0)
            if days_since >= 3 and days_since_fu >= 3 and fu_count < 3:
                buckets["INQUIRY_FU"].append({
                    "client": c["Client Name"], "email": c["Client Email"],
                    "fu_count": fu_count, "days_since": days_since
                })

    for a in appt_map.get(email, []):
        appt_dt = parse_appt(a["Appointment Date"], a["Appointment Time"])
        if not appt_dt: continue
        hours_until = (appt_dt - NOW).total_seconds() / 3600
        appt_status = (a["Status"] or "").strip()
        appt_date_str = a["Appointment Date"]

        if (appt_status == "Scheduled" and 44 <= hours_until <= 52
            and (a.get("Pre-Appt Reminder Sent") or "").lower() != "yes"):
            buckets["REMINDER_48H"].append({"client": c["Client Name"], "appt": appt_dt.strftime("%Y-%m-%d %H:%M"), "service": a["Service"], "hours_until": round(hours_until,1)})
        if (appt_status == "Scheduled" and 20 <= hours_until <= 28
            and (a.get("Pre-Appt Reminder Sent") or "").lower() == "yes"
            and (a.get("24hr Reminder Sent") or "").lower() != "yes"):
            buckets["REMINDER_24H"].append({"client": c["Client Name"], "appt": appt_dt.strftime("%Y-%m-%d %H:%M"), "service": a["Service"], "hours_until": round(hours_until,1)})
        if (appt_status == "No-Show" and appt_date_str == yesterday_str
            and (a.get("Post-Appt Follow-Up Sent") or "").lower() != "yes"):
            buckets["NO_SHOW"].append({"client": c["Client Name"], "appt": appt_dt.strftime("%Y-%m-%d %H:%M"), "service": a["Service"]})
        if (appt_status == "Completed" and appt_date_str == yesterday_str
            and (a.get("Post-Appt Follow-Up Sent") or "").lower() != "yes"):
            buckets["POST_APPT"].append({"client": c["Client Name"], "appt": appt_dt.strftime("%Y-%m-%d %H:%M"), "service": a["Service"]})

print(f"╔══ WORKFLOW 2 SIMULATION @ {NOW} " + "═"*20 + "╗")
total = 0
for kind, items in buckets.items():
    print(f"\n[{kind}] would send {len(items)} emails")
    for it in items[:10]:
        line = f"  → {it['client']}"
        if 'hours_until' in it: line += f" | in {it['hours_until']}h | {it.get('service','')}"
        elif 'appt' in it: line += f" | {it['appt']} | {it.get('service','')}"
        if 'fu_count' in it: line += f" | follow-up #{it['fu_count']+1}/3 | {it['days_since']}d since inquiry"
        print(line)
    if len(items) > 10: print(f"  … +{len(items)-10} more")
    total += len(items)
print(f"\n═══════════════════════════════════════════════════════════════════")
print(f"TOTAL W2 EMAILS: {total}")

expected = {"REMINDER_48H": 2, "REMINDER_24H": 1, "NO_SHOW": 1, "POST_APPT": 3, "INQUIRY_FU": 5}
issues = []
print("\nEXPECTED vs ACTUAL:")
for k, e in expected.items():
    actual = len(buckets[k])
    print(f"  {'OK ' if actual >= e else 'LOW'} {k:20s} {actual}/{e}" + (" ✓" if actual >= e else f" (missing {e-actual})"))
    if actual < e: issues.append(f"{k}: {actual}/{e}")
print("\n" + ("✓ All windows fire correctly." if not issues else f"⚠ Still short: {issues}"))
