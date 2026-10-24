# Submitly Frontend — Architecture

> Phase 3 of the frontend engineering workflow.
> Source: [screens-planning.md](./screens-planning.md) | [frontend-data-model.md](./frontend-data-model.md)
> Last updated: 2026-10-21

---

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui |
| Forms | react-hook-form + Zod |
| Server state | TanStack Query (React Query) |
| Client state | React `useState` (local) / URL params (filters, pagination) |
| Shared global state | None needed in v1 — auth user from session context |
| HTTP client | Native `fetch` wrapped in one `apiFetch` utility |

---

## 2. Folder Structure

```
submitly-frontend/
├── docs/                        ← Engineering docs (this file lives here)
├── app/
│   ├── layout.tsx               ← Root layout: providers, preconnect to API
│   ├── (auth)/
│   │   ├── layout.tsx           ← Centered card layout, no nav
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (student)/
│   │   ├── layout.tsx           ← Student nav shell
│   │   ├── submit/page.tsx
│   │   └── my-submissions/page.tsx
│   └── (mentor)/
│       ├── layout.tsx           ← Mentor nav shell
│       └── dashboard/page.tsx
├── components/
│   ├── ui/                      ← shadcn/ui primitives (Button, Badge, Table, Dialog, Toast)
│   └── shared/                  ← App-level shared components (Navbar, StatusBadge, LoadingSpinner)
├── features/
│   ├── auth/                    ← LoginForm, RegisterForm, session context
│   ├── submission/              ← SubmitForm, MySubmissionsTable
│   └── dashboard/               ← StatsCards, SubmissionsTable, ReviewModal
├── hooks/                       ← TanStack Query hooks (one per API endpoint)
│   ├── useMySubmissions.ts
│   ├── useSubmissions.ts
│   ├── useStats.ts
│   ├── useSubmitProject.ts
│   └── useReviewSubmission.ts
├── lib/
│   ├── apiFetch.ts              ← Single fetch wrapper: base URL, cookie, error parsing
│   ├── auth.ts                  ← Session helpers: get session, clear session
│   └── queryClient.ts           ← TanStack Query client config
├── types/
│   └── index.ts                 ← All TypeScript interfaces and enums
├── middleware.ts                 ← Next.js middleware: route protection + role redirect
├── next.config.ts               ← staleTimes, rewrites (API proxy)
└── .env.local                   ← NEXT_PUBLIC_API_URL
```

---

## 3. Rendering Boundaries (Server vs Client)

| Component / Page | Type | Why |
|---|---|---|
| `app/layout.tsx` | Server | No interactivity; sets `<head>`, providers |
| `(auth)/login/page.tsx` | Server shell + Client form | Page is a thin Server Component; form is Client |
| `(auth)/register/page.tsx` | Server shell + Client form | Same pattern |
| `(student)/submit/page.tsx` | Server shell + Client form | Server fetches nothing; form needs state |
| `(student)/my-submissions/page.tsx` | Server Component | Fetches submissions on server for first paint |
| `(mentor)/dashboard/page.tsx` | Server shell | Fetches stats on server; table is Client for filters |
| `features/dashboard/StatsCards` | Client Component | Needs to refetch after mentor actions |
| `features/dashboard/SubmissionsTable` | Client Component | Filters, pagination, review modal — all client state |
| `features/dashboard/ReviewModal` | Client Component | Form, open/close state |
| `features/submission/SubmitForm` | Client Component | Form state, validation, toast on success |
| `features/submission/MySubmissionsTable` | Client Component | Reads from TanStack Query cache |

Rule: a component is Server unless it uses `useState`, `useEffect`, event handlers, or browser APIs.

---

## 4. Data Flow Layers

```
Backend API (Express, port 5000)
    │
    ▼ (HTTP, httpOnly cookie forwarded via Next.js rewrites)
apiFetch (lib/apiFetch.ts)
    │  One function: handles base URL, credentials, JSON parsing, throws ApiError on 4xx/5xx
    │
    ▼
TanStack Query hooks (hooks/*.ts)
    │  One hook per endpoint: owns caching, loading state, error state, invalidation
    │
    ▼
Feature components (features/**/*.tsx)
    │  Read from hooks, render UI, call mutation hooks on user action
    │
    ▼
UI components (components/ui/*, components/shared/*)
    │  Stateless presentational: Button, Badge, Table, Dialog, Toast
    │
    ▼
User sees the rendered page
```

