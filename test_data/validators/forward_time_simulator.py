"""
Advance the simulation clock day-by-day for 30 days.
Show what W2 fires each morning, W5 fires on Mondays, W4 fires 1st of month.
Proves the data behaves correctly over time — not just today.
"""
import csv
from datetime import datetime, timedelta
from pathlib import Path

DATA = Path("/sessions/kind-lucid-bardeen/mnt/MedSpa Growth Engine/test_data")
START = datetime(2026, 7, 28, 9, 0, 0)

clients = list(csv.DictReader(open(DATA / "clients.csv")))
appts = list(csv.DictReader(open(DATA / "appointments.csv")))

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

# Simulate marking-before-send: we mutate the appts state as sends happen
# so future days don't re-fire

def run_w2(now, appts, clients):
    """Return counts of each trigger type fired at NOW."""
    counts = {"48h":0, "24h":0, "no_show":0, "post_appt":0, "inquiry_fu":0}
    yesterday_str = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    appt_map = {}
    for a in appts:
        e = a["Client Email"].lower().strip()
        if e: appt_map.setdefault(e, []).append(a)

    for c in clients:
        if not c["Client Email"]: continue
        if (c.get("Opted Out") or "").lower() == "yes": continue
        email = c["Client Email"].lower().strip()
        status = c.get("Status","").strip()

        # Inquiry follow-up
        if status == "New Inquiry":
            created = parse_dt(c["Created Date"])
            if created:
                days_since = (now - created).days
                last_fu = parse_dt(c["Last Follow-Up Date"])
                days_since_fu = (now - last_fu).days if last_fu else 999
                fu_count = int(c.get("Follow-Up Count") or 0)
                if days_since >= 3 and days_since_fu >= 3 and fu_count < 3:
                    counts["inquiry_fu"] += 1
                    # Mark: increment count and set last_fu
                    c["Follow-Up Count"] = str(fu_count + 1)
                    c["Last Follow-Up Date"] = now.strftime("%Y-%m-%d %H:%M:%S")

        for a in appt_map.get(email, []):
            appt_dt = parse_appt(a["Appointment Date"], a["Appointment Time"])
            if not appt_dt: continue
            hours_until = (appt_dt - now).total_seconds() / 3600
            appt_status = a.get("Status","").strip()
            appt_date_str = a["Appointment Date"]

            if (appt_status == "Scheduled" and 44 <= hours_until <= 52
                and (a.get("Pre-Appt Reminder Sent") or "").lower() != "yes"):
                counts["48h"] += 1
                a["Pre-Appt Reminder Sent"] = "Yes"

            if (appt_status == "Scheduled" and 20 <= hours_until <= 28
                and (a.get("Pre-Appt Reminder Sent") or "").lower() == "yes"
                and (a.get("24hr Reminder Sent") or "").lower() != "yes"):
                counts["24h"] += 1
                a["24hr Reminder Sent"] = "Yes"

            if (appt_status == "No-Show" and appt_date_str == yesterday_str
                and (a.get("Post-Appt Follow-Up Sent") or "").lower() != "yes"):
                counts["no_show"] += 1
                a["Post-Appt Follow-Up Sent"] = "Yes"

            if (appt_status == "Completed" and appt_date_str == yesterday_str
                and (a.get("Post-Appt Follow-Up Sent") or "").lower() != "yes"):
                counts["post_appt"] += 1
                a["Post-Appt Follow-Up Sent"] = "Yes"
    return counts

def run_w5(now, appts):
    """Weekly report — runs Monday 8am."""
    week_start = now - timedelta(days=7)
    completed = [a for a in appts if a["Status"] == "Completed" and parse_dt(a["Appointment Date"]) and week_start <= parse_dt(a["Appointment Date"]) <= now]
    revenue = sum(float(a["Revenue"] or 0) for a in completed)
    return {"emails": 1, "completions": len(completed), "revenue": revenue}

