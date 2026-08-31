# SchoolOS Status

Updated: 2026-08-29

## Current architecture

The repository is a monorepo containing a Django backend, React/Vite frontend, Python workers, and AWS/CDK infrastructure. The active product flow is primarily:

`React route -> frontend api client -> Django app URL -> DRF view -> serializer -> model/manager/service -> database or integration`

The frontend has role-based dashboard routes and a shared `apiFetch` that attaches JWT and CSRF headers and attempts refresh on `401`. The backend exposes domain URL groups for auth, schools, academics, attendance, finances, dashboard, and content. Multi-tenancy is intended to be enforced with school/tenant context.

REST is the supported client API contract. GraphQL and websocket code remains only for existing internal/subscription consumers; it is not exposed as a public HTTP endpoint until it has a complete auth, tenant, schema, and test contract.

## Findings to fix

### Resolved — backend schema import failure

Removed the references to the nonexistent accounts GraphQL mutation module. The remaining schema imports are valid for the retained websocket/internal path; add a schema import test as part of the next backend test pass.

### Resolved — unsafe default permissions

DRF now defaults to `IsAuthenticated`; login, token login, password reset, CSRF, branding, and explicitly public content endpoints declare their public permission behavior. Add a production settings test that guards this default.

### Resolved — authentication bypass can be enabled by configuration

Removed `VITE_DISABLE_AUTH_HEADER` and the corresponding frontend bypass logic. Backend views no longer infer an auth bypass from global permission configuration.

### Resolved — bootstrap and imported credentials are risky

Removed implicit bootstrap-user creation from school creation. School creation now requires the authenticated super-admin as tenant creator. Bulk-imported teachers receive an unusable password rather than a predictable credential; provisioning should be completed through the existing password-reset/invite process.

### P1 — tenant boundary needs systematic coverage

The code has tenant helpers and tenant middleware, but tenant isolation must be verified endpoint-by-endpoint, including object detail URLs, bulk import, reports, subscriptions, and admin actions. Add shared authorization test fixtures and cross-school denial tests.

### Resolved — configuration and repository hygiene

Removed the tracked `packages/backend/secrets.json` and added it to `.gitignore`. Any credentials that were real must still be rotated and removed from repository history. Non-local settings now require `DJANGO_SECRET_KEY`; local defaults remain development-only. Production should additionally set explicit hosts, origins, secure cookies, and HTTPS settings.

### P2 — flow consistency and maintainability

- `config/urls_api.py` has duplicate Django imports and unused GraphQL view imports.
- Dashboard URLs are registered with both slash and no-slash variants; choose one canonical API convention and redirect/reject the other consistently.
- Business logic is currently concentrated in large views such as the schools import flow. Extract parsing, validation, persistence, and provisioning into separate services with transaction/idempotency tests.
- Decide whether REST or GraphQL is the supported client contract. If GraphQL is retained, wire its endpoint, auth, tenant context, and tests consistently; otherwise remove dead schema/websocket paths.

## Recommended implementation order

1. Fix the GraphQL schema import and add a startup test.
2. Make backend authorization default-deny and lock down environment-based bypasses.
3. Audit/rotate tracked secrets and production security settings.
4. Replace bootstrap/predictable credentials with invite-based provisioning.
5. Build tenant-isolation tests around every protected domain endpoint.
6. Refactor bulk-import workflows into parser, validator, CRUD, and provisioning services.
7. Keep REST as the supported API boundary; complete GraphQL/websocket auth and tenant tests before exposing or expanding that path.

## Verification status

- Repository structure and request/auth flow reviewed.
- Documentation added: `AGENTS.md` and `status.md`.
- Focused checks are pending after the implementation changes.
