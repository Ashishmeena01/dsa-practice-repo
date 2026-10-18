# ORBITAL — DSA Mission Control

ORBITAL is a focused dashboard for planning data structures and algorithms practice. Browse a curated problem roadmap, filter by topic or difficulty, and keep track of progress in one place.

## Features

- Curated DSA roadmap with LeetCode links and topic tags
- Search, topic and difficulty filters, and problem sorting
- Progress tracking for to do, in progress, and solved problems
- Bookmarks and custom problem links
- Progress saved locally in the current browser
- Light and dark themes
- Interactive 3D mascot and quick navigation through the problem list
- Keyboard shortcut: **Ctrl/⌘ + K** to focus search

## Getting started

### Requirements

- Node.js 20.19+ or 22.12+
- npm

### Install and run

```bash
npm install
npm run dev
```

Vite prints the local development URL after the server starts.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check the application and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Tech stack

- React 19 and TypeScript
- Vite
- Three.js for the interactive 3D mascot
- Lucide for interface icons

## Project structure

```text
src/
  components/       Reusable interface components and 3D mascot
  App.tsx           Dashboard, roadmap data, and interaction state
  App.css           Dashboard layout and component styles
  index.css         Global styles
public/             Static assets and icons
```

## Data and privacy

Progress, bookmarks, and custom problems are stored in the browser's `localStorage`. They are not synced to an account or shared between browsers. Clearing browser storage removes this data.

## License

No license has been specified yet. Add a `LICENSE` file before distributing or reusing this project publicly.
