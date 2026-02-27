# M1.7 Progress

Implemented now:
- JWT auth guard for protected API routes
- Passwordless verify returns signed JWT token
- RBAC guard now reads permission claims from JWT payload
- OIDC start endpoint includes callback URL config scaffold
- Web auth flow stores session token in cookie (`ao_token`)
- Next.js middleware protects dashboard/admin/onboarding/billing/ai/settings routes
- Onboarding API calls now use Bearer token
- UI polish: animated aurora/conic glow background

Pending to complete full production auth:
- Real OIDC callback exchange and provider SDK integration
- Refresh token rotation + revocation store
- Secure HttpOnly auth cookie via backend callback flow
- Server-side permission checks in web BFF layer
