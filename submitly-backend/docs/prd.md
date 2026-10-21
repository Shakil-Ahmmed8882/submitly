# Submitly — Product Requirements Document

> Source: [brief.md](./brief.md) (Associate Web Instructor Hiring Task)
> Last updated: 2026-10-21

---

## 1. Overview

Submitly is a project submission and review dashboard. Students submit their projects through a form, and mentors review, approve, or reject them from an admin dashboard. The system uses role-based access control to separate the two experiences.

This is a hiring assessment project. The goal is a clean, functional, full-stack app — not an enterprise platform. Every decision below optimizes for clarity, correctness, and simplicity.

---

## 2. Roles & Permissions

| Role | How they join | What they can do |
|------|--------------|-----------------|
| **Student** | Signs up via the signup page | Submit projects, view their own submissions and statuses |
| **Mentor** | Seeded directly in the database | View all submissions (paginated), approve/reject with optional comment, view aggregated stats, filter by status |

- A user has exactly one role: `STUDENT` or `MENTOR`
- No role-switching, no self-promotion
- Mentor accounts are never created through the UI

---

## 3. Feature Specs

### 3.1 Authentication

**Signup (Student only)**
- Fields: Name, Email, Password
- Email must be unique
- Password requirements: minimum 6 characters
- On success: account created with role `STUDENT`, redirect to login
- On failure: inline validation errors (email taken, password too short, etc.)

