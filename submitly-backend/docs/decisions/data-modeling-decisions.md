# Data Modeling Decisions

> 13 decisions made during the data modeling session.
> Date: 2026-10-21

---

## Q1. Should Review be a separate table or fields on Submission?

**Chosen:** Fields on Submission (status, reviewed_by_id, reviewed_at, review_comment).
Review is final in v1, one mentor per submission, no history needed. Separate table adds joins for no benefit at this scope.

---

## Q2. Store mentor's name directly or as a relation?

**Chosen:** Relation (`reviewed_by_id` → User).
Single source of truth — if mentor updates their name, it's reflected everywhere. Prisma `include` makes the join trivial.

---

## Q3. One User table or separate Student/Mentor tables?

**Chosen:** Single User table with a `role` field.
Both roles have identical fields. One auth flow, one login endpoint. Separate tables would duplicate everything.

---

## Q4. Auto-increment integers or UUIDs for IDs?

**Chosen:** UUID.
Prevents ID enumeration (students can't guess other submission IDs). Industry standard for APIs. Slightly larger storage, but negligible at this scale.

---

## Q5. Soft delete, hard delete, or no delete?

**Chosen:** No delete in v1.
PRD has no delete feature. Rejection handles "this shouldn't be here." No delete logic to build or maintain. Can add soft delete in v2 if needed.

---

## Q6. Should `updated_at` be on every table?

**Chosen:** Yes, on every table.
Both User and Submission get updated. Auto-managed by Prisma (`@updatedAt`), zero code overhead, free debugging visibility.

---

## Q7. What indexes beyond Prisma defaults?

**Chosen:** Three indexes:
- `@@unique([user_id, repo_url])` — duplicate prevention + lookup
- `@@index([user_id])` — "my submissions" query
- `@@index([status])` — mentor filter by status and stats `groupBy`

Covers every query in the PRD without over-indexing.

---

## Q8. Should User have back-relations to Submission?

**Chosen:** Yes, bidirectional.
Prisma requires it when Submission references User. Adds `submissions` and `reviewed_submissions` on User, enabling `include` from both directions.

---

## Q9. What fields should User have?

**Chosen:** Minimal — name, email, password, role.
Every field serves a PRD feature. No profile fields (no profile page), no account status (no admin panel). Add via migration if needed later.

---

## Q10. How should the mentor be seeded?

**Chosen:** Environment variables with `upsert`.
Credentials in `.env` (gitignored), not in code. `upsert` prevents crashes on re-run. Shows secure configuration practice.

---

## Q11. Should string fields have database-level length limits?

**Chosen:** Yes, `@db.VarChar()` on all string fields.
Defense in depth — Zod validates first, database enforces as a safety net. Zero runtime cost, protects against bypassed validation.

---

## Q12. Is the stats query clean with review fields on Submission?

**Chosen:** Confirmed — single `groupBy` query on status field.
One query, no joins, uses the status index. Validates the Q1 decision. Separate review table would require 3 queries and an absence check for "pending."

---

## Q13. Native Postgres enums or string fields?

**Chosen:** Native Postgres enums.
2 roles, 3 statuses — all fixed in the PRD. Database enforces valid values, Prisma generates TypeScript types. Adding new values works with normal migrations.
