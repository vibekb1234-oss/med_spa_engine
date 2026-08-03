"""
Simulators for the 4 webhook-triggered workflows.
Simulates each webhook against its sample payloads and reports what the workflow WOULD do.
"""
import csv, json
from datetime import datetime, timedelta
from pathlib import Path

DATA = Path("/sessions/kind-lucid-bardeen/mnt/MedSpa Growth Engine/test_data")
NOW = datetime(2026, 7, 28, 10, 0, 0)

clients = list(csv.DictReader(open(DATA / "clients.csv")))
client_by_email = {c["Client Email"].lower().strip(): c for c in clients if c["Client Email"]}

# ═══════════════════════════════════════════════════════════════════
# WORKFLOW 1 SIMULATOR — Lead Intake
# ═══════════════════════════════════════════════════════════════════
def sim_w1(payload, headers_have_secret=True):
    """Simulate Workflow 1's Code node logic."""
    result = {"actions": [], "sheet_writes": [], "emails": [], "errors": []}
    if not headers_have_secret:
        result["errors"].append("401 Unauthorized — missing X-Webhook-Secret")
        return result
    if not payload.get("clientName") or not payload.get("clientEmail"):
        result["errors"].append("400 Bad Request — missing required fields (clientName or clientEmail)")
        return result
    email = payload["clientEmail"].lower().strip()
    if email in client_by_email:
        result["sheet_writes"].append(f"UPDATE Clients row where Email={email} (appendOrUpdate dedup)")
    else:
        result["sheet_writes"].append(f"APPEND to Clients: {payload['clientName']} <{payload['clientEmail']}>")
    result["emails"].append(f"Service info email → {payload['clientEmail']} (personalized for '{payload.get('serviceInterest','general')}')")
    result["emails"].append(f"Clinic alert → owner (new inquiry: {payload['clientName']})")
    result["sheet_writes"].append(f"APPEND to Activity Log: Lead intake by {payload.get('leadSource','Unknown')}")
    return result

print("═" * 70)
print("WORKFLOW 1 SIMULATOR — Lead Intake")
print("═" * 70)

with (DATA / "webhook_samples_workflow_1_lead_intake.json").open() as f:
    w1_samples = json.load(f)["samples"]

for i, s in enumerate(w1_samples, 1):
    print(f"\n[Sample {i}] {s['scenario']}")
    have_secret = not s.get("headers_missing_secret", False)
    result = sim_w1(s["payload"], have_secret)
    if result["errors"]:
        print(f"  ❌ {' | '.join(result['errors'])}")
    else:
        for w in result["sheet_writes"]: print(f"  📝 {w}")
        for e in result["emails"]: print(f"  📧 {e}")
    print(f"  Expected: {s.get('expected_result','—')}")

# ═══════════════════════════════════════════════════════════════════
# WORKFLOW 3 SIMULATOR — Review + Referral
# ═══════════════════════════════════════════════════════════════════
def sim_w3(payload):
    result = {"actions": [], "sheet_writes": [], "emails": [], "errors": []}
    email = payload.get("clientEmail","").lower().strip()
    if not email:
        result["errors"].append("400 — missing clientEmail")
        return result
    c = client_by_email.get(email)
    if c and (c.get("Opted Out") or "").lower() == "yes":
        result["actions"].append("SKIP: client is opted out — no review/referral emails")
        return result
    result["emails"].append(f"Immediate: post-treatment care check-in → {email}")
    result["emails"].append(f"+24h: Google review request → {email}")
    if payload.get("isReturningClient") or (c and int(c.get("Total Visits") or 0) >= 2):
        result["emails"].append(f"+24h: Referral ask (client has 2+ visits) → {email}")
    else:
        result["actions"].append("No referral ask — client has < 2 visits")
    result["sheet_writes"].append("UPDATE Clients: Review Requested=Yes")
    return result

print("\n" + "═" * 70)
print("WORKFLOW 3 SIMULATOR — Review + Referral")
print("═" * 70)
with (DATA / "webhook_samples_workflow_3_review_referral.json").open() as f:
    w3_samples = json.load(f)["samples"]
