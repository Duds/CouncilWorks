# Service Blueprint

| Stage | Frontstage (User Actions) | Backstage (Support Processes) | Systems | Outputs/Evidence | Metrics |
|------|----------------------------|-------------------------------|---------|------------------|---------|
| Login & Overview | Exec opens dashboard | RBAC checks, session validation | Next.js, NextAuth, API | KPI snapshot with council branding | p95 load time, auth errors |
| Inspection | Crew submits via mobile (offline capable) | Sync queue, validation, image upload | PWA, API, Object Storage | Condition updated, photos stored | sync latency, failure rate |
| Preventive Schedule | Supervisor reviews jobs | RCM‑lite engine generates plan | Python worker, Postgres | Work orders created | schedule adherence, utilisation |
| Citizen Report | Citizen logs fault | Data normalisation, deduplication | API gateway, Postgres | Work order created/triaged | intake volume, triage time |
| Execution | Crew closes job | Update lifecycle, audit log | PWA, API, DB | Compliance logged, costs captured | closure time, repeat faults |
| Forecasting | Manager runs scenario | Model simulates, caches results | Python, Postgres | Budget forecast | accuracy vs actuals |
| Reporting | Exec exports | Compile datasets, generate PDFs | Reporting engine | Audit pack in PDF/CSV | time-to-export, errors |

## Swimlane Narrative
- Crew members operate predominantly in the PWA; offline work is queued and reconciled with merge policies upon connectivity.
- Supervisors balance preventive and corrective work orders, supported by risk and condition trends.
- Managers configure templates and run scenarios to inform budgets and strategic plans.
- Executives and Councillors consume curated dashboards and exports for governance and public transparency.

## Pain Points & Remedies
- Connectivity gaps: offline-first app, conflict resolution, user prompts.
- GIS performance: spatial indexes, tile caching, simplified geometries.
- ERP complexity: adapter layer, idempotent sync, reconciliation reports.
