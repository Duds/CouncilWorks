# Journey-Centric UX Design Plan for Aegrid

## Executive Summary

This document outlines a comprehensive plan to transform the Aegrid sidebar from a feature-centric menu to a journey-centric workflow interface that embodies The Aegrid Rules. The plan addresses user persona needs, industry-standard roles, and implements best practices for intuitive navigation while ensuring every interaction supports the resilience-first philosophy.

## Industry Research: Asset Planner vs Scheduler

Based on industry research, both roles exist but serve different functions:

### Asset Planner

- **Focus**: Determines WHAT maintenance work needs to be done
- **Responsibilities**:
  - Develop detailed work plans
  - Ensure necessary resources (personnel, materials) are available
  - Maintain accurate records of planned activities
  - Asset lifecycle planning and renewal forecasting

### Asset Scheduler

- **Focus**: Determines WHEN work will take place and WHO will perform it
- **Responsibilities**:
  - Create and manage maintenance schedules
  - Coordinate with teams to assign tasks
  - Adjust schedules based on resource availability and priorities
  - Work order assignment and crew coordination

**Recommendation**: In Australian local government context, "Asset Planner" is more common and encompasses both planning and scheduling functions. We'll use "Asset Planner" as the primary role.

## Current Sidebar Analysis Against User Journeys & The Aegrid Rules

### Current Sidebar Items → Journey Mapping & Aegrid Rules Alignment

| Current Item      | Primary Persona | Journey Stage          | Aegrid Rules                 | Current Status |
| ----------------- | --------------- | ---------------------- | ---------------------------- | -------------- |
| Dashboard         | EXEC, MGR, SUP  | Discovery/Monitoring   | Rule 3: Real-World Response  | ✅ Implemented |
| Assets            | MGR, PLANNER    | Planning/Management    | Rule 1: Every Asset Purpose  | ✅ Implemented |
| RCM Templates     | MGR, PLANNER    | Planning/Configuration | Rule 2: Risk Sets Rhythm     | ✅ Implemented |
| Maintenance       | SUP, PLANNER    | Planning/Scheduling    | Rule 2: Risk Sets Rhythm     | ✅ Implemented |
| Asset Map         | SUP, CREW       | Execution/Navigation   | Rule 1: Asset Purpose        | ✅ Implemented |
| Risk Analysis     | MGR, EXEC       | Planning/Analysis      | Rule 2: Risk Sets Rhythm     | ✅ Implemented |
| Risk & Compliance | EXEC, MGR       | Monitoring/Reporting   | Rule 3: Protect Critical Few | ✅ Implemented |
| Asset Trending    | MGR, EXEC       | Analysis/Reporting     | Rule 4: Plan for Tomorrow    | ✅ Implemented |
| Custom Reports    | EXEC, MGR       | Reporting/Analysis     | Rule 4: Plan for Tomorrow    | ✅ Implemented |
| Report Triage     | SUP, MGR        | Execution/Management   | Rule 3: Real-World Response  | ✅ Implemented |
| Notifications     | ALL             | Communication          | Rule 3: Real-World Response  | ✅ Implemented |
| Settings          | ADMIN           | Configuration          | All Rules Support            | ✅ Implemented |
| Team              | SUP, MGR        | Management             | Rule 4: Margin Management    | ❌ Placeholder |
| Help              | ALL             | Support                | All Rules Support            | ❌ Placeholder |

### Missing Items → Journey Mapping & Aegrid Rules Alignment

| Missing Item      | Primary Persona | Journey Stage           | Aegrid Rules                 | Priority |
| ----------------- | --------------- | ----------------------- | ---------------------------- | -------- |
| Work Orders       | SUP, CREW       | Execution/Assignment    | Rule 3: Real-World Response  | HIGH     |
| Field Tool        | CREW            | Execution/Inspection    | Rule 3: Real-World Response  | HIGH     |
| SLA Management    | MGR, SUP        | Management/Monitoring   | Rule 3: Protect Critical Few | MEDIUM   |
| Vendor Portal     | MGR, SUP        | Management/Coordination | Rule 4: Margin Management    | MEDIUM   |
| Sustainability    | EXEC, MGR       | Monitoring/Reporting    | Rule 4: Plan for Tomorrow    | MEDIUM   |
| Critical Controls | SUP, MGR        | Execution/Compliance    | Rule 3: Protect Critical Few | HIGH     |
| Import/Export     | ADMIN, MGR      | Configuration/Data      | All Rules Support            | MEDIUM   |
| Activity Logs     | ADMIN, MGR      | Monitoring/Audit        | Rule 3: Real-World Response  | MEDIUM   |

## Proposed Journey-Centric Navigation Structure - Aligned with The Aegrid Rules

### 1. Resilience Overview (Executive Focus)

