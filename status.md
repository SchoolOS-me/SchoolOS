# SchoolOS Status

Updated: 2026-08-29

## Current architecture

The repository is a monorepo containing a Django backend, React/Vite frontend, Python workers, and AWS/CDK infrastructure. The active product flow is primarily:

`React route -> frontend api client -> Django app URL -> DRF view -> serializer -> model/manager/service -> database or integration`

The frontend has role-based dashboard routes and a shared `apiFetch` that attaches JWT and CSRF headers and attempts refresh on `401`. The backend exposes domain URL groups for auth, schools, academics, attendance, finances, dashboard, and content. Multi-tenancy is intended to be enforced with school/tenant context.

GraphQL and websocket code also exists, but the HTTP URL configuration does not currently expose a GraphQL endpoint, so this should be treated as an incomplete/secondary path until deliberately finished.

## Findings to fix

### P0 — backend schema import failure

`packages/backend/config/schema.py` references `users_schema.AnyoneMutation`, `users_schema.AuthenticatedMutation`, and `users_schema.Mutation`, but no `users_schema` import is present. Any import of the GraphQL schema can fail at startup. Fix by importing the intended accounts schema or removing those mutation references, then add a schema import/startup test.

### P0 — unsafe default permissions

`packages/backend/config/settings.py` defaults DRF permissions to `AllowAny`. This is unsafe if the environment is misconfigured. Change the default to authenticated access and explicitly mark only login, CSRF, health, and intentionally public endpoints as public. Add a production settings test that fails when `AllowAny` is the global default.

### P0 — authentication bypass can be enabled by configuration

The frontend `VITE_DISABLE_AUTH_HEADER` bypasses both the `Authorization` header and client-side route guards. The backend also detects global `AllowAny` as an auth bypass. These switches need to be local-development-only, fail closed in production, and ideally be removed in favor of test fixtures/mocks.

### P1 — bootstrap and imported credentials are risky

`apps/schools/views.py` can create a bootstrap super-admin when no creator exists, and bulk imports generate predictable passwords such as `Teacher0001!SchoolOS`. Replace this with an explicit, authenticated provisioning command and one-time invite/reset tokens. Never return or log generated passwords.

### P1 — tenant boundary needs systematic coverage

The code has tenant helpers and tenant middleware, but tenant isolation must be verified endpoint-by-endpoint, including object detail URLs, bulk import, reports, subscriptions, and admin actions. Add shared authorization test fixtures and cross-school denial tests.

### P1 — configuration and repository hygiene

`packages/backend/.env` and `packages/backend/secrets.json` are tracked by git. Audit them immediately, rotate anything real, remove secrets from history if necessary, and keep only redacted examples. Also verify production `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, CORS, CSRF, cookie, and HTTPS settings.

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
7. Decide and document the supported REST/GraphQL boundary, then remove or complete the unused path.

## Verification status

- Repository structure and request/auth flow reviewed.
- Documentation added: `AGENTS.md` and `status.md`.
- Full test suite not run yet.
- Security findings above are review findings; they are not fixed by this documentation change.