**Login (Both roles)**
- Fields: Email, Password
- On success: JWT token issued, redirect based on role — students go to submission page, mentors go to dashboard
- On failure: generic error "Invalid email or password" (don't reveal which field is wrong)

**Session**
- JWT stored in httpOnly cookie or localStorage (implementation decision)
- Token contains: userId, role, expiry
- Protected routes check token validity and role before responding

---

### 3.2 Submission Portal (Student View)

**Submit Project Form**
- Fields:
  - Project Name (required, text, max 100 chars)
  - Repository URL (required, must be a valid URL starting with `https://github.com/`)
  - Live Link (optional, must be a valid URL if provided)
  - Description (required, text, min 10 chars, max 500 chars)
- All validation runs on both client (instant feedback) and server (source of truth)
- On success: submission saved with status `PENDING`, success toast, form resets
- On failure: field-level error messages shown inline

**Duplicate Prevention**
- A student cannot submit the same Repository URL more than once
- Two different students can submit the same Repository URL (team/group projects)
- Check: `WHERE repoUrl = ? AND userId = ?` — if exists, reject with "You've already submitted this repository"

**Rate Limiting**
- 3 submissions per 15 minutes per authenticated user
- On limit hit, backend returns `429 Too Many Requests`:
  ```json
  {
    "error": "rate_limit_exceeded",
    "message": "You've reached the submission limit. Please try again after 15 minutes.",
    "retryAfter": 900
  }
  ```
- Frontend: toast message shown, form stays filled (no data loss), submit button disabled
- Resets automatically after the 15-minute window

**My Submissions View**
- Student sees a list/table of their own submissions
- Each row shows: Project Name, Status (Pending / Approved / Rejected), Submitted date
- If mentor left a comment on approve/reject, it's visible here
- Read-only — student cannot edit or delete submissions in v1

---

### 3.3 Review Dashboard (Mentor View)

**Submissions Table**
- Paginated data table, 10 rows per page
- Columns: Student Name, Project Name, Repo URL, Live Link, Status, Submitted Date
- Default sort: newest first
- Server-side pagination (page number and page size sent as query params)

**Filtering**
- Filter by status: All, Pending, Approved, Rejected
- Filters are server-side (query param `?status=approved`)
- Filter selection persists across pagination (page resets to 1 when filter changes)
- Default filter: All

**Approve / Reject Actions**
- Each row has Approve and Reject action buttons
- Clicking either opens a confirmation with an optional comment field
- Comment is optional — mentor can approve/reject without typing anything
- On confirm: status updates immediately, table row reflects the new status without full page reload
- A submission can only be reviewed once — once approved/rejected, the action buttons are replaced with the status badge

**Aggregated Statistics**
- Displayed at the top of the dashboard as stat cards
- Three cards:
  - Total Pending: count of submissions with status `PENDING`
  - Total Approved: count of submissions with status `APPROVED`
  - Total Rejected: count of submissions with status `REJECTED`
- Stats update when the mentor takes an action (approve/reject)

---

## 4. User Stories

### Student
- As a student, I want to sign up so I can access the submission portal
- As a student, I want to log in so I can submit and track my projects
- As a student, I want to submit my project details so my mentor can review them
- As a student, I want to see clear error messages when my form input is invalid
- As a student, I want to be told when I've hit the rate limit instead of getting a confusing error
- As a student, I want to see my submissions and their current status so I know where things stand
- As a student, I want to see mentor feedback if they left a comment on my submission

### Mentor
- As a mentor, I want to log in and land on the review dashboard
- As a mentor, I want to see all student submissions in a paginated table
- As a mentor, I want to filter submissions by status so I can focus on pending reviews
- As a mentor, I want to approve or reject a submission with an optional comment
- As a mentor, I want to see aggregated stats so I know overall progress at a glance

---

## 5. Acceptance Criteria

### Authentication
- [ ] Student can sign up with name, email, password
- [ ] Duplicate email returns a clear error
- [ ] Login returns JWT, redirects based on role
- [ ] Invalid credentials show generic error
- [ ] Protected routes return 401 for unauthenticated requests
- [ ] Protected routes return 403 for wrong role (student accessing mentor routes)

### Submission Portal
- [ ] Form validates all fields on client and server
- [ ] Repo URL must start with `https://github.com/`
- [ ] Duplicate repoUrl for the same student is rejected with a clear message
- [ ] Rate limit blocks 4th submission within 15 minutes
- [ ] Rate limit response preserves form data and shows a toast
- [ ] Successful submission resets the form and shows success feedback
- [ ] Student can view their own submissions with status and mentor comments

### Review Dashboard
- [ ] Table shows all submissions, paginated at 10 per page
- [ ] Server-side filter by status works (All, Pending, Approved, Rejected)
- [ ] Changing filter resets to page 1
- [ ] Approve/Reject updates status and optionally saves a comment
- [ ] Already-reviewed submissions show status badge instead of action buttons
- [ ] Stats cards show correct counts and update after actions

---

## 6. Out of Scope (v2 Candidates)

These features are intentionally excluded from v1. They are logged here so the codebase can be extended to support them later without major rewrites.

| Feature | Why deferred |
|---------|-------------|
| **Resubmission after rejection** | Requires versioning, status transitions, and notification logic. v1 rejection is final. |
| **Star/score rating on submissions** | Current review model is pass/fail (approve/reject). Rating adds ranking complexity. |
| **Signup rate limiting** | 3 signups/hour per IP. Low priority — bot abuse unlikely at this scale. |
| **Login rate limiting** | 5 attempts/5 min per email. Good security practice but not in the brief's scope. |
| **Configurable pagination size** | Dropdown to switch between 10/25/50 per page. Nice UX, not essential. |
| **Charts/graphs in stats** | Visual charts beyond count cards. Adds a charting library dependency for minimal gain. |
| **Email notifications** | Notify student when their submission is reviewed. Requires email service integration. |
| **Search submissions** | Text search across project names, descriptions. Useful at scale, not needed for v1. |
| **Bulk approve/reject** | Mentor selects multiple submissions and acts on all. Power-user feature. |
| **Student profile page** | Dedicated page for student info, submission history. Cards view handles this for now. |
| **Dark mode** | Styling variant. Not a functional requirement. |

---

## 7. Technical Constraints

From the brief — non-negotiable:

- **Language:** TypeScript (frontend and backend)
- **Frontend:** Next.js + TailwindCSS + ShadCN
- **Backend:** Express.js (separate from Next.js)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT-based RBAC
- **Repo:** GitHub, must be public after submission deadline

---

## 8. Open Questions

These are things not yet decided. They'll be resolved during data modeling or implementation.

| # | Question | Notes |
|---|----------|-------|
| 1 | Monorepo or separate repos for frontend/backend? | Monorepo with `/client` and `/server` is simpler for a hiring task |
| 2 | JWT in httpOnly cookie or localStorage? | httpOnly cookie is more secure, localStorage is simpler |
| 3 | How to seed the mentor account? | Prisma seed script or manual SQL insert |
| 4 | Should the backend validate GitHub repo URL exists (HEAD request), or just check URL format? | Format-only is simpler and avoids external API dependency |
| 5 | How should the frontend handle token expiry mid-session? | Silent redirect to login, or show a "session expired" message? |