**Primary Personas**: EXEC, MGR
**Journey Stage**: Discovery, Monitoring, Reporting
**Aegrid Rules**: Rule 3 (Real-World Response), Rule 4 (Plan for Tomorrow)

```
📊 Resilience Overview
├── Resilience Dashboard (critical control monitoring)
├── Risk & Compliance (compliance monitoring)
├── Asset Trending (performance analysis)
└── Strategic Reports (executive reporting)
```

### 2. Critical Control Planning (Planning Focus)

**Primary Personas**: MGR, PLANNER
**Journey Stage**: Planning, Configuration, Analysis
**Aegrid Rules**: Rule 1 (Every Asset Purpose), Rule 2 (Risk Sets Rhythm)

```
🏗️ Critical Control Planning
├── Asset Purpose Mapping (critical control connections)
├── Risk-Based Templates (maintenance planning)
├── Risk Analysis (consequence × likelihood)
├── Adaptive Scheduling (dynamic planning)
└── Sustainability Planning (future resilience)
```

### 3. Real-World Operations (Execution Focus)

**Primary Personas**: SUP, CREW, MGR
**Journey Stage**: Execution, Assignment, Coordination
**Aegrid Rules**: Rule 3 (Real-World Response), Rule 4 (Margin Management)

```
⚙️ Real-World Operations
├── Signal Response (adaptive work orders)
├── Field Operations (mobile inspections)
├── Asset Map (spatial navigation)
├── Margin Management (crew coordination)
└── Critical Controls (compliance execution)
```

### 4. Community Signal Detection (Citizen Focus)

**Primary Personas**: CITIZEN, SUP, MGR
**Journey Stage**: Communication, Transparency, Feedback
**Aegrid Rules**: Rule 3 (Real-World Response), Rule 1 (Purpose-Driven Service)

```
👥 Community Signal Detection
├── Signal Triage (community issue management)
├── Public Dashboard ("You said, we did")
├── Citizen Portal (issue reporting)
└── Signal Notifications (real-time communication)
```

### 5. System Administration (Admin Focus)

**Primary Personas**: ADMIN
**Journey Stage**: Configuration, Management, Monitoring
**Aegrid Rules**: All Rules Support

```
🔧 System Administration
├── User Management (role & permissions)
├── Data Management (import/export)
├── Activity Logs (audit trails)
├── System Settings (configuration)
└── Help & Support (knowledge base)
```

## Detailed Workflow Groups with Page Tabs - Aligned with The Aegrid Rules

### Group 1: Resilience Overview

**Purpose**: High-level resilience monitoring and executive decision-making
**Aegrid Rules**: Rule 3 (Real-World Response), Rule 4 (Plan for Tomorrow)

**Page Tabs**:

1. **Resilience Dashboard** - Critical control monitoring, risk signals, margin status
2. **Compliance** - Risk & compliance monitoring, critical control effectiveness
3. **Trends** - Asset condition trending, resilience metrics
4. **Strategic Reports** - Executive reporting, future planning insights

**User Flow**: EXEC → Resilience Dashboard → Compliance → Trends → Strategic Reports → Export

### Group 2: Critical Control Planning

**Purpose**: Purpose-driven asset planning and risk-based maintenance strategy
**Aegrid Rules**: Rule 1 (Every Asset Purpose), Rule 2 (Risk Sets Rhythm)

**Page Tabs**:

1. **Purpose Mapping** - Critical control connections, asset purpose validation
2. **Risk Templates** - Risk-based maintenance templates, consequence analysis
3. **Risk Analysis** - Consequence × likelihood analysis, dynamic risk assessment
4. **Adaptive Planning** - Dynamic scheduling, signal-driven adaptation
5. **Sustainability** - Future resilience planning, long-term scenarios

**User Flow**: MGR/PLANNER → Purpose Mapping → Risk Templates → Risk Analysis → Adaptive Planning → Sustainability

### Group 3: Real-World Operations

**Purpose**: Real-time operations and adaptive field execution
**Aegrid Rules**: Rule 3 (Real-World Response), Rule 4 (Margin Management)

**Page Tabs**:

1. **Signal Response** - Adaptive work orders, real-time priority adjustment
2. **Field Operations** - Mobile inspection interface, signal reporting
3. **Asset Map** - Spatial asset navigation, critical control visualization
4. **Margin Management** - Crew coordination, resource allocation, surge capacity
5. **Critical Controls** - Critical control management, emergency response

**User Flow**: SUP → Signal Response → Margin Management → Asset Map → Field Operations → Critical Controls

### Group 4: Community Signal Detection

**Purpose**: Community-driven signal detection and citizen engagement
**Aegrid Rules**: Rule 3 (Real-World Response), Rule 1 (Purpose-Driven Service)

