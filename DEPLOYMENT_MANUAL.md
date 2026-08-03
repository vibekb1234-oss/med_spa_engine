# Deployment Manual — MedSpa Growth Engine

**Read this front to back once. Then follow it click by click over one weekend.**

By the end you'll have:
- `medspagrowthengine.com` live and accessible worldwide
- `bibek@medspagrowthengine.com` sending and receiving pro email
- SPF / DKIM / DMARC email security passing
- Your own demo n8n instance running the 8 workflows against a test Sheet
- Calendly wired into the booking page
- Uptime monitoring pinging your inbox if anything goes down
- The ability to demo the product live to any prospect

Total active work: **6–8 hours split across two days.** Total elapsed time (including DNS propagation + email warmup): **14–16 days.**

If you follow this manual literally, you will not break anything. Every step is reversible.

---

## Table of contents

- **Chapter 0** — Pre-flight (what to gather before you touch anything)
- **Chapter 1** — Buy the domain
- **Chapter 2** — Prepare the deploy folder
- **Chapter 3** — Deploy to Netlify (drag-drop OR GitHub)
- **Chapter 4** — Connect your domain (DNS + SSL)
- **Chapter 5** — Pro email (Google Workspace)
- **Chapter 6** — Email deliverability (SPF, DKIM, DMARC)
- **Chapter 7** — Your demo n8n instance
- **Chapter 8** — Calendly and the booking page
- **Chapter 9** — Monitoring and analytics
- **Chapter 10** — Launch verification (25-point check)
- **Chapter 11** — Troubleshooting encyclopedia
- **Chapter 12** — Day-of-launch and after
- **Appendix A** — Every URL you'll need, in one place
- **Appendix B** — Costs summary
- **Appendix C** — Password/secret storage plan

---

# Chapter 0 — Pre-flight

**Don't skip this. Every hour spent here saves three hours of "wait, what was that password?" later.**

## 0.1 Physical setup

- A quiet 3-hour block. This is not TV work.
- A notebook or Notion doc titled **MGE Deploy Log** — you'll write down URLs, IDs, and secrets as you go
- Coffee/water/snacks — you should not have to get up

## 0.2 Install these on your machine

Before you start clicking, install these:

1. **Bitwarden** (free password manager) — https://bitwarden.com/download
   - You will create 6+ new accounts today. Every one gets a unique 20-char random password from Bitwarden. Never reuse a password.
   - After install, sign up, create a master password (memorize this ONE), enable 2FA on the Bitwarden account itself
2. **Google Authenticator** or **Authy** on your phone — App Store / Play Store
   - This is what generates the 6-digit codes for 2FA. Every account we create will use it.
3. **Chrome** or **Firefox** — you probably have one; if you don't, get Chrome. Netlify's dashboard works best on Chromium.

**Do not skip Bitwarden.** If your Namecheap or Netlify account gets phished, you lose your domain and hosting. A password manager makes phishing basically impossible because Bitwarden won't autofill on the fake site.

## 0.3 Have these ready before you begin

- **Credit card** with at least $50 available (domain ~$12, Workspace ~$7/mo, n8n cloud ~$20/mo)
- **Personal email** to receive verification codes (`vibekb.1234@gmail.com`)
- **Phone number** for 2FA setup on services that require SMS backup
- **A photo of yourself** looking professional (headshot, clean background) — for the booking page avatar
- **The exact spelling** of the domain you want. Type it in the notebook so you don't fat-finger during purchase.

## 0.4 Accounts you will create today (in order)

Write these down in your MGE Deploy Log. As you create each, note the account email, the unique password you used (paste from Bitwarden), and whether 2FA is enabled.

| # | Service | Purpose | Cost |
|---|---|---|---|
| 1 | Namecheap | Domain registrar | ~$12/year |
| 2 | Netlify | Hosting for the public site | Free |
| 3 | Google Workspace | Pro email + Google Drive/Sheets tied to your domain | $7/mo |
| 4 | n8n cloud | Automation engine (your own demo instance) | $20/mo |
| 5 | Calendly (or Cal.com) | Demo booking | Free tier fine |
| 6 | UptimeRobot | Site downtime alerts | Free |
| 7 | Google Cloud Console | Google Sheets API key for your demo instance | Free (under quota) |
| 8 | Cloudflare (optional) | Dashboard password protection | Free tier |

## 0.5 The mental model, one more time

```
DOMAIN         →  address in the phone book
DNS            →  the phone book itself
NAMESERVERS    →  which phone book to look in
HOSTING        →  the phone that rings
SSL            →  the encrypted line so calls can't be eavesdropped
EMAIL          →  a different number tied to the same address
SPF/DKIM/DMARC →  caller-ID that proves you're really you
```

If a step feels weird, come back to this diagram. Everything you're about to do is a small change to one of these things.

## 0.6 Rules to obey without exception

1. **Never paste a password or API key into a chat, screenshot, or public doc.** Only into Bitwarden, DNS fields, or the tool that needs it.
2. **Never share a Google Workspace admin password.** Ever. Not with a virtual assistant, not with Codex, not with a screen-recording tool.
3. **Every account gets 2FA immediately after creation.** Not "later". Immediately.
4. **When in doubt, wait.** DNS propagation, SSL provisioning, email warmup — these all take time. Do not rebuild something that's "not working" until you've waited at least 30 minutes.
5. **Do not commit anything to a public GitHub repo.** If you use GitHub, it must be private (Chapter 3B walks you through this).

Ready? Begin Chapter 1.

---

# Chapter 1 — Buy the domain

**Time: 15 minutes. Cost: ~$12 for the year.**

## 1.1 Confirm the name is available

1. Open https://www.namecheap.com in a new browser tab
2. In the search bar at the top of the page, type: `medspagrowthengine.com`
3. Press Enter

You'll see one of two screens:

**Screen A — "medspagrowthengine.com is available"** with a green button to add to cart. Perfect. Go to 1.2.

**Screen B — "medspagrowthengine.com is taken"** with alternatives listed below.

If B, pick from these alternatives in order of preference (check each in the search bar):
- `medspagrowth.com`
- `medspagrowthos.com`
- `medspagrowthengine.co`
- `medspagrowth.io`
- `growthenginemedspa.com`

**Do NOT buy** `.xyz`, `.club`, `.online`, `.link`, `.info`, `.biz`. These are cheaper but they trigger spam filters and look unprofessional to clinic owners. Stick with `.com` or `.co`.

## 1.2 Add to cart

Click the green **Add to Cart** button.

A slide-out appears on the right. It says something like "You have 1 item in your cart — $10.98."

Click **View Cart** or **Checkout**.

## 1.3 The upsell page — this is where beginners lose money

Namecheap shows you a page with 6–8 add-ons pre-selected. Almost all of them are useless for you. Go through each carefully:

| Add-on | What Namecheap says | What you actually do |
|---|---|---|
| Domain Privacy (WhoisGuard) | "Hide personal info from public WHOIS" | ✅ **KEEP.** It's FREE and hides your home address. If you don't, your name/address/phone go into a public database that spammers scrape. |
| PremiumDNS | "Faster DNS, DDoS protection" | ❌ **REMOVE.** Netlify's DNS is free and just as good. |
| SSL Certificate | "Secure your site with HTTPS" | ❌ **REMOVE.** Netlify auto-provisions Let's Encrypt SSL for free. |
| Web Hosting | "$0.99 first month, then $X" | ❌ **REMOVE.** You're using Netlify. |
| Email Hosting | "Private email @yourdomain" | ❌ **REMOVE.** You're using Google Workspace. |
| VPN | "Secure your connection" | ❌ **REMOVE.** Not relevant. |
| Website Builder | "Build a site in minutes" | ❌ **REMOVE.** Your site is already built. |

