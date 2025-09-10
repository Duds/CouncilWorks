# CouncilWorks Product Backlog

Last updated: 10/09/2025

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
