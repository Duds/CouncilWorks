# Developer Brief

Last updated: 10/09/2025
Owner: Engineering Lead

## Vision
Build the MVP of Aegrid (by GridWorks) - the Council Asset Lifecycle Intelligence Platform - focusing on RCM‑lite, GIS-enabled asset registry, preventive scheduling, offline inspections, SLA/SLM, Critical Controls (CCT), and executive dashboards. Align to Australian standards (language, dates, time, units, currency, holidays).

## Technology Stack
- Frontend: Next.js (App Router), React 18, TypeScript strict mode, shadcn/ui.
- Mobile: PWA with offline caching, background sync, image capture.
- Backend: Node.js (TypeScript) API with Zod validation, NextAuth.js (JWT sessions), Prisma ORM.
- Analytics: Python services for RCM‑lite and forecasting.
- Database: PostgreSQL + PostGIS; Prisma migrations; RLS for tenancy.
- Infra: Docker, Kubernetes/Azure Container Apps; GitHub Actions CI/CD; OpenTelemetry.
 - Rules Engine: Policy evaluation for CCT windows/escalations; worker/timer service for SLA/SLM and control schedules.

## MVP Scope
- Asset import (CSV/ERP), GIS visualisation, top 10 RCM‑lite templates, preventive scheduling, offline inspection flows with photo upload, risk/compliance dashboards, basic exports.
- SLA & Service Lifecycle Management (initial): contract records, SLA definitions (response/resolution/frequency), vendor portal access, SLA timers/alerts, evidence uploads, compliance reporting.
- Critical Controls (CCT): critical asset tagging, control configuration (windows/frequency), enforcement engine, escalation workflows, compliance dashboards.

## Repository Structure (Target)
- `app/` Next.js App Router; `components/` shadcn/ui & domain components; `prisma/`; `__tests__/`; `docs/`.

## Development Standards
- TypeScript strict; no `any`; clear interfaces; accessibility (WCAG 2.1 AA).
- Security: bcrypt 12 rounds; NextAuth.js for auth; Zod input validation; RBAC checks everywhere.
- Vendor Role: implement restricted vendor portal with least-privilege access scoped by `vendorId`; enforce RLS and scope checks on APIs and storage.
 - Critical Controls: require explicit justifications for overrides; log multi-party acknowledgements; ensure non-bypassable enforcement paths for critical tasks.
- Australian regional settings: DD/MM/YYYY, 24-hour time, AUD, metric units, AU time zones.
- Lint and test on every PR; maintain coverage; semantic commits.

## Workflows
- Branching: `feature/*`, `fix/*`, `docs/*` from `develop`; PR to `develop`; release via `main`.
- CI: typecheck, lint, test, build; security scans; preview deploys for feature branches.
- Migrations: Prisma `migrate`; reviewed in PR; seeded via scripts.

## Testing Strategy
- Unit: utilities, pure logic, Zod schemas, RBAC helpers.
- Component: React Testing Library for components and pages.
- API: supertest/contract tests; auth and RBAC guards.
- Integration: DB with test containers; migrations up/down; realistic seed data.
- SLA/SLM: timer behaviours, breach alerts, vendor scoping, evidence upload flows, contract renewal notifications.
 - CCT: control generation and scheduling, at-risk prediction alerts, escalation workflow, override flow with justification, role-restricted configuration.
- E2E (Phase 2): Critical flows (import, inspection, scheduling, export).

## Observability
- OpenTelemetry tracing across API and workers; JSON logs with correlation IDs.
- Metrics: API latency, error rates, queue depth, sync lag, spatial query times.
- SLA metrics: response/resolution percentiles, active timers, breaches by vendor, contract health scores.
 - CCT metrics: control compliance %, time-at-risk, MTTA/MTTR for controls, escalations per severity, override frequency.

## Documentation-as-code
- Update relevant `docs/*` with each change; keep SAD and ADRs current; maintain changelog.
- Follow `docs/design/brand-guidelines.md` for colours/tokens and Tailwind/shadcn usage.

## Local Dev Setup (Draft)
- Requirements: Node LTS, pnpm, Docker, Python 3.11, PostgreSQL with PostGIS.
- Steps:
  1. `pnpm install`
  2. Set `.env` with NextAuth secrets and DB URL
  3. `pnpm prisma migrate dev`
  4. `pnpm dev`

## Coding Guidelines
- Prefer shadcn/ui; Tailwind utilities; `rounded-full` for pill buttons; rainbow shadow for primary buttons [[memory:2528301]] [[memory:2528096]].
- Use helper functions for complex conditionals; avoid deep nesting; early returns.
- Error handling with custom error types; user-friendly messages.

## Security Checklist (Dev)
- All inputs validated; sanitise outputs; role checks on UI and API; secure cookies; HTTPS in all environments; secrets not committed.

## Roadmap Alignment
- Keep features aligned to epics and personas; build for offline crews first; optimise dashboard KPIs for execs.
