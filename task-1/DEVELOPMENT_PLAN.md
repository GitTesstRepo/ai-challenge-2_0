# Internal Leaderboard Clone - Development Plan

## 1. Goal
Build a pixel-accurate clone of the provided internal leaderboard screens (4 reference images) with matching behavior for:
- Top podium section
- Filter controls (year, quarter, category)
- Search input
- Ranked list rows
- Expand/collapse details panel
- Sorting and filtering behavior

Constraints:
- Match existing design and interactions only (no extra features).
- Do not use original real data.
- Generate synthetic dataset for about 250 users.
- Keep typography, font sizing, spacing, and indents aligned to screenshots.
- Design must be responsive across desktop and mobile states shown in screenshots.

## 2. Scope Definition
In scope:
- Recreate all visible screens and states shown in the 4 screenshots.
- Implement all demonstrated UI components and interactions.
- Provide generated mock data and deterministic ranking calculations.
- Ensure responsive behavior inferred from screenshots (desktop and mobile layouts).

Out of scope:
- Authentication
- Backend integration with real company systems
- Additional analytics features not shown in screenshots

## 3. Functional Requirements (to implement)
- Display leaderboard title and subtitle.
- Show three filters:
  - Year selector
  - Quarter selector
  - Category selector
- Search employees by name.
- Show top 3 ranked users as a podium block.
- Show full ranked list below with:
  - Rank number
  - Avatar
  - Name + role/department placeholders
  - KPI icons/metrics shown in the screenshots
  - Total points
  - Expand/collapse control
- Expand row to show recent activity table:
  - Activity label
  - Category badge
  - Date
  - Points
- Keep sorting/ranking derived from Year/Quarter/Category filters.
- Apply search as a visibility filter only (no rank re-indexing).
- Under active search, show podium cards only for users that are both in base top-3 and search results.
- Preserve minimum podium container height (`64px`) even when no podium card is visible.
- Support category dropdown values consistent with screenshot style.

## 4. Data Plan (Synthetic Only)
- Generate ~250 users with:
  - Fake full names
  - Placeholder title format (e.g., Position)
  - Placeholder department code format (e.g., DepartmentCode)
  - Avatar URLs (generated or static placeholders)
  - Activity history entries
  - Derived metrics and total points
- Data generation requirements:
  - No real organization names
  - No real employee names
  - No production identifiers
  - Seeded generation for stable local testing

## 5. UX/UI Replication Plan
- Extract visual tokens from screenshots:
  - Font family parity (or closest legally available equivalent)
  - Spacing system
  - Indent and margin values
  - Font sizes/weights
  - Border radius
  - Colors (background, accent blue, podium gold/silver/bronze)
  - Card shadows and borders
- Implement components in this order:
  1. Page shell and typography
  2. Filter/search toolbar
  3. Podium cards and rank badges
  4. Ranked list rows
  5. Expandable recent activity section
  6. Dropdown open state and row expanded state parity with screenshots
- Validate desktop and mobile screenshot parity side-by-side.

## 6. State & Logic Plan
- Single source of truth for leaderboard data.
- Derived selectors for:
  - Active filters
  - Search query
  - Sorted ranking
  - Top 3 extraction
- Interaction state:
  - Open/closed category dropdown
  - Expanded row(s) state
- Deterministic sorting rules (to be confirmed):
  - Primary: total points desc
  - Secondary tie-breakers (explicitly defined)

## 7. Testing & Verification Plan
- Functional verification checklist:
  - Filters apply correctly
  - Search applies correctly
  - Sorting stable and deterministic
  - Expand/collapse behavior works for all rows
  - Top 3 updates according to filtered dataset
- Visual verification:
  - Compare final screens with each reference image
  - Check typography, font size scale, spacing/indents, alignment, color, and icon placement
- Basic responsive checks:
  - Screenshot-equivalent desktop width
  - Screenshot-equivalent narrow/mobile width
  - No layout breakage or overlap at intermediate widths

## 8. Delivery Steps
1. Initialize project structure (if missing) and choose tech stack.
2. Build static UI skeleton matching screenshots.
3. Add generated dataset and ranking logic.
4. Add filters/search/sorting.
5. Add expandable activity details.
6. Tune styling to pixel-match references.
7. Perform final QA pass against all 4 screenshots.

## 9. Open Questions (Need your confirmation)
1. Preferred tech stack: React + TypeScript + Vite, or another stack?
2. Should this be client-only (no backend) with generated local data?
3. Should category/year/quarter options be exactly those visible in screenshots plus generated values, or strictly only visible ones?
4. Expand behavior: allow multiple expanded rows or only one row expanded at a time?
5. Should search match name only, or also title/department text?
6. Is exact icon set required (same icon pack), or visual-equivalent icons acceptable?
7. Do you want a fixed seed for fake data so results never change between reloads?
8. Should we include pagination/virtualization for 250 rows, or keep full list as in screenshot behavior?
9. Any required browser support targets (Chrome only vs broader)?

