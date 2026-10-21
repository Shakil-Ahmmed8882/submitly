# Submitly Backend

REST API for a project submission and review dashboard. Students submit projects; mentors approve or reject them.

**Stack:** TypeScript, Express 5, PostgreSQL, Prisma 6, Zod 4, JWT (httpOnly cookie)

## Getting started

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npx prisma migrate dev      # create tables
npx prisma db seed          # create the mentor account
npm run dev                 # http://localhost:5000
```

## Environment variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/submitly` |
| `JWT_SECRET` | Secret used to sign tokens | long random string |
| `JWT_EXPIRES_IN` | Token and cookie lifetime (`30m`, `12h`, `7d`) | `7d` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:3000` |
| `MENTOR_NAME` | Seeded mentor name | `Admin Mentor` |
| `MENTOR_EMAIL` | Seeded mentor login email | `mentor@submitly.com` |
| `MENTOR_PASSWORD` | Seeded mentor login password | `mentor123` |

Mentors are never created through signup; the seed script creates the account from these variables.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start with auto-reload |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled build |
| `npx prisma studio` | Browse the database |

## API

Base path: `/api/v1`. Auth is a JWT in an httpOnly `accessToken` cookie (a `Bearer` header also works).

| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Student signup |
| POST | `/auth/login` | Public | Login, sets the cookie |
| POST | `/submissions` | Student | Submit a project (3 per 15 min per user) |
| GET | `/submissions/mine` | Student | Own submissions |
| GET | `/submissions` | Mentor | All submissions, paginated; `?page=&limit=&status=` |
| PATCH | `/submissions/:id/review` | Mentor | Approve or reject, optional comment |
| GET | `/submissions/stats` | Mentor | Counts by status |

Responses use one shape: `{ success, statusCode, message, data, meta? }`. Validation errors return `422`.

Full request and response details are in [docs/api-contract.md](docs/api-contract.md).

## Project structure

```
src/
  server.ts            entry point
  app.ts               middleware chain and route mounting
  app/
    config/            environment variables
    lib/               Prisma client
    middleware/        auth, validation, rate limits, error handling
    utils/             AppError, catchAsync, sendResponse, jwt
    module/
      auth/            route -> controller -> service
      submission/      route -> controller -> service
prisma/
  schema/              Prisma schema and migrations
  seed.ts              mentor seed
```

## Docs

- [Brief](docs/brief.md)
- [PRD](docs/prd.md)
- [Architecture](docs/architecture.md)
- [Data modeling](docs/data-modeling.md)
- [API contract](docs/api-contract.md)
- [Design decisions](docs/decisions/)