def run_w4(now, clients):
    """client reactivation — runs 1st of month at 10am."""
    d60 = (now - timedelta(days=60)).strftime("%Y-%m-%d")
    d90 = (now - timedelta(days=90)).strftime("%Y-%m-%d")
    d180 = (now - timedelta(days=180)).strftime("%Y-%m-%d")
    current_month = now.strftime("%Y-%m")
    counts = {"L60":0,"L90":0,"L180":0,"Seasonal":0}
    for c in clients:
        if not c["Client Email"] or (c.get("Opted Out") or "").lower() == "yes": continue
        if c.get("Status") == "New Inquiry": continue
        last_visit = parse_dt(c["Last Visit Date"])
        if not last_visit: continue
        lv_str = last_visit.strftime("%Y-%m-%d")
        if c.get("Last Promo Month") == current_month: continue
        if lv_str <= d180: counts["L180"] += 1
        elif lv_str <= d90: counts["L90"] += 1
        elif lv_str <= d60: counts["L60"] += 1
        else: counts["Seasonal"] += 1
        c["Last Promo Month"] = current_month
    return counts

# ─── Simulate 30 days forward ───
print("╔" + "═" * 74 + "╗")
print("║  30-DAY FORWARD SIMULATION (2026-07-28 → 2026-08-26)".ljust(75) + "║")
print("╚" + "═" * 74 + "╝\n")

# Working copies
w_appts = [dict(a) for a in appts]
w_clients = [dict(c) for c in clients]

totals = {"w2_48h":0,"w2_24h":0,"w2_no_show":0,"w2_post_appt":0,"w2_inquiry_fu":0,"w5":0,"w4_total":0}

print(f"{'Date':<12} {'DoW':<4} {'W2 sends':<12} {'W5?':<5} {'W4?':<5} {'Notes':<20}")
print("─" * 75)

for day in range(30):
    now = START + timedelta(days=day)
    dow = now.strftime("%a")

    # W2 runs daily at 9am
    w2 = run_w2(now, w_appts, w_clients)
    w2_total = sum(w2.values())
    for k,v in w2.items():
        totals[f"w2_{k}"] += v

    # W5 runs Monday 8am
    w5_note = ""
    if now.weekday() == 0:  # Monday
        w5 = run_w5(now, w_appts)
        totals["w5"] += 1
        w5_note = f"1 report (${w5['revenue']:,.0f})"

    # W4 runs 1st of month at 10am
    w4_note = ""
    if now.day == 1:
        w4 = run_w4(now, w_clients)
        w4_total = sum(w4.values())
        totals["w4_total"] += w4_total
        w4_note = f"{w4_total} emails"

    # Compact display
    w2_line = f"{w2_total:2d} ({w2['48h']}+{w2['24h']}+{w2['no_show']}+{w2['post_appt']}+{w2['inquiry_fu']})" if w2_total else "0"
    print(f"{now.strftime('%Y-%m-%d')} {dow:<4} {w2_line:<12} {'✓ '+w5_note if w5_note else '':<5} {'✓ '+w4_note if w4_note else '':<5}")

print("\n╔══ 30-DAY TOTALS " + "═" * 55 + "╗")
print(f"  Workflow 2 total emails:     {sum(v for k,v in totals.items() if k.startswith('w2_'))}")
print(f"    48hr reminders:            {totals['w2_48h']}")
print(f"    24hr reminders:            {totals['w2_24h']}")
print(f"    no-show recoveries:        {totals['w2_no_show']}")
print(f"    post-appt check-ins:       {totals['w2_post_appt']}")
print(f"    inquiry follow-ups:        {totals['w2_inquiry_fu']}")
print(f"  Workflow 5 weekly reports:   {totals['w5']}")
print(f"  Workflow 4 monthly (Aug 1):  {totals['w4_total']}")
print("╚" + "═" * 74 + "╝")

# Check for idempotency violations
# After 30 days, count how many appointments still have Pre-Appt Reminder = No (should be some future ones)
future_unread = sum(1 for a in w_appts if a["Status"] == "Scheduled" and (a.get("Pre-Appt Reminder Sent") or "").lower() != "yes")
print(f"\n  Scheduled appts still unnotified: {future_unread} (should be near 0 if within 30d window)")