No component fetches directly. No component imports from `lib/apiFetch.ts` directly. The hook is always the bridge.

---

## 5. Auth Strategy

The backend sets an httpOnly `accessToken` cookie on its own domain (`localhost:5000`). The frontend runs on `localhost:3000`. Same-site cookie rules block cross-domain cookies by default.

**Solution: Next.js API rewrites (proxy)**

```typescript
// next.config.ts
rewrites: async () => [
  {
    source: "/api/:path*",
    destination: "http://localhost:5000/api/:path*",
  },
]
```

All fetch calls from the frontend use `/api/v1/...` (not `localhost:5000`). Next.js proxies them to the backend. The browser sees the cookie as same-site — no CORS issue, no SameSite block.

**Route protection: Next.js middleware**

```
middleware.ts intercepts every request:
  - No session → redirect to /login
  - STUDENT hits /dashboard → redirect to /submit
  - MENTOR hits /submit or /my-submissions → redirect to /dashboard
  - Already logged in hits /login or /register → redirect to role home
```

**Session on the client:**

After login, the API response includes `{ user: { id, name, email, role } }`. This is stored in a React context (`AuthContext`) so all components know the current user without re-fetching.

---

## 6. State Ownership

| State | Owner | Why |
|---|---|---|
| Submissions list (mentor) | TanStack Query | Server state, needs cache invalidation after review |
| Stats (mentor) | TanStack Query | Server state, refetches after review action |
| My submissions (student) | TanStack Query | Server state |
| Status filter | URL search param (`?status=PENDING`) | Shareable, survives refresh, syncs with pagination |
| Current page | URL search param (`?page=2`) | Same reason |
| Review modal open/closed | `useState` in ReviewModal | Local UI state, no need to share |
| Review form input | react-hook-form | Form-local |
| Auth user | React context (AuthContext) | Shared across all pages, set once on login |

---

## 7. Error Handling Map

| HTTP status | Where caught | What happens |
|---|---|---|
| 401 | `apiFetch` wrapper | Redirect to `/login`, clear session |
| 403 | `apiFetch` wrapper | Redirect to role home |
| 422 | TanStack Query `onError` in form mutations | Map field errors to react-hook-form `setError` |
| 409 | TanStack Query `onError` in form mutations | Inline message under the relevant field |
| 429 | TanStack Query `onError` in submit mutation | Toast: "Submission limit reached. Try again in 15 minutes." — form stays filled |
| 404 | TanStack Query `onError` | Toast with error message |
| 5xx | `error.tsx` per route group | Fallback error page |
| Network failure | `apiFetch` wrapper | Toast "Something went wrong. Check your connection." |

---

## 8. Performance Rules (applied during build)

- One `<AppLink>` wrapper around `next/link` — adds prefetch on hover/focus. No raw `next/link` in app code.
- Primary nav links use full prefetch so first click is instant.
- `staleTimes: { dynamic: 120 }` in `next.config.ts` — revisits reopen from memory.
- `<link rel="preconnect" href="http://localhost:5000">` in root layout.
- `loading.tsx` per route group — shape-matching skeleton so clicking a nav link never shows a blank page.
- No `&&` with a numeric left side (e.g. `count && <List>` is wrong if count can be 0).
- Independent data fetches start in parallel — no waterfalls.

---

## 9. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Pages | lowercase folder + `page.tsx` | `app/(student)/submit/page.tsx` |
| Feature components | PascalCase | `SubmitForm.tsx`, `ReviewModal.tsx` |
| Hooks | camelCase, `use` prefix | `useMySubmissions.ts` |
| Types | PascalCase interface | `Submission`, `AuthUser` |
| Enums / constants | SCREAMING_SNAKE | `SUBMISSION_STATUS.PENDING` |
| CSS | Tailwind utility classes, no custom CSS files |
| Query keys | string array constant | `["submissions", "mine"]`, `["stats"]` |

---

## 10. Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000   # points to Next.js itself (proxy handles the rest)
```

The actual backend URL lives only in `next.config.ts` rewrites — never exposed to the browser.
