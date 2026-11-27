# SHARE Service360 API — Phase 1

This is a **separate, non-deployed backend foundation**. The current static frontend keeps its existing demo behaviour. Do not call this production-ready until the integration, security reviews, migrations and regression tests are completed.

## Included
- PostgreSQL 16 migration: `sql/001_identity.sql`.
- Argon2id password hashing, server-side login, 8-hour opaque bearer sessions (only SHA-256 token hashes stored).
- One-time platform-admin bootstrap from Vault-provided `BOOTSTRAP_ADMIN_LOGIN` and `BOOTSTRAP_ADMIN_PASSWORD`. The password is never stored plaintext in the database.
- Ambassador create, read, list, activate/deactivate.
- Admin and programme lead can manage ambassadors, subject to server-side organisation/store scope.
- Audit entries for create/deactivation/reactivation and bootstrap.
- Readiness and liveness endpoints.

## Run (development only)
Requires Node.js 22+, PostgreSQL 16, and a database with the migration applied.

```sh
cd backend
npm install
npm test
PORT=8081 DATABASE_URL='postgresql://...' BOOTSTRAP_ADMIN_LOGIN='admin-username' BOOTSTRAP_ADMIN_PASSWORD='vault-provided-secret' npm start
```

**Do not place credentials in Git, shell history or screenshots.** In corporate EKS, Vault integration should inject them as Kubernetes secrets/environment variables at deployment time. Migrations should use a separate authorized migration identity.

## Routes
- GET `/health/live`, GET `/health/ready`
- POST `/api/auth/login` — JSON `{login,password}`
- GET `/api/auth/me` — Bearer token
- POST `/api/auth/logout` — Bearer token
- GET `/api/ambassadors` — scoped records
- GET `/api/ambassadors/:id` — authorized record
- POST `/api/ambassadors` — Admin / Programme Lead with approved scope
- POST `/api/ambassadors/:id/deactivate` or `activate`

Create payload: `{login,password,display_name,share_ambassador_id,employer,business_unit,brand,store,country,external_staff_id?,manager_name?}`.

## Deployment and security prerequisites
- Keep this backend separate from the static GitHub Pages artifact; Pages cannot run Node APIs.
- Run database migration, verify Vault mappings and DB service DNS; these were **not** confirmed from Helm values alone.
- Run API behind TLS ingress, configure secure same-origin reverse proxy for `/api`, and set restrictive ingress/network policies.
- Add login rate limiting, lockout strategy, CSRF protection if changing to cookie sessions, session rotation, password reset/rotation, audit retention and HTTP security headers.
- Implement user/scope management and approve the first Programme Lead scope before access is granted. Missing scopes deny access.
- Migrate the existing browser demo data/workflows and remove hardcoded test credentials only after real API routes are validated.
- Run integration/role-isolation tests on actual PostgreSQL (including multiple tenants), load tests and a backup/restore test.
- The application currently has a *single process* API listening on `PORT` (default 8080); deployment wiring for static assets and `/api` routing is not part of this first commit.
- SSO is not implemented. Local credentials are interim; external tenant Ambassadors must remain supported after Microsoft Entra integration.
