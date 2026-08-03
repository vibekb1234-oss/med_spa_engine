# MGE Design System

This directory is the moat. The actual product is `dashboard/index.html` — but anyone extending it or rebuilding it for another clinic should read this first.

---

## Philosophy

**MedSpa Growth Engine (MGE) is a productized service, not a SaaS.** A clinic owner pays a setup fee plus a monthly retainer, and what they receive is this dashboard sitting on top of 8 invisible n8n workflows. The dashboard's job is to make the automations legible, the operations pleasant, and the upkeep close to zero.

Three principles drive every decision in this directory:

1. **Premium and restrained.** This is the visible surface of a service that costs $1,000/month. It should look like that. No bright saturated colors, no flashy animations, no emoji in chrome, no serif "moments". Hierarchy comes from size, weight, spacing, and color — never from family changes.

2. **One thing at a time, well.** The dashboard does five things. It does each one as well as it can. There is no "settings depth" page where 200 sliders go to die. There is no plug-in marketplace. There is no "AI workspace" tab. Every feature has to earn its 56-pixel slot in the topbar or its row in the sidebar.

3. **The data lives in the clinic owner's Google Sheet, always.** No database. No proprietary store. The operator can open the Sheet at any time, edit it directly, and the dashboard reflects the change on next sync. The dashboard is a renderer, not the source of truth.

---

## What's in this directory

| File | Purpose |
|------|---------|
| [Tokens.md](Tokens.md) | Every CSS custom property: colors, typography, spacing, radii, shadows, motion, z-index, density. |
| [Components.md](Components.md) | Every reusable UI piece: app shell, KPI tile, panel, kanban card, data table, badges, buttons, form fields, ⌘K palette, notifications, quick-add, chatbot, toast, empty state. |
| [Patterns.md](Patterns.md) | Page layouts, navigation, drill-down, auth flow, density, theme, loading, error, sync, configuration, assistant flow. |
| [Roadmap.md](Roadmap.md) | What's shipped, what's next (top 5), backlog, deferred, out-of-scope. No unnecessary new automations. |
| [../system](../system) | Operator-facing system registry for frontend, workflows, data, integrations, launch ops, and copy assets. |

Read in this order: Tokens → Components → Patterns → Roadmap. README last (you're already here).

---

## Conventions for adding to the system

### Adding a new color
1. Add the token to `Tokens.md` under the relevant section, in BOTH dark and light theme tables.
2. Verify WCAG AA contrast for both themes.
3. Update `dashboard/index.html`'s `:root` and `[data-theme="light"]` blocks.
4. Reference by token name only in components — never inline a hex.

### Adding a new component
1. Justify why an existing component doesn't cover the need. Document this justification at the top of the component's entry in `Components.md`.
2. Add full anatomy + variants + usage rules to `Components.md`.
3. Add the relevant CSS class block in `dashboard/index.html`, scoped to the component (BEM-ish: `.kpi`, `.kpi__value`, `.kpi--success`).
4. If the component has interactive behavior, document the keyboard support in `Patterns.md`.

### Adding a new page
1. Update the sidebar nav in `dashboard/index.html` (max 5 nav items — if you're at 6, something else has to go).
2. Add a layout description to `Patterns.md` under "Page layouts".
3. Add the route handler in `dashboard/index.html`'s `navigateTo()` function.
4. Update the chatbot's "Navigation" intent to include the new page name.
5. Update the ⌘K command palette to include the new page.

### Adding a new theme
Don't, unless there's a compelling brand reason. Two themes (dark + light) cover every documented user preference. A third theme means tripling the color verification work for every future component.

---

## Anti-patterns — won't merge

- A serif font, anywhere, including hero numbers and "moments".
- A new automation without a clear operational reason. The 8 workflows are the line. New features should usually live in this dashboard, the Sheet, or supporting tools.
- Saturated colors (`#00ff00`, `#ff0000`). Everything desaturated, slightly warmed.
- Emoji in UI chrome. Stroke-only inline SVG icons. (Emoji in chatbot copy is fine.)
- Bringing in Tailwind, Bootstrap, or any UI framework. Hand-rolled CSS with design tokens.
- Multiple HTML files for the dashboard. One self-contained file with inline CSS and JS.
- Tracking, analytics, or any third-party script beyond Google Fonts + Google Identity Services + Apple Sign-in JS. Privacy is a feature.
- A chatbot answer that returns nothing on an unknown query. Always offer chip suggestions.
- A new component without justification — first ask whether existing ones cover the need.

---

## Compatibility commitments

- **Browsers:** modern evergreen Chrome / Safari / Firefox / Edge. No IE11. The dashboard uses `fetch`, `crypto.subtle`, `Intl.DateTimeFormat`, and `URLSearchParams` — all baseline 2020+.
- **Touch:** every action accessible without hover. Tap targets ≥44×44 on mobile.
- **Reduced motion:** all transitions collapse to 1ms when `prefers-reduced-motion: reduce` is set.
- **Reduced data:** no images larger than the burgundy brand SVG. No background videos. Total page weight under 200KB on first load (excluding fonts).
- **Reduced javascript:** the dashboard works as static HTML without sheet credentials configured — it shows the setup nudge and the Settings page only.

---

## Versioning

The design system follows the dashboard's build number, surfaced in the sidebar footer (`MGE · build 2026.04.26`). Date-based, no semver — the dashboard is a single deployable artifact, not a library.

A change is considered breaking if it requires a clinic owner to do anything during deployment beyond replacing the file. Adding components, tokens, themes, or pages is non-breaking. Renaming a localStorage key, changing the auth schema, or removing a webhook endpoint is breaking and requires a setup-script migration.

---

## Where this came from

The design language is intentionally derivative of the Mortgage Pipeline Machine (MPM) build. MPM was the first niche dashboard built on this template; MGE is the second. The three pillars (premium-restrained, one-thing-well, data-in-sheets) come straight from MPM. The burgundy accent is the deliberate medspa adaptation — MPM's champagne reads as financial-services neutral; burgundy reads as beauty/hospitality without being pink.

If you're building the third niche dashboard, copy this directory wholesale, swap the accent token, swap the entity vocabulary in `Components.md` and `Patterns.md`, and adjust `Roadmap.md` to your niche's reality.
