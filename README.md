# React & MUI Practical Coding Assessment

A Training Schedule List screen built with React, TypeScript, and MUI. There
is no real backend yet, so [Mirage JS](https://miragejs.com/) stands in for
one — the app talks to it through a normal `fetch`-based API layer, so
swapping in a real backend later is a matter of changing a base URL, not
rewriting components.

## Getting started

Requires Node 20+.

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

Other scripts:

```bash
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint       # oxlint
```

## What's here

- **Table** of lessons: trainee, date, time, instructor, vehicle/bus, lesson
  status, attendance status.
- **Filters**: date range, instructor, lesson status, trainee name search
  (debounced).
- **Actions**: view full lesson details in a dialog; mark attendance in a
  modal with required-field validation (a note is required for
  Absent/Late/Excused).
- **UI states**: loading (skeletons), empty, error (with retry), and a
  responsive layout that switches from a table to stacked cards on small
  screens.

## Structure

```
src/
  api/          fetch wrapper + typed lesson API calls (the backend contract)
  mocks/        Mirage JS server + generated mock data
  types/        shared domain types
  features/
    schedule/
      TrainingSchedulePage.tsx   page composition
      components/                filters, table, dialogs, empty/error states
      hooks/                     React Query hooks (lessons, instructors, attendance mutation)
  hooks/        generic hooks (debounce)
  theme/        MUI theme
```

`src/api` is the seam for a real backend: it only knows about
`/api/lessons`, `/api/lessons/:id`, `/api/lessons/:id/attendance`, and
`/api/instructors`. Point `VITE_API_BASE_URL` at a real server and remove
the `makeServer()` call in `main.tsx` and everything above it keeps working
unchanged.

## Trying the error / loading states

Mirage adds ~600ms of latency to every request so loading states are
actually visible. To force a failed request (and see the error state +
retry), open the browser console:

```js
window.__forceScheduleApiError = true   // every /lessons request now fails
window.__forceScheduleApiError = false  // back to normal
```
