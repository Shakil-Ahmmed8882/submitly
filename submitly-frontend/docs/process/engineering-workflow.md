# Frontend Engineering Workflow

The full sequence of building a frontend project **when the backend is already done** — from the existing backend foundations to a verified, shippable UI. Each phase produces a concrete artifact before moving to the next. No phase is skipped.

This is the frontend mirror of the backend `engineering-workflow.md`. The backend starts from a raw brief; the frontend starts from the backend's finished brief, PRD, data model, and API contract. The frontend does **not** redo those — it reads them and translates them into UI concerns.

---

```
PHASE 1: UNDERSTAND
━━━━━━━━━━━━━━━━━━━
  1. Reuse backend Brief + PRD    → No rewrite. Read as source of truth.
  2. Screens Planning    → Every route, role access, states, flows

PHASE 2: DESIGN
━━━━━━━━━━━━━━━
  3. Frontend Data Modeling       → TS types from the API + client-only state
  4. API Contract Audit           → Confirm the API serves every screen
  5. Frontend Architecture        → Folders, Server/Client, data flow, auth

PHASE 3: PLAN
━━━━━━━━━━━━━
  6. OpenSpec                     → Vertical feature slices, dependency-ordered

PHASE 4: BUILD
━━━━━━━━━━━━━━
  7. Project Setup                → Init, deps, config, scaffold, proxy
  8. Build per Slice              → One slice at a time, typecheck, commit, push

PHASE 5: VERIFY
━━━━━━━━━━━━━━━
  9. Browser Testing              → Golden path + edge cases per PRD
 10. Final Review                 → Clean up, perf/a11y pass, ship
```

---

---

## Phase 1: Understand

### 1. Reuse Backend Brief + PRD

**What it is:** The frontend does not get its own brief or PRD. The backend's `brief.md` and `prd.md` already define the product, the roles, the features, and the acceptance criteria. They are copied into the frontend `docs/` folder as read-only source of truth.

**What goes in:**
- `brief.md` — copied verbatim from the backend
- `prd.md` — copied from the backend (already covers both sides)
- `api-contract.md` — copied from the backend (read-only reference for every call)

**Why no frontend PRD:** Writing a second PRD duplicates decisions already locked. The frontend's real Phase 1 artifact is the screen inventory, not a new PRD.

**Output:** `docs/brief.md`, `docs/prd.md`, `docs/api-contract.md` (all carried from backend)

---

### 2. Screens Planning

**What it is:** The list of every page the UI needs, who sees it, what they can do, and what every state of that page looks like. This replaces "define the product" (already done) with "define the surface the user touches."

**What goes in:**
- Route map (every URL, its layout, its required role)
- Route groups (how Next.js App Router groups routes by role/layout)
- Redirect rules (401 → login, wrong role → role home, post-login destination)
- Screen inventory — for each screen:
  - Who sees it
  - What the user does on it
  - What actions it has
  - All states: loading, empty, success, error, unauthorized
- User journeys (step-by-step flows per role)

**How to build it:**
1. Open the PRD — list every feature a user can reach
2. Turn each feature into one or more routes
3. For each route, write out all states (never discover an empty/error state during coding)
4. Write the redirect rules that connect the routes
5. Walk each role's journey end to end to catch missing screens

**Output:** `docs/screens-planning.md`

---

---

## Phase 2: Design

### 3. Frontend Data Modeling

**What it is:** Not a second database schema. It models what the UI needs to hold — the API response shapes as TypeScript types, plus the client-only state the API never sends.