**Auto-renew:** Toggle ON. If you forget to renew and the domain expires, someone else can buy it and hold it for ransom. Auto-renew is a $12/year insurance policy.

**Registration period:** Pick **1 year**. Don't do 5 or 10 — if the business pivots, you'll regret it. And Namecheap tries to hide "1 year" behind "5 years is a better deal!" — don't fall for it.

Your cart should now say something like **$10.98 total.** If it says more than $20, an upsell is still checked. Go back and untick.

## 1.4 Create your Namecheap account

1. Click **Confirm Order** at the bottom
2. On the account page, click **Create Account**
3. Fill in:
   - **Username** — something you'll remember (write in notebook)
   - **Password** — open Bitwarden, click "Generate password", pick 20 characters, save the entry as "Namecheap"
   - **First/last name** — real
   - **Email** — `vibekb.1234@gmail.com`
4. Complete the CAPTCHA
5. Click Create Account

## 1.5 Fill in WHOIS contact info

Namecheap needs your real contact info for legal reasons (this is required by ICANN, the organization that governs domains). Because you kept Domain Privacy on, this info is hidden from public view.

Fill in your real name, real address, real phone. Namecheap will not spam you and will not sell this info while privacy is on.

## 1.6 Pay

- Credit card, PayPal, or crypto — your choice
- Enter card details, click Continue
- Review the summary — should be ~$11 for 1 year with privacy
- Click **Pay Now**

## 1.7 Enable 2FA immediately

**Before you close this tab, do this:**

1. Top-right corner, click your username → **Profile** → **Security**
2. Under Two-Factor Authentication, click **Enable**
3. Choose **TOTP (recommended)** — this uses your Authenticator app
4. Namecheap shows you a QR code
5. Open Google Authenticator on your phone → tap + → Scan QR code
6. Type the 6-digit code Authenticator shows into the Namecheap prompt
7. Save the 8-character **backup codes** somewhere safe (Bitwarden secure note titled "Namecheap 2FA backup codes")

**Now you own the domain and 2FA protects the account.** Nothing else works yet — the domain doesn't point at any hosting. That's Chapter 3.

## 1.8 Verify your registration email

Within 15 minutes, Namecheap sends a "Verify your registration email" to `vibekb.1234@gmail.com`. Click the link inside.

If you don't verify within 15 days, ICANN may temporarily suspend your domain. Don't skip this step. If the email didn't arrive, check spam.

## 1.9 Log the details in your notebook

