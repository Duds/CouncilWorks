# CouncilWorks Product Backlog

Last updated: 11/09/2025

## MVP Epics (Phase 1)

### E1: Foundation & Authentication
**Goal**: Establish secure, multi-tenant foundation with role-based access control
**Value**: Secure platform foundation enabling council-specific data isolation

### E2: Asset Register & GIS Integration  
**Goal**: Import, manage, and visualise council assets with spatial capabilities
**Value**: Centralised asset registry with GIS visualisation for better asset management

### E3: RCM-lite Templates & Scheduling
**Goal**: Implement simplified reliability-centred maintenance with automated scheduling
**Value**: Proactive maintenance planning reducing reactive work and extending asset life

### E4: Mobile Inspections (PWA)
**Goal**: Offline-capable mobile app for field inspections and work order management
**Value**: Efficient field operations with offline capability and seamless data sync

### E5: Dashboards & Reporting
**Goal**: Executive dashboards and compliance reporting for all user roles
**Value**: Data-driven decision making and audit-ready compliance reporting

### E6: Citizen Integration
**Goal**: Integrate citizen reporting into council workflows
**Value**: Improved community engagement and streamlined issue resolution

## Future Epics (Phase 2+)

### E7: Advanced Analytics & Forecasting
**Goal**: Predictive maintenance and long-term asset renewal planning
**Value**: Strategic asset planning and budget optimisation

### E8: ERP & System Integrations
**Goal**: Seamless integration with existing council systems
**Value**: Reduced data silos and improved operational efficiency

### E9: Sustainability & Carbon Tracking
**Goal**: Track environmental impact and sustainability metrics
**Value**: Support council climate commitments and sustainability goals

### E10: IoT & Telematics Integration
**Goal**: Real-time asset monitoring and predictive maintenance
**Value**: Enhanced asset reliability through real-time monitoring

## Features by Epic

### E1: Foundation & Authentication
- **F1.1**: Multi-tenant database architecture with RLS
- **F1.2**: NextAuth.js authentication with JWT sessions
- **F1.3**: Role-based access control (RBAC) implementation
- **F1.4**: User management and organisation setup
- **F1.5**: Security audit logging and monitoring

### E2: Asset Register & GIS Integration
- **F2.1**: Asset import from CSV/Excel files
- **F2.2**: ERP system integration for asset data
- **F2.3**: PostGIS spatial database setup
- **F2.4**: Interactive GIS map visualisation
- **F2.5**: Asset CRUD operations with spatial data
- **F2.6**: Asset search and filtering capabilities
- **F2.7**: Asset attachment and document management

### E3: RCM-lite Templates & Scheduling
- **F3.1**: Pre-built RCM templates for top 10 asset classes
- **F3.2**: Custom RCM template creation and editing
- **F3.3**: Failure mode and effects analysis (FMEA)
- **F3.4**: Risk scoring and prioritisation engine
- **F3.5**: Automated work order generation
- **F3.6**: Preventive maintenance scheduling
- **F3.7**: Maintenance task library management

### E4: Mobile Inspections (PWA)
- **F4.1**: Progressive Web App (PWA) development
- **F4.2**: Offline data storage and sync
- **F4.3**: Mobile inspection forms and workflows
- **F4.4**: Photo capture and GPS tagging
- **F4.5**: Work order assignment and tracking
- **F4.6**: Background sync and conflict resolution
- **F4.7**: Mobile-optimised user interface

### E5: Dashboards & Reporting
- **F5.1**: Executive KPI dashboard
- **F5.2**: Manager operational dashboard
- **F5.3**: Supervisor work order dashboard
- **F5.4**: Risk and compliance reporting
- **F5.5**: Asset condition trending
- **F5.6**: Export functionality (PDF/Excel)
- **F5.7**: Custom report builder

### E6: Citizen Integration
- **F6.1**: Citizen reporting portal
- **F6.2**: Snap Send Solve API integration
- **F6.3**: Report triage and assignment
- **F6.4**: Citizen notification system
- **F6.5**: "You said, we did" dashboard
- **F6.6**: Report status tracking

## User Stories by Feature

