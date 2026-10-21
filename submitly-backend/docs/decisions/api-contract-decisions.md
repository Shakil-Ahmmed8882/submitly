# API Contract Decisions

> 3 decisions made during the API contract session.
> Date: 2026-10-21

---

## Q1. One review endpoint or separate approve/reject endpoints?

**Chosen:** One endpoint — `PATCH /submissions/:id/review` with `status` in body.
Approve and reject have identical logic (update status, save comment, set reviewer). One route, one handler, Zod validates the status value. No duplication.

---

## Q2. How should "my submissions" be accessed?

**Chosen:** Dedicated path — `GET /submissions/mine`.
Clean separation from the mentor's listing endpoint. No branching logic in controller. No conflict with `:id` param since `mine` isn't a valid UUID.

---

## Q3. Should stats be a separate endpoint or part of the list response?

**Chosen:** Separate endpoint — `GET /submissions/stats`.
Independent caching and refreshing. Doesn't break the `sendResponse` format. Both queries run in parallel from the frontend on page load.