Write down:
- Domain: `medspagrowthengine.com`
- Registrar: Namecheap
- Registered on: [today's date]
- Renews: [today + 1 year]
- Account email: `vibekb.1234@gmail.com`
- 2FA enabled: yes
- Password stored in: Bitwarden ("Namecheap")
- Backup codes stored in: Bitwarden secure note

Domain: done. On to preparing the site files.

---

# Chapter 2 — Prepare the deploy folder

**Time: 20 minutes. This is where beginners accidentally publish sensitive files.**

Your project folder at `C:\Users\user\OneDrive\Desktop\MedSpa Growth Engine\` has 24+ folders. Not all of them belong online. Some contain lead lists, operator instructions, workflow JSONs with placeholder secrets, and internal docs. If you drag the whole folder to Netlify, someone can eventually find those files by URL.

There are two ways to handle this:

- **Method A: Manual selection** — pick only public folders. Simple but error-prone.
- **Method B: Copy a staging folder** — make a clean copy on your Desktop that contains only what's safe to publish, then upload that. Recommended.

## 2.1 Method B — create the staging folder (recommended)

### 2.1.1 Make the staging folder

1. Open File Explorer
2. Go to `C:\Users\user\OneDrive\Desktop\`
3. Right-click empty space → New → Folder
4. Name it: `MGE_DEPLOY_STAGING`

### 2.1.2 Copy ONLY these folders into it

Open `MedSpa Growth Engine` in another window. Copy (Ctrl+C, then Ctrl+V into `MGE_DEPLOY_STAGING`) each of these:

- `landing/` (the whole folder)
- `booking/` (the whole folder)
- `onboarding/` (the whole folder)
- `legal/` (the whole folder)
- `assets/` (the whole folder)
- `dashboard/index.html` (JUST THE FILE — do NOT copy the `legacy/` subfolder inside dashboard)

### 2.1.3 Copy these files too (root-level)

Copy these single files into the root of `MGE_DEPLOY_STAGING`:

- `netlify.toml` (this file makes Netlify redirect `/` to `/landing/index.html` and 404 the operator-only paths)
- `.vercelignore` (harmless if unused, useful if you switch hosts)
- `.cfignore` (same)

### 2.1.4 Do NOT copy these — ever

Never let any of these end up in your deploy folder:

- `Skills/` (third-party skill libraries, gigs of unrelated stuff)
- `operations/` (your business playbooks — AI operator instructions)
- `outputs/` (scraped lead lists, sensitive)
- `outreach/` (cold email scripts, offer tiers)
- `design/` (design system docs)
- `setup/` (client onboarding scripts + Apps Script code)
- `workflows/` (n8n JSON with placeholder secrets)
- `dashboard/legacy/` (old dashboard with hardcoded placeholder API keys)
- Any file ending in `.md` at the root (README, LAUNCH_CHECKLIST, ARCHITECTURE, DEPLOYMENT_MANUAL, etc.)

### 2.1.5 Verify the staging folder structure

Open `MGE_DEPLOY_STAGING`. It should look like this:

```
MGE_DEPLOY_STAGING/
├── landing/
│   ├── index.html
│   └── README.md   ← keep, netlify.toml blocks it from being served
├── booking/
│   └── index.html
├── onboarding/
│   └── index.html
├── legal/
│   ├── privacy.html
│   └── terms.html
├── assets/
│   ├── brand-tokens.css
│   ├── favicon.svg
│   └── og-image.svg
├── dashboard/
│   └── index.html    ← JUST this file, no subfolders
├── netlify.toml
├── .vercelignore
└── .cfignore
```

**If your staging folder has anything else — a `Skills/` folder, an `operations/` folder, a `LAUNCH_CHECKLIST.md`, ANY .md file at the root other than the ones listed — remove it before continuing.** These are operator-only files that must never leave your machine.

## 2.2 Method A — direct upload of specific folders (backup approach)

Same idea, but instead of copying to a staging folder, you'll multi-select in Netlify's drag zone. Less safe because it's easier to accidentally include a folder. Only use this if you're comfortable with Windows multi-select and confident you can hold Ctrl while clicking exactly the right items.

If you're new, use Method B.

## 2.3 Test one thing before you upload

Open `MGE_DEPLOY_STAGING/landing/index.html` in a browser (double-click it or right-click → Open with → Chrome). Confirm:

- Page loads
- Hero text says "Turn missed follow-up into repeat bookings, reviews, and referrals"
- Two big CTAs at the top: "See the system live" and "View packages"
- Colors are pink/dark theme
- Scroll all the way down — footer says "MedSpa Growth Engine — Built by Bibek Bhandari"

If any of that is wrong, the file didn't copy correctly. Redo 2.1.

If it looks right, you're ready to upload. On to Chapter 3.

---

# Chapter 3 — Deploy to Netlify

**Time: 30 minutes. Cost: free.**

Two paths. Pick one.

- **3A. Drag and drop** — fastest, no coding. Best for your very first deploy.
- **3B. GitHub sync** — recommended long-term. Every edit auto-deploys. Requires ~15 minutes of one-time setup.

Read both, pick 3A for launch, do 3B later once you're comfortable.

## 3A. Drag and drop

### 3A.1 Create Netlify account

1. Open https://app.netlify.com/signup
2. Click **Sign up with email** (or "Sign up with GitHub" if you already have GitHub)
3. Email: `vibekb.1234@gmail.com`
4. Password: Bitwarden → Generate → 20 characters → save as "Netlify"
5. Click Create account
6. Check `vibekb.1234@gmail.com` for a verification email → click the link
7. Netlify may ask you a few onboarding questions (team name, what you're building) — pick "Personal", "Marketing website", skip if you can

### 3A.2 Enable 2FA immediately

1. Top-right, click your avatar → **User settings**
2. Left sidebar → **Security**
3. Under Two-Factor Authentication → **Enable**
4. Google Authenticator → scan QR → enter 6-digit code
5. Save the recovery codes to Bitwarden as a secure note ("Netlify 2FA backup codes")

### 3A.3 Deploy the site

1. Top nav → **Sites** → **Add new site** → **Deploy manually**
2. You'll see a large dashed drop zone that says "Drag and drop your site folder here"
3. Open File Explorer in a separate window, navigate to `C:\Users\user\OneDrive\Desktop\MGE_DEPLOY_STAGING`
4. Select ALL contents of that folder (Ctrl+A inside the folder)
5. Drag the whole selection into the Netlify drop zone
6. Netlify uploads and processes — takes 15–90 seconds
7. When done, Netlify gives you a random URL like `https://silly-name-abc123.netlify.app`

**Click the URL.** Your landing page should load.

### 3A.4 Verify the netlify.toml is being read

In your temp URL, try these paths:
- `https://silly-name-abc123.netlify.app/` → should show landing page (netlify.toml redirects `/` to `/landing/index.html`)
- `https://silly-name-abc123.netlify.app/booking/` → booking page
- `https://silly-name-abc123.netlify.app/legal/privacy.html` → privacy policy
- `https://silly-name-abc123.netlify.app/operations/AI_OPERATOR_OS.md` → **404** (this is the confirmation the guard works — if it shows the file, you accidentally uploaded operations/)

If the operations 404 doesn't work and shows the actual file, delete the site (Netlify Site settings → Danger zone → Delete site), redo Chapter 2 more carefully, and re-upload.

### 3A.5 Rename the site

1. Netlify → Your site → **Site settings** → **Change site name**
2. Change from `silly-name-abc123` to `medspagrowthengine` (or `mge-prod`)
3. Save

Your URL is now `https://medspagrowthengine.netlify.app`. Still temporary — Chapter 4 hooks up your real domain.

## 3B. GitHub sync (do this after your first successful drag-drop launch)

### 3B.1 Create GitHub account

1. https://github.com/signup
2. Same routine: email, Bitwarden password, verify email

### 3B.2 Install GitHub Desktop

1. https://desktop.github.com — download the Windows installer
2. Install, launch
3. Sign in with your GitHub account

### 3B.3 Create the repo

1. GitHub Desktop → File → **New repository**
2. Name: `mge-deploy`
3. Local path: `C:\Users\user\OneDrive\Desktop\MGE_DEPLOY_STAGING`
4. **Initialize with README:** UNCHECK (you don't want one in a public-facing folder)
5. **Git ignore:** None
6. Create repository

### 3B.4 Add a `.gitignore` file

In GitHub Desktop, click "Show in Explorer" to open the folder. Create a new file called `.gitignore` (yes, starting with a dot) with this content:

```
# System files
.DS_Store
Thumbs.db
*.swp

# We don't want any accidentally-copied operator files in the repo
Skills/
operations/
outputs/
outreach/
design/
setup/
workflows/
dashboard/legacy/
LAUNCH_CHECKLIST.md
LAUNCH_READINESS_REPORT.md
DEPLOYMENT_MANUAL.md
DEPLOYMENT_GUIDE.md
SECURITY_GUIDE.md
ARCHITECTURE.md
MANAGED_OS_PACKAGE.md
GTM_LAUNCH_GUARDRAILS.md
README.md
```

Save.

### 3B.5 Push to GitHub as PRIVATE

1. Back in GitHub Desktop, you'll see the .gitignore listed as a change
2. Bottom-left, type a commit message: "Initial deploy"
3. Click "Commit to main"
4. Top-right, click **Publish repository**
5. **VERY IMPORTANT:** in the dialog, check ✅ **Keep this code private**. If you leave it public, all your files including the sensitive ones become world-readable.
6. Click Publish

### 3B.6 Connect Netlify to the repo

1. Netlify dashboard → **Add new site** → **Import from Git**
2. Choose **GitHub** → authorize Netlify to access your GitHub
3. Pick the `mge-deploy` repo
4. Branch: `main`
5. Build command: leave blank
6. Publish directory: leave blank (defaults to root)
7. Click Deploy site

Every push to GitHub main now auto-deploys within 60 seconds.

---

# Chapter 4 — Connect your domain

**Time: 20 minutes active + 5–60 minutes waiting for DNS propagation.**

Right now `medspagrowthengine.com` points nowhere. Your Netlify site is at `medspagrowthengine.netlify.app`. This chapter connects them.

## 4.1 Tell Netlify your domain exists

1. Netlify → your site → **Domain management** (or **Domains** in the left sidebar)
2. Click **Add a domain**
3. Type `medspagrowthengine.com`
4. Click **Verify**
5. Netlify says "You don't own this domain" — that's fine. Click **Add domain** anyway.
6. Netlify asks whether to set up **Netlify DNS**. Click **Yes, add domain**
7. Netlify displays 4 nameservers, like:

   ```
   dns1.p03.nsone.net
   dns2.p03.nsone.net
   dns3.p03.nsone.net
   dns4.p03.nsone.net
   ```

   **Copy all 4 into your notebook.** You'll paste them at Namecheap in the next step.

## 4.2 Point Namecheap at Netlify's nameservers

1. Open Namecheap in a new tab
2. Sign in (you enabled 2FA, so you'll enter the 6-digit code from Authenticator)
3. Left sidebar → **Domain List**
4. Find `medspagrowthengine.com` → click **Manage**
5. Scroll down to the **NAMESERVERS** section
6. Currently set to "Namecheap BasicDNS"
7. Click the dropdown, change to **Custom DNS**
8. Four text boxes appear (or you can click "Add Nameserver" if only one appears)
9. Paste your 4 Netlify nameservers, one per box:
   - `dns1.p03.nsone.net`
   - `dns2.p03.nsone.net`
   - `dns3.p03.nsone.net`
   - `dns4.p03.nsone.net`
10. Click the green ✓ to save

Namecheap will show a message: "Your nameservers have been updated. It may take up to 48 hours to propagate."

In practice it takes 5–30 minutes. Sometimes longer. Rarely longer than 2 hours.

## 4.3 Wait for propagation

You can check propagation live:

1. Open https://dnschecker.org
2. In the search bar, type `medspagrowthengine.com` and select record type **NS** (nameserver)
3. Click Search
4. The map shows which locations worldwide can see the new nameservers. When you see green ✓ across most countries, you're good.

Refresh every 5–10 minutes. Once ~80% of locations show your Netlify nameservers, proceed.

## 4.4 Provision the SSL certificate

Come back to Netlify → Domain management.

1. Your domain now shows "Netlify DNS" (green)
2. Scroll down to **HTTPS** section
3. Click **Verify DNS configuration** — should return green
4. Click **Provision certificate**
5. Wait 30–120 seconds. Netlify auto-fetches a Let's Encrypt certificate.
6. When the cert shows as "Provisioned" with a valid-until date, toggle ON **Force HTTPS**

Force HTTPS makes any `http://` request auto-redirect to `https://`. Non-negotiable — never let a visitor see an unencrypted version of your site.

## 4.5 Verify everything

Open a private/incognito browser window (Chrome: Ctrl+Shift+N).

Test:

1. Visit `https://medspagrowthengine.com` → landing page loads
2. Padlock icon shown in the address bar (click it — should say "Connection is secure")
3. Visit `http://medspagrowthengine.com` → should auto-redirect to `https://`
4. Visit `https://medspagrowthengine.com/booking` → redirects to `/booking/index.html`
5. Visit `https://medspagrowthengine.com/privacy` → redirects to `/legal/privacy.html`
6. Visit `https://medspagrowthengine.com/dashboard/legacy/` → 404 page
7. Visit `https://www.medspagrowthengine.com` → also loads (Netlify auto-handles www)

If all 7 pass, your public site is live worldwide. Actual humans can find and use it.

Domain: connected. Site: live. Now email.

---

# Chapter 5 — Pro email (Google Workspace)

**Time: 20 minutes. Cost: $7/month (14-day free trial).**

You need `bibek@medspagrowthengine.com` before you send any cold outreach. Sending from a personal Gmail (`vibekb.1234@gmail.com`) is a "not serious" signal to a clinic owner. Pro email costs $7/month — a rounding error against your first $3,500 setup fee.

## 5.1 Sign up

1. https://workspace.google.com → **Start Free Trial**
2. Choose plan: **Business Starter** ($7/user/month)
3. Business info:
   - Business name: `MedSpa Growth Engine`
   - Number of employees: **Just you** (1)
   - Region: your country
4. Contact info:
   - Your name: Bibek Bhandari
   - Current email: `vibekb.1234@gmail.com`
5. Do you have a domain? **Yes** → enter `medspagrowthengine.com`
6. Click Next
7. Sign in as admin:
   - Username: `bibek@medspagrowthengine.com`
   - Password: Bitwarden → generate 20-char → save as "Google Workspace admin"
8. Complete CAPTCHA, accept terms
9. Enter billing (credit card) — you won't be charged for 14 days

## 5.2 Verify you own the domain

Google shows you a TXT record like:

```
google-site-verification=abc123def456...
```

Copy this string.

### 5.2.1 Add the verification TXT record in Netlify DNS

1. Netlify → Domain management → click `medspagrowthengine.com`
2. Scroll to **DNS records** → **Add new record**
3. Record type: `TXT`
4. Name: `@` (this means the root domain — some interfaces call it "root" or leave blank)
5. Value: paste the entire `google-site-verification=...` string
6. TTL: leave default (3600)
7. Save

### 5.2.2 Come back to Google and click Verify

1. Google Workspace setup wizard → **Verify**
2. Wait 30–120 seconds. Google returns green ✓ "Verified".
3. If it fails, wait 5 minutes and retry. DNS propagation.

## 5.3 Add MX records (so email can flow)

Google now walks you through adding MX (Mail Exchange) records — these tell the world "email to `@medspagrowthengine.com` should be delivered to Google's servers".

Google shows you 5 MX records (or sometimes just 1 modern one). Something like:

```
Priority 1   ASPMX.L.GOOGLE.COM
Priority 5   ALT1.ASPMX.L.GOOGLE.COM
Priority 5   ALT2.ASPMX.L.GOOGLE.COM
Priority 10  ALT3.ASPMX.L.GOOGLE.COM
Priority 10  ALT4.ASPMX.L.GOOGLE.COM
```

For each row, add to Netlify DNS:

1. Record type: `MX`
2. Name: `@`
3. Priority: (the number Google gave)
4. Value: (the ASPMX address)
5. TTL: default
6. Save

Repeat for all 5.

Once done, back in Google Workspace setup → click **Activate Gmail**. Wait 1–5 minutes.

## 5.4 Send a test email

1. Open https://mail.google.com in a new incognito tab
2. Sign in as `bibek@medspagrowthengine.com` (password from Bitwarden)
3. Compose → To: `vibekb.1234@gmail.com` → Subject: "Test from pro email" → send
4. Check your `vibekb.1234@gmail.com` inbox — should arrive within 30 seconds
5. Reply back to `bibek@medspagrowthengine.com` — should also arrive

If both directions work, email is live.

## 5.5 Enable 2FA on Google Workspace

**Critical — do this before doing anything else in Google Workspace.**

1. https://myaccount.google.com/security (signed in as bibek@)
2. Under "How you sign in to Google" → **2-Step Verification** → **Get started**
3. Add your phone number for backup, but PRIMARY method should be Authenticator app
4. Follow prompts → scan QR → save backup codes to Bitwarden

Also enable for the admin account (same account, same setting).

---

# Chapter 6 — Email deliverability (SPF, DKIM, DMARC)

**Time: 30 minutes + 30 min propagation. Cost: $0.**

Without these three DNS records, your cold emails go straight to Gmail spam. Full stop. This is the single most-skipped step by beginners and it's the reason 80% of cold email attempts fail on day one.

Read the plain-English intro then follow the steps.

## 6.0 What each thing is, in one line

- **SPF** = "These specific mail servers are allowed to send email as @medspagrowthengine.com. Reject anything else."
- **DKIM** = "Every email we send has a cryptographic signature. Verify it against our public key. If it fails, the email was tampered with."
- **DMARC** = "If SPF or DKIM fails on a message, do X (nothing / quarantine / reject) and send me a report."

All three live as TXT records in your DNS. All three are set-and-forget.

## 6.1 SPF record

1. Netlify → DNS records → Add new record
2. Type: `TXT`
3. Name: `@`
4. Value: `v=spf1 include:_spf.google.com ~all`
5. TTL: default
6. Save

That one line says: "Google's mail servers are the only ones allowed to send email for this domain. Soft-fail (~all) any other source, meaning suspicious but not rejected."

## 6.2 DKIM record — generate the key at Google

1. Go to https://admin.google.com (signed in as bibek@)
2. Left sidebar → Apps → **Google Workspace** → **Gmail**
3. Scroll down to **Authenticate email**
4. Under "Selected domain", pick `medspagrowthengine.com`
5. Click **Generate new record**
6. Choose **2048-bit** (default) → Generate

Google shows you two things:
- **DNS Host name (TXT record name):** `google._domainkey`
- **TXT record value:** starts with `v=DKIM1; k=rsa; p=MIIBIjANBg...` and is VERY long (400+ characters)

Copy both.

## 6.3 Add DKIM to Netlify DNS

1. Netlify → DNS records → Add new record
2. Type: `TXT`
3. Name: `google._domainkey`
4. Value: paste the entire DKIM string starting with `v=DKIM1;`
5. TTL: default
6. Save

**Netlify may truncate the display of the value.** That's fine — the full value is stored, just visually shortened.

Wait 5 minutes. Then back in Google admin:

7. Click **Start authentication**
8. Google verifies your DNS. Status changes to "Authenticating email" then eventually "Authenticated"

If it fails, wait longer. DNS propagation can take up to 48 hours in worst cases (usually <1 hour).

## 6.4 DMARC record

1. Netlify → DNS records → Add new record
2. Type: `TXT`
3. Name: `_dmarc`
4. Value: `v=DMARC1; p=none; rua=mailto:bibek@medspagrowthengine.com; pct=100; adkim=r; aspf=r`
5. TTL: default
6. Save

Breakdown of that value:
- `v=DMARC1` — version
- `p=none` — for now, don't reject anything, just monitor. This is the SAFE mode.
- `rua=mailto:...` — send weekly aggregate reports to your email
- `pct=100` — apply the policy to 100% of your mail
- `adkim=r; aspf=r` — relaxed alignment (matches how Google sends)

Later (after 30+ days of monitoring reports showing no issues), you can upgrade to `p=quarantine` (send suspicious mail to spam) and eventually `p=reject` (bounce entirely).

## 6.5 Verify all three are live

**Wait 30 minutes** for DNS propagation.

Then go to https://mxtoolbox.com/emailhealth

1. Enter `medspagrowthengine.com`
2. Click **Email Health**
3. You should see:
   - ✅ **SPF Record Found**
   - ✅ **DKIM Selector: google._domainkey** — record found
   - ✅ **DMARC Record Found**
   - Any warnings about DNS setup — usually fine unless it says "not found"

If any come back red, wait another 30 minutes and retest. If still red after 2 hours, double-check the record values in Netlify DNS — most common issue is copy-paste error missing a character.

## 6.6 Send a diagnostic test email

The definitive test:

1. Go to https://www.mail-tester.com
2. Copy the test email address they show you (looks like `test-abc123@srv1.mail-tester.com`)
3. From your `bibek@medspagrowthengine.com`, send an email to that address. Subject and body can be anything — just make it a real-looking message: "Hey team, testing our new email setup. Ignore this. — Bibek"
4. Wait ~30 seconds, then click **Then check your score** on mail-tester.com

Score interpretation:
- **10/10** — perfect. You're deliverable.
- **8–9/10** — great. Small fixes possible.
- **5–7/10** — some issue. Read the report, fix what's red.
- **Under 5** — something is broken. Recheck SPF/DKIM/DMARC records exactly.

## 6.7 Email warmup — 14 days

Even with a perfect 10/10 mail-tester score, a brand new domain sending 50 cold emails on day 1 gets flagged. You must "warm" the reputation of the sending address.

**Manual warmup schedule (free but tedious):**

- **Day 1:** Send 2 emails to friends/family from `bibek@medspagrowthengine.com`. Ask each to reply.
- **Day 2:** Send 4 emails. Reply to any replies.
- **Day 3:** Send 6.
- **Day 4:** Send 10.
- **Day 5:** Send 12. Sign up for 2 newsletters as bibek@ (Wired, The Verge, whatever — legit publications).
- **Day 6:** Send 15. Reply to at least 3 emails you've received.
- **Day 7:** Send 20. Join a Google Group in your niche as bibek@.
- **Day 8–13:** 20–30/day, mostly warm (people you know or replied recently).
- **Day 14:** 30–40/day.
- **Day 15:** Now you can start cold outreach. Cap at 20 cold/day for the first week, ramp to 50/day over the next 2 weeks.

**Automated warmup (paid, $30–50/month):**

If manual warmup is too tedious:
- **Instantly.ai** — best for cold email, includes warmup for $30/mo
- **Warmup Inbox** — $19/mo just for warmup
- **Mailwarm** — $49/mo

For your first launch batch (10–20 cold sends to top-tier warm leads), manual warmup is fine. If/when you scale to 50+/day, get a paid warmup service.

---

# Chapter 7 — Your demo n8n instance

**Time: 45 minutes. Cost: $20/month.**

**Why you need this:** you cannot demo MGE to a prospect without an actual running instance. When someone books a discovery call and you screen-share to show "here's what your dashboard would look like", they need to see live data flowing. That means YOU need your own n8n running the 8 workflows against a test Google Sheet with fake but realistic data.

This is separate from a client install — that comes later per `setup/Setup_Guide.md`. This is your demo lab.

## 7.1 Sign up for n8n cloud

1. https://n8n.io → **Start free trial** (14 days) → **Create account**
2. Email: `bibek@medspagrowthengine.com` (from now on, use pro email for all business accounts)
3. Password from Bitwarden → save as "n8n cloud"
4. Instance region: pick closest (US, EU, Asia)
5. Instance URL: pick a short subdomain, e.g., `mge-demo.app.n8n.cloud` — you can't change this later, so pick carefully
6. Complete setup → land in the dashboard
7. Enable 2FA immediately (Settings → Personal → Password & Security → Two-factor authentication)

## 7.2 Create your demo Google Sheet

1. Open Google Drive as `bibek@medspagrowthengine.com` (https://drive.google.com)
2. New → Google Sheet → name it: **MGE Demo Sheet**
3. **Copy the Sheet ID from the URL.** The URL looks like: `https://docs.google.com/spreadsheets/d/1ABCdefGHIjklMNOpqrsTUV0123456789/edit`. The bit between `/d/` and `/edit` is your Sheet ID.
4. Write it in your notebook as "Demo Sheet ID"

## 7.3 Paste in the Apps Script setup

1. In the Sheet, top menu → **Extensions** → **Apps Script**
2. A new tab opens with the Apps Script editor
3. Delete any placeholder code shown
4. Open File Explorer, go to `C:\Users\user\OneDrive\Desktop\MedSpa Growth Engine\setup\MedSpa_Engine.gs`
5. Open that file in Notepad (right-click → Open with → Notepad)
6. Ctrl+A, Ctrl+C to copy the entire contents
7. Paste into the Apps Script editor (Ctrl+V)
8. Change the `WEBHOOK_SECRET` constant near the top — generate a random 32-char string:
   - Windows PowerShell: run `-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})`
   - Or use https://randomkeygen.com and pick "CodeIgniter Encryption Keys" then copy the first 32 chars
   - Save the string to Bitwarden as "MGE Demo Webhook Secret"
9. Save the Apps Script (Ctrl+S or the disk icon)
10. Top menu → select `setupMedSpaEngine` from the function dropdown → click **Run**
11. First run asks for authorization. Click **Review permissions** → sign in as bibek@ → click **Advanced** → **Go to MedSpa Growth Engine (unsafe)** → **Allow**. This is your own script, so "unsafe" here means "Google didn't verify it", not "actually unsafe."
12. Script runs. Check the Sheet — should now have tabs: Clients, Appointments, Activity Log

## 7.4 Create a Google Cloud project + API key

You need an API key so the dashboard can READ the Sheet (n8n handles writes via OAuth — see next step).

1. https://console.cloud.google.com (signed in as bibek@)
2. Top bar → project selector → **New Project**
3. Name: `mge-demo` → Create
4. Wait ~10 seconds for project to be created, then select it
5. Left menu → **APIs & Services** → **Library**
6. Search "Google Sheets API" → click it → **Enable**
7. Left menu → APIs & Services → **Credentials**
8. **Create Credentials** → **API key**
9. Google shows you the key. **Copy it immediately** — save to Bitwarden as "MGE Demo Sheets API Key"
10. Click **Edit API key** → set restrictions:
    - **Application restrictions:** HTTP referrers (web sites) → Add: `https://medspagrowthengine.com/*` and `https://medspagrowthengine.netlify.app/*` and `http://localhost/*` (for local testing)
    - **API restrictions:** Restrict key → Google Sheets API only
    - Save

## 7.5 Add OAuth credentials in n8n

1. Back in n8n → left sidebar → **Credentials** → **Add credential**
2. Search "Google Sheets" → **Google Sheets OAuth2 API** → Continue
3. n8n shows you a Redirect URL — copy it
4. Open a new tab: https://console.cloud.google.com → your `mge-demo` project → APIs & Services → **OAuth consent screen**
5. User Type: **External** → Create
6. App name: `MGE Demo` → User support email: bibek@ → Developer contact: bibek@ → Save
7. Scopes: skip for now → Save
8. Test users: add `bibek@medspagrowthengine.com` → Save
9. Back to top → APIs & Services → **Credentials** → **Create Credentials** → **OAuth client ID**
10. Application type: **Web application**
11. Name: `MGE n8n`
12. Authorized redirect URIs: paste the URL n8n gave you
13. Create → you'll get a Client ID and Client Secret. Copy both to Bitwarden.
14. Back to n8n → paste Client ID and Client Secret → **Sign in with Google** → sign in as bibek@ → grant permissions
15. n8n saves the credential. Repeat the same process for **Gmail OAuth2** — same OAuth client works, just add Gmail API scope.

Also enable **Gmail API** in Google Cloud Console (APIs & Services → Library → Gmail API → Enable) so the OAuth for Gmail works.

## 7.6 Configure and import the 8 workflows

You have two paths:

**Path A: Use the Workflow Configurator (recommended)**

1. Open `C:\Users\user\OneDrive\Desktop\MedSpa Growth Engine\setup\Workflow_Configurator.html` in Chrome
2. Fill in the 8 values it asks for:
   - Sheet ID: your demo Sheet ID
   - Webhook Secret: your generated secret
   - Clinic Name: "MGE Demo Clinic"
   - Clinic Email: bibek@
   - Timezone: your local IANA tz (e.g., `America/Toronto`)
   - Google Sheets credential ID: get from n8n → Credentials → click your Sheets credential → the ID in the URL
   - Gmail credential ID: same for Gmail
   - Clinic website URL: `https://medspagrowthengine.com`
3. Click **Download configured workflows** — downloads 8 JSON files
4. In n8n, top-right → **Import from File** → import each of the 8 JSONs
5. For each workflow: open it → click **Activate** toggle top-right

**Path B: Manual edit** — open each of the 8 files in `workflows/`, replace `YOUR_MEDSPA_SHEET_ID`, `YOUR_WEBHOOK_SECRET`, `YOUR_CLINIC_TIMEZONE`, etc. Import each. Skip this if you can use Path A.

## 7.7 Copy webhook URLs

For workflows 1, 3, 6, and 8 (the webhook-triggered ones):

1. Open the workflow in n8n
2. Click the Webhook node
3. Copy the **Production URL** (not Test URL)
4. Save each to Bitwarden as e.g., "MGE Demo Webhook 1 - Lead Intake"

You'll paste these into the dashboard next.

## 7.8 Configure the dashboard

1. Open `dashboard/index.html` in Chrome (double-click the file)
2. First-run setup screen — set a passcode (save to Bitwarden as "MGE Demo Dashboard passcode")
3. Once in, Settings → **System** tab
4. Fill in:
   - Google Sheets API Key: (the restricted key from 7.4)
   - MedSpa Sheet ID: your demo Sheet ID
   - Webhook Secret: your webhook secret
   - Webhook URL 1 (Lead Intake): the URL from 7.7
   - Webhook URL 3 (Review/Referral): the URL from 7.7
   - Webhook URL 6 (Booking Confirmation): the URL from 7.7
   - Webhook URL 8 (Status Update): the URL from 7.7
5. Save → Sync now
6. Dashboard should load with your (currently empty) demo data

## 7.9 Add fake demo data

For demos to look real, add fake but plausible entries in the Sheet:

1. Open your MGE Demo Sheet
2. **Clients tab** — add 20–30 rows with fake names, emails you own, various statuses (New Inquiry, Booked, Completed, VIP), realistic Total Visits and Revenue
3. **Appointments tab** — add 30–40 rows with mix of past (Completed/No-Show) and upcoming (Scheduled)
4. **Activity Log** — leave empty, it'll auto-populate as you test

For fake email addresses to receive the reminder emails without polluting a real inbox, use https://temp-mail.org or create Gmail aliases like `bibek+test1@medspagrowthengine.com`.

## 7.10 Smoke test the whole flow

1. In dashboard → Pipeline page → drag a client card between columns
2. Check Google Sheet Clients tab → status should have updated (this proves Workflow 8 works)
3. In dashboard → click "📧 Confirm" on an appointment
4. Check the email you used for that appointment → confirmation email arrives within 30 seconds (proves Workflow 6 works)
5. In dashboard → click "✅ Complete" on an appointment
6. Wait 24 hours (or manually trigger Workflow 3 in n8n) → review request email arrives (proves Workflow 3 works)
7. Manually run Workflow 2 in n8n → should process any appointments with reminders due (proves Workflow 2 works)
8. Wait until next Monday 8am (or manually run Workflow 5) → weekly report arrives at bibek@ (proves Workflow 5 works)

**If all 5 pass, your demo instance works.** You can now demo the product live to any prospect.

If any fail, check:
- n8n → Executions → click failed run → read the error
- Most common: Sheet ID wrong, webhook secret mismatched, OAuth expired

---

# Chapter 8 — Calendly + booking page

**Time: 30 minutes. Cost: free (Calendly free tier covers this).**

## 8.1 Sign up for Calendly

1. https://calendly.com → Sign up → sign in with Google → pick `bibek@medspagrowthengine.com`
2. Choose free plan (14-day Pro trial is fine, no need to upgrade)
3. Pick your Calendly URL: `calendly.com/bibek-mge` (or similar)

## 8.2 Create the demo event

1. From Calendly dashboard → **Create** → **Event type** → **One-on-One**
2. Event name: `MedSpa Growth Engine Demo — 15 min`
3. Location: **Google Meet** (auto-created for each call)
4. Duration: 15 minutes
5. Availability:
   - Working hours: pick your actual working hours (e.g., Mon–Thu 9am–5pm, Fri 9am–12pm)
   - **Buffer time before:** 5 min
   - **Buffer time after:** 10 min (so you can write notes)
   - **Minimum notice:** 4 hours (prevents "book right now" panic bookings)
   - **Maximum bookings per day:** 4 (protects your energy)
6. Confirmation email: customize the message — something like "Looking forward to showing you the MGE system. If you have a booking system or intake form URL you can send in advance, that helps me tailor the demo. — Bibek"
7. Save

## 8.3 Get the embed code

1. On the event page → **Share** → **Add to Website**
2. Choose **Inline Embed**
3. Copy the entire embed code — looks like:
   ```html
   <div class="calendly-inline-widget" data-url="https://calendly.com/bibek-mge/mge-demo" style="min-width:320px;height:700px;"></div>
   <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
   ```

## 8.4 Paste into the booking page

1. Open `C:\Users\user\OneDrive\Desktop\MedSpa Growth Engine\booking\index.html` in a text editor (Notepad works, VS Code is nicer)
2. Ctrl+F search for `calendly-embed` — you'll find a placeholder `<div id="calendly-embed">` around line 159
3. Replace the entire placeholder block with your Calendly embed code from 8.3
4. Save

## 8.5 Update the staging folder + redeploy

1. Copy the new `booking/index.html` into `MGE_DEPLOY_STAGING/booking/index.html` (overwrite)
2. Netlify → your site → **Deploys** → drag the entire `MGE_DEPLOY_STAGING` folder into the drop zone at the top (this triggers a redeploy)
3. Wait 60 seconds
4. Visit `https://medspagrowthengine.com/booking/` in incognito — Calendly should appear instead of the placeholder

If you set up GitHub sync (3B), just commit + push instead.

## 8.6 Test end-to-end

1. Incognito browser → `https://medspagrowthengine.com`
2. Click "See the system live" (goes to booking page)
3. Calendly loads → pick a time slot → enter details → book
4. Confirmation appears
5. Check `bibek@medspagrowthengine.com` inbox → Calendly notification with call details
6. Check your Google Calendar → event appears

If this works, a prospect can now book a real demo call.

## 8.7 Add a real photo to the booking page

The booking page has a "BB" initials avatar. Replace with a headshot:

1. Save your photo as `assets/bibek.jpg` (square, 400×400 minimum, professional)
2. Open `booking/index.html`, search for `class="avatar"` — find the div showing "BB"
3. Replace with `<img src="../assets/bibek.jpg" alt="Bibek Bhandari" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
4. Copy the updated file + photo into `MGE_DEPLOY_STAGING`
5. Redeploy

---

# Chapter 9 — Monitoring and analytics

**Time: 20 minutes. Cost: free (or +$9/mo for Plausible).**

## 9.1 UptimeRobot — alerts if the site goes down

1. https://uptimerobot.com → Sign up (free tier: 50 monitors)
2. Verify email
3. **Add New Monitor**
4. Monitor Type: **HTTP(s)**
5. Friendly Name: `MGE Landing`
6. URL: `https://medspagrowthengine.com`
7. Monitoring Interval: **5 minutes** (free tier minimum)
8. Alert Contacts: add `bibek@medspagrowthengine.com` and `vibekb.1234@gmail.com`
9. Create Monitor
10. Repeat for `https://medspagrowthengine.com/booking/`

You'll get an email within 5 minutes of any downtime. UptimeRobot's dashboard shows uptime % over 30 days.

## 9.2 Plausible — privacy-friendly analytics (optional but recommended)

1. https://plausible.io → Sign up (30-day free trial, then $9/mo)
2. Add site: domain = `medspagrowthengine.com`
3. Plausible gives you a one-line script tag:
   ```html
   <script defer data-domain="medspagrowthengine.com" src="https://plausible.io/js/script.js"></script>
   ```
4. Paste this script just before the closing `</head>` in:
   - `landing/index.html`
   - `booking/index.html`
   - `onboarding/index.html`
   - `legal/privacy.html`
   - `legal/terms.html`
5. Copy updated files into `MGE_DEPLOY_STAGING`, redeploy
6. Visit your site in incognito → refresh Plausible dashboard → visit shows up within seconds

Plausible tracks: visitors, page views, top pages, sources (Google, LinkedIn, direct), goal conversions (like "clicked Book Demo"). Zero cookies. No banner needed.

## 9.3 Skip Google Analytics

GA is free but requires a cookie banner (breaks the clean look), slows the page, and gives Google tracking data on every visitor. For your first 6 months, Plausible is enough. Add GA later only if a client asks for it.

---

# Chapter 10 — Launch verification (25-point check)

**Do all 25 before sending your first cold email.** Any failure = fix before proceeding.

## Site + hosting

- [ ] 1. `https://medspagrowthengine.com` loads the landing page in incognito
- [ ] 2. Padlock icon shows (click it → "Connection is secure")
- [ ] 3. `http://medspagrowthengine.com` auto-redirects to `https://`
- [ ] 4. `https://www.medspagrowthengine.com` also works
- [ ] 5. `/booking/` shows Calendly, not placeholder
- [ ] 6. `/legal/privacy.html` loads
- [ ] 7. `/legal/terms.html` loads
- [ ] 8. `/dashboard/legacy/` returns 404
- [ ] 9. `/operations/AI_OPERATOR_OS.md` returns 404
- [ ] 10. `/setup/Setup_Guide.md` returns 404

## Email + deliverability

- [ ] 11. Send email from bibek@ to a Gmail address — arrives in inbox, not spam
- [ ] 12. In that email, open → 3-dot menu → Show original — SPF: PASS, DKIM: PASS, DMARC: PASS
- [ ] 13. Mail-tester.com score: 8/10 or higher
- [ ] 14. MXtoolbox.com/emailhealth shows all green for the domain

## Demo instance

- [ ] 15. Dashboard loads at `dashboard/index.html` locally with your passcode
- [ ] 16. Dashboard shows fake client data from your demo Sheet
- [ ] 17. Kanban drag saves back to the Sheet (Workflow 8)
- [ ] 18. "📧 Confirm" sends a confirmation email (Workflow 6)
- [ ] 19. "✅ Complete" queues review request (Workflow 3)
- [ ] 20. Manually running Workflow 2 in n8n processes reminders

## Booking flow

- [ ] 21. Book a test demo through the booking page — confirmation arrives at bibek@
- [ ] 22. Google Calendar shows the test event
- [ ] 23. Booking page contact form (below Calendly) opens mailto with prefilled subject

## Monitoring

- [ ] 24. UptimeRobot shows both monitors as UP (green)
- [ ] 25. Plausible dashboard records your incognito test visits

**All 25 green?** You are truly launched. Only now send your first cold email.

**Any red?** Do not send outreach yet. Fix the failed items. It's better to launch a week late than launch broken.

---

# Chapter 11 — Troubleshooting encyclopedia

## Domain / DNS

**"I updated nameservers 4 hours ago and site still doesn't load"**

Check https://dnschecker.org with your domain and record type NS. If it shows mixed results (some green, some red), just wait — some ISPs cache DNS aggressively. If ALL locations show the old Namecheap nameservers after 6 hours, log back into Namecheap and confirm the nameservers were saved.

**"Site loads on my phone but not my laptop"**

Your laptop cached the old DNS. In Windows PowerShell (admin): `ipconfig /flushdns`. Restart the browser. Or wait 30 min.

**"medspagrowthengine.com loads but www.medspagrowthengine.com doesn't"**

Netlify → Domain management → check that www is listed as an alias. If not, add it → click "Set primary" on the version you want.

## SSL

**"Your connection is not secure" warning in browser**

Netlify → Domain management → HTTPS section → click "Provision certificate". Wait 60 seconds. If it fails, click "Verify DNS configuration" first, then retry.

**"SSL cert says provisioned but browser still warns"**

Force a hard refresh (Ctrl+Shift+R). If persists, wait 15 minutes — cert deployment isn't instantaneous globally.

## Email

**"My test email went to spam"**

Check Gmail's Show Original on the message. If SPF or DKIM shows PASS but message went to spam, that's normal for a brand-new domain — reputation isn't earned yet. Do the warmup schedule.

If SPF or DKIM shows FAIL, your DNS records are wrong. Recheck.

**"DKIM verification failing at Google admin"**

Wait longer (up to 48h). If still failing, delete the TXT record in Netlify and re-add it — sometimes copy-paste introduces invisible characters. Use the raw copy button in Google admin.

**"DMARC reports coming in as .xml.gz attachments — what do I do?"**

For now, nothing. In 30 days, if you want, load one into https://dmarcian.com free tool to see who's sending mail as your domain. But `p=none` mode is passive — you don't need to act on these.

## Netlify

**"Deploy failed" message after drag-drop**

Click the failed deploy → read the log. Most common: your zip was corrupted or contained a file too large. Redo the staging folder from scratch.

**"Site works but shows Netlify 404 on refresh"**

You forgot to include `netlify.toml`. Copy it into the staging root and redeploy.

**"Some pages 200 but others 404 randomly"**

You have folder-name capitalization mismatches (Linux is case-sensitive). Rename all folders lowercase, redeploy.

## Dashboard / n8n

**"Dashboard says 'Failed to load Sheet data'"**

- Check API key restrictions in Google Cloud Console — HTTP referrer must include exact URL you're accessing dashboard from
- Check Sheet ID is exact (from between `/d/` and `/edit` in the URL)
- Check Sheet is shared with the API key's project — actually API keys don't need share (they read public-readable ranges), but n8n does need OAuth grants

**"Kanban drag doesn't save"**

- Check webhook URL in dashboard Settings matches the Production URL from n8n (not the Test URL)
- Check webhook secret matches exactly on both sides
- Open browser dev tools → Network tab → drag a card → look for the POST to n8n → check response. 401/403 = secret mismatch. 500 = n8n workflow error, check n8n executions.

**"n8n workflow shows 'Node Type not found: n8n-nodes-base.googleSheets'"**

You're on an older n8n version. Update your n8n cloud instance (Settings → General → Update).

**"Emails from workflows not sending"**

- Gmail OAuth credential expired → re-auth in n8n credentials
- Or you hit Gmail's 500/day send limit for free Workspace accounts — wait 24h

## Calendly

**"Calendly embed shows but is cropped/broken layout"**

The `height:700px` in the embed code isn't enough on mobile. Change to `height:800px;max-width:100%;` and redeploy.

**"Test booking didn't create a calendar event"**

Calendly → Account → Integrations → Google Calendar → reconnect. Sometimes OAuth expires.

---

# Chapter 12 — Day-of-launch and after

## Launch weekend, hour by hour

### Day 1 (Saturday) — Site live

- **9am–10am** — Chapter 1 (buy domain)
- **10am–11am** — Chapter 2 (prepare staging folder) + Chapter 3A (Netlify drag-drop deploy)
- **11am–12pm** — Chapter 4 (connect domain, provision SSL)
- **12pm–1pm** — lunch, let DNS propagate
- **1pm–2pm** — Chapter 5 (Google Workspace signup + MX records)
- **2pm–3pm** — Chapter 6 (SPF, DKIM, DMARC records)
- **3pm–3:30pm** — Chapter 9 (UptimeRobot)
- **3:30pm** — send Day 1 warmup emails (2 to friends)
- **Evening** — read Chapter 7 tomorrow's steps

### Day 2 (Sunday) — Demo instance live

- **9am–12pm** — Chapter 7 (n8n cloud + demo Sheet + workflow config + import)
- **12pm–1pm** — lunch
- **1pm–2pm** — Chapter 8 (Calendly + booking page redeploy)
- **2pm–3pm** — Chapter 9.2 (Plausible if you want it)
- **3pm–4pm** — **Chapter 10 verification checklist — do all 25**
- **4pm** — send Day 2 warmup emails (4 to friends/family)

### Weekdays 1–14 — Warmup

- Daily: send warmup emails per Chapter 6.7 schedule
- Daily: 10 min responding to any real inbox mail as bibek@
- Weekly: check mail-tester.com score
- Bibek's brain: read `operations/AI_OPERATOR_OS.md` end to end, understand the outreach playbook

### Day 15 — First cold outreach batch

- Open `outputs/swarm/1_raw_leads.csv` (your 134 ICP-qualified leads)
- Sort by fit — pick your top 10
- Open `operations/AI_LEAD_RESEARCH_AND_PERSONALIZATION.md` — run the research prompt on each of those 10
- Draft messages using the 4-part structure (one observed fact / one implication / one solution / one CTA)
- Send from bibek@medspagrowthengine.com
- Wait

### First reply

- Do NOT wing it. Open `operations/AI_COMMUNICATION_SYSTEM.md` for the reply triage taxonomy.
- Hot reply → book a call, use `operations/AI_CALL_BRIEF_TEMPLATE.md` to prep
- Objection → follow the SALES_CLOSING_SOP response patterns

### First booked demo call

- 20 min before: open `operations/AI_CALL_BRIEF_TEMPLATE.md`, fill it in from your research on the clinic
- Open your demo dashboard in one tab, the ROI calculator in another
- Screen-share the demo dashboard — walk them through the 4-leak recovery flow
- End with: "Want me to send the tailored ROI numbers for your clinic within 24 hours?"

### First paid client

- Follow `setup/Setup_Guide.md` — that walks you through setting up a NEW clinic install (their own Sheet, their own n8n instance, their own dashboard)
- This is different from your demo instance — each client gets their own

---

# Appendix A — Every URL you'll need

| Purpose | URL |
|---|---|
| Domain registrar | https://www.namecheap.com |
| Hosting | https://app.netlify.com |
| Pro email signup | https://workspace.google.com |
| Pro email inbox | https://mail.google.com (login as bibek@) |
| Google Workspace admin | https://admin.google.com |
| Google Cloud Console | https://console.cloud.google.com |
| n8n cloud | https://n8n.io |
| Calendly | https://calendly.com |
| Uptime monitoring | https://uptimerobot.com |
| Analytics | https://plausible.io |
| DNS propagation checker | https://dnschecker.org |
| Email health check | https://mxtoolbox.com/emailhealth |
| Email deliverability test | https://www.mail-tester.com |
| Password manager | https://bitwarden.com |
| Random string generator | https://randomkeygen.com |
| Data breach check | https://haveibeenpwned.com |

## Bookmark all of these in a browser folder called "MGE Ops"

---

# Appendix B — Costs summary

| Item | One-time | Monthly | Notes |
|---|---|---|---|
| Domain | ~$12/yr | ~$1/mo | Namecheap, renews yearly |
| Netlify hosting | 0 | 0 | Free tier is plenty |
| Google Workspace | 0 | $7 | 14-day free trial first |
| n8n cloud (demo) | 0 | $20 | Your own demo instance |
| Calendly | 0 | 0 | Free tier fine |
| UptimeRobot | 0 | 0 | Free tier fine |
| Plausible | 0 | $9 | Optional, skip until first client |
| Warmup service | 0 | $30 | Optional, skip for manual warmup |
| Google Cloud API | 0 | 0 | Free tier covers demo traffic |
| **Total pre-first-client** | **$12** | **$28** | With Plausible; $19 without |
| Client n8n instance | 0 | $20 | Per paying client, passed through in retainer |

Your setup cost total: **~$40 first month, ~$28/month ongoing.**

Charge $1,000–$1,500/month retainer per client. First client covers all your costs and puts $970+ profit in your pocket.

---

# Appendix C — Password + secret storage plan

Every secret needs a home. This is yours:

**Bitwarden vault entries to create:**

- Namecheap login (username + password + 2FA backup codes as secure note)
- Netlify login (same)
- Google Workspace admin login (same)
- n8n cloud login (same)
- GitHub login (if using)
- Calendly login
- UptimeRobot login
- Plausible login
- Google Cloud Console login (same as Workspace)

**Bitwarden secure notes for the operational secrets:**

- MGE Demo Sheet ID (`1ABCdefGHI...`)
- MGE Demo Webhook Secret (32 chars)
- MGE Demo Sheets API Key (`AIzaSy...`)
- MGE Demo Dashboard passcode
- MGE Demo Webhook URL 1 (Lead Intake) — from n8n
- MGE Demo Webhook URL 3 (Review/Referral)
- MGE Demo Webhook URL 6 (Booking Confirmation)
- MGE Demo Webhook URL 8 (Status Update)
- OAuth Client ID + Secret (Google Cloud)

When you land your first paying client, create a NEW folder in Bitwarden called "Client - [Clinic Name]" and generate a fresh set of all of the above for them. Never reuse across clinics.

---

## The one sentence that makes all of this real

**Set up = ~10 hours of focused work spread across two days. Ongoing operation = 30 minutes/day. First paying client covers all your monthly costs plus profit. You know how to do everything in this document because it's now written down step by step.**

Bookmark this file. Follow it linearly. Do the boring steps carefully. In 16 days you have a real business generating real outreach with a real product ready to install for real clients.

Ship this weekend.
