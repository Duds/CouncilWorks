# Service Blueprint – CouncilWorks

CouncilWorks by GridWorks connects front-line crews, council managers, executives, and citizens through a unified asset lifecycle intelligence platform. This blueprint outlines how the service operates across frontstage (user actions), backstage (internal processes), enabling systems, and support layers.

---

## High-Level Blueprint

| **Step** | **Frontstage (User Actions)** | **Backstage (Processes)** | **Systems / Tools** | **Outputs / Value** | **Metrics** |
|----------|--------------------------------|----------------------------|----------------------|----------------------|-------------|
| **1. Login & Access** | User logs into CouncilWorks dashboard or mobile app. | Role-based access applied; user session validated. | API Gateway, Auth service (OAuth2/SSO), Postgres | Personalised dashboard view. | Login success %, failed logins, active users. |
| **2. Asset Data Capture** | Asset Manager imports assets or Crew records an inspection in field. | Data validation, standardisation, and mapping to asset model. | ERP integration, Mobile PWA, Postgres + PostGIS | Updated register with location, type, and condition. | Number of assets imported, inspection completion rate. |
| **3. Preventive Maintenance Scheduling** | Supervisor views upcoming jobs and work orders. | RCM-lite templates generate schedules; jobs auto-prioritised by risk. | Analytics Engine (Python), Scheduler Service, DB | Work order queue aligned to risk and lifecycle stage. | % preventive vs reactive jobs, overdue tasks. |
| **4. Citizen Issue Report** | Citizen reports a playground fault via portal/Snap Send Solve. | Report normalised, linked to asset, converted into work order. | API Gateway, Citizen App integration, DB | Seamless intake of citizen issues into workflows. | Avg. citizen-to-work-order processing time. |
| **5. Work Order Assignment** | Depot Manager assigns jobs to crews. | Auto-routing rules suggest crew allocation based on skills/geography. | API Gateway, Mobile PWA, Workforce management | Jobs appear instantly in crew mobile queue. | % jobs assigned on time, crew utilisation rate. |
| **6. Field Execution** | Crew inspects/repairs asset; uploads condition data and photos. | Offline sync stores updates until connectivity restored. | Mobile PWA, API Gateway, DB | Asset lifecycle updated; work order closed. | Avg. job completion time, % jobs with supporting photos. |
| **7. Risk & Compliance Reporting** | Manager generates audit report. | Analytics engine compiles history, tasks, risk scores. | Analytics Engine, Reporting Module, DB | Audit-ready compliance pack (exportable PDF/Excel). | Audit report generation time, # compliance breaches detected. |
| **8. Forecasting & Planning** | Exec reviews 10-year renewal forecast. | Lifecycle models simulate repair vs replace; budget scenarios generated. | Python Analytics, ERP data feed, Dashboards | CapEx/OpEx decision support, funding justification. | Forecast accuracy, replacement deferrals, ROI. |
| **9. Executive Briefing** | Councillor views high-level KPI dashboard. | Aggregates data into plain-English summaries. | Dashboards (Next.js), API Gateway | Evidence for council meetings and community briefings. | Exec dashboard usage, citizen satisfaction survey scores. |
| **10. Sustainability & Future Assets** | Exec reviews EV fleet/solar farm performance. | IoT/telematics feed into analytics, carbon footprint calculated. | IoT integration, Analytics Engine, Sustainability Module | Emissions reduction metrics and ROI tracking. | % assets reporting telemetry, CO₂ saved vs baseline. |

---

## Detailed Process Blueprint

| Stage | Frontstage (User Actions) | Backstage (Support Processes) | Systems | Outputs/Evidence | Metrics |
|------|----------------------------|-------------------------------|---------|------------------|---------|
| Login & Overview | Exec opens dashboard | RBAC checks, session validation | Next.js, NextAuth, API | KPI snapshot with council branding | p95 load time, auth errors |
| Inspection | Crew submits via mobile (offline capable) | Sync queue, validation, image upload | PWA, API, Object Storage | Condition updated, photos stored | sync latency, failure rate |
| Preventive Schedule | Supervisor reviews jobs | RCM‑lite engine generates plan | Python worker, Postgres | Work orders created | schedule adherence, utilisation |
| Citizen Report | Citizen logs fault | Data normalisation, deduplication | API gateway, Postgres | Work order created/triaged | intake volume, triage time |
| Execution | Crew closes job | Update lifecycle, audit log | PWA, API, DB | Compliance logged, costs captured | closure time, repeat faults |
| Forecasting | Manager runs scenario | Model simulates, caches results | Python, Postgres | Budget forecast | accuracy vs actuals |
| Reporting | Exec exports | Compile datasets, generate PDFs | Reporting engine | Audit pack in PDF/CSV | time-to-export, errors |

---

## Supporting Processes
- **User Support**: Helpdesk, knowledge base, onboarding training modules.  
- **Data Migration**: Assisted import from ERP/legacy systems.  
- **Configuration**: Customise templates, workflows, and dashboards per council.  
- **Continuous Improvement**: Pilots run as *PilotWorks* streams; successful modules promoted to full product.  

---

## Service Layers
1. **Frontstage** – Users: citizens, crews, supervisors, managers, executives.  
2. **Backstage** – CouncilWorks processes: scheduling, validation, reporting, analytics.  
3. **Systems** – Platform stack: API Gateway (Node.js), Analytics Engine (Python), PostgreSQL + PostGIS, Next.js frontend, PWA mobile.  
4. **Support** – Training, support desk, SLA-based response, continuous release updates.  
5. **Metrics Layer** – Operational KPIs, compliance stats, community satisfaction indicators.

---

## Swimlane Narrative
- Crew members operate predominantly in the PWA; offline work is queued and reconciled with merge policies upon connectivity.
- Supervisors balance preventive and corrective work orders, supported by risk and condition trends.
- Managers configure templates and run scenarios to inform budgets and strategic plans.
- Executives and Councillors consume curated dashboards and exports for governance and public transparency.

---

## End-to-End Experience Example: Playground Safety
1. Citizen reports broken swing via portal.  
2. Report auto-converted into work order.  
3. Supervisor sees high-priority safety job.  
4. Crew dispatched via mobile, repairs swing, uploads photo.  
5. Asset condition updated; compliance log generated.  
6. Manager runs safety compliance dashboard.  
7. Councillor references "you said, we did" dashboard in council meeting.  

**Outcome**: Transparent, auditable, citizen-visible process from issue raised → issue resolved.

---

## Pain Points & Remedies
- Connectivity gaps: offline-first app, conflict resolution, user prompts.
- GIS performance: spatial indexes, tile caching, simplified geometries.
- ERP complexity: adapter layer, idempotent sync, reconciliation reports.

---

## Blueprint Outcomes
- **Operational Efficiency**: More preventive work, less reactive firefighting.  
- **Compliance Readiness**: Audit packs generated automatically.  
- **Community Trust**: Citizens see how issues are addressed.  
- **Strategic Value**: Councils can forecast, justify budgets, and extend asset life.
