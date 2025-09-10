# Product Backlog

Last updated: 10/09/2025

## Epics

### E1: Asset Register & GIS Integration
- Who gains: Managers, Supervisors, Execs
- What changes: Central asset registry with spatial context
- Why it matters: Single source of truth; unlocks spatial analysis and routing
- How we’ll know: 95% assets imported; map performance p95 < 800ms; user satisfaction > 8/10

### E2: RCM‑lite Templates & Scheduling
- Who gains: Managers, Supervisors
- What changes: Standardised maintenance policies and preventive schedules
- Why it matters: Fewer breakdowns; predictable workloads and budgets
- How we’ll know: 30% reduction in reactive jobs; 90% schedule adherence

### E3: Mobile Inspections App
- Who gains: Crew, Supervisors
- What changes: Offline-first inspections with photo capture and GPS
- Why it matters: Faster, accurate data capture in the field
- How we’ll know: Sync success > 99%; inspection coverage up 40%

### E4: Dashboards & Reporting
- Who gains: Execs, Managers
- What changes: Risk/compliance dashboards and audit-ready exports
- Why it matters: Governance, transparency, and faster decisions
- How we’ll know: Time-to-export < 30s; meeting prep time reduced 50%

### E5: Integrations (Citizen, ERP, IoT)
- Who gains: Supervisors, Managers, Citizens
- What changes: Automated intake and data sync
- Why it matters: Less manual work; better service
- How we’ll know: 80% automated triage; reconciliation errors < 1%

### E6: Sustainability & Carbon Module
- Who gains: Managers, Execs
- What changes: Track emissions and sustainability metrics
- Why it matters: Compliance and public reporting
- How we’ll know: Quarterly sustainability report generated from system

## Features

- Feature: Import assets from CSV/ERP
  - Purpose: Populate registry quickly with validated data
  - Linked to: E1
  - Success signals: >95% valid rows; duplicate detection < 1%
  - Impacted stakeholders: Managers, IT

- Feature: GIS map visualisation
  - Purpose: Visualise assets and jobs on a map with filters
  - Linked to: E1
  - Success signals: p95 < 800ms, spatial queries cached
  - Impacted stakeholders: Managers, Supervisors

- Feature: Create/edit RCM templates
  - Purpose: Define failure modes and maintenance tasks
  - Linked to: E2
  - Success signals: Template reuse > 70%; clear audit trail
  - Impacted stakeholders: Managers

- Feature: Preventive maintenance scheduling
  - Purpose: Generate and adjust work orders
  - Linked to: E2
  - Success signals: 90% adherence; backlog within target
  - Impacted stakeholders: Supervisors

- Feature: Offline inspections with photo upload
  - Purpose: Capture field data reliably without coverage
  - Linked to: E3
  - Success signals: Sync success >99%; conflict rate < 2%
  - Impacted stakeholders: Crew, Supervisors

- Feature: Risk/compliance dashboard
  - Purpose: Provide actionable risk and compliance insights
  - Linked to: E4
  - Success signals: KPI clarity rated > 8/10; p95 < 1s
  - Impacted stakeholders: Execs, Managers

- Feature: Citizen report intake API
  - Purpose: Accept and normalise citizen fault reports
  - Linked to: E5
  - Success signals: 80% auto-triage; duplicates merged
  - Impacted stakeholders: Citizens, Supervisors

- Feature: Carbon footprint tracking
  - Purpose: Track emissions for reporting
  - Linked to: E6
  - Success signals: Quarterly report accuracy verified
  - Impacted stakeholders: Managers, Execs

## User Stories

- As an Asset Manager, I want to import assets from Excel so that I can build a register.
- As a Crew Member, I want to complete an inspection on mobile offline so that I can work in the field.
- As a Supervisor, I want auto-generated work orders so that I can allocate tasks quickly.
- As an Executive, I want to export audit-ready reports so that I can meet compliance requirements.

## Bugs (placeholders)
- B1: Sync issue in offline mode
- B2: Wrong risk score calculation in template

## Tasks
- T1: Set up DB schema migration pipeline
- T2: Build asset import endpoint
- T3: Design playground RCM template
- T4: Implement JWT-based RBAC middleware
- T5: Containerise API + DB
