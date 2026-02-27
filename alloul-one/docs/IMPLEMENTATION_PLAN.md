# Implementation plan (Full Build via Milestones)

## M1 (current start)
- [x] Monorepo structure
- [x] Architecture doc
- [x] Initial Prisma schema
- [x] OpenAPI seed contracts
- [x] Local docker-compose for core services
- [x] NestJS bootstrap with modules (auth/org/rbac/admin)
- [~] OIDC + OAuth2 + passwordless (API flows added; provider secrets/callback wiring pending)
- [x] Tenant middleware + policy guards (initial scaffold)
- [x] M1.5 UI shell: Sidebar + Auth page + Onboarding page + Admin overview
- [x] M1.6: API-connected Auth/Onboarding + i18n switch + RTL
- [x] M1.7: JWT session guard + protected routes + auth wiring improvements + visual polish

## M2
- [x] Knowledge base modules (docs/versioning/approvals)
- [x] Search indexing pipeline (Meilisearch -> OpenSearch migration path)
- [x] Immutable audit log chain/hash verification endpoint

## M3
- [x] Projects/Tasks modules
- [x] Workflow engine + trigger/action registry
- [x] Outbox publisher + worker subscriptions

## M4
- [x] Handover module
- [x] Handover score model + explanation report
- [~] Ownership transfer workflows (next increment: assign successor + transfer actions)

## M5
- [x] Public feed/profile/follows/groups
- [x] Marketplace listings/offers/orders
- [~] Messaging architecture (phase-prep)

## M6
- [x] Stripe billing + usage metering (webhook scaffold)
- [x] AI modules (memory/reasoning/summarizer/executor) foundation endpoint
- [x] Observability stack (otel, prometheus, grafana, sentry) bootstrap configs
- [x] Security hardening pass checklist + baseline controls

## M7
- [x] K8s production manifests + Helm values
- [x] Terraform baseline infra modules
- [x] Runbooks, SLO/SLI, incident checklist
