# SLO / SLI (M7 baseline)

## API Availability
- SLI: successful HTTP responses / total responses
- SLO: 99.9% monthly for core API routes

## API Latency
- SLI: p95 latency for read endpoints
- SLO: p95 <= 400ms for `/v1/orgs/*`, `/v1/feed/*`

## Workflow Execution
- SLI: successful workflow runs / total runs
- SLO: >= 99% successful runs (excluding user validation failures)

## Recovery Objectives
- RTO: 60 minutes
- RPO: 15 minutes

## Alert thresholds
- Error rate > 2% for 5m
- p95 latency > 800ms for 10m
- worker backlog (outbox PENDING) > 5k for 10m
