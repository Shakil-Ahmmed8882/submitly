# Submitly Frontend — API Contract Audit

> Phase 2 gate of the frontend engineering workflow.
> Checks every screen in [screens-planning.md](./screens-planning.md) against the backend's [api-contract.md](../../submitly-backend/docs/api-contract.md) and the running backend code.
> Last updated: 2026-10-21

---

## Screen → Endpoint Map

| Screen / overlay | Endpoint | Verdict |
|---|---|---|
| `/login` | `POST /auth/login` | Ready |
| `/register` | `POST /auth/register` | Ready |
| `/submit` | `POST /submissions` | Ready (409, 422, 429 all defined) |
| `/my-submissions` | `GET /submissions/mine` | Ready |
| `/dashboard` stats | `GET /submissions/stats` | Ready |
| `/dashboard` table | `GET /submissions?page&limit&status` | Ready (server-side filter and pagination) |
| Review dialog | `PATCH /submissions/:id/review` | Ready (404, 409 handled) |
| Detail dialog | none | Ready, uses the row already loaded |
| Navbar user name | none (from login response) | Gap, see G2 |
| Logout button | none | **Gap G1** |
| Session after refresh | none | **Gap G2** |

---

## Gaps

### G1. No logout endpoint

The `accessToken` cookie is httpOnly, so frontend JavaScript cannot delete it. Without a backend endpoint, Logout cannot actually log anyone out.

**Fix:** add `POST /auth/logout` that clears the cookie. No auth required, returns 200.

### G2. No way to restore the session on refresh

Login returns the user once. After a page refresh the React context is empty, and Next.js middleware cannot read the role from an httpOnly cookie it cannot verify. The navbar name, role guard, and redirect rules all need the current user.

**Fix:** add `GET /auth/me` behind the existing `auth()` middleware, returning `{ user: { id, name, email, role } }`. The frontend calls it on load; a 401 means logged out.

Both fixes are about 15 lines each, reuse existing utilities, and change no current endpoint.

---

## Contract Documentation Mismatches

| Where | Contract says | Backend actually returns | Frontend decision |
|---|---|---|---|
| `GET /submissions` item | `reviewed_by: null` (object) | `reviewed_by_id` string, no object | Type uses `reviewed_by_id`; reviewer name is not displayed in v1 |
| `GET /submissions/mine` item | Subset of fields | All scalar columns | Type the full `Submission`, render only what the screen needs |

The contract doc should be corrected on the backend side so both repos agree.

---

## Verified Behavior (from the backend smoke test)

- Validation errors return 422, not 400
- Duplicate repo returns 409 with message "You've already submitted this repository"
- Reviewing a non-PENDING submission returns 409
- Rate limit returns 429, keyed by user id
- `?status=` accepts only PENDING, APPROVED, REJECTED; anything else is 422
- Pagination meta is `{ page, limit, total, totalPages }`
- Stats shape is `{ pending, approved, rejected, total }`
