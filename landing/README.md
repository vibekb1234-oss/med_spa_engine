# MedSpa Landing Page

Primary file: `landing/index.html`. Public landing page for MedSpa Growth Engine: MedSpa-specific revenue recovery copy, pricing, and colors over the shared brand-tokens system.

## Before Sending Traffic

All in-page CTAs route to the clean `/book` URL. The booking page embeds the Calendly Revenue Leak Audit event:

`https://calendly.com/medspaagrowth/revenue-leak-audit`

If the event link changes, update:

- `booking/index.html` - Calendly widget and fallback link
- `launch/calendly/README.md` - operator setup docs
- `launch/env.example` - `CALENDLY_DISCOVERY_URL`
- `legal/privacy.html` and `legal/terms.html` - contact links if needed

Check before going public:

- Hero CTA goes to `/book`.
- Pricing matches the current offer tiers.
- Package names match the sales script.
- Claims stay modeled, not guaranteed.
- Mobile layout has no horizontal scroll at 390px and 430px widths.

## Local Preview

From the repo root:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8765/landing/index.html
```

## Note For Deployment

This README is operator documentation only, not prospect-facing copy.
