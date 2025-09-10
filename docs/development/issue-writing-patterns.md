# Issue Writing Patterns

Last updated: 10/09/2025
Owner: Development Team

## Overview

This document defines the standard patterns for writing GitHub issues in the CouncilWorks project. All issues should follow these patterns to ensure consistency, clarity, and proper project management.

## Issue Types and Patterns

### 1. Epic Issues

**Format**: `E#: [Epic Name]`

**Structure**:
```markdown
## Epic: [Epic Name]

**Goal**: [High-level goal statement]
**Value**: [Business value and impact]

## Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Acceptance Criteria
- [ ] [High-level acceptance criteria]
- [ ] [Another acceptance criteria]

## Priority: [High/Medium/Low]
## Sprint: [Sprint identifier]
```

**Example**:
```markdown
## Epic: Foundation & Authentication

**Goal**: Establish secure, multi-tenant foundation with role-based access control
**Value**: Secure platform foundation enabling council-specific data isolation

## Features
- Multi-tenant database architecture with RLS
- NextAuth.js authentication with JWT sessions
- Role-based access control (RBAC) implementation

## Acceptance Criteria
- [ ] Multi-tenant database setup with Row-Level Security
- [ ] NextAuth.js configured with JWT sessions
- [ ] RBAC system with roles: ADMIN, MANAGER, SUPERVISOR, CREW, EXEC, CITIZEN

## Priority: High
## Sprint: MVP-1
```

### 2. Feature Issues

**Format**: `F#.#: [Feature Name]`

**Structure**:
```markdown
## Feature: [Feature Name]

**Epic**: [Epic reference]

**Goal**: [Specific feature goal]

## User Stories
- [User story reference or description]

## Acceptance Criteria
- [ ] [Specific acceptance criteria]
- [ ] [Another acceptance criteria]

## Technical Tasks
- [Technical task 1]
- [Technical task 2]

## Priority: [High/Medium/Low]
## Story Points: [Number]
```

**Example**:
```markdown
## Feature: Multi-tenant Database Architecture with RLS

**Epic**: E1: Foundation & Authentication

**Goal**: Set up PostgreSQL with PostGIS and implement Row-Level Security for multi-tenancy

## User Stories
- As an Admin, I want to set up my council organisation so that I can configure the system for my council
- As a user, I want my data to be isolated from other councils so that privacy is maintained

## Acceptance Criteria
- [ ] PostgreSQL database with PostGIS extension
- [ ] Prisma ORM setup with migrations
- [ ] Row-Level Security (RLS) policies implemented

## Technical Tasks
- Set up PostgreSQL with PostGIS extension
- Implement Prisma ORM with migrations
- Set up Row-Level Security (RLS) policies

## Priority: High
## Story Points: 8
```

### 3. User Story Issues

**Format**: `US#.#: As a [role], I want [goal]`

**Structure**:
```markdown
## User Story: [Story Title]

**As a** [User Role]  
**I want to** [Goal/Action]  
**So that** [Value/Benefit]

## Acceptance Criteria
- [ ] [Specific acceptance criteria]
- [ ] [Another acceptance criteria]

## Definition of Done
- [ ] Feature implemented and tested
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed and approved

## Priority: [High/Medium/Low]
## Story Points: [Number]
```

**Example**:
```markdown
## User Story: Organisation Setup

**As an** Admin  
**I want to** set up my council organisation  
**So that** I can configure the system for my council

## Acceptance Criteria
- [ ] Admin can create new organisation
- [ ] Organisation details can be configured (name, address, contact info)
- [ ] Organisation settings can be customised
- [ ] Multi-tenant isolation is enforced

## Definition of Done
- [ ] Feature implemented and tested
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Documentation updated
- [ ] Code reviewed and approved

## Priority: High
## Story Points: 5
```

### 4. Task Issues

**Format**: `Task: [Task Description]`

**Structure**:
```markdown
## Task: [Task Title]

**Purpose**: [Why this task is needed]
**Epic/Feature**: [Related epic or feature]

## Description
[Detailed description of the task]

## Acceptance Criteria
- [ ] [Specific acceptance criteria]
- [ ] [Another acceptance criteria]

## Technical Details
- [Technical requirement 1]
- [Technical requirement 2]

## Priority: [High/Medium/Low]
## Story Points: [Number]
```