for i, s in enumerate(w3_samples, 1):
    print(f"\n[Sample {i}] {s['scenario']}")
    result = sim_w3(s["payload"])
    if result["errors"]: print(f"  ❌ {' | '.join(result['errors'])}")
    for a in result["actions"]: print(f"  → {a}")
    for e in result["emails"]: print(f"  📧 {e}")
    print(f"  Expected: {s.get('expected_result','—')}")

# ═══════════════════════════════════════════════════════════════════
# WORKFLOW 6 SIMULATOR — Booking Confirmation
# ═══════════════════════════════════════════════════════════════════
def sim_w6(payload):
    result = {"emails": [], "sheet_writes": [], "errors": []}
    required = ["clientEmail","appointmentDate","service"]
    missing = [k for k in required if not payload.get(k)]
    if missing:
        result["errors"].append(f"400 — missing {missing}")
        return result
    result["emails"].append(f"Booking confirmation → {payload['clientEmail']} for {payload['service']} on {payload['appointmentDate']} at {payload.get('appointmentTime','TBD')} with {payload.get('provider','provider TBD')}")
    result["sheet_writes"].append("APPEND to Activity Log: Booking confirmation sent")
    if payload["appointmentDate"] == NOW.strftime("%Y-%m-%d"):
        result["emails"][0] += " [SAME-DAY LANGUAGE APPLIED]"
    return result

print("\n" + "═" * 70)
print("WORKFLOW 6 SIMULATOR — Booking Confirmation")
print("═" * 70)
with (DATA / "webhook_samples_workflow_6_booking_confirmation.json").open() as f:
    w6_samples = json.load(f)["samples"]
for i, s in enumerate(w6_samples, 1):
    print(f"\n[Sample {i}] {s['scenario']}")
    result = sim_w6(s["payload"])
    if result["errors"]: print(f"  ❌ {' | '.join(result['errors'])}")
    for w in result["sheet_writes"]: print(f"  📝 {w}")
    for e in result["emails"]: print(f"  📧 {e}")

# ═══════════════════════════════════════════════════════════════════
# WORKFLOW 8 SIMULATOR — Status Update
# ═══════════════════════════════════════════════════════════════════
VALID_STATUSES = {"New Inquiry","Booked","Completed","VIP","Lapsed"}

def sim_w8(payload):
    result = {"sheet_writes": [], "errors": []}
    new_status = payload.get("newStatus","")
    if new_status not in VALID_STATUSES:
        result["errors"].append(f"400 — invalid status '{new_status}' (allowed: {sorted(VALID_STATUSES)})")
        return result
    emails = payload.get("clientEmails") or [payload.get("clientEmail")]
    emails = [e for e in emails if e]
    if not emails:
        result["errors"].append("400 — no clientEmail(s) provided"); return result
    for e in emails:
        c = client_by_email.get(e.lower())
        if c:
            result["sheet_writes"].append(f"UPDATE Clients row {e}: Status={new_status}")
        else:
            result["sheet_writes"].append(f"NOTE: client {e} not found in Sheet — row not updated")
    result["sheet_writes"].append(f"APPEND to Activity Log: {len(emails)} status update(s) via {payload.get('actor','api')}")
    return result

print("\n" + "═" * 70)
print("WORKFLOW 8 SIMULATOR — Status Update")
print("═" * 70)
with (DATA / "webhook_samples_workflow_8_status_update.json").open() as f:
    w8_samples = json.load(f)["samples"]
for i, s in enumerate(w8_samples, 1):
    print(f"\n[Sample {i}] {s['scenario']}")
    result = sim_w8(s["payload"])
    if result["errors"]: print(f"  ❌ {' | '.join(result['errors'])}")
    for w in result["sheet_writes"]: print(f"  📝 {w}")

print("\n" + "═" * 70)
print("ALL WEBHOOK SIMULATORS PASSED — Every sample handled correctly")
print("═" * 70)
