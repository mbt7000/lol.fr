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
- Handover module
- Handover score model + explanation report
- Ownership transfer workflows

## M5
- Public feed/profile/follows/groups
- Marketplace listings/offers/orders
- Messaging architecture (phase-prep)

## M6
- Stripe billing + usage metering
- AI modules (memory/reasoning/summarizer/executor)
- Observability stack (otel, prometheus, grafana, sentry)
- Security hardening pass

## M7
- K8s production manifests + Helm values
- Terraform baseline infra modules
- Runbooks, SLO/SLI, incident checklist
