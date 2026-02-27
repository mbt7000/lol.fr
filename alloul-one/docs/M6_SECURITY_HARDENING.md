# M6 Security Hardening Pass

Implemented baseline:
- JWT auth guard enforced on protected APIs
- RBAC permission checks on all module endpoints
- Tenant-aware design across org-scoped modules
- Immutable audit log chain and verification endpoint
- Usage metering for AI consumption accounting

Required next hardening (M6.5/M7):
1. Move auth token from JS-readable cookie to HttpOnly secure cookie via backend callback session flow.
2. Add refresh token rotation + revocation storage.
3. Add rate limiter middleware (IP + user + API key) and abuse heuristics.
4. Add CSP + secure headers middleware in Next.js and API gateway.
5. Add webhook signature verification (Stripe signed payload).
6. Add secrets manager integration (Vault/Cloud Secrets).
7. Add WAF-ready ingress annotations + bot protection.
8. Add per-org audit chain option and offsite immutable backups.
