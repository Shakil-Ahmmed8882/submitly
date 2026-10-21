# Engineering Workflow

The full sequence of building a backend project — from raw requirements to verified, shippable code. Each phase produces a concrete artifact before moving to the next. No phase is skipped.

---

```
PHASE 1: UNDERSTAND
━━━━━━━━━━━━━━━━━━━
  1. Brief             → Raw requirements captured
  2. PRD               → Decisions made, scope locked
  3. Data Modeling      → Tables, relations, constraints

PHASE 2: DESIGN
━━━━━━━━━━━━━━━
  4. API Contract       → Every endpoint defined
  5. Architecture       → Folder structure, middleware, auth flow

PHASE 3: PLAN
━━━━━━━━━━━━━
  6. OpenSpec           → Implementation broken into atomic changes

PHASE 4: BUILD
━━━━━━━━━━━━━━
  7. Project Setup      → Init, deps, config, folder scaffold
  8. Build per Change   → One change at a time, test, commit

PHASE 5: VERIFY
━━━━━━━━━━━━━━━
  9. Manual Testing     → Every acceptance criteria from PRD
 10. Final Review       → Clean up, verify, ship
```

---

---

## Phase 1: Understand

### 1. Brief

**What it is:** The raw, unedited source of requirements. Could be a PDF, a conversation, a Slack thread, a client email. Captured word-for-word into `docs/brief.md`.

**What goes in:**
- Every requirement from the source, exactly as written
- No interpretation, no rewording, no additions
- Format it as clean markdown, but don't change the content

**Output:** `docs/brief.md`

---

### 2. PRD (Product Requirements Document)

**What it is:** The brief, transformed into engineering decisions. Every ambiguity in the brief gets resolved here. Every feature gets broken down into specifics.

