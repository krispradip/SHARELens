# SHARE Service360 — Corporate DEV deployment handoff

This repository is a **work-in-progress UAT build**, not a tested production release.

## Existing infrastructure
- EKS GRID2 dev: share-service360.dev.grid2.maf.ae
- Service port 8080; existing Helm values provided by project owner
- PostgreSQL 16, 5 GiB PVC declared; runtime status to be checked
- Vault role: share-service360-postgresql-grid2-dev
- Vault path: secret/data/grid2-dev/share-service360/config

## Frontend and backend
The root Dockerfile builds ONE image serving the frontend and /api on port 8080.
The frontend automatically uses real API auth only when S360_API_MODE=enabled.
By default, old demo mode is retained, to avoid breaking the existing working preview.

## Required corporate environment variables
- DATABASE_URL (Vault/secret-injected; never hardcode into repository)
- BOOTSTRAP_ADMIN_LOGIN (Vault-provided)
- BOOTSTRAP_ADMIN_PASSWORD (Vault-provided, >=16 characters)
- S360_API_MODE=enabled (ONLY after database, API, migrations are validated)
- PORT=8080

## Database
Apply backend/sql/001_identity.sql with a database migration identity before enabling live auth.
Database bootstrap runs at API startup and only creates an administrator when none exists.

## Current limitation
The real-API management UI covers creating, listing and activating/deactivating Ambassadors.
Editing Ambassador profiles, complete roles management, programme lead scope assignment,
password reset UI, full workflow persistence and corporate SSO remain incomplete.
The current demo content must not be treated as real operational data.
Security hardening and integration testing are required before inviting external testers.

## Deployment checks
- /health/live responds HTTP 200
- /health/ready responds HTTP 200 and reports database connected
- / loads application login screen
- /api/auth/login authenticates bootstrap admin
- Admin sees Ambassador Management; new account appears in database
- Programme Lead is scoped and cannot access outside assigned country/BU/brand/store
- Existing demo scoring and counters remain unchanged until migrated to API

## Pending external integrations
Adjust per-Ambassador QR, S3 Knowledge Base (retain Mitti), SHARE acquisition and sales feeds.

## Strict feature exclusion
No AI agents, agent orchestration or simulated AI analysis in the DEV/UAT product.
Legacy source requires final cleanup and a full regression pass.
