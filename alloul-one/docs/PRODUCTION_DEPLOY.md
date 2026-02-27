# Production Deploy (M7)

## Prerequisites
- Kubernetes cluster (v1.28+)
- Ingress controller (nginx)
- TLS certificates (cert-manager or pre-provisioned secret)
- Managed Postgres + Redis + object storage
- Secrets manager wired (Vault or cloud provider)

## Steps
1. Create namespace and secrets
   - `kubectl apply -f infra/k8s/namespace.yaml`
   - Create `alloul-secrets` with DATABASE_URL, REDIS_URL, JWT_SECRET, etc.
2. Deploy API/Web/Worker
   - `kubectl apply -f infra/k8s/api-deployment.yaml`
   - `kubectl apply -f infra/k8s/api-service.yaml`
   - `kubectl apply -f infra/k8s/web-deployment.yaml`
   - `kubectl apply -f infra/k8s/web-service.yaml`
   - `kubectl apply -f infra/k8s/worker-deployment.yaml`
3. Deploy ingress + HPA
   - `kubectl apply -f infra/k8s/ingress.yaml`
   - `kubectl apply -f infra/k8s/api-hpa.yaml`
4. Deploy monitoring configmaps
   - `kubectl apply -f infra/k8s/monitoring/`

## Post-deploy verification
- `GET /v1/observability/healthz` returns ok
- Auth flow works (passwordless/oidc start)
- DB migrations applied
- Worker processing outbox events
- Alerting channels tested
