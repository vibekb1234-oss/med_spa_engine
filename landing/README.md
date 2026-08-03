# MedSpa Landing Page

Primary file: `landing/index.html`. Public landing page for MedSpa Growth Engine — MedSpa-specific copy, pricing, and colors over the shared brand-tokens system.

## Before Sending Traffic

All in-page CTAs now route to `../booking/index.html`. The booking page handles the prefilled-email handoff to `vibekb.1234@gmail.com`. If you change your contact email, update it in:

- `booking/index.html` — the `mailto:` submit handler
- `legal/privacy.html` and `legal/terms.html` — the contact sections

Check before going public:

- Hero CTA goes to the right booking/contact destination.
- Pricing matches the current offer tiers.
- Package names match the sales script.
- Claims stay modeled, not guaranteed.

## Local Preview

From the repo root:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8765/landing/index.html
```

## Note for deployment

This README will be excluded from the production deploy by `netlify.toml`, `.vercelignore`, and `.cfignore`. It's operator documentation only, never served to prospects.

