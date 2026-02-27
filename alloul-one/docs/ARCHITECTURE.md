# Alloul One — Architecture (Enterprise)

## 1) Executive summary
Alloul One is a multi-tenant, AI-native SaaS platform serving B2B organizations and individuals in one ecosystem.

Core principles:
- Tenant isolation first (`org_id` + policy enforcement)
- Event-driven domain model (Outbox + async processing)
- API-first contracts (OpenAPI)
- Security/compliance baseline by default
- Modular AI services with permission-aware access

## 2) Chosen backend
**NestJS (TypeScript)** selected over Fastify+tRPC due to:
- Strong enterprise structure (modules, DI, guards, interceptors)
- First-class OpenAPI generation
- Easier standardization for large teams and compliance workflows
- Stable ecosystem for auth, queues, observability, and testing

## 3) Monorepo layout
- `apps/web`: Next.js App Router, Tailwind, shadcn/ui, TanStack Query, Zustand
- `apps/api`: NestJS REST API, OpenAPI docs
- `apps/worker`: BullMQ workers (notifications, search indexing, AI jobs)
- `packages/ui`: shared components and design tokens
- `packages/shared`: Zod schemas, DTO contracts, event names
- `packages/config`: shared tsconfig/eslint/prettier configs
- `infra/terraform`: cloud resources
- `infra/k8s`: namespace, deploy, service, ingress, autoscaling
- `infra/helm`: chart packaging

## 4) Multi-tenant model
- Every tenant-scoped table includes `org_id`
- Access checks at API layer via RBAC + ABAC policies
- Optional Postgres Row-Level Security in enterprise mode
- Tenant-aware cache keys and queue topics

## 5) Core bounded contexts
1. Identity & Access (users, roles, permissions, sessions)
2. Organization (orgs, teams, departments, locations)
3. Knowledge (docs, versions, approvals, tags)
4. Delivery (projects, tasks, comments, files, OKRs)
5. Workflow (definitions, triggers, runs, logs)
6. Handover (checklists, ownership transfer, score)
7. Social/Public (profiles, posts, follows, groups)
8. Marketplace (listings, offers, orders, disputes)
9. Billing (plans, subscriptions, invoices, usage meters)
10. Notifications (in-app, email, WhatsApp/Telegram providers)
11. AI services (memory/reasoning/summarizer/executor)

## 6) Event-driven backbone
- Write model transaction includes domain change + `events_outbox`
- Worker publishes outbox events to internal bus
- Subscribers handle side effects (notifications, search index, AI summary)
- Idempotency at consumer level using event id + dedupe table

## 7) AI architecture
- `ai/memory`: org/user scoped retrieval (vector + metadata filters)
- `ai/reasoning`: task/project analysis and next-best-action suggestions
- `ai/summarizer`: docs/chat/meeting summaries
- `ai/executor`: permission-aware workflow action runner

Guardrails:
- Prompt inputs filtered by tenant and permissions
- Tool calls scoped by `org_id`
- Safety policies and audit of AI actions

## 8) Security baseline
- OIDC/OAuth2 + optional passwordless
- RBAC + ABAC guards
- Immutable `audit_logs` (append-only)
- Secure headers, CSP, OWASP checks
- Rate limiting per IP/user/org/API key
- Encryption in transit (TLS) + at rest (managed keys)

## 9) Observability
- OpenTelemetry traces/log correlations
- Prometheus metrics + Grafana dashboards
- Sentry for FE/BE errors
- Business KPIs dashboards (usage, adoption, retention)

## 10) i18n
- Languages enabled from start: Arabic (`ar`), English (`en`), Chinese (`zh`), Korean (`ko`)
- Locale routing in web app
- Translation keys stored in centralized dictionary service

## 11) Milestones
- M1: Repo bootstrap + Auth + Multi-tenant + RBAC + Admin skeleton
- M2: Knowledge base + Search + Audit logs
- M3: Projects/Tasks + Workflow engine
- M4: Handover module + score/reporting
- M5: Public features (feed/profile/groups/marketplace)
- M6: Billing + usage + AI features + observability + hardening
- M7: Production K8s + runbooks + SLOs
