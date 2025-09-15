# Service Blueprint – Aegrid

Aegrid connects front-line crews, council managers, executives, and citizens through a unified asset lifecycle intelligence platform. This blueprint outlines how the service operates across frontstage (user actions), backstage (internal processes), enabling systems, and support layers.

---

## High-Level Blueprint

| **Step** | **Frontstage (User Actions)** | **Backstage (Processes)** | **Systems / Tools** | **Outputs / Value** | **Metrics** |
|----------|--------------------------------|----------------------------|----------------------|----------------------|-------------|
| **1. Login & Access** | User logs into Aegrid dashboard or mobile app. | Role-based access applied; user session validated. | API Gateway, Auth service (OAuth2/SSO), Postgres | Personalised dashboard view. | Login success %, failed logins, active users. |
| **2. Asset Data Capture** | Asset Manager imports assets or Crew records an inspection in field. | Data validation, standardisation, and mapping to asset model. | ERP integration, Mobile PWA, Postgres + PostGIS | Updated register with location, type, and condition. | Number of assets imported, inspection completion rate. |
| **3. Preventive Maintenance Scheduling** | Supervisor views upcoming jobs and work orders. | RCM-lite templates generate schedules; jobs auto-prioritised by risk. | Analytics Engine (Python), Scheduler Service, DB | Work order queue aligned to risk and lifecycle stage. | % preventive vs reactive jobs, overdue tasks. |
| **4. Citizen Issue Report** | Citizen reports a playground fault via portal/Snap Send Solve. | Report normalised, linked to asset, converted into work order. | API Gateway, Citizen App integration, DB | Seamless intake of citizen issues into workflows. | Avg. citizen-to-work-order processing time. |
| **5. Work Order Assignment** | Depot Manager assigns jobs to crews. | Auto-routing rules suggest crew allocation based on skills/geography. | API Gateway, Mobile PWA, Workforce management | Jobs appear instantly in crew mobile queue. | % jobs assigned on time, crew utilisation rate. |
| **6. Field Execution** | Crew inspects/repairs asset; uploads condition data and photos. | Offline sync stores updates until connectivity restored. | Mobile PWA, API Gateway, DB | Asset lifecycle updated; work order closed. | Avg. job completion time, % jobs with supporting photos. |
| **7. Risk & Compliance Reporting** | Manager generates audit report. | Analytics engine compiles history, tasks, risk scores. | Analytics Engine, Reporting Module, DB | Audit-ready compliance pack (exportable PDF/Excel). | Audit report generation time, # compliance breaches detected. |
| **8. Forecasting & Planning** | Exec reviews 10-year renewal forecast. | Lifecycle models simulate repair vs replace; budget scenarios generated. | Python Analytics, ERP data feed, Dashboards | CapEx/OpEx decision support, funding justification. | Forecast accuracy, replacement deferrals, ROI. |
| **9. Executive Briefing** | Councillor views high-level KPI dashboard. | Aggregates data into plain-English summaries. | Dashboards (Next.js), API Gateway | Evidence for council meetings and community briefings. | Exec dashboard usage, citizen satisfaction survey scores. |
| **10. Sustainability & Future Assets** | Exec reviews EV fleet/solar farm performance. | IoT/telematics feed into analytics, carbon footprint calculated. | IoT integration, Analytics Engine, Sustainability Module | Emissions reduction metrics and ROI tracking. | % assets reporting telemetry, CO₂ saved vs baseline. |
| **11. SLA & SLM** | Vendor views assigned work orders and uploads evidence. | SLA timers track response/resolution; contract association validated; alerts on breach. | Vendor Portal (RBAC), API Gateway, Scheduler/Timer Service, DB, Notifications | SLA status (met/breached), auditable evidence, contract performance insights. | SLA compliance %, breaches, mean time to respond/resolve, contract renewal alerts. |
| **12. Critical Controls (CCT)** | Supervisor tags asset/task as critical control; monitors compliance. | Critical control rules enforced; escalations triggered if at risk. | API Gateway, Rules Engine, Notifications, DB | Guaranteed execution or escalation for critical tasks. | Critical control compliance %, time-at-risk, escalations raised/cleared. |