## 10. Confirmed Decisions
- Tech stack: React + TypeScript + Vite (chosen by implementation owner).
- Deployment target: GitHub Pages.
- Data source: client-side only, generated synthetic data.
- Row expansion behavior: only one row expanded at a time.
- Search scope: name + position + department.
- Year filter options: `All Years` and `2025` only.
- Filter options: fixed to screenshot-visible values only (`Education`, `Public Speaking`, `University Partnership`) plus `All Categories`.
- Data generation stability: fixed seed so data remains stable across reloads.

## 11. Definition of Done
- UI and behavior match screenshots in all provided states.
- Typography, font sizes, spacing, and indents visually match screenshot references.
- All displayed data is synthetic.
- ~250 generated users available and fully functional with filters/search/sorting.
- No extra features beyond screenshot functionality.
- Ready-to-run instructions included.

Fidelity decision lock:
- Prioritize exact screenshot-width/state matching over generalized in-between-width interpolation.

## 12. Design Description Document
- Dedicated design specification file created: `DESIGN_DESCRIPTION.md`.
- This file contains:
  - Visual direction and token-level expectations
  - Locked typography specification (font families, weights, desktop/mobile sizes)
  - Component-level desktop/mobile behavior
  - Screenshot-state parity checklist
  - Current implementation status and remaining tuning work

## 13. Implementation Progress Snapshot
Completed:
- React + TypeScript + Vite project scaffolding in `leaderboard/`.
- Synthetic deterministic data generation (~250 users).
- Leaderboard UI structure: header, toolbar, podium, ranking list, expanded activity table.
- Core interactions: filters, search, sorting, top-3 extraction, single-row expand/collapse.
- Responsive layout for desktop and mobile states.
- Date display format aligned to screenshot style (`DD-Mon-YYYY`).

In progress:
- Final pixel-level tuning for exact typography metrics, spacing, and icon proportions.

Next:
- Complete side-by-side QA against each of the 4 screenshots.
- Freeze style tokens after final parity pass.

## 14. Screenshot Parity Checklist
Target states:
- Screenshot 1 (desktop default view): In progress - structure and hierarchy implemented; minor spacing/icon-size tuning ongoing.
- Screenshot 2 (desktop row expanded): In progress - expanded table and row border behavior implemented; final micro-alignment ongoing.
- Screenshot 3 (desktop category dropdown open): Implemented - dropdown visuals and behavior (open/select/outside click/escape) in place.
- Screenshot 4 (mobile view): In progress - stacked layout and mobile row footer behavior implemented; final spacing tuning ongoing.

Open visual mismatches to resolve next:
- Desktop: final verification of podium badge offset and step-height ratio against screenshot capture.
- Desktop expanded row: final row-by-row baseline check for table text and separators.
- Mobile: final first-row footer icon/value/chevron balance check at screenshot width.

Acceptance close criteria for each screenshot:
- Typography family and size match documented values in `DESIGN_DESCRIPTION.md`.
- Spacing and component proportions visually align with reference at representative viewport widths.
- No overlap/clipping and no missing elements in all captured states.

Latest adjustments (current pass):
- Added dedicated design description document (`DESIGN_DESCRIPTION.md`) and linked it in project docs.
- Refined synthetic data profile to closer screenshot-like scoring ranges.
- Aligned generated name style to placeholder naming convention.
- Tuned responsive CSS edge cases for expanded mobile table readability.

Latest adjustments (current pass + typography lock):
- Added explicit, locked typography specification in `DESIGN_DESCRIPTION.md` (font families, weights, desktop/mobile sizes).
- Synced implementation typography scale and naming style with documentation.
- Updated synthetic employee naming format to screenshot-like placeholders (`Name1 Surname1` pattern).

Latest adjustments (current pass + font-family alignment):
- Updated heading/display font family to `Segoe UI` with generic `sans-serif` fallback.
- Rebalanced title/subtitle, podium, and row-name sizes for stronger parity.
- Synced `DESIGN_DESCRIPTION.md` typography values with current CSS implementation.

Latest adjustments (mobile table + minimum width):
- Fixed mobile expanded activity table: column widths redistributed to (40/27/15/18%) so ACTIVITY gets more room while POINTS stays visible.
- Category pill wraps to max 2 lines on mobile; DATE can wrap into 2-3 lines at narrow widths; POINTS stays one line.
- Horizontal overflow behavior below compact threshold is scoped to full leaderboard row body only.
- Podium keeps fitting behavior on narrow screens via dedicated <=435px scaling, while expanded row details continue fitting viewport width.
- Updated documentation in `DESIGN_DESCRIPTION.md` to reflect scoped overflow and final mobile table column rules.