**Page Tabs**:

1. **Signal Triage** - Community signal management, priority assessment
2. **Public Dashboard** - "You said, we did" transparency, signal status
3. **Citizen Portal** - Community reporting interface, signal submission
4. **Signal Notifications** - Real-time communication, signal alerts

**User Flow**: SUP/MGR → Signal Triage → Citizen Portal → Public Dashboard → Signal Notifications

### Group 5: System Administration

**Purpose**: System configuration and user management
**Aegrid Rules**: All Rules Support

**Page Tabs**:

1. **Users** - User and role management, Aegrid Rules training
2. **Data** - Import/export tools, critical control mapping
3. **Logs** - Activity and audit trails, signal processing logs
4. **Settings** - System configuration, resilience parameters
5. **Help** - Knowledge base and support, Aegrid Rules guidance

**User Flow**: ADMIN → Users → Settings → Data → Logs → Help

## UX Best Practices Implementation

### 1. Progressive Disclosure

- **Level 1**: Main workflow groups (5 primary groups)
- **Level 2**: Page tabs within groups
- **Level 3**: Sub-features within tabs
- **Level 4**: Detailed actions and forms

### 2. Contextual Navigation

- Show relevant groups based on user role
- Highlight current journey stage
- Provide breadcrumb navigation within groups
- Implement role-based feature visibility

### 3. Visual Hierarchy

- **Primary Groups**: Large, distinct icons with clear labels
- **Page Tabs**: Medium-sized tabs with descriptive names
- **Actions**: Small buttons with clear CTAs
- **Status Indicators**: Badges for notifications, counts, alerts

### 4. Responsive Design

- **Desktop**: Full sidebar with all groups visible
- **Tablet**: Collapsible groups with tab navigation
- **Mobile**: Bottom navigation with key workflows
- **PWA**: Mobile-optimized workflow groups

### 5. User Feedback Integration

- **Loading States**: Skeleton screens during data loading
- **Success States**: Confirmation messages for completed actions
- **Error States**: Clear error messages with recovery options
- **Empty States**: Helpful guidance for empty sections

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

1. **Create new sidebar component structure**
   - Implement workflow group navigation
   - Add page tab functionality
   - Implement role-based visibility

2. **Update routing structure**
   - Create group-based routes
   - Implement nested tab routing
   - Add breadcrumb navigation

### Phase 2: Content Migration (Weeks 3-4)

1. **Migrate existing features to new structure**
   - Move features to appropriate groups
   - Implement page tab layouts
   - Update navigation links

2. **Implement missing features**
   - Work Orders management
   - Team Management
   - Critical Controls interface
   - Help & Support system

### Phase 3: Enhancement (Weeks 5-6)

1. **Add advanced UX features**
   - Progressive disclosure
   - Contextual navigation
   - Visual hierarchy improvements

2. **Implement responsive design**
   - Mobile optimization
   - Tablet layout
   - PWA enhancements

### Phase 4: Testing & Refinement (Weeks 7-8)

1. **User testing**
   - Conduct usability testing
   - Gather user feedback
   - Iterate based on findings

2. **Performance optimization**
   - Lazy loading for tabs
   - Caching strategies
   - Performance monitoring

## Success Metrics

### User Experience Metrics

- **Task Completion Rate**: % of users completing primary workflows
- **Time to Complete Tasks**: Average time for common operations
- **User Satisfaction**: Survey scores for navigation ease
- **Error Rate**: % of navigation-related errors

### Business Metrics

- **Feature Adoption**: Usage of grouped features vs individual items
- **User Engagement**: Time spent in relevant workflow groups
- **Support Tickets**: Reduction in navigation-related support requests
- **Training Time**: Time required for new user onboarding

## Conclusion

This journey-centric approach transforms the Aegrid sidebar from a feature list into an intuitive workflow system that embodies The Aegrid Rules. By grouping related features around resilience principles and implementing page tabs that support critical control management, users can follow natural workflows that align with the resilience-first philosophy.

The proposed structure reduces cognitive load, improves task completion rates, and creates a more professional, enterprise-grade user experience that matches the sophistication of the Aegrid platform. Every navigation decision supports the four core rules:

- **Rule 1 (Every Asset Purpose)**: Navigation emphasizes critical control connections and purpose-driven asset management
- **Rule 2 (Risk Sets Rhythm)**: Risk-based planning and adaptive scheduling are prominently featured
- **Rule 3 (Real-World Response)**: Signal detection and adaptive response capabilities are central to the workflow
- **Rule 4 (Margin Management)**: Margin operations and resilience planning are integrated throughout

This approach ensures that every user interaction reinforces the resilience-first philosophy and supports the transformation from reactive maintenance to proactive risk management.