---

## Detailed Process Blueprint

| Stage | Frontstage (User Actions) | Backstage (Support Processes) | Systems | Outputs/Evidence | Metrics |
|------|----------------------------|-------------------------------|---------|------------------|---------|
| Login & Overview | Exec opens dashboard | RBAC checks, session validation | Next.js, NextAuth, API | KPI snapshot with council branding | p95 load time, auth errors |
| Inspection | Crew submits via mobile (offline capable) | Sync queue, validation, image upload | PWA, API, Object Storage | Condition updated, photos stored | sync latency, failure rate |
| Preventive Schedule | Supervisor reviews jobs | RCM‑lite engine generates plan | Python worker, Postgres | Work orders created | schedule adherence, utilisation |
| Citizen Report | Citizen logs fault | Data normalisation, deduplication | API gateway, Postgres | Work order created/triaged | intake volume, triage time |
| Execution | Crew closes job | Update lifecycle, audit log | PWA, API, DB | Compliance logged, costs captured | closure time, repeat faults |
| Critical Control Enforcement | Supervisor configures control; crew performs mandated task | Validate execution within window; trigger escalation if overdue/at-risk | Rules Engine, API, Notifications | Control compliance captured; escalation trail | control compliance %, time-at-risk |
| Forecasting | Manager runs scenario | Model simulates, caches results | Python, Postgres | Budget forecast | accuracy vs actuals |
| Reporting | Exec exports | Compile datasets, generate PDFs | Reporting engine | Audit pack in PDF/CSV | time-to-export, errors |
| SLA Tracking & Vendor Portal | Vendor accepts/completes job; uploads photos/invoice | Start/stop SLA timers; validate evidence; link to contract; notify on breach | Vendor Portal, API, Object Storage, Notifications | Timestamped updates, GPS photos, invoice attachments; SLA status | SLA met %, breaches, average response/resolution time |

---

## Supporting Processes
- **User Support**: Helpdesk, knowledge base, onboarding training modules.  
- **Data Migration**: Assisted import from ERP/legacy systems.  
- **Configuration**: Customise templates, workflows, and dashboards per council.  
- **Continuous Improvement**: Pilots run as *PilotWorks* streams; successful modules promoted to full product.  
- **Contract Management**: Vendor onboarding, contract records (start/end, scope, SLAs), renewal notifications, performance reviews.  
- **Critical Controls Configuration**: Identify critical assets, define control rules/windows, map to RCM tasks, and maintain escalation paths.

---

## Service Layers
1. **Frontstage** – Users: citizens, crews, supervisors, managers, executives.  
2. **Backstage** – Aegrid processes: scheduling, validation, reporting, analytics, SLA timers and alerts.  
3. **Systems** – Platform stack: API Gateway (Node.js), Analytics Engine (Python), PostgreSQL + PostGIS, Next.js frontend, PWA mobile.  
4. **Support** – Training, support desk, SLA-based response, contract performance, continuous release updates.  
5. **Metrics Layer** – Operational KPIs, SLA compliance, contract health, community satisfaction indicators.

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

## End-to-End Experience Example: Graffiti Removal under SLA
1. Citizen reports graffiti via portal.  
2. Work order created with contract link and `SLA: 48 hours`.  
3. Vendor notified via portal/email; accepts job.  
4. SLA response timer stops on acceptance; resolution timer runs until closure.  
5. Vendor uploads GPS-stamped photos and notes; optionally invoices.  
6. System validates evidence and closes job; marks SLA Met/Breached.  
7. Manager reviews vendor SLA dashboard; breaches trigger alerts and contract review tasks.  

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