**Example**:
```markdown
## Task: Set up PostgreSQL with PostGIS Extension

**Purpose**: Establish spatial database capabilities for asset management
**Epic/Feature**: E1: Foundation & Authentication / F1.1: Multi-tenant Database Architecture

## Description
Set up PostgreSQL database with PostGIS extension to support spatial data for asset management, including geometry storage, spatial indexing, and spatial queries.

## Acceptance Criteria
- [ ] PostgreSQL installed and configured
- [ ] PostGIS extension installed and enabled
- [ ] Spatial reference systems configured
- [ ] Database connection tested
- [ ] Spatial data types verified

## Technical Details
- PostgreSQL 15+ required
- PostGIS 3.3+ extension
- Australian coordinate reference systems (GDA2020, GDA94)
- Spatial indexing for performance

## Priority: High
## Story Points: 3
```

### 5. Bug Issues

**Format**: `Bug: [Bug Description]`

**Structure**:
```markdown
## Bug: [Bug Title]

**Severity**: [Critical/High/Medium/Low]
**Component**: [Affected component or feature]

## Description
[Detailed description of the bug]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- [Environment details]
- [Browser/Device information]
- [Version information]

## Acceptance Criteria
- [ ] Bug is fixed
- [ ] Test case added to prevent regression
- [ ] Documentation updated if needed

## Priority: [High/Medium/Low]
```

**Example**:
```markdown
## Bug: Sync Issue in Offline Mode

**Severity**: High
**Component**: Mobile PWA / Offline Sync

## Description
When users perform inspections offline and then reconnect, some data fails to sync properly, resulting in lost inspection data.

## Steps to Reproduce
1. Open mobile app in offline mode
2. Perform an inspection with photos
3. Reconnect to internet
4. Wait for sync to complete
5. Check if inspection data is present

## Expected Behavior
All offline inspection data should sync successfully when connectivity is restored.

## Actual Behavior
Some inspection data, particularly photos, fails to sync and is lost.

## Environment
- Mobile PWA
- iOS Safari / Android Chrome
- Version 1.0.0

## Acceptance Criteria
- [ ] All offline data syncs successfully
- [ ] Sync conflict resolution works properly
- [ ] Error handling for failed syncs
- [ ] Test cases added for offline sync scenarios

## Priority: High
```

## Labeling Standards

### Required Labels
- **epic**: For epic issues
- **feature**: For feature issues
- **story**: For user story issues
- **task**: For task issues
- **bug**: For bug issues

### Optional Labels
- **backend**: For backend-related work
- **frontend**: For frontend-related work
- **dashboard**: For dashboard-related work
- **documentation**: For documentation work
- **enhancement**: For enhancement requests

## Priority Levels

- **High**: Critical for MVP or blocking other work
- **Medium**: Important but not blocking
- **Low**: Nice to have or future enhancement

## Story Points

Use Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21

- **1-2**: Simple tasks, minor fixes
- **3-5**: Small features, straightforward tasks
- **8**: Medium complexity features
- **13**: Complex features requiring significant work
- **21**: Very complex features or major architectural changes

## Sprint Planning

- **MVP-1**: Foundation and core authentication
- **MVP-2**: Asset management and mobile inspections
- **MVP-3**: Dashboards and citizen integration
- **Future**: Post-MVP enhancements

## Best Practices

1. **Clear Titles**: Use descriptive, action-oriented titles
2. **Consistent Format**: Follow the established patterns exactly
3. **Complete Information**: Include all required sections
4. **Proper Linking**: Reference related epics, features, and stories
5. **Acceptance Criteria**: Make criteria specific and testable
6. **Story Points**: Estimate effort realistically
7. **Labels**: Use appropriate labels for filtering and organisation
8. **Australian English**: Use Australian spelling and terminology
9. **Date Format**: Use DD/MM/YYYY format
10. **Time Format**: Use 24-hour time format

## Examples of Good vs Bad Issues

### Good Epic Title
✅ `E1: Foundation & Authentication`

### Bad Epic Title
❌ `Authentication stuff`

### Good Feature Title
✅ `F1.1: Multi-tenant Database Architecture with RLS`

### Bad Feature Title
❌ `Database setup`

### Good User Story Title
✅ `US1.1: As an Admin, I want to set up my council organisation`

### Bad User Story Title
❌ `Admin setup`

## Review Checklist

Before creating or updating issues, ensure:

- [ ] Title follows the correct format
- [ ] All required sections are included
- [ ] Acceptance criteria are specific and testable
- [ ] Proper labels are applied
- [ ] Priority and story points are assigned
- [ ] Related issues are linked
- [ ] Australian English is used throughout
- [ ] Formatting is consistent with examples

## Related Documentation

- [Developer Brief](../development/developer-brief.md)
- [Testing Guide](../development/testing-guide.md)
- [RBAC Implementation](../security/rbac-implementation.md)
- [Product Backlog](../TODO.md)