Latest adjustments (final mobile parity corrections):
- Reverted unintended <=435px scaling on full leaderboard rows and expanded details; kept only podium scaling in that rule.
- Forced RECENT ACTIVITY table headers (`ACTIVITY`, `CATEGORY`, `DATE`, `POINTS`) to 12px across desktop and mobile by removing a <=1200px override.

Latest adjustments (current pass + spacing alignment):
- Tuned podium vertical rhythm (avatar/name/points spacing) and podium block heights to closer match screenshot proportions.
- Adjusted ranked-row inner horizontal padding and right-side metrics/total spacing for desktop parity.
- Added fixed expanded-table column width distribution for ACTIVITY/CATEGORY/DATE/POINTS alignment.
- Refined mobile row footer alignment (metric area and chevron placement) and mobile row/detail paddings.

Latest adjustments (current pass + micro-alignment):
- Shifted podium rank-badge anchor and rebalanced podium step heights for closer screenshot proportion matching.
- Improved expanded activity-table baseline consistency by adding vertical alignment and tighter header padding.
- Fine-tuned mobile footer metric alignment and chevron button sizing/offset to better match the captured mobile state.
- Re-validated production build successfully after these updates.

Latest adjustments (current pass + screenshot-width-first):
- Expanded desktop content span and reduced top/header spacing to align page structure with the captured desktop composition.
- Reduced toolbar control heights and card padding to match the compact screenshot control geometry.
- Rebalanced podium/rows vertical spacing for closer default-state parity at target viewport width.
- Locked mobile footer vertical anchoring to bottom-align icon/value/chevron as seen in the captured mobile state.
- Re-validated production build successfully after this pass.

Latest adjustments (current pass + 1-3px polish):
- Shifted podium badge anchor by 1px for tighter overlap parity on avatar edge.
- Tightened row-card vertical compactness and expanded-table row separator rhythm by 1px.
- Nudged mobile first-row footer baseline (top spacing and chevron vertical offset) for closer screenshot alignment.
- Re-validated production build successfully after this pass.

Latest adjustments (current pass + fixed podium dimensions):
- Locked desktop podium block sizing to exact screenshot dimensions:
  - Rank 1: 280 x 178
  - Rank 2: 280 x 146
  - Rank 3: 280 x 114
- Ensured rank 3 block is lower than rank 2, matching the reference.

Latest adjustments (current pass + podium name section sizing):
- Applied explicit per-rank podium name font sizes:
  - Rank 1 name: 24px
  - Rank 2 name: 20px
  - Rank 3 name: 20px
- Set regular list row name text to 18px.
- Kept podium supporting line (position/department) at 15px.
- Synced these values into `DESIGN_DESCRIPTION.md`.

Latest adjustments (current pass + data and detail consistency):
- Replaced `NameX`/`SurnameX` placeholders with deterministic synthetic random first/last names.
- Restored visible `POINTS` column values in expanded activity rows.
- Expanded details now render all filtered activities (no 4-row truncation).
- Enforced consistency: expanded row count aligns with metric icon counts, and row points sum aligns with displayed TOTAL.

Latest adjustments (current pass + pictogram/category mapping):
- Bound metrics pictograms directly to categories:
  - `tv` icon count = number of `Public Speaking` activities
  - `hat` icon count = number of `Education` activities
  - `smile` icon count = number of `University Partnership` activities
- Updated `DESIGN_DESCRIPTION.md` to document the explicit icon mapping.

Latest adjustments (current pass + variable icon presence):
- Updated synthetic activity generation so each user is assigned a category subset of size 1, 2, or 3.
- Ensured at least one activity per assigned category, so displayed icon presence reliably matches generated category coverage.
- Row metrics can now show one, two, or three icons per user (instead of effectively always two).

Latest adjustments (current pass + final typography micro-tuning):
- Set list TOTAL value font-size to 24px.
- Set list rank number font-size to 24px.
- Tuned podium rank-badge number sizes to 18px (rank 1) and 14px (rank 2/3).
- Tuned podium points values to 20px (rank 1) and 18px (rank 2/3), with star icons scaled proportionally.
- Reduced podium star-to-points spacing to 3px.
- Increased list details chevron visual width and added darker hover/focus state.
- Reduced podium top dark-band height for closer screenshot parity.

Latest adjustments (current pass + layout/interaction parity refinements):
- Normalized filter block fill to pure white and fixed inconsistent control heights.
- Unified all filter caret arrows to consistent visual style/size and then reduced them by 60%.
- Implemented required search behavior: magnifier hides on focus and text starts at left edge.
- Constrained filter block and list section to max width 1154px.
- Added hover-lift shadow behavior to list rows and filter block.
- Set list row minimum height to 96px.
- Refined Public Speaking icon internals (horizontal screen line and vertical/horizontal stand).
- Updated generated avatar hair to centered, symmetric, and lower-height shape above the eyes.
- Updated list TOTAL label size to 10px.