### E1: Foundation & Authentication
- **US1.1**: As an Admin, I want to set up my council organisation so that I can configure the system for my council
- **US1.2**: As an Admin, I want to manage user accounts and roles so that I can control access to sensitive data
- **US1.3**: As a user, I want to log in securely so that I can access the system with appropriate permissions
- **US1.4**: As a user, I want my data to be isolated from other councils so that privacy is maintained

### E2: Asset Register & GIS Integration
- **US2.1**: As an Asset Manager, I want to import assets from Excel so that I can quickly populate the system
- **US2.2**: As an Asset Manager, I want to see assets on a map so that I can understand their spatial distribution
- **US2.3**: As a Manager, I want to search and filter assets so that I can find specific items quickly
- **US2.4**: As a Manager, I want to attach documents to assets so that I can maintain complete records
- **US2.5**: As a Supervisor, I want to view asset details so that I can plan maintenance activities

### E3: RCM-lite Templates & Scheduling
- **US3.1**: As a Manager, I want to use pre-built RCM templates so that I can quickly set up maintenance programs
- **US3.2**: As a Manager, I want to create custom RCM templates so that I can tailor maintenance to my assets
- **US3.3**: As a Manager, I want to see risk scores for assets so that I can prioritise maintenance
- **US3.4**: As a Supervisor, I want work orders to be generated automatically so that I can focus on execution
- **US3.5**: As a Manager, I want to schedule preventive maintenance so that I can reduce reactive work

### E4: Mobile Inspections (PWA)
- **US4.1**: As a Crew member, I want to perform inspections offline so that I can work in areas with poor connectivity
- **US4.2**: As a Crew member, I want to take photos during inspections so that I can document asset condition
- **US4.3**: As a Crew member, I want to update work order status so that supervisors know progress
- **US4.4**: As a Crew member, I want to sync data when connectivity returns so that information is up-to-date
- **US4.5**: As a Supervisor, I want to assign work orders to crew members so that work is distributed efficiently

### E5: Dashboards & Reporting
- **US5.1**: As an Executive, I want to see high-level KPIs so that I can monitor council performance
- **US5.2**: As a Manager, I want to see operational metrics so that I can manage day-to-day operations
- **US5.3**: As a Manager, I want to generate compliance reports so that I can meet audit requirements
- **US5.4**: As an Executive, I want to export reports so that I can share information with councillors
- **US5.5**: As a Manager, I want to see asset condition trends so that I can plan renewals

### E6: Citizen Integration
- **US6.1**: As a Citizen, I want to report issues easily so that I can help improve my community
- **US6.2**: As a Citizen, I want to track my report status so that I know it's being addressed
- **US6.3**: As a Supervisor, I want to receive citizen reports so that I can prioritise community issues
- **US6.4**: As a Citizen, I want to see what the council has done so that I feel engaged with local government
- **US6.5**: As a Manager, I want to analyse citizen reports so that I can identify recurring issues

## Technical Tasks

### Infrastructure & DevOps
- **T1**: Set up PostgreSQL with PostGIS extension
- **T2**: Implement Prisma ORM with migrations
- **T3**: Configure NextAuth.js with JWT sessions
- **T4**: Set up Docker containerisation
- **T5**: Implement CI/CD pipeline with GitHub Actions
- **T6**: Configure Azure Container Apps deployment
- **T7**: Set up monitoring and logging with OpenTelemetry

### Security & Compliance
- **T8**: Implement bcrypt password hashing
- **T9**: Set up Row-Level Security (RLS) policies
- **T10**: Configure CORS and security headers
- **T11**: Implement input validation with Zod schemas
- **T12**: Set up audit logging for sensitive operations
- **T13**: Configure rate limiting and DDoS protection

### Testing & Quality
- **T14**: Set up Jest testing framework
- **T15**: Implement React Testing Library for components
- **T16**: Set up API testing with supertest
- **T17**: Configure test database with realistic seed data
- **T18**: Implement E2E testing with Playwright
- **T19**: Set up code coverage reporting
- **T20**: Configure linting and code quality checks

## Bugs & Issues
*To be populated as issues are discovered during development*

