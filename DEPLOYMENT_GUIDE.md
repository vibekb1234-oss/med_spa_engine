# Deployment Guide — MedSpa Growth Engine

**Written for someone who has never deployed a website. No jargon assumed.**

By the end of this guide, `https://medspagrowthengine.com` will be a live site anyone in the world can visit, your email will send from `bibek@medspagrowthengine.com`, and the security layers will be in place. Total time: **one focused weekend** (about 4–6 hours of active work, plus 14 days of email warmup running in the background).

---

## Mental model — what you're actually building

Before you click anything, understand the pieces:

```
                 ┌─────────────────────────┐
YOU BUY A →      │  DOMAIN                 │  → medspagrowthengine.com
DOMAIN NAME      │  (Namecheap)            │     (an address that points to a server)
                 └───────────┬─────────────┘
                             │ DNS records tell browsers where to go
                             ▼
                 ┌─────────────────────────┐
YOU RENT →       │  HOSTING                │  → Netlify serves your HTML files
A SERVER         │  (Netlify — free tier)  │     to anyone who visits the domain
                 └───────────┬─────────────┘
                             │
                             ▼
       ┌─────────────────────┴──────────────────────┐
       │                                            │
   ┌───▼────┐                                  ┌────▼───┐
   │ PUBLIC │ (landing, booking, legal)        │ HIDDEN │ (dashboard, workflows, ops docs)
   │ FILES  │  → these show to prospects       │ FILES  │  → these are excluded from deploy
   └────────┘                                  └────────┘

Separately:
                 ┌─────────────────────────┐
YOU CREATE →     │  PRO EMAIL              │  → bibek@medspagrowthengine.com
AN EMAIL SEAT    │  (Google Workspace)     │     (sends and receives on the domain)
                 └─────────────────────────┘
                 ┌─────────────────────────┐
YOU CONFIGURE →  │  EMAIL SECURITY         │  → SPF + DKIM + DMARC
DNS RECORDS      │  (added to your domain) │     (proves your emails aren't spam)
                 └─────────────────────────┘
```

**About the "database":** you don't need to set up a database. Each clinic's data lives in their own Google Sheet. Google Sheets IS the database. You'll only touch this when you have a paying client (covered in `setup/Setup_Guide.md`, not here).

---

## Part 1 — Buy the domain (15 minutes, ~$12/year)

**What we're doing:** picking the address people will type to find you.

### Step 1.1 — Decide on the name

Recommended: `medspagrowthengine.com`. Check availability in step 1.2. If it's taken, alternatives (in order of preference):

- `medspagrowth.com`
- `medspagrowthos.com`
- `medspagrowthengine.co`
- `medspagrowth.io`

Do NOT buy `.xyz`, `.club`, `.online` — they trigger spam filters. Stick to `.com` or `.co`.

### Step 1.2 — Buy it on Namecheap