**What goes in:**
- API response types (mirror the API contract exactly — never guess)
- The shared envelope type (`ApiResponse<T>`, pagination meta)
- Client-only types (filter state, pagination state, auth session)
- Form input types (one per form, mirroring backend validation)
- View model mappings (where an API value differs from what's displayed — e.g. `null` → "Unassigned")
- Enums and status maps (status → label, status → badge color)

**How to build it:**
1. Open the API contract — create a TS interface for every response shape
2. For each form, derive an input type from the backend validation rules
3. List the client-only state each screen needs (filters, pagination, modals)
4. Note every place the UI transforms an API value before showing it

**Rule:** API DTOs and UI view models can differ. Don't duplicate every backend type blindly — only model what the UI actually renders.

**Output:** `docs/frontend-data-model.md` (+ TypeScript types during build)

---

### 4. API Contract Audit

**What it is:** A verification gate. Before building, confirm the existing backend can serve every screen defined in Phase 1. Catch missing endpoints, missing query params, or shape mismatches now — not during coding.

**What goes in:**
- A map of screen → endpoint (which screen calls which endpoint)
- Confirmation that each endpoint supports what the screen needs (server-side filter? pagination? the exact fields the table shows?)
- Any gap flagged as a contract change on the backend (documented, not silently worked around)

**How to build it:**
1. For each screen in the inventory, list the data it needs
2. Find the endpoint that serves it in the API contract
3. Verify the method, params, and response shape match the need
4. If a screen needs something no endpoint provides (e.g. server-side filtering), flag it — do not fake it client-side

**Gate:** Resolve missing or contradictory backend capabilities before depending on them.

**Output:** Screen → endpoint map (section in `frontend-architecture.md` or its own note)

---

### 5. Frontend Architecture

**What it is:** How the codebase is organized and how data moves through it. The highest-leverage phase — every mistake here repeats in every feature. Decided before any file is created.

**What goes in:**
- Stack table (framework, styling, UI kit, forms, state libraries)
- Folder structure (full tree with annotations)
- Rendering boundaries (which components are Server, which are Client, and why)
- Data flow layers (API client → query hooks → feature components → UI components)
- Auth strategy (how the httpOnly cookie reaches the frontend; route protection; session shape)
- State ownership (server state, URL state, local state, shared state — who owns what)
- Error handling map (every HTTP status → where caught → what the user sees)
- Performance rules (prefetch wrapper, loading.tsx, staleTimes, preconnect, no waterfalls)
- Naming conventions
- Environment variables

**How to build it:**
1. Pick the architecture style — feature-based at the route level, layered within each feature (default)
2. Decide the data flow layers so no component ever fetches directly
3. Settle the auth strategy first — it's the riskiest decision (cross-domain cookie → Next.js proxy)
4. Assign every kind of state to exactly one owner
5. Apply React/Vercel best practices as architectural rules here, enforced during build

**Rule:** Add a layer (service, repository, abstraction) only when it gives real separation or reuse — not because a diagram says so. Smallest structure that keeps responsibilities clear.

**Output:** `docs/frontend-architecture.md`

---

---

## Phase 3: Plan

### 6. OpenSpec

**What it is:** The implementation plan broken into **vertical feature slices**, dependency-ordered. A slice is a feature that works end to end (UI + API call + states + tests), not a horizontal layer.

**What goes in:**
- Ordered list of slices
- Group 1 is always foundation (project setup, apiFetch, types, auth middleware, shared UI, loading skeletons)
- Each later group is one feature vertical (auth pages, student pages, mentor pages)
- Each slice specifies: what files, what data/hook, what component, what states, what completion test
- Slices ordered by dependency — no slice depends on a later one

**How to build it:**
1. Look at the architecture — what foundation must exist before any feature?
2. Look at the screen inventory — group screens into feature verticals
3. Order: foundation → auth → student features → mentor features
4. Each slice small enough to review in a few minutes and commit on its own

**Rule:** Build vertical slices, not all components first. "Task assignment" means the dialog, the mutation, the permission behavior, the pending/error states, and the cache update — not just the dialog.

**Output:** `openspec/` (gitignored — implementation tool, not documentation)

---

---

## Phase 4: Build

### 7. Project Setup

- Initialize Next.js (App Router, TypeScript, Tailwind)
- Install deps (shadcn/ui, TanStack Query, react-hook-form, zod)
- Create the folder scaffold matching the architecture doc
- Configure `next.config.ts` (API rewrites/proxy, staleTimes)
- Set up the TanStack Query provider and AuthContext
- Create `apiFetch`, the base types, and shared UI primitives
- First commit + push: `chore: project setup and scaffold`

### 8. Build per Slice

- Pick the next slice from OpenSpec
- Implement it end to end (UI → hook → API → states)
- Apply the architecture's performance rules as you write
- Run `tsc --noEmit` (and lint) before committing
- Commit with a conventional message, then **push immediately** — never leave work local
- Move to the next slice

**Commit style:** conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`). Short, human-sounding. No AI references.

---

---

## Phase 5: Verify

### 9. Browser Testing

- Open the PRD acceptance criteria
- Golden path in a real browser, per role: register → login → submit → review → see result
- Edge cases: wrong role access, empty states, 422 form errors, 409 duplicate, 429 rate limit, API down
- Check the server/network tab for serial requests that should be parallel
- Role-based checks: a student must never reach a mentor screen or action
- Document anything not verified in a browser

**Security rule:** Hiding a button is not authorization. The backend enforces access control; the frontend only reflects it.

### 10. Final Review

- Read every touched file for dead code, unused imports, stray `console.log`
- Performance/accessibility pass: measure real bottlenecks before micro-optimizing; check keyboard nav, focus, contrast, semantic HTML
- Verify `.gitignore` (no secrets, no AI files, CLAUDE.md / .claude / openspec excluded)
- Check commit history reads like a clean engineering story
- Ship it

---

---

## The Reusable Flow (save this)

```
📄 Reuse backend Brief + PRD
   ↓
🧭 Screens Planning
   ↓
🧱 Frontend Data Modeling
   ↓
🔌 API Contract Audit
   ↓
🏗️ Frontend Architecture
   ↓
📝 OpenSpec (vertical slices)
   ↓
🛠️ Build per slice (commit + push each)
   ↓
🧪 Browser testing (golden path + edge cases)
   ↓
🚀 Final review & ship
```

Three rules that prevent most repeated mistakes:

- **Don't code before resolving API and UI assumptions.** A missing endpoint found mid-build should trigger a documented contract change, not a client-side hack.
- **Don't overengineer the architecture.** Smallest structure that keeps responsibilities clear and can grow.
- **Don't treat testing and performance as final-day work.** Test each slice as it's built; apply performance rules while coding, measure before release.

---

## Changelog

| Date | What changed |
|------|-------------|
| 2026-10-21 | Initial version — frontend workflow defined as the mirror of the backend process, for an existing-backend project. |
