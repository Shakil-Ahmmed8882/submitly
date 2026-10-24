# Submitly Frontend — Screens Planning

> Phase 1 of the frontend engineering workflow.
> Source: [prd.md](../../submitly-backend/docs/prd.md) | [api-contract.md](../../submitly-backend/docs/api-contract.md)
> Last updated: 2026-10-21

---

## Route Map

| Route | Layout | Role | Page |
|---|---|---|---|
| `/` | none (redirect only) | Any | Redirects by role, or to `/login` |
| `/login` | Auth layout | Public | Login |
| `/register` | Auth layout | Public | Student signup |
| `/submit` | Student layout | STUDENT | Submit project form |
| `/my-submissions` | Student layout | STUDENT | Own submissions + mentor feedback |
| `/dashboard` | Mentor layout | MENTOR | Stats cards + submissions table |
| `not-found` | Root | Any | 404 page |
| `error` | Per route group | Any | Unexpected error fallback |

**Overlays (not routes):** Review dialog (mentor), Submission detail dialog (both roles).

### Redirect Rules

- Unauthenticated user hits a protected route → `/login`
- Authenticated user hits `/login` or `/register` → their role home
- STUDENT hits `/dashboard` → `/submit`
- MENTOR hits `/submit` or `/my-submissions` → `/dashboard`
- After login → STUDENT `/submit`, MENTOR `/dashboard`
- After register → `/login` with success toast
- `/` → role home, or `/login` if unauthenticated
- Any 401 mid-session (expired token) → `/login` with toast "Your session expired. Please log in again."
- Logout → `/login`

---

## Route Groups (Next.js App Router)

```
app/
  (auth)/           ← centered card, no nav
    login/
    register/
  (student)/        ← student nav shell
    submit/
    my-submissions/
  (mentor)/         ← mentor nav shell
    dashboard/
  not-found.tsx
```

---

## Shared Shell Pieces

**Navbar (student layout):** logo, links to Submit and My Submissions, user name, Logout button.
**Navbar (mentor layout):** logo, Dashboard link, user name, Logout button.
**Auth layout:** logo + centered card, link to the sibling page (login ↔ register).

---

## Screen Inventory

### /login

**Who:** Public. Authenticated users are redirected away.

**What the user does:** Enters email and password, submits.

**States:**
- Default: empty form
- Loading: button disabled, spinner
- Error 401: inline "Invalid email or password"
- Error 422: field-level messages
- Session-expired arrival: toast "Your session expired. Please log in again."
- Success: redirect by role

---

### /register

**Who:** Public. Authenticated users are redirected away.

**What the user does:** Enters name, email, password, submits.

**States:**
- Default: empty form
- Loading: button disabled, spinner
- Error 409: "An account with this email already exists"
- Error 422: field-level messages
- Success: redirect to `/login` with toast "Account created. Please log in."

---

### /submit

**Who:** STUDENT only.

**What the user does:** Fills project name, repo URL, live link (optional), description, submits.

**States:**
- Default: empty form
- Loading: button disabled, spinner
- Success: toast "Project submitted successfully", form resets
- Error 422: field-level messages
- Error 409: inline message under repo URL "You've already submitted this repository"
- Error 429: toast with limit message, form stays filled, submit button disabled

---

### /my-submissions

**Who:** STUDENT only.

**What the user does:** Views own submissions, reads mentor feedback, opens a row to see full details.

**Actions:** Open detail dialog. Read-only otherwise (no edit or delete in v1).

**States:**
- Loading: skeleton rows
- Empty: "You haven't submitted any projects yet." + button to `/submit`
- Populated: rows with project name, status badge, submitted date, mentor comment if present
- Error: inline error card with retry

**Per-row:** PENDING yellow, APPROVED green, REJECTED red. Comment shown only when `review_comment` is not null.

---

### /dashboard

**Who:** MENTOR only.

**What the user does:** Reads stats, browses all submissions, filters by status, paginates, reviews pending submissions, opens a row to see full details.

**Actions:**
- Change status filter (All / Pending / Approved / Rejected), page resets to 1
- Paginate (previous / next, 10 per page)
- Approve or Reject a PENDING row (opens review dialog)
- Open detail dialog

**States (stats cards):**
- Loading: skeleton cards
- Populated: Pending, Approved, Rejected, Total
- Refetches after every review
- Error: card-level retry

**States (table):**
- Loading: skeleton rows
- Empty, no filter: "No submissions yet."
- Empty, filter active: "No submissions match this filter." + clear filter button
- Populated: rows with student name, project name, repo URL, live link, status, date, actions
- Error: inline error card with retry

**Per-row:** PENDING shows Approve and Reject buttons. APPROVED or REJECTED shows the status badge only.

---

## Overlays

### Review dialog (mentor)

- Shows project name, the chosen action (Approve or Reject), optional comment textarea (max 500)
- Loading: confirm disabled, spinner
- Success: closes, row updates, stats refetch, toast
- Error 409 (already reviewed): toast "This submission was already reviewed", closes, table refetches
- Error 404: toast, closes, table refetches
- Other error: toast, dialog stays open

### Submission detail dialog (both roles)

The table columns do not include `description`, so it needs a place to be read.

- Shows project name, description, repo URL, live link, status, submitted date
- Shows mentor comment and reviewed date when reviewed
- Mentor view also shows the student's name and email
- Read-only, no loading state (data is already in the row)

---

## System Screens

### not-found (404)
Message, link to role home (or `/login` if unauthenticated).

### error (unexpected failure)
"Something went wrong" with a Try again button. One per route group so the nav shell survives.

---

## User Journeys

### Student, first time
1. `/login`, clicks Register
2. Registers, lands on `/login` with success toast
3. Logs in, lands on `/submit`
4. Submits project, toast, form resets
5. Goes to `/my-submissions`, sees it as PENDING

### Student, after review
1. Logs in, goes to `/my-submissions`
2. Sees APPROVED or REJECTED, reads the comment if any

### Student, rate limited
1. Submits a 4th project within 15 minutes
2. Toast shows the limit message, form stays filled, button disabled

### Mentor, daily review
1. Logs in, lands on `/dashboard`
2. Reads stats, filters to Pending
3. Clicks Approve or Reject, review dialog opens
4. Adds optional comment, confirms
5. Row badge and stats update, paginates on

### Session expiry (both roles)
1. Token expires mid-session, next request returns 401
2. Redirected to `/login` with "Your session expired" toast

---

## Open Items (resolved in API Audit)

- Logout needs a backend endpoint to clear the httpOnly cookie
- Session restore on page refresh needs a way to ask the backend who is logged in
