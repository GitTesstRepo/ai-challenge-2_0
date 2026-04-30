# Internal Leaderboard Clone

Pixel-focused, responsive clone of the provided internal leaderboard screenshots.

Project planning and design references:
- Main plan: `../DEVELOPMENT_PLAN.md`
- Design description: `../DESIGN_DESCRIPTION.md`

## Stack
- React
- TypeScript
- Vite

## Data Rules
- 100% synthetic data only
- Deterministic seeded generation
- 250 generated users
- No real employee/company data

## Features Implemented
- Top title/subtitle area
- Filters: year, quarter, category
- Search by name, position, department code
- Podium for top 3 users
- Full ranked list
- Row expand/collapse (single expanded row at a time)
- Recent activity table in expanded rows
- Stable sorting by points
- Responsive desktop/mobile layout

## Run Locally
1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Environment Isolation
All dependencies are local to this project in the `node_modules` folder. No global npm package installation is required.

## Suggested GitHub Pages Publish
You can deploy the `dist` output using GitHub Pages (for example via GitHub Actions or `gh-pages`).