## Notes
- All user stories follow the format: "As a [role], I want [goal] so that [value]"
- Features are prioritised based on MVP requirements and user value
- Technical tasks support the implementation of features and user stories
- Australian English, DD/MM/YYYY dates, 24-hour time, metric units, and $AUD throughout

---

### E1 — Phased Delivery Plan (Foundation & Authentication)

- Phase 0: Project foundations (approx. 1 week) ✅ **COMPLETED**
  - Scope: F1.3, F1.4, F1.5, F1.6, F1.7, F1.8, F1.27, F1.28, F1.30; T1–T7, T14–T20
  - Deliverables:
    - ✅ Next.js + TypeScript scaffold with shadcn/ui and branding tokens
    - ✅ CI/CD (build, test, lint) on PRs; protected branches per workflow rules
    - ✅ PostgreSQL + Prisma migrations running locally and in CI
    - ✅ Seed data (admin + sample users/roles) re-runnable
    - ✅ Observability baseline (structured logs, error reporting hooks)
  - Acceptance:
    - ✅ One-command local spin-up via docker-compose; migrations + seeds succeed
    - ✅ CI passes for build, lint, unit tests; coverage reporting enabled

- Marketing Landing Page ✅ **COMPLETED** (Bonus work)
  - Scope: F1.9 (Landing/marketing page)
  - Deliverables:
    - ✅ Modern, cutting-edge landing page with marketing expert peer review
    - ✅ Hero section with A/B testing (server-side to prevent flicker)
    - ✅ "How it works" section with demo carousel
    - ✅ Condensed persona value propositions
    - ✅ FAQ section
    - ✅ Analytics events and A/B test scaffolding
    - ✅ SEO metadata, Open Graph, and JSON-LD schema
    - ✅ Professional OG card design
    - ✅ Local SVG images (no external dependencies)
  - Acceptance:
    - ✅ Landing page loads without errors
    - ✅ A/B testing works without content flicker
    - ✅ All images load from local files
    - ✅ SEO metadata properly configured

- Phase 1: Core authentication & session security (approx. 1–1.5 weeks) ✅ **COMPLETED**
  - Scope: F1.12, F1.13, F1.14, F1.15, F1.17 (minimal); T8, T10, T11; Security rules (bcrypt 12 rounds, Zod validation)
  - Deliverables:
    - ✅ NextAuth.js with email/password authentication
    - ✅ Registration with email/password validation
    - ✅ Secure login with proper error handling
    - ❌ Password reset with time-limited token (future)
    - ✅ JWT session management; protected routes and API guards in place
  - Acceptance:
    - ✅ Auth flows implemented (success/failure, validation)
    - ✅ Zod input validation present on auth APIs; security headers configured

- Phase 2: RBAC, RLS and admin controls (approx. 1 week)
  - Scope: F1.22, F1.23, F1.24, F1.25, F1.26 (minimal); T9, T12, T13
  - Deliverables:
    - Role enforcement across routes/APIs for ADMIN, MANAGER, SUPERVISOR, CREW, EXEC, CITIZEN
    - Admin UI to assign/change roles; enable/disable users; force reset
    - Audit logging for sensitive operations; basic admin dashboard
    - Row-Level Security (RLS) policies for multi-tenancy
  - Acceptance:
    - RBAC checks covered by unit/integration tests; RLS verified via tests
    - Audit log entries generated for role/user status changes

- Phase 3: Profile, UX polish and MFA (approx. 0.5–1 week)
  - Scope: F1.18, F1.19, F1.20, F1.21, F1.16; Public pages F1.9, F1.11 (minimal)
  - Deliverables:
    - User profile management (name, email, password, avatar), notification prefs
    - Activity log with AEST timestamps and device/session management UI
    - TOTP MFA with backup codes; SMS/email fallback wiring
    - Minimal landing page and changelog section
  - Acceptance:
    - MFA enrol/verify/recovery tested; profile updates require re-auth where appropriate
    - Accessibility checks (WCAG AA) on new screens; keyboard navigation verified

