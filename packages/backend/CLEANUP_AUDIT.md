# Backend Cleanup Audit (Initial)

This audit compares current backend routes to routes used by `packages/kcs-frontend/src/api/*`.
No destructive removals were done in this pass.

## Actively Used by Frontend

- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`
- `GET /api/dashboard/admin/summary/`
- `GET /api/dashboard/teacher/summary/`
- `GET /api/dashboard/student/summary/`
- `GET /api/dashboard/parent/summary/`
- `GET /api/dashboard/super-admin/summary/`
- `GET /api/schools/`
- `POST /api/schools/`
- `PATCH /api/schools/:id/`
- `POST /api/schools/:id/admin/`
- `POST /api/schools/:id/subscription/`
- `GET /api/academics/admin/teachers/`
- `POST /api/academics/admin/teachers/create/`
- `GET /api/academics/admin/students/`
- `POST /api/academics/admin/students/create/`
- `GET /api/academics/admin/classes/`
- `POST /api/academics/admin/classes/create/`
- `GET /api/academics/admin/sections/`
- `POST /api/academics/admin/sections/create/`

## Not Used by Frontend (Candidates)

These may still be used by mobile apps, scripts, admin tooling, webhooks, or future UI.
Validate before removal.

- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `POST /api/auth/password/reset/`
- `POST /api/auth/password/reset/confirm/`
- `GET /api/content/contentful-hook/`
- `api/finances/stripe/*` (djstripe URLs)
- `POST /api/attendance/sessions/`
- `GET /api/attendance/sessions/list/`
- `POST /api/attendance/mark/`
- `GET /api/attendance/parent/attendance/`
- `GET /api/academics/teacher/classes/`
- `POST /api/academics/teacher/marks/`
- `GET /api/academics/parent/children/`
- `GET /api/academics/parent/results/`

## Table Cleanup Approach (Safe)

1. Mark model/app as deprecated in code (do not drop DB table yet).
2. Remove API routes and frontend references first.
3. Deploy and monitor for 1 release cycle.
4. Create explicit Django migrations to drop tables only after verification.

## Suggested Next Cleanup PRs

1. Route cleanup: remove unused auth token/password-reset endpoints only if not needed.
2. Attendance/academics teacher-parent endpoints: remove if product scope excludes them.
3. Optional app pruning from `INSTALLED_APPS`: `content`, `notifications`, `websockets`, `integrations`, `finances` only after confirming no dependency.
