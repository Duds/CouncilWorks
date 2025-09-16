# Journey-Centric UX Design Plan for CouncilWorks Sidebar

## Executive Summary

This document outlines a comprehensive plan to transform the CouncilWorks sidebar from a feature-centric menu to a journey-centric workflow interface. The plan addresses user persona needs, industry-standard roles, and implements best practices for intuitive navigation.

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

## Current Sidebar Analysis Against User Journeys

### Current Sidebar Items → Journey Mapping

| Current Item | Primary Persona | Journey Stage | Current Status |
|--------------|-----------------|---------------|----------------|
| Dashboard | EXEC, MGR, SUP | Discovery/Monitoring | ✅ Implemented |
| Assets | MGR, PLANNER | Planning/Management | ✅ Implemented |
| RCM Templates | MGR, PLANNER | Planning/Configuration | ✅ Implemented |
| Maintenance | SUP, PLANNER | Planning/Scheduling | ✅ Implemented |
| Asset Map | SUP, CREW | Execution/Navigation | ✅ Implemented |
| Risk Analysis | MGR, EXEC | Planning/Analysis | ✅ Implemented |
| Risk & Compliance | EXEC, MGR | Monitoring/Reporting | ✅ Implemented |
| Asset Trending | MGR, EXEC | Analysis/Reporting | ✅ Implemented |
| Custom Reports | EXEC, MGR | Reporting/Analysis | ✅ Implemented |
| Report Triage | SUP, MGR | Execution/Management | ✅ Implemented |
| Notifications | ALL | Communication | ✅ Implemented |
| Settings | ADMIN | Configuration | ✅ Implemented |
| Team | SUP, MGR | Management | ❌ Placeholder |
| Help | ALL | Support | ❌ Placeholder |

### Missing Items → Journey Mapping

| Missing Item | Primary Persona | Journey Stage | Priority |
|--------------|-----------------|---------------|----------|
| Work Orders | SUP, CREW | Execution/Assignment | HIGH |
| Field Tool | CREW | Execution/Inspection | HIGH |
| SLA Management | MGR, SUP | Management/Monitoring | MEDIUM |
| Vendor Portal | MGR, SUP | Management/Coordination | MEDIUM |
| Sustainability | EXEC, MGR | Monitoring/Reporting | MEDIUM |
| Critical Controls | SUP, MGR | Execution/Compliance | HIGH |
| Import/Export | ADMIN, MGR | Configuration/Data | MEDIUM |
| Activity Logs | ADMIN, MGR | Monitoring/Audit | MEDIUM |

## Proposed Journey-Centric Navigation Structure

### 1. Strategic Overview (Executive Focus)
**Primary Personas**: EXEC, MGR
**Journey Stage**: Discovery, Monitoring, Reporting

```
📊 Strategic Overview
├── Dashboard (KPI overview)
├── Risk & Compliance (compliance monitoring)
├── Asset Trending (performance analysis)
└── Custom Reports (executive reporting)
```

### 2. Asset Planning (Planning Focus)
**Primary Personas**: MGR, PLANNER
**Journey Stage**: Planning, Configuration, Analysis

```
🏗️ Asset Planning
├── Asset Register (inventory management)
├── RCM Templates (maintenance planning)
├── Risk Analysis (asset risk assessment)
├── Maintenance Planning (scheduling)
└── Sustainability (environmental impact)
```

### 3. Operations Management (Execution Focus)
**Primary Personas**: SUP, CREW, MGR
**Journey Stage**: Execution, Assignment, Coordination

```
⚙️ Operations Management
├── Work Orders (task management)
├── Field Operations (mobile inspections)
├── Asset Map (spatial navigation)
├── Team Management (crew coordination)
└── Critical Controls (compliance execution)
```

### 4. Community Engagement (Citizen Focus)
**Primary Personas**: CITIZEN, SUP, MGR
**Journey Stage**: Communication, Transparency, Feedback

```
👥 Community Engagement
├── Report Triage (citizen issue management)
├── Public Dashboard ("You said, we did")
├── Citizen Portal (issue reporting)
└── Notifications (communication)
```

### 5. System Administration (Admin Focus)
**Primary Personas**: ADMIN
**Journey Stage**: Configuration, Management, Monitoring

```
🔧 System Administration
├── User Management (role & permissions)
├── Data Management (import/export)
├── Activity Logs (audit trails)
├── System Settings (configuration)
└── Help & Support (knowledge base)
```

## Detailed Workflow Groups with Page Tabs

### Group 1: Strategic Overview
**Purpose**: High-level monitoring and executive decision-making

**Page Tabs**:
1. **Dashboard** - KPI overview, performance metrics
2. **Compliance** - Risk & compliance monitoring
3. **Trends** - Asset condition trending
4. **Reports** - Custom report builder

**User Flow**: EXEC → Dashboard → Compliance → Trends → Reports → Export

### Group 2: Asset Planning
**Purpose**: Asset lifecycle planning and maintenance strategy

**Page Tabs**:
1. **Register** - Asset inventory and details
2. **Templates** - RCM maintenance templates
3. **Risk** - Risk analysis and scoring
4. **Planning** - Maintenance scheduling
5. **Sustainability** - Environmental impact tracking

**User Flow**: MGR/PLANNER → Register → Templates → Risk → Planning → Sustainability

### Group 3: Operations Management
**Purpose**: Day-to-day operations and field execution

**Page Tabs**:
1. **Work Orders** - Task assignment and tracking
2. **Field Tool** - Mobile inspection interface
3. **Map** - Spatial asset navigation
4. **Team** - Crew management and coordination
5. **Controls** - Critical control management

**User Flow**: SUP → Work Orders → Team → Map → Field Tool → Controls

### Group 4: Community Engagement
**Purpose**: Citizen interaction and public transparency

**Page Tabs**:
1. **Triage** - Citizen report management
2. **Public** - "You said, we did" dashboard
3. **Portal** - Citizen reporting interface
4. **Notifications** - Communication management

**User Flow**: SUP/MGR → Triage → Portal → Public → Notifications

### Group 5: System Administration
**Purpose**: System configuration and user management

**Page Tabs**:
1. **Users** - User and role management
2. **Data** - Import/export tools
3. **Logs** - Activity and audit trails
4. **Settings** - System configuration
5. **Help** - Knowledge base and support

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

This journey-centric approach transforms the sidebar from a feature list into an intuitive workflow system that aligns with user personas and their daily tasks. By grouping related features and implementing page tabs, users can follow natural workflows while maintaining access to all necessary tools.

The proposed structure reduces cognitive load, improves task completion rates, and creates a more professional, enterprise-grade user experience that matches the sophistication of the CouncilWorks platform.
