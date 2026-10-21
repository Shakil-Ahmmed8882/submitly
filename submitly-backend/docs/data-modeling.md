# Submitly Backend — Data Modeling

> Derived from: [prd.md](./prd.md) | Decisions: [data-modeling-decisions.md](./decisions/data-modeling-decisions.md)
> Last updated: 2026-10-21

---

## Entities

| Entity | Purpose |
|--------|---------|
| **User** | Students and mentors. Single table, role-based. |
| **Submission** | A student's project submission. Includes review fields (status, comment, reviewer). |

---

## Enums

```prisma
enum Role {
  STUDENT
  MENTOR
}

enum SubmissionStatus {
  PENDING
  APPROVED
  REJECTED
}
```

---

## Schema

```prisma
model User {
  id                    String       @id @default(uuid())
  name                  String       @db.VarChar(100)
  email                 String       @unique @db.VarChar(255)
  password              String       @db.VarChar(255)
  role                  Role         @default(STUDENT)
  submissions           Submission[] @relation("SubmittedSubmissions")
  reviewed_submissions  Submission[] @relation("ReviewedSubmissions")
  created_at            DateTime     @default(now())
  updated_at            DateTime     @updatedAt
}

model Submission {
  id              String           @id @default(uuid())
  project_name    String           @db.VarChar(100)
  repo_url        String           @db.VarChar(500)
  live_link       String?          @db.VarChar(500)
  description     String           @db.VarChar(500)
  status          SubmissionStatus @default(PENDING)
  review_comment  String?          @db.VarChar(500)
  reviewed_by_id  String?
  reviewed_by     User?            @relation("ReviewedSubmissions", fields: [reviewed_by_id], references: [id])
  reviewed_at     DateTime?
  user_id         String
  user            User             @relation("SubmittedSubmissions", fields: [user_id], references: [id])
  created_at      DateTime         @default(now())
  updated_at      DateTime         @updatedAt

  @@unique([user_id, repo_url])
  @@index([user_id])
  @@index([status])
}
```

---

## Relations

```
User (1) ──────── (*) Submission       "a student submits many projects"
     ↑                    │
     └────────────────────┘            "a mentor reviews many submissions"
       via reviewed_by_id
```

- **User → Submission (submitted):** One-to-many. A student can have multiple submissions. `user_id` on Submission.
- **User → Submission (reviewed):** One-to-many. A mentor can review multiple submissions. `reviewed_by_id` on Submission. Nullable — empty until reviewed.

---

## Indexes

| Index | Type | Serves |
|-------|------|--------|
| `User.id` | Primary key (auto) | All user lookups |
| `User.email` | Unique (auto) | Login, duplicate email check |
| `Submission.id` | Primary key (auto) | All submission lookups |
| `[user_id, repo_url]` | Unique composite | Duplicate submission prevention |
| `[user_id]` | Index | "My submissions" query |
| `[status]` | Index | Mentor filter by status, stats `groupBy` |

---

## Constraints

- `email` is unique — no two users share an email
- `[user_id, repo_url]` is unique — a student can't submit the same repo twice
- `live_link` is nullable — optional field in the submission form
- `review_comment`, `reviewed_by_id`, `reviewed_at` are nullable — empty until a mentor reviews
- `status` defaults to `PENDING`
- `role` defaults to `STUDENT`
- No delete operations in v1 — records are permanent

---

## Seed Data

Mentor account seeded via environment variables:

```env
# .env
MENTOR_NAME=Admin Mentor
MENTOR_EMAIL=mentor@submitly.com
MENTOR_PASSWORD=mentor123
```

```typescript
// prisma/seed.ts
await prisma.user.upsert({
  where: { email: process.env.MENTOR_EMAIL! },
  update: {},
  create: {
    name: process.env.MENTOR_NAME!,
    email: process.env.MENTOR_EMAIL!,
    password: await bcrypt.hash(process.env.MENTOR_PASSWORD!, 10),
    role: "MENTOR",
  },
})
```

`upsert` ensures running the seed multiple times doesn't crash.

---

## Key Queries This Schema Serves

| Query | Used by | How |
|-------|---------|-----|
| Create submission | Student | `prisma.submission.create(...)` |
| Check duplicate | Student submit | `@@unique([user_id, repo_url])` constraint — Prisma throws P2002 |
| My submissions | Student dashboard | `where: { user_id }` — uses `@@index([user_id])` |
| All submissions (paginated) | Mentor dashboard | `findMany` with `skip/take` + optional `where: { status }` |
| Filter by status | Mentor filter | `where: { status }` — uses `@@index([status])` |
| Update status | Mentor approve/reject | `update` with `status`, `review_comment`, `reviewed_by_id`, `reviewed_at` |
| Stats counts | Mentor dashboard | `groupBy({ by: ["status"], _count: { status: true } })` |
