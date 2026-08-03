# MGE Design Tokens

The single source of truth for every CSS custom property used in `dashboard/index.html`. Every other design document references the values here. If a value isn't on this page, it does not exist in the system — extend this file before introducing it elsewhere.

---

## Colors — Dark Theme (Default)

| Token | Hex | Where used |
|-------|-----|-----------|
| `--bg-0` | `#0c0a0d` | App background, body |
| `--bg-1` | `#15121a` | Panels, sidebar, modal surfaces |
| `--bg-2` | `#1d1923` | Raised elements (KPI tiles, kanban cards), inputs |
| `--bg-3` | `#26212d` | Hover states on raised elements |
| `--border` | `#221d28` | Panel borders, table dividers, subtle separators |
| `--border-bright` | `#312a3a` | Focused inputs, hover borders, active nav indicator base |
| `--text` | `#ebe6dc` | Body copy, table cells, default labels (warm cream — never pure white) |
| `--text-strong` | `#f7f2e6` | KPI values, headings, primary CTAs |
| `--text-dim` | `#a39c93` | Secondary copy, sub-labels, hints |
| `--text-faint` | `#6b6660` | Disabled, placeholder, low-emphasis metadata |
| `--accent` | `#a85664` | Brand burgundy — primary CTA, active nav, focus rings, brand mark |
| `--accent-bright` | `#c0697a` | Hover state on `--accent`, glow accents |
| `--accent-deep` | `#7e3e4d` | Pressed state, deep-fill icon outlines |
| `--accent-glow` | `rgba(168, 86, 100, 0.18)` | Soft halos behind brand mark, kanban active column |
| `--success` | `#8ec5b6` | "On track", confirmed bookings, completed treatments |
| `--success-deep` | `#557066` | Success badge text |
| `--warning` | `#e8b04d` | At-risk, urgency triggers, pending review |
| `--warning-deep` | `#8a6422` | Warning badge text |
| `--danger` | `#d88775` | No-shows, lapsed, errors |
| `--danger-deep` | `#824032` | Danger badge text |
| `--info` | `#8ab8d8` | New inquiries, neutral status, sync indicator |
| `--info-deep` | `#3f6986` | Info badge text |
| `--vip` | `#d4af6a` | VIP badge gold (warmer than warning) |
| `--vip-deep` | `#7a6233` | VIP badge text |

## Colors — Light Theme

Mirror of the dark scale on warm cream backgrounds. The accent shifts deeper to maintain WCAG AA contrast on light surfaces.

| Token | Hex | Notes |
|-------|-----|-------|
| `--bg-0` | `#f7f3ec` | Body — warm cream, never pure white |
| `--bg-1` | `#fffdf7` | Panels |
| `--bg-2` | `#fbf6ec` | Raised elements |
| `--bg-3` | `#f1ebde` | Hover |
| `--border` | `#e8dfce` | Subtle separators |
| `--border-bright` | `#cfc3ad` | Focus, active borders |
| `--text` | `#1a1518` | Body |
| `--text-strong` | `#0a0508` | Headings, KPI values |
| `--text-dim` | `#5b5048` | Secondary |
| `--text-faint` | `#94897e` | Disabled |
| `--accent` | `#7e3e4d` | Deepened burgundy for AA contrast |
| `--accent-bright` | `#a85664` | Hover |
| `--accent-deep` | `#5a2832` | Pressed |
| `--accent-glow` | `rgba(126, 62, 77, 0.10)` | Halos |
| `--success` | `#557066` | Deepened sage |
| `--warning` | `#8a6422` | Deepened amber |
| `--danger` | `#824032` | Deepened coral |
| `--info` | `#3f6986` | Deepened dusty blue |
| `--vip` | `#7a6233` | Deepened gold |

Theme is toggled by setting `data-theme="light"` on `<html>`. Persisted to `mge_preferences` in localStorage.

---

## Typography

| Token | Value | Notes |
|-------|-------|-------|
| `--font-sans` | `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | All UI copy. Loaded from Google Fonts at weights 400/500/600/700 |
| `--font-mono` | `'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace` | Numerics, timestamps, sheet field labels, system chrome ONLY. Loaded at 400/500/600 |

**There is no serif token. Past attempts at "moments of warmth" with serifs got compared to Times New Roman. Hierarchy comes from size + weight, not family.**

### Type scale (sans)

| Size | Token | Weight | Use |
|------|-------|--------|-----|
| `11px` | `--type-meta` | 500 / uppercase | Section labels, eyebrow text, badge copy |
| `12px` | `--type-caption` | 500 | Hints, secondary metadata |
| `13px` | `--type-small` | 400 | Table cells, dense lists, default sidebar nav |
| `14px` | `--type-body` | 400 | Default body, form inputs |
| `15px` | `--type-body-lg` | 500 | Important body, panel intros |
| `16px` | `--type-heading-3` | 600 | Card titles, modal headings |
| `18px` | `--type-heading-2` | 700 | Page titles |
| `22px` | `--type-heading-1` | 700 | KPI labels above values |
| `34px` | `--type-display-sm` | 700 | KPI values |
| `48px` | `--type-display` | 800 | Empty-state hero numbers, login splash |