- Dependencies & Risks
  - Email delivery/verification requires configured provider; mitigate with local dev inbox
  - Rate limiting depends on runtime layer (Next.js middleware/edge or proxy); ensure deterministic tests
  - RLS misconfiguration can block access; pair tests with seed tenants and roles

- Non-functional requirements (applies across phases)
  - Security: bcrypt (12 rounds), NextAuth.js, Zod validation, secure session handling
  - Testing: unit, integration and E2E for auth/RBAC; realistic seed data
  - Documentation: update README, security docs and architectural notes per change
  - Regional: Australian English, DD/MM/YYYY, 24-hour time, metric units, $AUD

### E1 Detailed Feature Set (Foundation & Authentication)

- Application Scaffolding & Environment Setup
  - F1.3: Local app scaffolding (Next.js + TypeScript + Tailwind + shadcn/ui)
    - US1.2: App scaffold runs locally with strict TS and base UI
  - F1.4: CI/CD pipeline (GitHub Actions: build, test, deploy)
    - US1.3: CI builds/tests PRs; main deploys staged
  - F1.5: Environment management (.env for local/dev/test/prod)
    - US1.4: Environment configs load safely per environment
  - F1.6: Database initialisation (PostgreSQL + Prisma migrations)
    - US1.5: Run migrations/seed locally and in CI
  - F1.7: Logging & monitoring (pino/winston + Sentry)
    - US1.6: Structured logs and error tracking available
  - F1.8: Theming & branding setup (tokens, typography, branding hooks)
    - US1.7: Base components themed with tokens/typography

- Public-Facing Pages
  - F1.9: Landing/marketing page (overview + CTA for login/register)
    - US1.8: Landing page communicates value; CTA to auth
  - F1.10: Documentation/help page scaffold
    - US1.9: Help scaffold for onboarding
  - F1.11: Changelog/Release notes section
    - US1.10: Changelog lists recent changes per environment

- Authentication & Security
  - F1.12: Auth providers (email/password + Google + Microsoft)
    - US1.11: Sign in with email or Google/Microsoft
  - F1.13: Registration with email verification
    - US1.12: Register and verify via time-limited email link
  - F1.14: Secure login (rate limiting & lockout)
    - US1.13: Lockout after failed attempts; monitored
  - F1.15: Password reset (time-limited token)
    - US1.14: Reset password securely with one-time token
  - F1.16: Multifactor authentication (TOTP + SMS/email fallback)
    - US1.15: MFA via TOTP with fallback and recovery codes
  - F1.17: Session management (JWT refresh rotation & device tracking)
    - US1.16: View and revoke active sessions/devices

- User Profile & Management
  - F1.18: User avatar upload
    - US1.17: Upload/preview/remove profile picture
  - F1.19: Profile management (name, email, password, avatar)
    - US1.18: Update profile; email verification on change
  - F1.20: Notification preferences
    - US1.19: Opt-in/out notification categories
  - F1.21: Activity log (logins, sessions, recent actions)
    - US1.20: View activity with AEST timestamps; revoke sessions

- Administrative & RBAC Features
  - F1.22: Role-based access control (ADMIN, MANAGER, SUPERVISOR, CREW, EXEC, CITIZEN)
    - US1.21: Enforce roles on routes and APIs
  - F1.23: User assignment UI (assign/change roles)
    - US1.22: Admin assigns roles with audit trail
  - F1.24: User status management (enable/disable, force reset)
    - US1.23: Disable accounts; force password reset
  - F1.25: Audit logging (account/role changes)
    - US1.24: Audit log with filters and export
  - F1.26: Admin dashboard (users, roles, MFA, activity)
    - US1.25: Security posture dashboard with drill-down

- Developer Experience Enhancements
  - F1.27: Local first-instance deployment (docker-compose)
    - US1.26: Run app + Postgres locally via one command
  - F1.28: Seed data for dev (admin, sample users, roles)
    - US1.27: Seed re-runnable for quick flows
  - F1.29: Storybook/Component docs scaffold
    - US1.28: Storybook for UI consistency and documentation
  - F1.30: Unit & integration test setup (Jest, Playwright for auth flows)
    - US1.29: Tests and CI gates to prevent regressions
