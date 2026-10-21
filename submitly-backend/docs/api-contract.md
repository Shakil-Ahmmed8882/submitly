# Submitly Backend — API Contract

> Derived from: [prd.md](./prd.md) | [data-modeling.md](./data-modeling.md)
> Last updated: 2026-10-21

---

## Base

- Prefix: `/api/v1`
- Content-Type: `application/json`
- Auth: JWT via httpOnly cookie (`accessToken`)

## Response Format

All responses follow:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Description of what happened",
  "data": {},
  "meta": {}
}
```

`meta` only present on paginated responses. On errors, `data` and `meta` are omitted.

---

---

## Auth Routes

### POST /api/v1/auth/register

Create a new student account.

**Auth:** None

**Body:**
```json
{
  "name": "Shakil Ahmed",
  "email": "shakil@example.com",
  "password": "secret123"
}
```

**Validation:**
- `name` — required, string, 2–100 chars
- `email` — required, valid email format, max 255 chars
- `password` — required, min 6 chars, max 255 chars

**Success (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Shakil Ahmed",
      "email": "shakil@example.com",
      "role": "STUDENT",
      "created_at": "2026-10-21T10:00:00.000Z"
    }
  }
}
```

**Errors:**
| Status | Message | When |
|--------|---------|------|
| 409 | Email already exists | Duplicate email |
| 422 | Validation error | Invalid/missing fields |

---

### POST /api/v1/auth/login

Log in and receive a JWT cookie.

**Auth:** None

**Body:**
```json
{
  "email": "shakil@example.com",
  "password": "secret123"
}
```

**Validation:**
- `email` — required, valid email
- `password` — required, string

**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Shakil Ahmed",
      "email": "shakil@example.com",
      "role": "STUDENT"
    }
  }
}
```

Sets `accessToken` as httpOnly cookie.

**Errors:**
| Status | Message | When |
|--------|---------|------|
| 401 | Invalid email or password | Wrong credentials (generic, doesn't reveal which field) |
| 422 | Validation error | Invalid/missing fields |

---

### POST /api/v1/auth/logout

Clear the auth cookie and end the session.

**Auth:** None

**Body:** None

**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully"
}
```

---

### GET /api/v1/auth/me

Get the currently authenticated user's profile.

**Auth:** `STUDENT` or `MENTOR`

**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Shakil Ahmed",
      "email": "shakil@example.com",
      "role": "STUDENT"
    }
  }
}
```

**Errors:**
| Status | Message | When |
|--------|---------|------|
| 401 | Not authenticated | No token or invalid token |

---

---

## Submission Routes (Student)

### POST /api/v1/submissions

Submit a new project.

**Auth:** `STUDENT` only

**Rate Limit:** 3 per 15 minutes per authenticated user

**Body:**
```json
{
  "project_name": "Todo App",
  "repo_url": "https://github.com/shakil/todo-app",
  "live_link": "https://todo-app.vercel.app",
  "description": "A full-stack todo application with auth and real-time updates"
}
```

**Validation:**
- `project_name` — required, string, 2–100 chars
- `repo_url` — required, valid URL starting with `https://github.com/`, max 500 chars
- `live_link` — optional, valid URL if provided, max 500 chars
- `description` — required, string, 10–500 chars

**Success (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Project submitted successfully",
  "data": {
    "submission": {
      "id": "uuid",
      "project_name": "Todo App",
      "repo_url": "https://github.com/shakil/todo-app",
      "live_link": "https://todo-app.vercel.app",
      "description": "A full-stack todo application with auth and real-time updates",
      "status": "PENDING",
      "user_id": "uuid",
      "created_at": "2026-10-21T10:00:00.000Z"
    }
  }
}
```

**Errors:**
| Status | Message | When |
|--------|---------|------|
| 401 | Not authenticated | No token or invalid token |
| 403 | Access denied | Not a student |
| 409 | You've already submitted this repository | Same repo_url by same student |
| 422 | Validation error | Invalid/missing fields |
| 429 | You've reached the submission limit. Please try again after 15 minutes. | Rate limited |

---

### GET /api/v1/submissions/mine

Get the logged-in student's own submissions.

**Auth:** `STUDENT` only

**Query Params:** None

**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Submissions retrieved successfully",
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "project_name": "Todo App",
        "repo_url": "https://github.com/shakil/todo-app",
        "live_link": "https://todo-app.vercel.app",
        "description": "A full-stack todo application...",
        "status": "APPROVED",
        "review_comment": "Clean code, well structured",
        "reviewed_at": "2026-10-21T14:00:00.000Z",
        "created_at": "2026-10-21T10:00:00.000Z"
      }
    ]
  }
}
```

