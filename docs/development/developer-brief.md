# Developer Brief

Last updated: 10/09/2025
Owner: Engineering Lead

## Vision

Build the MVP of Aegrid - the Asset Lifecycle Intelligence Platform - focusing on resilient asset management following The Aegrid Rules: Every Asset Has a Purpose, Risk Sets the Rhythm, Respond to the Real World, and Operate with Margin. Implement GIS-enabled asset registry, signal-driven scheduling, offline inspections, SLA/SLM, Critical Controls (CCT), and resilience-focused dashboards. Align to Australian standards (language, dates, time, units, currency, holidays).

## Technology Stack

- Frontend: Next.js (App Router), React 18, TypeScript strict mode, shadcn/ui.
- Mobile: PWA with offline caching, background sync, image capture.
- Backend: Node.js (TypeScript) API with Zod validation, NextAuth.js (JWT sessions), Prisma ORM.
- Analytics: Python services for RCM‑lite and forecasting.
- Database: PostgreSQL + PostGIS; Prisma migrations; RLS for tenancy.
- Infra: Docker, Kubernetes/Azure Container Apps; GitHub Actions CI/CD; OpenTelemetry.
- Rules Engine: Policy evaluation for CCT windows/escalations; worker/timer service for SLA/SLM and control schedules.

## MVP Scope

- **Resilience-First Asset Management**: Asset import (CSV/ERP), GIS visualisation, purpose-driven asset organization, signal-driven scheduling, offline inspection flows with photo upload, resilience dashboards, basic exports.
- **SLA & Service Lifecycle Management (initial)**: contract records, SLA definitions (response/resolution/frequency), vendor portal access, SLA timers/alerts, evidence uploads, compliance reporting.
- **Critical Controls (CCT)**: critical asset tagging, control configuration (windows/frequency), enforcement engine, escalation workflows, compliance dashboards.
- **The Aegrid Rules Implementation**: Purpose-driven asset organization, risk-based scheduling, signal detection and response, margin management systems.

## Repository Structure (Target)

- `app/` Next.js App Router; `components/` shadcn/ui & domain components; `prisma/`; `__tests__/`; `docs/`.

## Development Standards

- TypeScript strict; no `any`; clear interfaces; accessibility (WCAG 2.1 AA).
- Security: bcrypt 12 rounds; NextAuth.js for auth; Zod input validation; RBAC checks everywhere.
- Vendor Role: implement restricted vendor portal with least-privilege access scoped by `vendorId`; enforce RLS and scope checks on APIs and storage.
- Critical Controls: require explicit justifications for overrides; log multi-party acknowledgements; ensure non-bypassable enforcement paths for critical tasks.
- Australian regional settings: DD/MM/YYYY, 24-hour time, AUD, metric units, AU time zones.
- **Icon Standards**: Use Lucide React exclusively; named imports for tree-shaking; consistent sizing (`h-4 w-4`, `h-5 w-5`, `h-6 w-6`); semantic color classes; accessibility labels for icon-only buttons.
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

## Recent Improvements (v0.3.1)

### Sidebar Enhancement

- **Collapse Functionality**: Fixed sidebar collapse mechanism with proper CSS targeting
- **Dynamic Asset Badge**: Asset Register badge now shows real-time count from database
- **API Integration**: New `/api/assets/count` endpoint for fetching organization-specific asset counts
- **CSS Architecture**: Resolved CSS conflicts and improved responsive design
- **Performance**: Optimized sidebar rendering and state management

### Technical Implementation

- **React Hooks**: Added `useState` and `useEffect` for dynamic data fetching
- **Error Handling**: Graceful handling of API failures and loading states
- **Type Safety**: Proper TypeScript interfaces for sidebar components
- **Authentication**: Secure API endpoints requiring valid user sessions

## Coding Guidelines

- Prefer shadcn/ui; Tailwind utilities; `rounded-full` for pill buttons; rainbow shadow for primary buttons [[memory:2528301]] [[memory:2528096]].
- Use helper functions for complex conditionals; avoid deep nesting; early returns.
- Error handling with custom error types; user-friendly messages.

## Security Checklist (Dev)

- All inputs validated; sanitise outputs; role checks on UI and API; secure cookies; HTTPS in all environments; secrets not committed.

## Roadmap Alignment

- Keep features aligned to epics and personas; build for offline crews first; optimise dashboard KPIs for execs.
