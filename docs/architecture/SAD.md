# Software Architecture Document (SAD)

Version: 0.1.0 (Draft)
Owner: Architecture Team
Last updated: 10/09/2025

- Related: `docs/architecture/service-concept.md`, `docs/architecture/service-blueprint.md`, `docs/security/rbac-implementation.md`, `docs/database/seed-implementation.md`, `docs/database/ERD.puml`, `docs/architecture/resource-naming-convention.md`, `docs/development/developer-brief.md`

## 1. Introduction
- Purpose: Define the end-to-end architecture for the Council Asset Lifecycle Intelligence Platform (CouncilWorks) to support Australian councils in proactive asset lifecycle management.
- Scope: MVP through Phase 2, covering asset register, RCM‑lite templates, scheduling, inspections (offline PWA), dashboards, and integrations (GIS, citizen reporting, ERP).
- Stakeholders: Asset & Infrastructure Managers, Works Supervisors, Fleet Coordinators, Parks Officers, Executives/Councillors, IT, Finance, citizens.

## 2. Architectural Goals and Principles
- Focused, lightweight RCM‑lite engine for practicality and explainability.
- Mobile-first PWA with offline capability and seamless sync.
- Secure by default: RBAC, audit logging, least privilege, input validation (Zod).
- Interoperable: Standards-based APIs, GIS via PostGIS/GeoJSON, ERP adapters.
- Observability: structured logging, traces, metrics, health checks.
- Regional alignment: Australian English, DD/MM/YYYY, 24-hour time, AUD, metric units, Australian time zones and public holidays.

## 3. Context and Constraints
- Context: Multi-tenant SaaS for tiered councils; constrained budgets and mixed digital maturity.
- Regulatory: Records retention, privacy, accessibility (WCAG 2.1 AA), procurement.
- Performance: Field crews need fast, resilient offline-first behaviour; dashboards sub‑second for common views.
- Data residency: Prefer AU regions where applicable.

## 4. High-Level Architecture
- Frontend: Next.js (App Router) dashboards; PWA for field crews (offline cache, background sync).
- API Layer: Node.js (TypeScript) REST/GraphQL gateway; validation with Zod; authentication with NextAuth.js (JWT sessions) and RBAC.
- Analytics & Scheduling: Python services for RCM‑lite, forecasting, optimisation (containers, async jobs/worker queue).
- Database: PostgreSQL + PostGIS; Prisma ORM for app data access; Postgres RLS for tenant and role scoping.
- Integrations: Webhooks, adapters for ERP, citizen reporting portals, IoT; message queue for async tasks.
- Observability: OpenTelemetry traces, structured logs, metrics; dashboards and alerting.
- Deployment: Containers (Docker, Kubernetes/Azure Container Apps); environments: dev, test, prod.

### 4.1 C4: System Context (textual)
- Users: Council staff (Admin, Manager, Supervisor, Crew, Exec), Citizens.
- External Systems: ERP, GIS (e.g. ArcGIS), Identity Provider (IdP), Email/SMS, File storage, IoT.
- CouncilWorks provides secure dashboards, APIs, mobile workflows, analytics, and reporting.

### 4.2 C4: Containers
- Web App (Next.js)
- Mobile PWA
- API Gateway (Node.js)
- Worker/Analytics (Python)
- Postgres/PostGIS
- Message Broker (e.g. RabbitMQ/Cloud queue)
- Object Storage (photos, documents)
- Identity Provider (OIDC/SAML) via NextAuth providers

## 5. Data Architecture
- Canonical identifiers: UUIDs; time kept in UTC in DB, displayed in local Australian time.
- Spatial: PostGIS geometry for assets; index on geography/geometry columns.
- Multi-tenancy: `organisation_id` on all tenant-scoped tables; enforced via Postgres RLS and application claims.
- Auditing: Created/updated timestamps, user IDs, change logs; immutable event trail for critical records.
- Backups & DR: PITR enabled; daily encrypted backups; tested restores.

## 6. Security Architecture
- Authentication: NextAuth.js with JWT sessions; configurable providers; session expiry and refresh.
- Authorisation: Role-based (Admin, Manager, Supervisor, Crew, Exec, Citizen); hierarchical permissions; policy checks at API and UI; database RLS.
- Secrets: Managed via environment variables/secret manager; never committed.
- Input validation: Zod schemas at all API boundaries; output sanitisation for HTML.
- Passwords (if used): bcrypt 12 rounds; never stored in plain text.
- Transport: HTTPS everywhere; HSTS; secure cookies.
- Threat model: Covers auth bypass, multi-tenant data leakage, CSRF/XSS/SQLi, offline tampering, replay, broken access control.

## 7. Quality Attributes
- Reliability: Zero-downtime deploys, health checks, circuit breakers, retries with backoff.
- Performance: API p95 < 300ms for common endpoints; dashboard p95 < 1s; large exports in async jobs.
- Scalability: Horizontal scaling for stateless services; DB read replicas as needed; caching layers.
- Usability: WCAG 2.1 AA; keyboard navigation; offline-friendly flows; clear error messaging.
- Observability: Trace > log > metric correlation; SLOs and alerting.
- Maintainability: Modular, typed, documented, ADRs for decisions, tests.

## 8. Application Modules
- Asset Registry: import, CRUD, GIS view; attachments.
- RCM‑lite: templates, failure modes, tasks, risk scoring; generation policies.
- Scheduling: preventive plans; work order creation and allocation.
- Inspections (PWA): offline forms, photos, GPS tagging; sync resolution.
- Reporting & Exports: risk/compliance dashboards; audit-ready packs.
- Integrations: Citizen intake API, ERP sync, IoT signals.

## 9. Deployment & Environments
- Dev: feature branches; preview deployments.
- Test: integration and UAT; seeded realistic data.
- Prod: AU region; blue/green or rolling deploy; mandatory monitoring.
- Configuration via env vars; secrets from secret store; infra as code.

## 10. Observability
- OpenTelemetry SDK across Node and Python services.
- Log format: JSON, correlation IDs, user/tenant IDs where appropriate.
- Dashboards: performance, error rates, sync lag, job queues, GIS query times.

## 11. Compliance & Governance
- Privacy and records management; data classification.
- Access reviews; least privilege; joiner/mover/leaver processes.
- Change management with documented ADRs and changelog.

## 12. Risks and Mitigations
- Offline conflicts: implement CRDT/last-write-wins with user prompts; server-side merge policies.
- Spatial performance: appropriate indexes; tile-based rendering; caching.
- Integration fragility: retries, DLQs, idempotency keys.
- Multi-tenant leakage: defence in depth (claims, RLS, tests).

## 13. Open Decisions (ADRs)
- ADR-001: Queue technology (Managed vs self-hosted).
- ADR-002: GraphQL vs REST for internal APIs.
- ADR-003: Mobile packaging (pure PWA vs optional wrapper).
- ADR-004: GIS library choice for web map rendering.

## 14. Glossary
- RCM‑lite: Simplified Reliability-Centred Maintenance.
- RLS: Row-Level Security (Postgres).
- PWA: Progressive Web App.
- SLO/SLA: Service Level Objective/Agreement.
