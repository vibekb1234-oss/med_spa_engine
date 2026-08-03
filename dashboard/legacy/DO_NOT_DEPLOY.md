# DO NOT DEPLOY THIS FOLDER

This `dashboard/legacy/` directory is the first-generation dashboard, kept around as a fallback reference only.

## Why it must stay private

Files in here contain hardcoded placeholder secrets that look like real keys to anyone reading the source:

- `medspa_dashboard.html` — `YOUR_GOOGLE_SHEETS_API_KEY`, sample Sheet ID `1BxiMVs0XRA5...`, and other example values
- `Google_AI_Studio_Dashboard_Prompt.md` — example credentials and webhook scaffolding

These are not active secrets — they're documented placeholders — but they will:

1. Confuse a clinic owner who finds the folder and tries to use it
2. Trigger secret-scanning tools on hosting providers (Netlify/Vercel/Cloudflare Pages all run these)
3. Look unprofessional if a prospect lands on the folder URL by accident

## What to do at deploy time

When you push to your static host, exclude this folder from the deploy. Pick whichever method fits your host:

**Netlify** — add to `netlify.toml`:
```toml
[build]
  publish = "."
  ignore = "dashboard/legacy/**"
```

**Vercel** — add to `.vercelignore`:
```
dashboard/legacy
```

**Cloudflare Pages** — add to `.cfignore`:
```
dashboard/legacy/
```

**Generic static host** — delete the folder from the deploy bundle before upload, or move it out of the public directory.

## The live dashboard

The current production dashboard is `dashboard/index.html` (one level up from here). That file has no hardcoded secrets — all config is entered via the first-run setup and stored in browser localStorage per clinic.

---

*If you don't need the legacy folder anymore, you can delete it entirely. It's only kept for historical reference.*
