# Alloul One

Enterprise-grade multi-tenant SaaS platform (B2B + Individuals) with AI-native workflows.

## Monorepo

- `apps/web` — Next.js app (App Router, Tailwind, shadcn/ui)
- `apps/api` — NestJS API (REST + OpenAPI)
- `apps/worker` — BullMQ background workers
- `packages/ui` — shared UI components
- `packages/shared` — shared types/schemas/contracts
- `packages/config` — lint/tsconfig/env presets
- `infra/` — Terraform, Kubernetes, Helm
- `docs/` — architecture, API, runbooks

## Quick start (local)

```bash
pnpm install
pnpm dev
```

> Initial bootstrap includes architecture, data model (Prisma), OpenAPI seed, and local compose scaffolding.
