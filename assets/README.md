# Shared Assets

This folder contains runtime assets used by the public-facing system pages.

| File | Purpose |
|---|---|
| `brand-tokens.css` | Shared public-page design tokens: colors, fonts, spacing, radii. |
| `theme.js` | Shared dark/light theme toggle for public and utility pages. |
| `medspa-growth-engine-mark.png` | Transparent PNG logo mark used in public headers, auth, dashboard, and favicon. |
| `favicon.svg` | Legacy browser tab icon. |
| `og-image.svg` | Social preview image. |
| `dashboard-overview.png` | Real dashboard screenshot used on the landing page hero demonstration. |
| `dashboard-pipeline.png` | Real dashboard pipeline screenshot used as landing-page proof. |
| `dashboard-settings.png` | Real dashboard settings screenshot used as landing-page proof. |

## Token Ownership

- Public pages should import `assets/brand-tokens.css`.
- Dashboard tokens live in `dashboard/index.html` because the dashboard is a single-file app.
- Full token documentation lives in `design/Tokens.md`.
- Quick operator design reference lives in `system/DESIGN_ASSETS.md`.
