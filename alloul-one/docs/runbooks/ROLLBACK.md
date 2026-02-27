# Runbook: Rollback Procedure

## Trigger conditions
- Elevated error rate after release
- Auth failures across tenants
- Data consistency risk

## Steps
1. Identify last known good release tag/image.
2. Roll back web/api/worker deployments:
   - `kubectl rollout undo deployment/alloul-api -n alloul-one`
   - `kubectl rollout undo deployment/alloul-web -n alloul-one`
   - `kubectl rollout undo deployment/alloul-worker -n alloul-one`
3. Verify health checks:
   - `/v1/observability/healthz`
4. Freeze workflow runs if needed.
5. Validate smoke tests (`scripts/smoke-test.sh`).
6. Open incident postmortem and tag release as blocked.

## DB rollback policy
- Prefer forward-fix migrations.
- For destructive migration incidents, restore from backup snapshot (RPO target 15m).
