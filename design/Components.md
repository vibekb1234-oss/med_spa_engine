# MGE Component Catalog

Every reusable UI piece in `dashboard/index.html`. If it appears more than once on screen, it's documented here. New components require justification — first ask whether an existing component covers the need.

All values reference `Tokens.md`. No raw hex codes in this file.

---

## App shell

### Topbar
**56px tall.** Fixed top, full width. Holds, in order:

1. **Brand mark** — burgundy circular badge with `MGE` monogram, glows on hover via `--accent-glow`. Clicking returns to Overview.
2. **Status pulse** — 6px dot with the system status color (`--success` / `--warning` / `--danger`) and a 12px ring that pulses at 2.4s when sync is active. Tooltip on hover shows last sync time.
3. **Live clock** — `--font-mono`, 13px. Updates every second. Format: `HH:MM:SS · Mon 21 Jul`. Hidden below 720px viewport.
4. **⌘K search** — 280px pill input on desktop, magnifier icon-only on mobile. Click or `⌘K`/`Ctrl+K` opens the command palette.
5. **Quick-add (`+`)** — icon button. Opens popover with 4 shortcut links to supporting tools.
6. **Notification bell** — icon button with red dot (8px) when unread > 0. Click opens dropdown.
7. **Theme toggle** — sun ⇄ moon icon, 180ms cross-fade. Persists.
8. **User badge** — circular avatar (initial), 28px. Click opens user menu (Profile / Settings / Sign out).

Topbar collapses intelligently below 720px: the live clock is the first to drop, then the search becomes icon-only, then the quick-add merges into the user menu.

### Sidebar
**240px wide on desktop, drawer on ≤768px.** Fixed left.

- Top: same brand mark as topbar (so on mobile drawer the brand still anchors the experience).
- Nav list: 5 items with stroke icon + label.
- Active item gets a 3px-wide `--accent` indicator on the left edge AND a `--accent-glow` background. Inactive on hover gets just the background.
- Footer block: session countdown timer (`--font-mono`, `--text-faint`), workflow count badge (`8 workflows live`), build version.

### Mobile drawer
Slides in from left, 280px wide. Backdrop is `--bg-0` at 0.7 alpha. Close on backdrop click, drawer-link click, or Esc.

---

## Cards & containers

### KPI tile
Used on Overview and Analytics. Anatomy:

```
┌──────────────────────────────────┐
│ LABEL                  ╱╲╱╲╱╲╱╲ │
│                                  │
│ 0042                             │
│                                  │
│ Sub-label · ▲ +12%               │
└──────────────────────────────────┘
```

- Background `--bg-2`, 1px `--border`, radius `--radius-xl`, padding `20px 24px`.
- Label: `--type-meta`, `--text-dim`, uppercase.
- Value: `--type-display-sm`, `--text-strong`, `--font-mono`, tabular-nums, zero-padded to 4 digits.
- Sub-label: `--type-caption`, `--text-dim`, with optional trend delta (▲ green or ▼ red).
- Sparkline: 80×24px SVG top-right, color matches state (success/warning/danger).
- Hover: border lifts to `--border-bright` over 120ms.

**State variants:**
- `kpi--success` (green sparkline)
- `kpi--warning` (amber)
- `kpi--danger` (coral)
- `kpi--neutral` (default `--accent`)

### Panel
Generic container for grouped content (alerts, activity stream, secondary tables).

- Background `--bg-1`, 1px `--border`, radius `--radius-xl`.
- Header: `display:flex`, `padding 20px 24px 14px`, holds title (`--type-heading-3`) + optional action button (right-aligned).
- Body: `padding 4px 24px 24px`. No double-padding when stacking panels — sibling spacing comes from the parent grid.
- `panel--bordered` adds a left accent bar in `--accent` for emphasis (used for Critical Alerts).

### Kanban card
Lives in the Pipeline page columns.

```
┌────────────────────────────────┐
│ Olivia Davis           VIP     │
│ HydraFacial · Last visit 14d   │
│                                │
│ ╲╲ Next appt: Jul 28, 11:00am  │
└────────────────────────────────┘
```

- Background `--bg-2`, radius `--radius-lg`, padding `12px 14px`, 1px `--border`.
- Drag handle is the entire card. `cursor: grab`, `cursor: grabbing` while moving.
- Hover lifts via `transform: translateY(-1px)` + `--shadow-sm`. Active state inverts background to `--bg-3`.
- Top row: client name (15px, `--text-strong`) + status badge (right-aligned).
- Meta row: service · last visit relative time, 12px `--text-dim`.
- Optional info row: next appointment in mono, with leading `╲╲` ascii to anchor the eye.

### Data table
Used on Clients page and inside dossier panels. Anatomy:

- Wrapper: `--bg-1` panel as above.
- `<thead>`: sticky inside the panel body, `--bg-2`, `--type-meta` headers, `--text-dim`, uppercase.
- `<tbody> tr`: 40px tall (compact: 30px), `--border` between rows. Hover `--bg-2`. Selected row `--accent-glow`.
- Cells: `padding: 0 16px`, `--type-small`. First cell often has a small badge prefix.
- Sortable columns get a chevron icon when active, `--text-dim` when not.
- Empty state replaces `<tbody>` with a centered `--type-caption` row, 60px tall.

---

## Atoms

### Badges (status)
Pill, `--radius-pill`, `padding: 2px 10px`, `--type-meta`, leading 6px dot.

