# Runbook: Incident Response

1. Detect
- Confirm alert in monitoring stack (Prometheus/Grafana/Sentry)
- Identify impacted service: web/api/worker/db/redis

2. Triage
- Severity assignment (SEV1/SEV2/SEV3)
- Determine blast radius (tenants affected)

3. Mitigation
- Rollback last deploy if needed
- Scale up affected deployment (`kubectl scale`)
- Temporarily disable non-critical jobs/workflows

4. Recovery
- Validate health endpoints and key user journeys
- Reprocess failed outbox events when safe

5. Postmortem
- Root cause, timeline, corrective actions
- Add tests/alerts to prevent recurrence
