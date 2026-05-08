# Leaderboard Design Description

This document captures visual and interaction requirements derived from the 4 reference screenshots.

## 0. Fidelity Priority (Locked)
- Primary target: exact visual matching at the captured screenshot viewport states.
- Secondary target: acceptable behavior between breakpoints, without overriding screenshot-state parity.
- When trade-offs are required, screenshot-state alignment takes precedence over generalized interpolation.

## 1. Visual Direction
- Overall tone: clean enterprise dashboard with soft gray page background and white cards.
- Main accent color: bright blue used for stars, icons, points, and active borders.
- Secondary accents: podium gold/silver/bronze cues for top 3 ranks.
- Shape language: rounded cards and pills, thin borders, subtle shadows.

## 1.1 Typography Specification (Locked)
Font families:
- Primary body/UI font: Segoe UI
- Heading/display font: Segoe UI
- Fallbacks:
  - Body/UI: sans-serif
  - Heading/display: sans-serif

Font weights:
- Body text: 400
- Emphasis labels and values: 700
- Strong display emphasis (where used): 900

Desktop font sizes:
- Outer page heading (`Company Leader Board 2025`): 36px
- Page title: 30px
- Subtitle: 14px
- Toolbar selects/search input: 14px
- Category dropdown menu items: 16px
- Podium name (rank 1): 24px
- Podium name (rank 2): 20px
- Podium name (rank 3): 20px
- Podium rank badge number (rank 1): 18px
- Podium rank badge number (rank 2/3): 14px
- Podium position/department: 14px, font-weight 500
- Podium points value (rank 1): 20px
- Podium points value (rank 2/3): 18px
- Podium rank number inside block: 102px
- Podium blocks use subtle vertical gradients rather than flat fills.
- List row rank number: 24px
- List row name: 18px
- List row position/department: 14px
- Metric values: 15px
- Total label: 10px
- Total points value: 24px
- Expanded section title (RECENT ACTIVITY): 14px
- Expanded table header: 12px
- Expanded table body: 14px
- Expanded category pill: 12px

Mobile font sizes:
- Page title: 28px
- Subtitle: 13px
- Toolbar selects/search input: 14px
- Category dropdown menu items: 15px
- Podium name (rank 1): 24px
- Podium name (rank 2): 20px
- Podium name (rank 3): 20px
- Podium position/department: 14px, font-weight 500
- Podium points value (rank 1): 20px
- Podium points value (rank 2/3): 18px
- List row rank number: 24px
- List row name: 18px
- List row position/department: 14px
- Metric values: 14px
- Expanded section title: 14px
- Expanded table header: 12px
- Expanded table body: 13px
- Expanded category pill: 13px

Line-height and letter-spacing:
- Title line-height: 1.05
- Body/default line-height: 1.2 to 1.35 depending on component
- Subtitle letter-spacing: 0.01em
- Total label letter-spacing: 0.04em

## 2. Layout Structure
- A centered content container with large top heading area.
- Outer page heading above the main card: `Company Leader Board 2025`.
- Outer page heading sits on the gray page background.
- Main leaderboard content sits inside a dedicated light panel (`#f8fafc`).
- Main light panel maximum width: `1204px`.
- Main light panel minimum width: `435px`.
- Header area:
  - Title: "Leaderboard"
  - Subtitle: "Top performers based on contributions and activity"
- Toolbar row under header:
  - Year select
  - Quarter select
  - Category select
  - Search field
- Podium section with up to 3 highlighted users (search can reduce visible count).
- Ranked list section with expandable rows.

## 3. Toolbar Requirements
- Toolbar appears as a rounded white card with border and soft shadow.
- Toolbar max width: 1154px.
- Toolbar card radius: 14px.
- Toolbar desktop padding: 20px 24px.
- The leaderboard title and subtitle sit fully inside the light panel above the toolbar.
- 3 select controls use compact rectangular styling.
- Desktop control widths are fixed as follows:
  - Year: 120px x 32px
  - Quarter: 120px x 32px
  - Category: 150px x 32px
