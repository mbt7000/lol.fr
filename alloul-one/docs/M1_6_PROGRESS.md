# M1.6 Progress

Implemented:
- API auth expansion (OIDC start + passwordless start/verify endpoints)
- RBAC permission decorator + guard enforcement via `x-permissions`
- Tenant-aware org creation service using Prisma
- Web onboarding form now calls API `/v1/orgs`
- Web auth card now calls API auth endpoints
- Locale cookie flow + switcher (ar/en/zh/ko)
- RTL support for Arabic via root `dir=rtl`

Notes:
- OIDC provider secrets/callback wiring is pending secure env setup.
- RBAC currently uses header-based stub permissions and will move to token claims in next step.
