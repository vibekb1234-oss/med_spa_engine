# Legacy Dashboard

The active dashboard is **`dashboard/index.html`** — that's the one to use.

This folder holds the original first-generation dashboard, kept here as a reference and as a fallback. It still works (and the security fixes from the earlier audit pass were applied to it before this archive), but new development happens on `dashboard/index.html`.

## When to use the legacy dashboard

- You need a familiar, simpler operational view (4 panels, no kanban, no command palette)
- The new dashboard breaks for any reason and you need an emergency fallback
- You're testing/comparing against the new build

## What changed in the new dashboard

- Five-page app shell (Overview / Pipeline / Clients / Analytics / Settings)
- 6-column kanban with drag-drop status updates (powered by Workflow 8)
- Bulk actions on the Clients table (export, mark VIP, send confirmations)
- Saved filters + LTV column
- Provider performance breakdown in Analytics
- ⌘K command palette
- Embedded "Coral" assistant chatbot
- Multi-user auth with role-based gating
- Light + dark themes
- Webhook secret enforced on every webhook call
- Mobile-responsive (sidebar drawer, kanban horizontal snap, full-screen chat)

If this folder is in the way and you're confident you don't need it, delete it.