- On mobile, these filter widths remain locked and wrap across lines instead of stretching full width.
- Mobile filter layout uses one control per row; Year, Quarter, and Category keep fixed widths and align left.
- On mobile, filter control height remains `32px`.
- Selecting a long label such as `University Partnership` must not change the locked filter width.
- Search field stretches to occupy the largest width in desktop layout.
- Search field flexes to take the remaining toolbar width on desktop.
- All filter controls use fill `rgb(235, 235, 237)`.
- Filter arrows are visually unified across Year, Quarter, and Category.
- Long selected filter labels stay on one line and truncate with `...`.
- Year dropdown includes `All Years` and `2025` only.
- Category dropdown includes:
  - All Categories
  - Education
  - Public Speaking
  - University Partnership
- Dropdown behavior:
  - Opens on click
  - Closes on option select
  - Closes on outside click
  - Closes on Escape key
- Search behavior:
  - On focus, the magnifier icon hides.
  - Input text starts from the left edge of the field.
  - When search text is present, a dedicated clear (`x`) button appears on the right.
  - Search narrows visible rows only and does not recalculate leaderboard rank values.

## 4. Podium Requirements
- Top 3 users appear in this visual order (left-center-right): rank 2, rank 1, rank 3.
- Desktop podium columns are fixed at 280px each and centered as a 3-column group.
- Desktop podium block dimensions are fixed as follows:
  - Rank 1 block: 280px x 178px
  - Rank 2 block: 280px x 146px
  - Rank 3 block: 280px x 114px
- Podium avatar sizes:
  - Rank 1 avatar: 124px
  - Rank 2 avatar: 86px
  - Rank 3 avatar: 86px
- Podium rank badge sizes:
  - Rank 1 badge: 44px
  - Rank 2/3 badge: 40px
- Center card (rank 1) visually dominates with:
  - Gold avatar ring
  - Gold rank badge
  - Taller podium block
  - Points pill background `#fef9c3` with text `#ca8a04`
  - Gold gradient numeral inside the podium block
- Side cards (rank 2 and rank 3):
  - White avatar ring
  - Neutral podium block tone
  - Silver/bronze rank badges
  - Cool gray-blue gradient numeral inside the podium block
- Podium blocks keep only a subtle top inset shadow band; no blurred outer shadow is used.
- At intermediate widths, all three podium blocks shrink proportionally together while staying centered with side breathing room.
- The podium switches directly from 3 columns to 1 column at about `687px`.
- Podium container minimum height is locked to `64px` on both desktop and mobile.
- Podium behavior under active search:
  - Evaluate podium membership from base top-3 after Year/Quarter/Category filters.
  - Show only users that are both in base top-3 and current search results.
  - If one podium user matches search, render that single podium card centered.
  - If two podium users match search, render both cards side by side and centered.
  - If no podium users match search, keep the podium area empty while preserving the `64px` minimum height.
- Each podium card includes:
  - Avatar
  - Name
  - Position and department code
  - Points pill with star icon

## 5. Ranked List Row Requirements
Each row includes:
- Rank number
- Avatar (`56px` desktop)
- Employee name
- Position + department code
- Metrics area (learning/sessions icons with values)
- Icon mapping:
  - `hat` icon count maps to `Education` activities.
  - `tv` icon count maps to `Public Speaking` activities.
  - `smile` icon count maps to `University Partnership` activities.
- Users may show 1, 2, or 3 metric icons depending on which categories are present.
- TOTAL points value with star icon
- Expand/collapse circular button
- Expand/collapse circular button size: `36px` desktop
- Expand/collapse arrow darkens on hover/focus for better state affordance.
- On mobile narrow layouts, the expand/collapse arrow is pinned to the visible right edge; at `<=230px` viewport width, pinning is disabled and the arrow can overflow with row content.
- Row block minimum height: 96px.
- List section max width: 1154px.
- Row and filter cards lift with stronger shadow on hover.

Expanded row state includes:
- Blue border emphasis around expanded card
- "RECENT ACTIVITY" label
- Table with columns:
  - ACTIVITY
  - CATEGORY
  - DATE
  - POINTS
- Table shows all filtered activities for the selected user (no fixed row truncation).
- Recent activity title abbreviations follow category mapping:
  - `[LAB]` for `Education`
  - `[REG]` and `[EDU]` for `Public Speaking`
  - `[UNI]` for `University Partnership`
