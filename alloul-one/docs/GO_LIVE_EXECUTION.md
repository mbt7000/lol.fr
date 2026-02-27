# GO LIVE EXECUTION

## 0) Fill secrets first
Edit and apply:
- `infra/k8s/secrets/secret-template.yaml`

Required values:
- DATABASE_URL
- REDIS_URL
- JWT_SECRET
- STRIPE_WEBHOOK_SECRET
- OIDC_CLIENT_ID
- OIDC_CLIENT_SECRET

## 1) Run deployment
```bash
cd alloul-one
chmod +x scripts/*.sh
./scripts/go-live.sh
```

## 2) Run validations
```bash
API_URL=https://api.alloulone.com/v1 ./scripts/smoke-test.sh
API_URL=https://api.alloulone.com/v1 ./scripts/security-validate.sh
```

## 3) Verify SLO dashboards
- Grafana connected to Prometheus
- Error rate and latency alerts active

## 4) Rollback if needed
Follow:
- `docs/runbooks/ROLLBACK.md`