| Variant | Color | Use |
|---------|-------|-----|
| `badge-new-inquiry` | `--info` | New Inquiry status |
| `badge-booked` | `--warning` | Booked status |
| `badge-completed` | `--success` | Completed status |
| `badge-vip` | `--vip` | VIP clients |
| `badge-at-risk` | `--warning` | At-risk (60–90d) |
| `badge-lapsed` | `--text-faint` | Lapsed (90+d) |
| `badge-no-show` | `--danger` | Missed appointment |
| `badge-scheduled` | `--info` | Upcoming appointment |
| `badge-cancelled` | `--text-faint` | Cancelled appointment |

### Buttons

**Primary** — `background --accent`, `color --text-strong`, `padding 8px 14px`, `--radius-md`. Hover `--accent-bright`. Used for the single most important action on a screen.

**Secondary** — transparent fill, 1px `--border-bright` border, `color --text`. Hover `--bg-2`. Used for cancel, dismiss, "View all".

**Icon button** — 32×32px (44×44 on mobile), transparent, `color --text-dim`. Hover `--bg-2` + `color --text`. Used for topbar icons, table row actions.

**Back link** — `← Back to Pipeline` style. Leading chevron, `--type-small`, `--text-dim`. Hover `--text`. Lives at the top of any drill-down view.

### Form fields

- Input: `--bg-2` background, 1px `--border`, `--radius-md`, height 36px, padding `0 12px`. `--font-sans` 14px.
- Focus: border `--accent`, shadow `--shadow-glow`.
- Disabled: opacity 0.5, cursor not-allowed.
- Error: border `--danger`. Helper text `--type-caption`, `--danger`, below.
- Label: `--type-meta`, `--text-dim`, uppercase, 6px gap above field.
- Hint (below): `--type-caption`, `--text-faint`.

### Switch / toggle
30×18px pill, `--bg-3` off, `--accent` on. Knob 14×14px white, slides 12px. Used in Settings.

### Tabs
Horizontal list. Inactive: `--type-small`, `--text-dim`, `padding 10px 16px`. Active: `--text-strong`, with `--accent` 2px underline. Hover inactive: `--text`.

---

## Composite components

### ⌘K command palette
Modal centered, 580px wide, max 480px tall. `--bg-1`, `--radius-xl`, `--shadow-xl`.

- Top: input `--bg-2`, 14px `--font-mono`, magnifier icon left, hotkey badge `Esc` right.
- Below: sectioned results list. Section header `--type-meta`, `--text-dim`, `padding 8px 16px`.
- Result row: 40px, icon + label + optional secondary copy + Enter chevron right. Hover/keyboard-active: `--bg-2`.
- Sections in order: **Pages** · **Clients** · **Appointments** · **Actions** (Force Sync, Sign Out, Add Lead).
- Empty state: "No matches for `<query>`" centered with chip suggestions.

Mobile: full-width modal sliding from top.

### Notification dropdown
Anchored to bell icon, 360px wide, max 480px tall, scrollable.

- Header: title + "Mark all read" button.
- Each item: 12px gap, 56px tall, with leading icon (color matches event type), event copy, relative time.
- Read items have 0.6 opacity.
- Footer link: "View activity log".

Persists "seen" timestamps to `mge_notifications_seen` localStorage.

### Quick-add popover
Anchored to + icon, 280px wide.

- 4 link rows, 44px each, with leading icon, label, sub-label.
- Links: New inquiry · Add appointment · Open intake form · Open configurator.

### Embedded assistant (chatbot)
**FAB:** 56×56px circle, `--accent` background, `--shadow-md`, bottom-right `24px` from edges. Chat icon. Pulsing ring 2.4s.

**Panel:** 420×600px desktop, full-screen on mobile. Slides in from right.
- Header: title (`Coral, your concierge`), close X.
- Body: scrollable message list. User bubbles right-aligned `--accent`. Assistant left-aligned `--bg-2`.
- Suggestion chips: pill row above input. Tappable. Updates with context.
- Input: full-width, send button right.

Intent matcher categories (see `Patterns.md` → Assistant flow):
1. Navigation
2. Search
3. Live data
4. System knowledge
5. General conversation (greetings, time/date, math, jokes, encouragement, weather, identity, goodbye)

Fallback: chip suggestions + "I didn't quite catch that — try one of these".

### Toast
Top-right, 320px wide, 56px tall. `--bg-1`, `--shadow-lg`, `--radius-lg`. Leading status icon.
- `toast--success` (green)
- `toast--error` (coral)
- `toast--info` (blue)

Auto-dismiss after 4s. Click X to dismiss early.

### Empty state
Centered in panel body, 200px tall.
- Stroke icon, 48×48px, `--text-faint`.
- Title `--type-heading-3`, `--text-dim`.
- Sub-copy `--type-caption`, `--text-faint`.
- Optional CTA button.

Used when: no clients, no appointments today, no notifications, no search results.

### Loading state
- Inline: 16×16px spinner inside button (replaces label).
- Block: skeleton rectangles in `--bg-2` with subtle pulse, exact dimensions of expected content.
- Page: centered spinner + "Syncing datastore" `--type-caption`.

Skeletons disappear with cross-fade; never snap.

---

## Component anti-patterns

- **Stacking panels with their own padding inside another padded panel.** Choose one parent for spacing.
- **Using a badge for a non-status thing.** If it isn't classifying state, use a tag or just inline copy.
- **Icon-only buttons without `aria-label`.** Always set it.
- **Toast for an error the user needs to act on.** Toasts auto-dismiss; persistent errors belong in an inline alert.
- **Animating layout properties.** Use `transform` and `opacity` only.
- **Hover-only affordances.** Touch users don't have hover; every hover-revealed action also has a tap-state path.
