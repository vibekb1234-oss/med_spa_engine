# Security Guide — MedSpa Growth Engine

**What protects what, and what breaks if you skip it. Written plain.**

Security isn't one thing you turn on. It's a stack of small locks, each protecting a different thing. Understanding the stack means you don't panic when someone asks "is this HIPAA compliant?" or "what if someone hacks my Sheet?"

This guide is short on purpose. If you can explain each line to a clinic owner in one sentence, you're safe.

---

## The threat model — what could actually go wrong

For a productized service like MGE, there are only 5 real risks. Every security decision below defends against one of these:

1. **A clinic's data leaks** (client names, emails, appointment history become public)
2. **Someone impersonates you** (spoofs your domain to send phishing as `bibek@medspagrowthengine.com`)
3. **Someone spams your automation** (finds a webhook URL and pumps garbage into a clinic's Sheet)
4. **Someone takes over your accounts** (steals a password, gets into Netlify/Workspace/n8n)
5. **A regulator or lawyer asks a question** (HIPAA, CAN-SPAM, GDPR, CASL)

That's it. Every layer below defends against one of these.

---

## The security stack, layer by layer

### Layer 1 — HTTPS everywhere (defends against: eavesdropping, phishing)

**What it is:** All traffic between visitors and your site is encrypted. The URL starts with `https://`, not `http://`.

**How it's set up:** Netlify auto-provisions a Let's Encrypt SSL certificate the moment you connect your domain. You just click "Force HTTPS" once. See `DEPLOYMENT_GUIDE.md` Part 3.3.

**If you skip it:** Anyone on the same wifi as a prospect can read what they're submitting on your booking form. Also, Chrome shows a scary "Not Secure" warning that kills conversions.

**Check it works:** Padlock icon in the browser address bar. Green padlock = good.

---

### Layer 2 — Restricted API key (defends against: API abuse, data leaks)

**What it is:** The dashboard reads Google Sheets data via an API key that lives in browser localStorage. Anyone opening the browser dev tools can see the API key. That's OK — because the key is restricted.

**How it's set up:**
- Only works from your dashboard's URL (HTTP referrer restriction)
- Only works against the Google Sheets API (not Drive, not Gmail, not Calendar)
- One key per clinic — never reused

**If you skip the restrictions:** Someone finds the key, uses it to read (or delete) any Google Sheet on the internet that your project has access to. Then Google emails you saying your key got abused and turns it off — taking your dashboard down.

**Check it works:** Google Cloud Console → your project → APIs & Services → Credentials → the key should show:
- Application restrictions: **HTTP referrers** with your dashboard domain
- API restrictions: **Google Sheets API only**

---

### Layer 3 — Sheet sharing permissions (defends against: catastrophic data leak)

**What it is:** The clinic's Google Sheet is only shared with 3–4 specific email addresses. NEVER "Anyone with the link."

**How it's set up:** In the Sheet → Share button → General access = **Restricted**. Add:
- Clinic owner (Editor)
- The Google account n8n uses for OAuth (Editor — added automatically when n8n connects)
- Your `bibek@medspagrowthengine.com` (Viewer — as backup)

**If you skip it:** A clinic owner accidentally forwards the Sheet link in an email. Recipient forwards it. Within a week, hundreds of people have client names, phone numbers, and appointment history. This is the WORST possible failure — it's the one that gets you sued and ends the business.

**Check it works:** Open the Sheet as an anonymous user (log out of Google, open the Sheet URL) — you should see a "Request access" screen, not the data.

---

### Layer 4 — Webhook secret (defends against: automation abuse)

**What it is:** Each n8n webhook checks for a specific `X-Webhook-Secret` header. Requests without it get rejected. The secret is a random 32-character string, unique per clinic.

**How it's set up:** Generated during clinic onboarding. Stored in:
- The Code node inside each webhook-triggered n8n workflow (workflows 1, 3, 6, 8)
- The dashboard's Settings → System → Webhook Secret field

**If you skip it:** Someone (a bot scanner, a competitor, a bored teenager) finds one of your webhook URLs by scanning n8n cloud subdomains. They start POSTing garbage — fake leads, fake status changes, thousands of them per hour. Your clinic's Sheet fills with junk data. Their emails start bouncing because Gmail rate-limits your sends.

**Check it works:** Try POSTing to a webhook URL without the header:
```bash
curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook/msg-lead-intake -d '{"test":1}'
```
Should return 401 or 403. If it returns 200, your secret check is broken.

---

### Layer 5 — Dashboard passcode + hosting-level protection (defends against: unauthorized access)

**What it is:** Two locks on the dashboard.

**Lock 1 (built-in):** The first time anyone opens `dashboard/index.html`, they must set a passcode. It's hashed with SHA-256 and stored in their browser's localStorage. Session expires after 8 hours.

**Lock 2 (hosting-level, optional but recommended):** Netlify Password Protection (paid, $19/mo) OR Cloudflare Access (free) puts an HTTP auth layer in front of the dashboard URL itself.

**If you skip lock 1:** Anyone with the dashboard URL gets in. There is no lock 1 to skip — it's built into the dashboard code. You'd have to actively modify the code to disable it.

**If you skip lock 2:** Someone who steals a clinic owner's laptop (unlocked) gets one lock instead of two. Lock 1 still protects against remote access — they'd need physical access AND to guess/reset the passcode.

**Check it works:** Open the dashboard URL in a new incognito window. You should see the passcode entry screen, not the dashboard.

---

### Layer 6 — SPF + DKIM + DMARC (defends against: domain spoofing, spam folders)

**What it is:** Three DNS records that prove emails from `bibek@medspagrowthengine.com` are really from you.

- **SPF** says which servers are allowed to send as your domain (Google's, in your case)
- **DKIM** cryptographically signs every outbound email; recipients verify the signature
- **DMARC** tells recipients what to do if SPF or DKIM fails

**How it's set up:** See `DEPLOYMENT_GUIDE.md` Part 5.

**If you skip it:**
- Cold outreach goes straight to spam. Your open rate drops from ~30% to ~3%.
- Anyone can spoof `bibek@medspagrowthengine.com` and send phishing that looks like it's from you. Your domain reputation dies.

**Check it works:** https://mxtoolbox.com/emailhealth — enter your domain. All three should show green checkmarks.

---

### Layer 7 — Account security (defends against: account takeover)

**What it is:** Strong passwords + 2-factor authentication on every account that matters.

**Which accounts matter:**
- Google Workspace (bibek@medspagrowthengine.com) — 2FA MUST be on
- Netlify — 2FA MUST be on
- Namecheap — 2FA MUST be on
- n8n cloud — 2FA MUST be on
- GitHub (if using) — 2FA MUST be on
- Google Cloud Console — 2FA MUST be on

**How to set up 2FA:** Every one of these services has "Security → Enable 2-factor authentication" in their settings. Use Google Authenticator or Authy app (not SMS — SMS 2FA can be phone-swapped by attackers).

**If you skip it:** Password gets phished or leaked in a data breach (happens to everyone eventually — check https://haveibeenpwned.com). Attacker logs in, changes your DNS to their servers, redirects your emails, and you spend a week fighting to reclaim the domain while your business is offline.

**Use a password manager:** Bitwarden is free and open-source. Every account gets a unique 20-character random password. Master password is the only one you memorize.

---

### Layer 8 — What NOT to collect (defends against: HIPAA, legal exposure)

**What it is:** MGE explicitly does NOT touch:
- Medical records
- Prescriptions
- Clinical notes
- Photos of treatment areas
- Government IDs
- Payment card numbers
- Insurance information

The Sheet columns are: Client Name, Email, Phone, Service Interest, Appointment Date, Status, Revenue. That's it. Nothing else goes in.

**If you accidentally collect medical info:**
- You are now HIPAA-covered in the US
- You need a Business Associate Agreement with every client
- Google Workspace needs its HIPAA-eligible tier
- You need audit logs, encryption at rest guarantees, breach notification procedures
- One violation = $50k–$1.5M fine
- **You do not want any of this.**

**How to enforce:** Your legal/terms document explicitly forbids clinics from putting PHI in the Sheet. Your onboarding script tells the clinic "if this info touches your booking system or EHR, we do not sync it here." When you see a Sheet column labeled "Diagnosis" or "Prescription", you delete it immediately.

---

## The 60-second security audit (do this monthly)

Once a month, run through this in ~60 seconds:

1. **All account passwords rotated in last year?** If any are older, change them.
2. **2FA enabled on all 6 critical accounts?** Log into each, confirm.
3. **Any suspicious activity in Google Workspace admin log?** admin.google.com → Reports → Audit
4. **Any suspicious activity in Netlify?** app.netlify.com → Team → Audit log
5. **API key restrictions still in place?** Google Cloud Console → Credentials → each key
6. **Any Sheet accidentally shared as "Anyone with link"?** Drive → filter by "shared with anyone with the link"
7. **DMARC reports coming in weekly?** Check `bibek@medspagrowthengine.com` inbox for XML attachments from mailer-daemon addresses. No reports = DMARC broken.
8. **Uptime monitor pinged you with any downtime?** UptimeRobot dashboard.
9. **Any n8n workflow errors in the last week?** n8n → Executions view.
10. **Any client's Google Cloud project showing "billing warning"?** Console → each project.

That's the audit. If all 10 pass, you're fine. If any fail, fix it that day.

---

## If something goes wrong — the incident playbook

**"I got locked out of my Google Workspace"**
→ Google account recovery: https://accounts.google.com/signin/recovery. If that fails, you have a backup email set on the account, right? Right?? (Set it now: admin.google.com → your user → Security → Recovery email.)

**"I think my dashboard passcode got stolen"**
→ On the affected browser: dev tools → Application → Local Storage → delete `mge_admin_hash`. Next dashboard visit triggers a new first-run setup.

**"An API key got flagged by Google"**
→ Google Cloud Console → Credentials → delete the flagged key. Create a new one with the same restrictions. Update the dashboard's Settings with the new key. Sheet reads resume within seconds.

**"A webhook secret leaked"**
→ Rotate immediately. Generate a new random string. Update it in:
   - All 4 webhook-triggered n8n workflows (in the Code node's secret check)
   - The dashboard's Settings → System → Webhook Secret
Do both sides. If you rotate on only one, kanban drag-drop silently stops working.

**"A client's Sheet got accidentally made public"**
→ Immediately: Share button → General access → back to Restricted. Then check the Sheet's version history for any suspicious edits during the window it was public. Notify the clinic owner regardless — better to over-communicate.

**"Someone reported spam from my domain"**
→ Check https://mxtoolbox.com/blacklists — see if you're on any DNSBLs. If yes, follow the delisting process for each. Investigate whether SPF/DKIM/DMARC broke, or whether your account got compromised. Rotate Workspace password + 2FA immediately.

**"A prospect asks 'is this HIPAA compliant?'"**
→ Answer: "MGE is not a HIPAA-covered service. We handle contact information and appointment scheduling — not medical records. Your booking system and EHR remain the source of truth for patient data. Nothing clinical lives in our system." That's it. Don't over-explain.

---

## What to tell a paranoid clinic owner (verbatim)

"Your client data lives in your own Google Sheet in your own Google account — not on my servers. If you cancel our service tomorrow, you keep everything. The automations run in your own n8n cloud instance under your billing. The dashboard is a web page that reads your Sheet through a Google API key that is locked to your domain and can only read spreadsheets — nothing else. All email sends are cryptographically signed so nobody can impersonate you. Every login uses 2-factor authentication. And there's no medical data in the system at any point — the clinic's EHR handles all of that."

That paragraph is your data-security elevator pitch. Rehearse it.

---

## Bottom line

The MGE security model isn't fancy. It's **many small locks, each protecting one thing.** Skip any lock and you're one accident away from a real problem. Follow all of them and you're safer than 95% of small agencies — because most agencies keep client data on their own servers with one shared password.

Read `DEPLOYMENT_GUIDE.md` for the how-to on setting these up. This file is the "why it matters" companion.

---

*Related: `ARCHITECTURE.md` (system diagram + secret storage map), `LAUNCH_CHECKLIST.md` (task-list version), `legal/privacy.html` and `legal/terms.html` (what clients/prospects see).*
