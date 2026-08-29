# SchoolOS Engineering Guide

This file is the working agreement for humans and coding agents in this repository. Keep it short, practical, and update it when the architecture changes.

## Repository shape

- `packages/backend`: Django API, domain apps, GraphQL schema, background tasks, and tests.
- `packages/frontend`: React/Vite application. Keep page/module code separate from API clients and shared UI.
- `packages/workers`: asynchronous Python workers and integrations.
- `packages/infra`: AWS/CDK infrastructure and deployment configuration.
- `packages/internal`, `packages/contentful`, and shared packages: supporting tools and libraries.

## Required backend flow

Use this dependency direction for new features:

`config router / app urls -> view or GraphQL resolver -> serializer/input validation -> service/use case -> repository/manager/ORM -> model`

- **Routers** (`config/urls_api.py` and each app's `urls.py`) only map URLs to handlers. Do not put business logic in routers.
- **Views/resolvers** authenticate, authorize, validate the request, call one use case, and format the response. They should remain thin.
- **Serializers/input types** validate and normalize external data. They must not become a second service layer.
- **Services** contain business workflows, orchestration, external-service calls, and transaction boundaries. Keep them grouped by domain/use case.
- **CRUD** should be explicit and separate from orchestration. Put reusable persistence operations in managers/repositories or focused CRUD services; do not hide multi-step business rules in model methods or views.
- **Models** represent persisted state, constraints, and small invariant-preserving operations. Avoid network calls and request-specific logic in models.
- **Integrations** (Stripe, Contentful, OpenAI, email, etc.) need a small client/adapter boundary so domain services do not depend directly on SDK details.
- **Tasks/workers** receive stable IDs or small serializable payloads and call services. They must be safe to retry and must not duplicate business logic.

For frontend features, follow:

`route -> page/module -> feature component -> api client -> backend endpoint`

Keep route definitions in `src/router.tsx`, HTTP behavior in `src/api`, and role/permission decisions enforced by the backend as well as reflected in the UI.

## Multi-tenancy and authorization

- Treat `school_id`/tenant context as security boundaries, never as a client-trusted filter.
- Resolve the tenant from authenticated context and verify object ownership on every read, update, delete, import, and export.
- Use explicit role/permission checks for every protected endpoint. Default-deny is required in non-local environments.
- Super-admin operations must be visibly and separately authorized from school-admin operations.
- Add regression tests for cross-tenant access denial whenever a new tenant-scoped resource is added.

## Security practices

- Never commit real secrets, tokens, passwords, `.env` files, or generated credentials. Use environment variables and secret managers.
- Production must have `DEBUG=false`, a strong unique `SECRET_KEY`, explicit `ALLOWED_HOSTS`, restricted CORS/CSRF origins, secure cookies, and HTTPS.
- Do not ship authentication bypass switches or bootstrap users enabled by default. If a local-only bypass is unavoidable, fail closed outside an explicitly marked local environment.
- Hash passwords with Django's password utilities; never log credentials or include them in API responses. Force first-login password setup for imported users.
- Validate upload type, size, encoding, row count, and content; use transactions and idempotency for bulk imports.
- Verify webhook signatures before processing and make webhook handlers idempotent.
- Use parameterized ORM queries, safe output encoding, rate limits on login/password reset, and generic authentication error messages.
- Keep API documentation and health endpoints intentionally public only when they reveal no sensitive details; protect or disable interactive docs in production.

## Code quality and delivery

- Prefer small, single-purpose modules and typed, descriptive names. Avoid duplicate URL registrations and unused imports.
- Add or update unit/API tests for behavior changes, especially authorization, tenant isolation, error paths, and retries.
- Run the relevant lint, type-check/build, and test commands before handoff. Do not suppress failures without documenting why.
- Use migrations for schema changes; never edit an applied migration. Make data migrations reversible where practical.
- Use Conventional Commits and keep changes scoped. Update `status.md` when architecture, risks, or verification state changes.

## Agent workflow

1. Read this file, `status.md`, the relevant package README, and nearby code before editing.
2. Trace the complete request flow before changing an endpoint.
3. Make the smallest safe change, preserve unrelated user work, and inspect the diff.
4. Verify with focused tests first, then broader checks when practical.
5. Report changed files, verification performed, and remaining risks clearly.