1. Go to https://www.namecheap.com
2. Search for `medspagrowthengine.com` in the search bar
3. If available, click **Add to Cart**
4. In cart, **UNCHECK** these upsells:
   - Domain Privacy — ✅ KEEP (it's free at Namecheap and hides your home address from public WHOIS)
   - PremiumDNS — ❌ UNCHECK (you'll use Netlify DNS instead, free)
   - SSL certificates — ❌ UNCHECK (Netlify gives you SSL free)
   - Email hosting — ❌ UNCHECK (you'll use Google Workspace)
   - VPN — ❌ UNCHECK
5. Register for 1 year first (~$12). Renew annually. Don't lock in 10 years — if the business pivots, you'll regret it.
6. Create the Namecheap account, pay, confirm.

**You now own a domain.** It doesn't do anything yet — it's like owning a phone number that isn't connected to a phone. Next steps connect it.

---

## Part 2 — Set up hosting on Netlify (30 minutes, free)

**What we're doing:** putting your HTML files on a server that anyone in the world can reach.

### Step 2.1 — Create a Netlify account

1. Go to https://app.netlify.com/signup
2. Sign up with your `vibekb.1234@gmail.com` (you can add the pro email later)
3. Skip the team/plan questions — free tier is fine

### Step 2.2 — Deploy the site

You have two options. Pick ONE:

**Option A — Drag and drop (fastest, 2 minutes)**

1. From Netlify dashboard, click **Add new site** → **Deploy manually**
2. Open File Explorer, navigate to `C:\Users\user\OneDrive\Desktop\MedSpa Growth Engine`
3. Select ALL the folders and files EXCEPT: `Skills/`, `operations/`, `outputs/`, `outreach/`, `design/`, `dashboard/legacy/`, and any `.md` files at the root except what's in the `landing/`, `booking/`, `onboarding/`, `legal/` folders
4. Drag them into the Netlify deploy zone
5. Wait ~30 seconds. Netlify gives you a random URL like `https://silly-name-123abc.netlify.app`
6. Visit that URL. You should see your landing page. **If yes, congrats — you're technically live.**

**Option B — GitHub sync (recommended long-term, 15 minutes)**

Only do this if you want changes to auto-deploy when you edit files. Otherwise skip to Part 3.

1. Create a free GitHub account at https://github.com/signup if you don't have one
2. Install GitHub Desktop from https://desktop.github.com (much easier than the CLI)
3. Open GitHub Desktop → File → New Repository → point at `C:\Users\user\OneDrive\Desktop\MedSpa Growth Engine`
4. Add a `.gitignore` file (see Part 2.3 below), commit, publish to GitHub as **private**
5. Back in Netlify: **Add new site** → **Import from Git** → GitHub → pick the repo
6. Netlify auto-detects your `netlify.toml` config. Click **Deploy**.

### Step 2.3 — If using GitHub, add .gitignore

Create a file called `.gitignore` in the project root (I already wrote `.vercelignore` and `.cfignore`, but Git needs its own):

```
# Operator-only files that should never leave your machine
Skills/
operations/
outputs/
outreach/
design/
dashboard/legacy/
setup/
workflows/

# Docs that shouldn't be public
LAUNCH_CHECKLIST.md
LAUNCH_READINESS_REPORT.md
DEPLOYMENT_GUIDE.md
SECURITY_GUIDE.md
ARCHITECTURE.md
MANAGED_OS_PACKAGE.md
GTM_LAUNCH_GUARDRAILS.md
README.md
**/README.md

# Local system files
.DS_Store
Thumbs.db
*.swp
```

### Step 2.4 — Confirm the netlify.toml is doing its job

The `netlify.toml` file I already wrote in your project root does two important things automatically:
- Redirects the root `/` to `/landing/index.html` (so visitors land on your landing page, not a 404)
- Blocks 404 on `/operations/*`, `/setup/*`, `/dashboard/legacy/*`, etc. — even if those files somehow got uploaded, no one can reach them by URL

Test this on your temporary Netlify URL:
- Visit `https://your-temp-url.netlify.app/` → landing page ✅
- Visit `https://your-temp-url.netlify.app/dashboard/legacy/` → 404 ✅
- Visit `https://your-temp-url.netlify.app/operations/AI_OPERATOR_OS.md` → 404 ✅

If any of those don't work correctly, comment out the `.gitignore` for `netlify.toml` and re-deploy.

---

## Part 3 — Connect your domain to Netlify (20 minutes)

**What we're doing:** telling the internet that `medspagrowthengine.com` should show your Netlify site.

### Step 3.1 — Point Netlify at your domain

1. In Netlify → Domain management → **Add a domain**
2. Type `medspagrowthengine.com` → Verify → Add
3. Netlify says "Set up Netlify DNS" — click **Yes, add domain**
4. Netlify shows you **4 nameservers** like:
   ```
   dns1.p03.nsone.net
   dns2.p03.nsone.net
   dns3.p03.nsone.net
   dns4.p03.nsone.net
   ```
   **Keep this tab open — you'll need these in step 3.2.**

### Step 3.2 — Point your domain at Netlify's nameservers

1. Open Namecheap in a new tab → Dashboard → click your domain → **Manage**
2. Find the section called **NAMESERVERS**
3. Change from "Namecheap BasicDNS" to **Custom DNS**
4. Paste in the 4 nameservers from Netlify (one per line)
5. Click the green ✓ to save
6. Wait 5–30 minutes for the change to propagate (sometimes takes up to 24 hours worldwide, but usually much faster)

### Step 3.3 — Force HTTPS (SSL certificate)

1. Back in Netlify → Domain management
2. Once your domain shows as "Netlify DNS" (green ✓), scroll down to **HTTPS**
3. Click **Verify DNS configuration** — should return green
4. Click **Provision certificate** — Netlify auto-installs a Let's Encrypt SSL cert (free, valid for 90 days, auto-renews forever)
5. Once green, toggle ON **Force HTTPS** — this redirects `http://` to `https://` automatically

### Step 3.4 — Verify

Wait 15 minutes. Then open a private/incognito browser window and visit:
- `https://medspagrowthengine.com` → should show your landing page
- `http://medspagrowthengine.com` → should redirect to `https://`
- `https://medspagrowthengine.com/booking` → should redirect to `/booking/index.html`

**If any of these fail, wait another hour — DNS propagation can be slow. If still failing after 24 hours, check that the Namecheap nameservers match exactly.**

---

## Part 4 — Get pro email (20 minutes, $7/month)

**What we're doing:** setting up `bibek@medspagrowthengine.com` so prospects don't see a personal Gmail.

### Step 4.1 — Sign up for Google Workspace

1. Go to https://workspace.google.com
2. Click **Start Free Trial** → Business Starter plan ($7/mo, 14-day free trial)
3. Sign up with `medspagrowthengine.com` as your domain
4. When it asks "Do you own this domain?" → yes
5. Create your first user: `bibek@medspagrowthengine.com`
6. Choose a strong password. Save it somewhere safe (a password manager like Bitwarden — free).

### Step 4.2 — Verify domain ownership

Google will give you a TXT record to add to your DNS. Since your DNS is on Netlify:

1. Copy the TXT record value Google shows you (looks like `google-site-verification=abc123...`)
2. Netlify → Domain management → click your domain → **DNS records** → **Add new record**
3. Type: `TXT`
4. Name: `@` (means the root domain)
5. Value: paste the Google verification string
6. TTL: leave default
7. Save
8. Back in Google Workspace, click **Verify**

Once verified, Google walks you through adding MX records (also in Netlify DNS). Follow their prompts — they give you the exact records to paste.

### Step 4.3 — Send a test email

1. Open https://mail.google.com and sign in as `bibek@medspagrowthengine.com`
2. Send a test email to your `vibekb.1234@gmail.com`
3. Reply back to make sure both directions work

You now have pro email. But it's not secure against spoofing yet — that's Part 5.

---

## Part 5 — Email security (SPF, DKIM, DMARC) — 30 minutes

**What we're doing:** proving to Gmail/Outlook/Yahoo that emails from `bibek@medspagrowthengine.com` are really from you. Without this, cold outreach goes straight to spam.

**In plain English:**
- **SPF** = "These are the servers allowed to send email as my domain."
- **DKIM** = "Here's a cryptographic signature — verify it against my public key."
- **DMARC** = "If a message fails SPF or DKIM, do THIS with it (reject / quarantine / just report)."

You need ALL THREE for cold email to land in inboxes.

### Step 5.1 — SPF record

1. Netlify → DNS records → Add new record
2. Type: `TXT`
3. Name: `@`
4. Value: `v=spf1 include:_spf.google.com ~all`
5. Save

That single line tells the world: "Google's servers are the only ones allowed to send email from medspagrowthengine.com."

### Step 5.2 — DKIM record

1. Go to https://admin.google.com → Apps → Google Workspace → Gmail → **Authenticate email**
2. Under "Selected domain" pick `medspagrowthengine.com`
3. Click **Generate new record** (2048-bit key is fine)
4. Google shows you a TXT record. It looks like:
   ```
   Name: google._domainkey
   Value: v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA... (very long)
   ```
5. Copy both values
6. Netlify → DNS records → Add new record
7. Type: `TXT`
8. Name: `google._domainkey`
9. Value: paste the whole thing starting with `v=DKIM1;`
10. Save
11. Wait 5 minutes, then back in Google admin → click **Start authentication**

### Step 5.3 — DMARC record

1. Netlify → DNS records → Add new record
2. Type: `TXT`
3. Name: `_dmarc`
4. Value: `v=DMARC1; p=none; rua=mailto:bibek@medspagrowthengine.com; pct=100; adkim=r; aspf=r`
5. Save

Explanation: `p=none` means "just monitor for now, don't reject anything." After 30 days of monitoring reports (they come to your inbox as XML — ignore them for now), you can tighten to `p=quarantine` and eventually `p=reject`.

### Step 5.4 — Verify all three are live

Go to https://mxtoolbox.com/emailhealth (free tool).

Enter `medspagrowthengine.com` and click **Check**. You should see:
- ✅ SPF record found
- ✅ DKIM record found (search for `google._domainkey`)
- ✅ DMARC record found

If any fail, wait 30 minutes for propagation and try again.

### Step 5.5 — Warm the sender (14 days, passive)

Even with perfect DKIM/SPF/DMARC, a brand-new domain sending 50 cold emails on day 1 will go to spam. You have to "warm" it:

- Day 1: Send 3 emails to friends/family from `bibek@medspagrowthengine.com`, ask them to reply
- Day 2: Send 5 emails
- Day 3: 10
- Day 4: 15
- Day 5–7: 20/day, all warm (people who know you or replied before)
- Day 8–14: Start replying to conversations, join a Google Group or two, generally look like a real person's email
- Day 15+: Now you can send cold outreach

There are paid warmup tools (Instantly.ai, Warmup Inbox, Mailwarm) that do this automatically for $30-50/month. Not required for launch — a solo operator can warm manually.

---

## Part 6 — Google Sheets & API key security (only when you have your first client)

**Skip this section until you have a paying clinic.** But when you do, here's the secure way to set up their Google Sheet + API key.

### Step 6.1 — Create the clinic's Sheet

Follow `setup/Setup_Guide.md`. It walks you through pasting `MedSpa_Engine.gs` into Apps Script and running the setup function. This creates the Clients, Appointments, Activity Log tabs.

**Sharing settings — CRITICAL:**
1. Click **Share** on the Sheet
2. General access: **Restricted** (NOT "Anyone with the link")
3. Add ONLY these people:
   - The clinic owner (Editor)
   - The Google account n8n uses (Editor, added automatically when they OAuth)
   - Your own dropbox address as backup (Viewer)

**Never share as "Anyone with the link".** That would make all client data public if the link leaked.

### Step 6.2 — Create the restricted API key

The dashboard reads the Sheet via a Google Sheets API key (not OAuth — OAuth would require every clinic owner to log in through Google every session, which is bad UX).

To keep this API key from being abused:

1. Go to https://console.cloud.google.com
2. Create a new project called `medspa-<clinic-name>` (one project PER clinic — don't reuse)
3. Enable the **Google Sheets API** for this project
4. Create credentials → API key
5. Click **Restrict key**:
   - **Application restrictions:** HTTP referrers (web sites)
   - Add: `https://dashboard.clinic-name.com/*` (the dashboard's actual URL)
   - **API restrictions:** Restrict to Google Sheets API only
6. Save

Now even if the API key leaks (someone reads the browser dev tools on the dashboard), it only works from your dashboard URL and can only touch Sheets — not Drive, not Gmail, not anything else.

### Step 6.3 — Generate the webhook secret

The dashboard sends actions to n8n (like "mark this appointment complete") via webhooks. Anyone who guessed the webhook URL could spam it. The `X-Webhook-Secret` header prevents that.

1. Generate a random 32-character string. On Windows PowerShell:
   ```powershell
   [System.Web.Security.Membership]::GeneratePassword(32, 0)
   ```
   Or use https://randomkeygen.com (pick "CodeIgniter Encryption Keys")
2. In each of your 4 webhook-triggered n8n workflows (1, 3, 6, 8), the Code node has a line that checks `$json.headers['x-webhook-secret'] === 'YOUR_WEBHOOK_SECRET'`. Replace `YOUR_WEBHOOK_SECRET` with your random string.
3. In the dashboard's Settings, paste the same string into the "Webhook secret" field.

**One webhook secret per clinic. Never reuse across clinics.**

---

## Part 7 — Dashboard access protection

**The dashboard is not indexed by Google** (there's no link to it from the public site), but security through obscurity isn't security. Two layers:

### Layer 1 — Passcode login (already built)

The first time a clinic owner opens `dashboard/index.html`, it forces them to set a passcode. That passcode is hashed with SHA-256 and stored in their browser's localStorage. Session times out after 8 hours of inactivity.

### Layer 2 — Hosting-level protection (recommended)

If you deploy the dashboard on Netlify, add HTTP Basic Auth on top of the passcode login:

1. Netlify → Site settings → Access & Security → **Password protection**
2. Site password: pick something different from the dashboard passcode
3. Save

Now anyone visiting the dashboard URL first has to pass Netlify's HTTP auth, THEN the dashboard's own login. Two locks, two keys.

Netlify's password protection is a **paid feature** (Pro plan, $19/month). If you don't want to pay, alternatives:
- Deploy the dashboard on a different subdomain (like `app.medspagrowthengine.com`) and just don't link to it publicly
- Use Cloudflare Access (free tier for up to 50 users) — a bit more setup, more secure

---

## Part 8 — Analytics + uptime monitoring (15 minutes, free)

**What we're doing:** knowing when the site is down, and seeing who visits.

### Step 8.1 — Uptime monitoring

1. Sign up at https://uptimerobot.com (free — 50 monitors)
2. Add new monitor:
   - Type: HTTPS
   - URL: `https://medspagrowthengine.com`
   - Interval: 5 minutes
   - Alert contact: your email
3. Repeat for `https://medspagrowthengine.com/booking/`

You'll get an email within 5 minutes of any downtime.

### Step 8.2 — Privacy-friendly analytics

Skip Google Analytics — it drops cookies, requires a cookie banner, and slows the page. Use Plausible instead:

1. Sign up at https://plausible.io — $9/month, 30-day free trial
2. Add your domain
3. Copy the one-line script tag they give you
4. Paste it just before `</head>` in `landing/index.html` and `booking/index.html`
5. Re-deploy

Plausible shows you visitors, page views, sources, conversions. Zero cookies. No banner needed.

---

## Part 9 — Launch verification (do this before sending ANY outreach)

The launch is only real when all of these pass:

- [ ] `https://medspagrowthengine.com` shows the landing page in incognito
- [ ] `https://medspagrowthengine.com/booking/` shows the booking page
- [ ] `https://medspagrowthengine.com/legal/privacy.html` shows the privacy policy
- [ ] `https://medspagrowthengine.com/dashboard/legacy/` returns 404
- [ ] `https://medspagrowthengine.com/operations/AI_OPERATOR_OS.md` returns 404
- [ ] SSL padlock icon shows in the browser (not "Not Secure")
- [ ] Test-submit the booking form — your mail client opens with a prefilled draft
- [ ] Send a test email from `bibek@medspagrowthengine.com` to a Gmail address. Verify:
  - It arrives in inbox, not spam
  - Click the 3-dot menu → Show original → verify SPF: PASS, DKIM: PASS, DMARC: PASS
- [ ] UptimeRobot shows the site as UP
- [ ] Plausible is recording your test visits

**If all 10 pass, you're live.** Only after all 10 pass should you send your first cold email batch.

---

## What each of these costs, monthly

| Item | Cost | Required? |
|---|---|---|
| Domain (Namecheap) | ~$1/mo (paid annually) | Yes |
| Netlify hosting | Free | Yes |
| Google Workspace | $7/mo | Yes (for pro email) |
| Netlify password protection | $19/mo | No — Cloudflare Access is a free alternative |
| Plausible analytics | $9/mo | No — skip until you have real traffic |
| UptimeRobot | Free | Yes |
| n8n cloud (per clinic) | $20/mo | Only when you have a paying client |
| Google Cloud (API key) | Free (under quota) | Only when you have a paying client |

**Your monthly cost before first client: ~$8** ($7 Workspace + $1 domain). Add $9 for Plausible if you want analytics.
**Monthly cost per active clinic: ~$20** (n8n) — you pass this to the client as part of the retainer.

---

## Common failure modes and fixes

| Symptom | Cause | Fix |
|---|---|---|
| Domain doesn't resolve after 24h | Nameservers not saved correctly at Namecheap | Re-check nameservers exactly match Netlify's |
| "Your connection is not secure" | SSL cert didn't provision | Netlify → Domain management → Provision certificate |
| Emails go to spam | SPF or DKIM broken | Run mxtoolbox check; wait 24h after DNS changes |
| DMARC failing | SPF and DKIM domains don't match `From:` header | Ensure you send from `@medspagrowthengine.com`, not an alias |
| Dashboard 404 on Netlify | `netlify.toml` blocked it | Only reach the dashboard via the dedicated URL, not the site's public routes |
| Landing page shows Netlify 404 | Deploy didn't include `landing/index.html` | Re-check Netlify build log; verify root `/` redirect in `netlify.toml` |
| Booking form doesn't open Gmail | Browser has no default mailto handler | The 5% edge case — swap for Formspree endpoint |

---

## The order of operations, one more time

1. **Weekend 1 morning:** Buy domain (Part 1), set up Netlify hosting (Part 2), connect them (Part 3). ~1 hour.
2. **Weekend 1 afternoon:** Set up Google Workspace (Part 4), email security (Part 5). ~1 hour.
3. **Weekend 1 evening:** Warmup emails begin (Part 5.5). Uptime + analytics (Part 8). ~30 min.
4. **Weekdays 1–14:** Send 3–20 warmup emails per day. Do nothing else on deployment.
5. **Weekend 2:** Cold outreach begins to your 134 ICP leads. `AI_OPERATOR_OS.md` is your playbook.
6. **When first client closes:** Parts 6 + 7 (Sheet, API key, webhook secret, dashboard security). Follow `setup/Setup_Guide.md`.

That's it. You'll never touch this deployment infrastructure again unless you switch hosts or add a second domain.

---

## If you get stuck

Every step has a "how do I do this specific thing" question with 10,000 answers on the web. Some search hints:

- "How to change nameservers on Namecheap" → YouTube has a 2-min video
- "How to add SPF DKIM DMARC Google Workspace" → Google Workspace admin help
- "How to set up custom domain on Netlify" → Netlify docs, extremely well written
- "Netlify DNS not propagating" → wait 24h; if still broken, contact Netlify support (they respond within a day even on free tier)

You're not going to break anything. If you make a mistake at Netlify or in DNS, revert the change and try again. The domain and hosting can be reconfigured infinitely without cost.

**One rule: never share your Google Workspace admin password, never post your API keys or webhook secrets in Slack/Discord/screenshots. Everything else is recoverable.**

---

*Read this alongside `SECURITY_GUIDE.md` (what protects what and why) and `LAUNCH_CHECKLIST.md` (the terse task list).*