- Category rendered as rounded pill.
- Date format: `DD-Mon-YYYY` (example: `14-May-2025`).
- Points shown with leading plus sign.
- Consistency rule: expanded row count equals (`hat` + `tv` + `smile`) icon counts combined.
- Consistency rule: sum of row points equals displayed TOTAL points.

Empty result state:
- Empty result state applies only when no rows match the active filters/search.
- A compact notice row is shown with an info icon and the message: `No activities found matching the current filters.`

## 6. Data and Content Rules
- No real names, titles, or department names from source system.
- Data must be synthetic and deterministic.
- User count target: about 250 users.
- All generated activity dates are restricted to 2025.
- Avatar assets are generated locally as synthetic PNG portraits (`128x128`).
- Avatar files are stored in `leaderboard/public/avatars` as `avatar-001.png` ... `avatar-250.png`.
- Avatar assignment is deterministic and index-based to keep visuals stable across reloads.
- Search scope includes:
  - Name
  - Position
  - Department code
- Rank consistency rule: displayed row rank and podium rank reflect dropdown-filtered leaderboard order (Year/Quarter/Category) and are not re-indexed by search.
- One row expanded at a time.

## 6.1 Minimum Width and Scroll Behavior (Locked)
- Reference compact-width threshold: `435px`.
- Below `435px`, horizontal overflow behavior is scoped to the full leaderboard row body area only (identity/metrics/controls block).
- Podium and expanded row details should continue fitting the viewport (scale down/reflow as needed) rather than forcing page-level horizontal overflow.

## 7. Responsive Behavior
Desktop:
- Toolbar displayed in a single row.
- Podium shown as 3 columns.
- Rows remain compact with right-side totals and controls.

Validated intermediate state (777px reference):
- Year, Quarter, and Category remain on the first row with fixed widths (`120px`, `120px`, `150px`) and left alignment.
- Search control moves to a separate second row and spans full available toolbar width.
- Podium remains in 3-column mode at this width.

Mobile:
- Mobile breakpoint is approximately `687px`.
- Toolbar uses one control per row with Year/Quarter/Category left-aligned at fixed widths.
- Podium stacks cards while preserving 1st/2nd/3rd visual semantics.
- Row body reflows:
  - Identity block on top
  - Footer area with metrics and expand control
  - Total block minimized/hidden to match reference behavior
- Expanded details card keeps stable outer borders within the viewport.
- Expanded table content may overflow horizontally inside the details card at narrow widths.
- Overflow progression is right-to-left by table columns (POINTS first, then DATE, then CATEGORY) as width decreases.
- Horizontal scrollbar for expanded table overflow is visible at the bottom of the details card.
- Mobile expanded table column widths (fixed layout): Activity 40%, Category 27%, Date 15%, Points 18%.
- Category pill text wraps to a maximum of 2 lines on mobile.
- Date cell wraps across lines on mobile (2-3 lines are acceptable at narrow widths).
- Points cell is always kept on one line (`white-space: nowrap`).

## 8. Pixel-Precision Checklist
- Typography hierarchy and weights match screenshots.
- Spacing and indents around title, toolbar, and rows are consistent.
- Card radius, border color, and shadows are visually aligned.
- Podium heights and rank badge placement are aligned.
- Podium block dimensions match 280x178 (rank 1), 280x146 (rank 2), and 280x114 (rank 3).
- Expanded row table alignment and line separators match.
- Mobile view has no overlap, clipping, or broken alignment.

## 9. Current Implementation Status
Implemented:
- All major sections from screenshots.
- Filtering, search, sorting, top-3 extraction.
- Single-row expand/collapse behavior.
- Deterministic synthetic data generation (~250 users).
- Deterministic PNG avatar asset generation (250 files) with stable index-based assignment.
- Avatar style upgraded to more human-like synthetic portraits (still clearly unreal and non-photographic).
- Synthetic user naming uses realistic random first/last-name combinations (still fully synthetic).
- Dropdown open/close behavior parity improvements.
- Date formatting alignment to screenshot style.
- Responsive layout with mobile-specific row adjustments.

Remaining tuning:
- Final side-by-side visual QA pass per screenshot state.

Latest behavior decisions (locked):
- Search preserves rank numbers from dropdown-filtered leaderboard order.
- Podium under search shows only matching users from the base top-3 (0/1/2/3 cards).
- Podium container keeps `min-height: 64px` even when no podium cards are displayed.
