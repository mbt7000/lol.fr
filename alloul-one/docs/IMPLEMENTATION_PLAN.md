# Implementation plan (Full Build via Milestones)

## M1 (current start)
- [x] Monorepo structure
- [x] Architecture doc
- [x] Initial Prisma schema
- [x] OpenAPI seed contracts
- [x] Local docker-compose for core services
- [ ] NestJS bootstrap with modules (auth/org/rbac/admin)
- [ ] OIDC + OAuth2 + passwordless
- [ ] Tenant middleware + policy guards

## M2
- Knowledge base modules (docs/versioning/approvals)
- Search indexing pipeline (Meilisearch -> OpenSearch migration path)
- Immutable audit log chain/hash verification endpoint

## M3
- Projects/Tasks modules
- Workflow engine + trigger/action registry
- Outbox publisher + worker subscriptions

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