**What goes in:**
- Project overview (one paragraph — what and why)
- Roles and permissions (who can do what)
- Feature specs (each feature: inputs, outputs, edge cases, error states)
- User stories ("As a [role], I want to [action], so that [outcome]")
- Acceptance criteria (checkboxes — done means ALL pass)
- Out of scope (what we're NOT building, logged for v2)
- Open questions (things not yet decided)

**How to build it:**
1. Read the brief end to end
2. List every ambiguity — things the brief doesn't answer
3. For each ambiguity, make a decision and document it
4. Write user stories that cover every feature
5. Write acceptance criteria that are testable (yes/no, not subjective)

**Output:** `docs/prd.md`

---

### 3. Data Modeling

**What it is:** The database schema — tables, columns, relations, constraints. Designed to serve every feature in the PRD.

**What goes in:**
- Entity list (what tables exist and why)
- Field definitions (name, type, required/optional, constraints)
- Relations (one-to-many, many-to-many, with reasoning)
- Indexes (what queries need to be fast)
- Enums (status fields, role fields)
- Seed data (what needs to exist before the app runs)

**How to build it — the decision session format:**

Every design choice is presented as a structured question. Three questions are presented at a time so they can be answered in one batch.

Questions are numbered incrementally across the entire session (Q1, Q2, Q3... Q10, Q11...) so you always know how many decisions have been made.

Each question follows this format:

```
## Q[N]. [The actual question as a heading]

A short description: why this question matters and what it affects.

### [Descriptive name of option 1]

Code snippet showing how this looks in practice (Prisma schema, 
JSON structure, or table diagram).

Summary of what this option gives you.

### [Descriptive name of option 2]

Code snippet.

Summary.

### [Descriptive name of option 3]

Code snippet.

Summary.

### Recommendation

Which option is best suited for this project and why. 
Placed at the bottom so it doesn't bias the decision-maker 
before they've read all options.

### Trade-offs

Options NOT chosen are listed first. The chosen option is listed last.
Each trade-off uses the descriptive name (never "Option A" or "Option 1").
Keep each trade-off compact — 2-3 lines max. State what you gain, 
what you lose, and whether the loss matters in our case. No lengthy 
explanations. Example:

- **[Option name]** — Gain: [benefit]. Lose: [cost]. [When it makes sense].
- **[Option name]** — Gain: [benefit]. Lose: [cost]. [When it makes sense].
- **[Chosen option]** — Gain: [benefit]. Lose: [cost, but why it's acceptable].
```

**After the session:** All decisions are logged in `docs/decisions/data-modeling-decisions.md` with the full context — the question, the options considered, what was chosen, and why.

**Output:** `docs/data-modeling.md` + `docs/decisions/data-modeling-decisions.md`

---

---

## Phase 2: Design

### 4. API Contract

**What it is:** Every endpoint the backend exposes, fully defined before writing code. No design decisions should remain when you start implementing.

**What goes in:**

For each endpoint:
- HTTP method and path
- Who can access it (auth requirements, role)
- Request body / query params (with types)
- Success response (status code + shape)
- Every possible error response (status code + message)
- Rate limiting (if applicable)

**How to build it:**
1. Open the PRD — go through each feature and each user story
2. For each action a user can take, define the endpoint
3. Cross-reference with the data model — make sure every field the API returns exists in the schema
4. Cross-reference with the PRD acceptance criteria — make sure every criteria has an endpoint that serves it

**Output:** `docs/api-contract.md`

---

### 5. Architecture

**What it is:** How the codebase is organized — folder structure, middleware chain, request flow, naming conventions, key dependencies.

**What goes in:**
- Folder structure (full tree with annotations)
- Request flow diagram (route → middleware → controller → service → response)
- Middleware chain order
- Auth flow (how tokens work, where they're stored, how roles are checked)
- Naming conventions (files, exports, functions, routes)
- Environment variables
- Key dependencies and why each is chosen

**How to build it:**
1. Start from an existing project that follows the same pattern (if available)
2. Adapt the structure to fit this project's modules
3. Document every convention so there's no guessing during implementation

**Output:** `docs/architecture.md`

---

---

## Phase 3: Plan

### 6. OpenSpec

**What it is:** The implementation plan broken into atomic, ordered changes. Each change is one commit-sized piece of work with clear inputs and outputs.

**What goes in:**
- Ordered list of changes
- Each change specifies: what files to create/modify, what it depends on, what the acceptance test is
- Changes are ordered by dependency — earlier changes don't depend on later ones
- Each change should be independently testable

**How to build it:**
1. Look at the architecture (folder structure) — what needs to exist first?
2. Look at the API contract — which endpoints depend on which?
3. Order: setup → utilities → schema → auth → core features → secondary features
4. Each change should be small enough to review in under 5 minutes

**Output:** `openspec/` (gitignored — this is an implementation tool, not documentation)

---

---

## Phase 4: Build

### 7. Project Setup

- Initialize the project (package.json, tsconfig, deps)
- Create the folder scaffold matching the architecture doc
- Set up Prisma, run initial migration
- Create utility files (appError, catchAsync, sendResponse)
- Seed the database (mentor account)
- First commit: `chore: project setup and scaffold`

### 8. Build per Change

- Pick the next change from OpenSpec
- Implement it
- Test it (manually or with the acceptance criteria from the change)
- Commit with a conventional commit message
- Move to the next change

**Commit style:** conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`). Short, human-sounding messages that describe what changed. No AI references.

---

---

## Phase 5: Verify

### 9. Manual Testing

- Open the PRD acceptance criteria
- Test every single checkbox
- If something fails, fix it and commit the fix separately
- Document anything that wasn't verified (e.g., couldn't test in browser)

### 10. Final Review

- Read through every file for dead code, unused imports, stray console.logs
- Verify .gitignore is correct (no secrets, no AI files)
- Check commit history reads like a clean engineering story
- Ship it

---

---

## Changelog

| Date | What changed |
|------|-------------|
| 2026-10-21 | Initial version — full workflow defined, data modeling session format documented |
