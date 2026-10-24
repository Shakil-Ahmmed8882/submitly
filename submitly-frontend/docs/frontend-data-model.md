# Submitly Frontend — Data Model

> Phase 2 of the frontend engineering workflow.
> Source: [api-contract.md](../../submitly-backend/docs/api-contract.md) | [screens-planning.md](./screens-planning.md)
> Last updated: 2026-10-21

---

## API Response Types

These mirror the backend API contract exactly. Never guess — derive from api-contract.md.

```typescript
// Shared envelope
interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: PaginationMeta
}

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Entities
interface User {
  id: string
  name: string
  email: string
  role: "STUDENT" | "MENTOR"
}

interface Submission {
  id: string
  project_name: string
  repo_url: string
  live_link: string | null
  description: string
  status: SubmissionStatus
  review_comment: string | null
  reviewed_by_id: string | null
  reviewed_at: string | null
  user_id: string
  created_at: string
}

// GET /submissions (mentor) adds the student, nothing else
interface SubmissionWithStudent extends Submission {
  user: Pick<User, "id" | "name" | "email">
}

interface Stats {
  pending: number
  approved: number
  rejected: number
  total: number
}

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED"
type Role = "STUDENT" | "MENTOR"
```

---

## Client-Only Types

These do not come from the API. The UI creates and manages them.

```typescript
// Auth session — what the client holds after login
interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

// Filter state — /dashboard filter bar
type StatusFilter = "ALL" | SubmissionStatus

// Pagination state — /dashboard table
interface PaginationState {
  page: number
  limit: number
}

// Review modal state — /dashboard modal
interface ReviewFormInput {
  status: "APPROVED" | "REJECTED"
  comment: string
}
```

---

## Form Input Types (Zod schemas + inferred types)

These are the shapes that react-hook-form manages. They mirror backend validation rules.

```typescript
// /register
interface RegisterInput {
  name: string        // 2–100 chars
  email: string       // valid email, max 255
  password: string    // min 6, max 255
}

// /login
interface LoginInput {
  email: string
  password: string
}

// /submit
interface SubmitProjectInput {
  project_name: string   // 2–100 chars
  repo_url: string       // https://github.com/ prefix, max 500
  live_link?: string     // optional, valid URL if provided
  description: string    // 10–500 chars
}

// /dashboard review modal
interface ReviewInput {
  status: "APPROVED" | "REJECTED"
  comment?: string       // max 500 chars
}
```

---

## View Model Mappings

Where the API value differs from what the UI displays.

| API value | UI display | Where used |
|---|---|---|
| `status: "PENDING"` | Badge: "Pending" (yellow) | `/my-submissions`, `/dashboard` |
| `status: "APPROVED"` | Badge: "Approved" (green) | `/my-submissions`, `/dashboard` |
| `status: "REJECTED"` | Badge: "Rejected" (red) | `/my-submissions`, `/dashboard` |
| `review_comment: null` | Hidden (not rendered) | `/my-submissions` |
| `live_link: null` | "—" or hidden | `/dashboard` table |
| `reviewed_by: null` | Not shown | `/dashboard` (PENDING rows) |

---

## Enums

```typescript
export const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
}

export const STATUS_COLOR: Record<SubmissionStatus, string> = {
  PENDING: "yellow",
  APPROVED: "green",
  REJECTED: "red",
}
```