Latest adjustments (current pass + real PNG avatars):
- Added deterministic avatar image generation script: `npm run generate:avatars`.
- Generated 250 PNG avatar files (`128x128`) in `leaderboard/public/avatars` (`avatar-001.png` ... `avatar-250.png`).
- Replaced inline SVG data URLs with static file paths in leaderboard data.
- Avatar assignment now cycles deterministically by user index to keep output stable across runs.
- Upgraded portrait rendering to more human-like synthetic face composition (eyes, brows, nose, shading, optional glasses/facial hair).
- Regeneration clears prior `avatar-###.png` files before writing a fresh deterministic set.

Latest adjustments (current pass + 2025-only data/filter lock):
- Restricted all generated activity dates to 2025.
- Removed 2026 from the year filter while keeping `All Years` available.
- Kept desktop toolbar sizing locked to 120px / 120px / 150px for Year / Quarter / Category, with Search taking the remaining width.
- Synced toolbar control fill to `rgb(235, 235, 237)`.

Latest adjustments (current pass + screenshot-fit audit):
- Increased desktop toolbar card padding to `20px 24px` and radius to `14px` for closer screenshot geometry.
- Locked desktop podium layout to centered `280px` columns instead of fluid-width cards.
- Split podium avatar scale by rank: `124px` for rank 1 and `86px` for ranks 2/3.
- Reduced side podium badges to `40px` while keeping rank 1 at `44px`.
- Removed excess side-podium points-pill width by dropping the old minimum width.
- Tightened desktop row internals: `56px` row avatars, smaller right-side gap, `118px` total block, and `36px` expand button.
- Increased mobile side-podium avatar size to `92px` and slightly widened footer metric spacing for closer small-screen parity.

Latest adjustments (current pass + empty-result screenshot parity):
- Added outer page header text `Company Leader Board 2025` above the main leaderboard card.
- Replaced browser-native search clearing with an explicit right-aligned clear (`x`) button inside the search field.
- Added a dedicated empty-result notice row with info icon and the message `No activities found matching the current filters.`
- Hid the podium section when the filtered result set is empty.

Latest adjustments (current pass + search/podium rank behavior):
- Refactored ranking flow so rank order is computed from dropdown filters first (Year/Quarter/Category), then search narrows visible rows.
- Preserved row and podium rank numbers under search (no re-indexing to 1..N after search filter).
- Updated search-mode podium behavior:
  - 0 matching base-top-3 users -> no podium cards rendered
  - 1 matching base-top-3 user -> single podium card centered
  - 2 matching base-top-3 users -> two podium cards centered side by side
- Locked podium container minimum height to `64px` on desktop and mobile to preserve vertical rhythm when no podium cards are visible.

Latest adjustments (current pass + header/background correction):
- Moved the light background from the global page strip onto a dedicated inner leaderboard panel.
- Kept `Company Leader Board 2025` on the gray page background and moved `Leaderboard` plus subtitle fully inside the light panel.
- Rebalanced the header hierarchy to closer screenshot proportions: outer page heading `34px`, inner leaderboard title `30px`.

Latest adjustments (current pass + activity abbreviation mapping):
- Replaced generic recent-activity title prefixes with category-specific abbreviation pools.
- Locked recent-activity abbreviations to:
  - `[LAB]` for `Education`
  - `[REG]` and `[EDU]` for `Public Speaking`
  - `[UNI]` for `University Partnership`

Latest adjustments (current pass + final layout/detail parity):
- Reduced the main light leaderboard area maximum width to `1204px`.
- Increased the outer page heading `Company Leader Board 2025` to `36px`.
- Updated the rank 1 points pill to background `#fef9c3` and text `#ca8a04`.
- Added subtle vertical gradients to podium block fills and separate gradient treatment for the large podium numerals.
- Kept only the top inset shadow band on podium blocks and removed the blurred outer shadow.
- Tightened the intermediate responsive podium layout so the 3-card group remains centered instead of drifting toward the light-panel edges.
- Preserved mobile filter widths at `120px`, `120px`, and `150px` while allowing the toolbar to wrap across lines.
- Kept mobile filter control height locked to `32px` instead of increasing it.
- Forced long selected category labels to stay on one line with ellipsis.
- Hard-locked the category control to `150px` so selecting `University Partnership` cannot change its width.

Latest adjustments (freeze note + 777px validation):
- Confirmed screenshot parity against `img/sketches/2026-04-30_14-25-55.png` (777px state).
- Locked pre-mobile behavior so Search moves to a separate row at `<=777px` while Year/Quarter/Category stay fixed-width and left-aligned.
- Kept podium in 3-column mode at `777px`; direct switch to stacked podium remains at `<=687px`.