Tabular numerics on every number: `font-variant-numeric: tabular-nums`. Letter-spacing -0.01em on all `≥18px` headings.

### KPI value formatting

Zero-padded to 4 digits: `0042` not `42`. This is the only place padding is acceptable in the system. It exists to prevent layout shift on the KPI tiles between empty-state, low-volume, and high-volume.

---

## Spacing

4px grid. Use multiples of 4 only. Tokens cover the common values; arbitrary spacing requires justification.

| Token | Value | Common use |
|-------|-------|-----------|
| `--space-1` | `4px` | Icon-to-label gap, badge padding-y |
| `--space-2` | `8px` | Tight grouping inside a card |
| `--space-3` | `12px` | Form field gap |
| `--space-4` | `16px` | Default panel padding-x |
| `--space-5` | `20px` | Panel padding-y, section gap |
| `--space-6` | `24px` | Page padding, KPI grid gap |
| `--space-8` | `32px` | Page section gap |
| `--space-10` | `40px` | Hero spacing in setup screen |
| `--space-12` | `48px` | Empty-state padding |

---

## Radii

| Token | Value | Use |
|-------|-------|-----|
| `--radius-xs` | `2px` | Inline tags inside copy |
| `--radius-sm` | `4px` | Badges, status pills |
| `--radius-md` | `6px` | Inputs, secondary buttons |
| `--radius-lg` | `8px` | Primary buttons, kanban cards |
| `--radius-xl` | `12px` | Panels, modals |
| `--radius-2xl` | `16px` | Hero panels (login, empty state) |
| `--radius-pill` | `999px` | Sidebar nav highlight, status pulse |

---

## Shadows

Used sparingly. Most depth in MGE comes from background-color shifts and the 1px `--border-bright`, not shadow.

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.18)` | Hover lift on kanban cards (dark theme) |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.24)` | Floating action button |
| `--shadow-lg` | `0 12px 32px rgba(0,0,0,0.32)` | Notification dropdown, quick-add popover |
| `--shadow-xl` | `0 24px 64px rgba(0,0,0,0.4)` | Modals, command palette |
| `--shadow-glow` | `0 0 0 4px var(--accent-glow)` | Focus ring on inputs |

Light theme overrides each shadow with deeper alpha — see Theme block in `dashboard/index.html`.

---

## Motion

| Token | Value | Use |
|-------|-------|-----|
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` | Default easing |
| `--ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Toast in/out, modal in |
| `--duration-fast` | `120ms` | Hover, focus, simple state |
| `--duration` | `180ms` | Page nav, panel show/hide |
| `--duration-slow` | `260ms` | Modal open, kanban card snap |

`@media (prefers-reduced-motion: reduce)` overrides every animation duration to `1ms` and disables transforms on the brand-mark pulse, status-pulse, FAB ring, and KPI sparkline draw.

---

## Z-index

| Token | Value | Layer |
|-------|-------|-------|
| `--z-base` | `1` | Page content |
| `--z-sticky` | `10` | Topbar, sidebar |
| `--z-dropdown` | `100` | Notifications, quick-add, user menu |
| `--z-popover` | `200` | Tooltip |
| `--z-modal-backdrop` | `900` | Backdrop |
| `--z-modal` | `1000` | Modal content, command palette |
| `--z-toast` | `1100` | Toast notifications |
| `--z-fab` | `1200` | Assistant FAB (always on top) |

---

## Density

Default density. Compact density (toggled via Settings → Profile) reduces vertical rhythm by 25%:

| Property | Default | Compact |
|----------|---------|---------|
| Table row height | `40px` | `30px` |
| Sidebar nav item height | `36px` | `28px` |
| KPI tile padding | `20px 24px` | `16px 20px` |
| Panel padding | `20px 24px` | `14px 18px` |
| Form field height | `36px` | `30px` |

Density toggle sets `data-density="compact"` on `<html>`; CSS uses attribute selectors to override.

---

## Accessibility floor

- All interactive elements have a visible focus ring (`--shadow-glow`) — never `outline: none` without a replacement.
- WCAG AA contrast on every text/background pair — verified for both themes. Contrast checks live at the bottom of `dashboard/index.html` in a comment block.
- Tap targets ≥44×44px on touch (mobile breakpoint). Desktop targets ≥32×32px for icon-only.
- All icon buttons have `aria-label`. SVG icons have `role="img"` and `aria-hidden="true"` when decorative.
- Color is never the only signal — every status badge pairs color with a leading icon or short text.
- Sparklines have an accompanying numeric value; they are decorative.

---

## What's NOT a token

- Saturated colors (`#00ff00`, `#ff0000`). The palette is intentionally desaturated and warmed.
- Serif fonts. Anywhere.
- Pure white (`#ffffff`) or pure black (`#000000`). Use `--text` and `--bg-0`.
- Bright shadows. Shadow rgba never exceeds 0.4 alpha.
- Transitions on `width` or `height` (causes layout thrash). Use `transform` and `opacity` instead.
