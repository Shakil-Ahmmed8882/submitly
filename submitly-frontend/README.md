# Submitly Frontend

[← Submitly (root)](../README.md) · [Backend](../submitly-backend/README.md) · [Live API](https://submitly-backend.vercel.app/health)

Next.js dashboard for Submitly. Students submit projects and track review status; mentors review, approve, or reject submissions.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, TanStack Query, React Hook Form + Zod, Radix UI, Biome

## Getting started

```bash
bun install
bun dev          # http://localhost:3000
```

Requires the [backend](../submitly-backend/README.md) running locally (default `http://localhost:5000`) or pointed at the deployed API.

## Scripts

| Command | Purpose |
|---|---|
| `bun dev` | Start dev server |
| `bun run build` | Production build |
| `bun start` | Run the production build |
| `bun run lint` | Biome check |
| `bun run format` | Biome format (write) |
| `bun test` | Run tests |

## Project structure

```
src/
  app/            Next.js App Router routes
  modules/        Feature modules (auth, student, mentor, shared) — services, sections, layouts
  components/     Shared UI components
  design-system/  Design tokens and primitives
  lib/            API client and shared utilities
  providers/      App-level context providers
  routes/         Route and navigation definitions
  types/          Shared TypeScript types
  validation/     Zod schemas
proxy.ts          Route guards (auth/role checks)
```

## Docs

- [Brief](docs/brief.md)
- [PRD](docs/prd.md)
- [Frontend architecture](docs/frontend-architecture.md)
- [Frontend data model](docs/frontend-data-model.md)
- [Design system](docs/design-system.md)
- [Screens planning](docs/screens-planning.md)
- [API contract](docs/api-contract.md)
- [API audit](docs/api-audit.md)

## Live

- Backend API: https://submitly-backend.vercel.app
- Health check: https://submitly-backend.vercel.app/health
