# Study Project Report: Leaderboard Frontend Clone

## Objective
Create a pixel-accurate frontend clone of an internal company leaderboard application while maintaining privacy and security by removing all sensitive data.

## Challenge
The original leaderboard contains real employee names, departments, positions, and internal identifiers that cannot be shared or stored in a public repository. Direct access to the live site was not an option for privacy compliance.

## Approach & Tools

### 1. Data Anonymization via Chrome DevTools
To capture the design and layout without exposing real data, the following technique was used:

**Method:**
- Opened the original leaderboard application in Chrome browser
- Activated Chrome Developer Tools (`F12`)
- Used the **Elements Inspector** to identify and modify DOM elements in real-time
- Systematically replaced all sensitive data:
  - Employee names → generated placeholder names
  - Departments and positions → generic fake titles (e.g., "Position", "DepartmentCode")
  - Avatar images → placeholder avatar URLs or stripped image sources
  - Points and metrics → synthetic realistic values

**Why this works:**
- No permanent changes to the actual system
- Changes exist only in the browser's DOM for this session
- All visual structure, layout, spacing, and styling remain unchanged
- Chrome DevTools inspector allows live editing without affecting the server

### 2. Screenshot Capture of Modified State
Once all real data was replaced with fake equivalents:
- Took 8 reference screenshots at different viewport widths
- Captured key states:
  - Desktop view (wide layout, all filters on one row)
  - Intermediate responsive state (breakpoint where search wraps)
  - Mobile view (stacked layout)
  - Podium section and expanded row details
- Screenshots served as the **single source of truth** for design specification

### 3. Implementation Approach
Using the anonymized screenshots as reference:
- Extracted visual tokens: colors, typography, spacing, border radii, shadows
- Identified responsive breakpoints and layout shifts
- Recreated component structure in React + TypeScript
- Generated synthetic dataset (~250 users) with deterministic seeded generation
- Implemented all interactive features: filtering, search, expand/collapse, sorting

## Data Generation
All data is 100% synthetic and generated programmatically:
- Random name generation (no real employee names)
- Placeholder position/department formats
- Deterministic seeding for stable, reproducible data during development
- No production data, no real organizational information

## Verification Process
- Pixel-by-pixel comparison of screenshots against the implemented clone
- Responsive behavior validation across 777px and 687px breakpoints
- Typography and spacing alignment with reference screenshots
- Interactive state matching (dropdown open/close, row expand/collapse)

## Tools Used
- **Chrome DevTools**: DOM inspection and live element modification
- **Screenshot utility**: Viewport dimension capture and validation
- **React + TypeScript**: Component framework and type safety
- **Vite**: Build tooling and development server
- **CSS Grid/Flexbox**: Responsive layout implementation

## Outcome
A fully functional, privacy-compliant leaderboard frontend that matches the original design and interactions while containing only synthetic, non-sensitive data.
