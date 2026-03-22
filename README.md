# Multi-View Project Tracker

A production-ready React + TypeScript project tracker with three synchronized views: Kanban Board, List View, and Timeline View. All views share a single Zustand store — edits in one view are instantly reflected everywhere.

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Folder Structure

```
src/
├── components/     # Reusable UI primitives (Button, Badge, Avatar, Dropdown, etc.)
├── views/          # KanbanView, ListView, TimelineView
├── store/          # Zustand global state
├── hooks/          # usePresenceSimulation, useUrlSync
├── utils/          # dates, filters, url serialization
├── data/           # Seed data generator (500+ tasks, 6 users)
├── types/          # TypeScript interfaces and constants
└── pages/          # Route pages
```

## State Management — Zustand

Zustand was chosen for its minimal API, no boilerplate, and excellent React integration. A single store holds all tasks, filters, sort config, view mode, and presence data. All three views read from the same store, ensuring instant cross-view synchronization with zero refetching.

## Custom Drag-and-Drop (Kanban)

Implemented using Pointer Events API (supports mouse + touch):
1. `onPointerDown` captures offset and starts drag state
2. `onPointerMove` updates cursor position and detects hovered column via `getBoundingClientRect()`
3. `onPointerUp` commits status change if dropped on a valid different column, otherwise snaps back
4. A fixed-position overlay renders the dragged card following the cursor
5. Original position shows a dashed placeholder of equal height
6. Valid target columns receive a subtle highlight ring

## Custom Virtual Scrolling (List View)

Built from scratch without react-window or react-virtualized:
- Fixed row height (52px) enables O(1) index calculation
- Only visible rows + 5 buffer rows above/below are rendered
- Container div has full computed height for correct scrollbar
- Visible slice is offset via `translateY()` for smooth positioning
- ResizeObserver tracks container height dynamically

## Collaboration Simulation

- 4 simulated users randomly "view" tasks, switching every 4 seconds
- Colored avatar indicators appear on task cards being viewed
- Top presence bar shows active viewer count with stacked avatars
- Sometimes two users view the same task to demo avatar stacking

## Performance Considerations

- React.memo on TaskCard prevents unnecessary re-renders
- useMemo for filtered/sorted data derivations
- Virtual scrolling renders ~20 rows instead of 500+
- Zustand's selector pattern minimizes component subscriptions
- No unnecessary state copies or deep clones

## No External Libraries Used For:

- ✅ Drag-and-drop — custom Pointer Events implementation
- ✅ Virtual scrolling — custom scroll math + translateY
- ✅ UI components — all custom (Button, Badge, Avatar, Dropdown, FilterBar, EmptyState)
- ✅ State management — Zustand (the only non-React dependency for state)

## Lighthouse Target

Targeting 85+ performance score via:
- Minimal DOM nodes (virtual scrolling)
- No heavy dependencies
- CSS-only animations
- Efficient re-render patterns