**Errors:**
| Status | Message | When |
|--------|---------|------|
| 401 | Not authenticated | No token or invalid token |
| 403 | Access denied | Not a student |

---

---

## Submission Routes (Mentor)

### GET /api/v1/submissions

Get all submissions, paginated, with optional status filter.

**Auth:** `MENTOR` only

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `status` | string | (all) | Filter: `PENDING`, `APPROVED`, `REJECTED` |

**Example:** `GET /api/v1/submissions?status=PENDING&page=1&limit=10`

**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Submissions retrieved successfully",
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "project_name": "Todo App",
        "repo_url": "https://github.com/shakil/todo-app",
        "live_link": "https://todo-app.vercel.app",
        "description": "A full-stack todo application...",
        "status": "PENDING",
        "review_comment": null,
        "reviewed_by_id": null,
        "reviewed_at": null,
        "user": {
          "id": "uuid",
          "name": "Shakil Ahmed",
          "email": "shakil@example.com"
        },
        "created_at": "2026-10-21T10:00:00.000Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "totalPages": 5
  }
}
```

**Errors:**
| Status | Message | When |
|--------|---------|------|
| 401 | Not authenticated | No token or invalid token |
| 403 | Access denied | Not a mentor |
| 422 | Validation error | Invalid status value or page/limit |

---

### PATCH /api/v1/submissions/:id/review

Approve or reject a submission with an optional comment.

**Auth:** `MENTOR` only

**Params:**
- `:id` — Submission UUID

**Body:**
```json
{
  "status": "APPROVED",
  "comment": "Great work, clean architecture"
}
```

**Validation:**
- `status` — required, must be `APPROVED` or `REJECTED`
- `comment` — optional, string, max 500 chars

**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Submission reviewed successfully",
  "data": {
    "submission": {
      "id": "uuid",
      "project_name": "Todo App",
      "status": "APPROVED",
      "review_comment": "Great work, clean architecture",
      "reviewed_by_id": "mentor-uuid",
      "reviewed_at": "2026-10-21T14:00:00.000Z"
    }
  }
}
```

**Errors:**
| Status | Message | When |
|--------|---------|------|
| 401 | Not authenticated | No token or invalid token |
| 403 | Access denied | Not a mentor |
| 404 | Submission not found | Invalid ID |
| 409 | Submission has already been reviewed | Status is not PENDING |
| 422 | Validation error | Invalid status value |

---

### GET /api/v1/submissions/stats

Get aggregated submission counts by status.

**Auth:** `MENTOR` only

**Success (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Stats retrieved successfully",
  "data": {
    "stats": {
      "pending": 12,
      "approved": 45,
      "rejected": 3,
      "total": 60
    }
  }
}
```

**Errors:**
| Status | Message | When |
|--------|---------|------|
| 401 | Not authenticated | No token or invalid token |
| 403 | Access denied | Not a mentor |

---

---

## Endpoint Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | None | Student signup |
| POST | `/api/v1/auth/login` | None | Login (both roles) |
| POST | `/api/v1/auth/logout` | None | Clear session cookie |
| GET | `/api/v1/auth/me` | Any | Get current user profile |
| POST | `/api/v1/submissions` | Student | Submit a project |
| GET | `/api/v1/submissions/mine` | Student | View own submissions |
| GET | `/api/v1/submissions` | Mentor | List all submissions (paginated, filterable) |
| PATCH | `/api/v1/submissions/:id/review` | Mentor | Approve or reject |
| GET | `/api/v1/submissions/stats` | Mentor | Aggregated counts |

**Total: 9 endpoints**
