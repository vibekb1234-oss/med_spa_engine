# Design Assets

This file is the quick design source of truth. For full detail, use `design/Tokens.md`, `design/Components.md`, and `design/Patterns.md`.

## Typography

| Use | Font | Weight | Notes |
|---|---|---:|---|
| Headings | `Geist` | 600-800 | Premium, restrained, clean SaaS-style typography without feeling like generic SaaS. |
| Body copy | `Geist` | 400-500 | Used for paragraphs, labels, cards, buttons, and dashboard copy. |
| Numbers/system labels | `Geist Mono` | 400-600 | Used for KPI values, timestamps, keyboard hints, IDs, sheet fields, and status metadata. |
| Serif fonts | None | N/A | Do not introduce serif fonts. Keep hierarchy from size, weight, spacing, and color. |

Font loading:

- Dashboard: `dashboard/index.html`
- Landing page: `landing/index.html`
- Public shared pages: Google Fonts import plus `assets/brand-tokens.css`

## Brand Colors

### Dashboard App Palette

The dashboard intentionally uses a warmer, deeper burgundy system because it is the product surface a clinic will use every day.

| Token | Value | Use |
|---|---|---|
| `--bg-0` | `#0c0a0d` | App background |
| `--bg-1` | `#15121a` | Main panels and sidebar |
| `--bg-2` | `#1d1923` | Raised cards and inputs |
| `--bg-3` | `#26212d` | Hover and secondary surfaces |
| `--text` | `#ebe6dc` | Body text |
| `--text-strong` | `#f7f2e6` | Headings and key numbers |
| `--text-dim` | `#a39c93` | Supporting copy |
| `--accent` | `#a85664` | Primary burgundy |
| `--accent-bright` | `#c0697a` | Hover and emphasis |
| `--accent-deep` | `#7e3e4d` | Pressed/deep accent |
| `--success` | `#8ec5b6` | Completed/on-track |
| `--warning` | `#e8b04d` | At-risk/pending |
| `--danger` | `#d88775` | Failed/no-show/error |
| `--info` | `#8ab8d8` | Neutral info/new inquiry |
| `--vip` | `#d4af6a` | VIP/gold status |

### Public Marketing Palette

Public pages use `assets/brand-tokens.css`. This palette is slightly brighter for landing-page impact.

| Token | Value | Use |
|---|---|---|
| `--bg-0` | `#0c0b12` | Public page background |
| `--bg-1` | `#15131d` | Public panels |
| `--text` | `#f0eaf0` | Body text |
| `--text-strong` | `#fff7fb` | Hero/headlines |
| `--accent` | `#d94d85` | Marketing CTA pink-magenta |
| `--accent-bright` | `#f07ab0` | Hover/highlight |
| `--accent-deep` | `#9d2f5d` | Deep accent |
| `--teal` | `#55c7b1` | Secondary gradient accent |

### Public Light Theme

Public pages now support a shared light theme through `assets/brand-tokens.css` and `assets/theme.js`.

| Token | Value | Use |
|---|---|---|
| `--bg-0` | `#fbf7f2` | Light page background |
| `--bg-1` | `#fffdf9` | Light panels/cards |
| `--bg-2` | `#f8f0e8` | Raised light surfaces |
| `--text` | `#271b22` | Light body copy |
| `--text-strong` | `#130b10` | Light headings |
| `--accent` | `#9d2f5d` | Light-theme CTA burgundy |
| `--nav-bg` | `rgba(255, 253, 249, 0.90)` | Sticky public nav |

## Gradients

| Name | CSS | Use |
|---|---|---|
| Public page body | `linear-gradient(180deg, var(--bg-0) 0%, #11101a 42%, var(--bg-0) 100%)` | Landing and booking background depth |
| Public light body | `linear-gradient(180deg, #fbf7f2 0%, #fffdf9 46%, #f8f0e8 100%)` | Landing, booking, onboarding, legal light mode |
| Brand mark | `linear-gradient(135deg, var(--accent), var(--teal))` | Logos, avatars, compact brand marks |
| Accent text | `linear-gradient(135deg, var(--accent-bright), var(--teal))` | Hero accent words only |
| Dashboard assistant avatar | `linear-gradient(135deg, var(--accent), var(--accent-bright))` | In-app assistant identity |
| Featured pricing card | `linear-gradient(180deg, var(--bg-1), var(--bg-2))` | Landing pricing emphasis |

## Spacing And Radius

- Base spacing grid: `4px`.
- Standard cards/panels: `8px` to `12px` radius.
- Buttons: `8px` to `10px` radius.
- Inputs: `6px` to `8px` radius.
- Pills: `999px` radius only for badges, tags, and nav highlights.

## Icons

- Dashboard icon buttons are compact on desktop and touch-safe on mobile.
- Desktop icon button size: `34px`; SVG icon size: `18px`.
- Mobile icon button size: `42px`; SVG icon size: `18px`.
- Every icon-only button needs an `aria-label`.

## What Not To Add

- No Tailwind, Bootstrap, or external UI framework.
- No extra theme beyond dark/light unless a client brand demands it.
- No decorative bokeh/orb backgrounds.
- No new font family unless the entire system is intentionally rebranded.
