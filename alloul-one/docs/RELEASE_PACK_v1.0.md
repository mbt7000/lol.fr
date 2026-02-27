# Alloul One — Release Pack v1.0

Status: **Production-ready baseline delivered**

## 1) Complete architecture documentation
- `docs/ARCHITECTURE.md`
- `docs/IMPLEMENTATION_PLAN.md` (M1→M7 complete)

## 2) Full database schema
- `apps/api/prisma/schema.prisma`

## 3) API contracts
- `docs/openapi.yaml`

## 4) Production-ready codebase
- Web: `apps/web`
- API: `apps/api`
- Worker: `apps/worker`
- Domain modules implemented: auth/rbac/orgs/knowledge/search/audit/projects/workflows/outbox/handover/social/marketplace/billing/usage/ai/observability

## 5) Deployment configuration
- K8s: `infra/k8s/*`
- Helm: `infra/helm/alloul-one/*`
- Terraform baseline: `infra/terraform/*`
- Dockerfiles: `apps/*/Dockerfile`

## 6) Monitoring setup
- API health/metrics endpoints
- Prometheus/Grafana configmaps in `infra/k8s/monitoring/*`

## 7) Smoke test validation
- `scripts/smoke-test.sh`

## 8) Security validation
- `scripts/security-validate.sh`
- `docs/M6_SECURITY_HARDENING.md`
- Immutable audit chain verification endpoint

## 9) Runbooks + rollback procedures
- `docs/runbooks/INCIDENT_RESPONSE.md`
- `docs/runbooks/ONCALL_CHECKLIST.md`
- `docs/runbooks/ROLLBACK.md`

## 10) Release pack ready
- This file confirms v1.0 packaging completeness for deployment operations.

## Final pre-go-live checklist
1. Populate secrets from vault into `alloul-secrets`.
2. Configure real OIDC providers and callback domain.
3. Enable webhook signature verification secret.
4. Apply DB migrations in production.
5. Run smoke + security scripts against production staging.
6. Execute canary deploy and observe SLOs for 24h.
