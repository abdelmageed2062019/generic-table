# Generic Table (Next.js)

## How to Run

Requirements:

- Node.js 18+

Install and start:

```bash
npm install
npm run dev
```

Open:

- http://localhost:3000/en/users-selection
- http://localhost:3000/en/users-expandable
- http://localhost:3000/ar/users-selection
- http://localhost:3000/ar/users-expandable

Other useful scripts:

```bash
npm run lint
npm run build
npm test
```

## Approach

- Next.js App Router with locale segment (`/en`, `/ar`) using `next-intl`.
- RTL/LTR support via a direction provider; UI components use `dir` and direction-aware alignment (`text-start`, etc.).
- Users table is built on TanStack Table + a reusable `DataTable` wrapper (sorting, pagination, selection, expandable rows).
- Two pages are exposed via routes:
  - `/[locale]/users-selection` (row selection)
  - `/[locale]/users-expandable` (expandable rows)
  - The tabs keep the same UI but navigate between these routes.
- Data fetching and mutations use React Query:
  - Query keys are centralized to keep invalidation consistent.
  - Create/Update/Delete invalidate the users cache so the table refreshes.
- Local data is stored in a JSON file via `lowdb` (`data/db.json`) and served through Next.js API routes under `/api/users`.
- CSV export fetches the currently-filtered users and generates a UTF-8 CSV (with BOM for correct Excel/Arabic support).
- Sonner is used for toast notifications on create/delete success and error.
- Create and edit user forms use `react-hook-form` with basic client-side validation (required fields + email format) and translated validation messages (EN/AR).
- Row actions include a centered user details modal with a view mode and an edit mode.
- Error boundary (App Router) is implemented for the locale segment via `app/[locale]/error.tsx`.

## Mock Data Source

- File-backed mock database: [data/db.json](./data/db.json)
- This file is the source of truth for `/api/users` (read/write via `lowdb`).

## Assumptions / Trade-offs

- CSV export fetches a large page size (effectively “all matching rows”) to avoid implementing server-side streaming in this exercise.
- The “database” is file-backed (`lowdb`) for simplicity and portability; it’s not intended for concurrent production workloads.
- Toast messages are intentionally short and generic; detailed error messaging could be added by surfacing API error details.
