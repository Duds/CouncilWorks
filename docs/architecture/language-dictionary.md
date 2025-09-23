# Aegrid Language Dictionary - Epic 24 Implementation

**Document Purpose**: Comprehensive language dictionary supporting data dictionary and UI labels dictionary for Epic 24: Language Simplification & Visualisation Enhancement

**Version**: 1.0.0
**Last Updated**: 23 September 2025
**Status**: 🚀 **PLANNING** - Ready for Implementation

## 📋 Executive Summary

This document provides a comprehensive language dictionary that standardises all terminology used throughout the Aegrid platform, aligning with ISO 55000 asset management standards and industry best practices. The dictionary supports Epic 24's language simplification objectives and provides the foundation for both data dictionary and UI labels dictionary implementation.

## 🎯 Dictionary Structure

### Categories Covered

1. **Asset Management Core Terms**
2. **Database Field Names & Data Models**
3. **UI Labels & Navigation**
4. **API Endpoints & Functions**
5. **Component Names & Variables**
6. **Status & Priority Terms**
7. **User Roles & Permissions**
8. **Technical & System Terms**

### Format

- **As-Is**: Current term used in the system
- **To-Be**: Standardised industry term
- **Definition**: Clear definition aligned with ISO 55000
- **Context**: Where the term is used
- **Priority**: Implementation priority (High/Medium/Low)

---

## 🏗️ Asset Management Core Terms

### Asset Lifecycle Management

| As-Is             | To-Be             | Definition                                                   | Context                    | Priority |
| ----------------- | ----------------- | ------------------------------------------------------------ | -------------------------- | -------- |
| Asset             | Asset             | Physical or logical entity that has value to an organisation | Database models, UI labels | High     |
| Asset Register    | Asset Register    | Comprehensive inventory of all assets under management       | Navigation, reports        | High     |
| Asset Hierarchy   | Asset Hierarchy   | Structured organisation of assets showing relationships      | Database schema, UI        | High     |
| Asset Condition   | Asset Condition   | Current state of an asset's physical or functional status    | Database enum, forms       | High     |
| Asset Status      | Asset Status      | Current operational state of an asset                        | Database enum, dashboards  | High     |
| Asset Type        | Asset Type        | Classification of assets by their nature or function         | Database enum, filters     | High     |
| Asset Priority    | Asset Priority    | Relative importance of an asset to organisational objectives | Database enum, planning    | High     |
| Asset Criticality | Asset Criticality | Level of importance based on business impact                 | Risk analysis, planning    | High     |
| Asset Performance | Asset Performance | Measure of how well an asset delivers its intended function  | Dashboards, reports        | High     |
| Asset Lifecycle   | Asset Lifecycle   | Complete sequence of phases from acquisition to disposal     | Planning, documentation    | High     |

### Maintenance Management

| As-Is                  | To-Be                  | Definition                                            | Context                 | Priority |
| ---------------------- | ---------------------- | ----------------------------------------------------- | ----------------------- | -------- |
| Work Order             | Work Order             | Authorisation to perform maintenance work on an asset | Database model, UI      | High     |
| Maintenance Schedule   | Maintenance Schedule   | Planned sequence of maintenance activities            | Planning, scheduling    | High     |
| Maintenance Plan       | Maintenance Plan       | Comprehensive strategy for maintaining assets         | RCM templates, planning | High     |
| Inspection             | Inspection             | Systematic examination of asset condition             | Mobile app, forms       | High     |
| Preventive Maintenance | Preventive Maintenance | Maintenance performed at predetermined intervals      | Scheduling, planning    | High     |
| Corrective Maintenance | Corrective Maintenance | Maintenance performed after failure detection         | Work orders, scheduling | High     |
| Predictive Maintenance | Predictive Maintenance | Maintenance based on condition monitoring             | AI features, planning   | High     |
| Maintenance Planner    | Maintenance Planner    | Role responsible for planning maintenance activities  | User roles, permissions | High     |
| Maintenance Supervisor | Maintenance Supervisor | Role responsible for overseeing maintenance execution | User roles, permissions | High     |
| Maintenance Crew       | Maintenance Crew       | Team responsible for performing maintenance work      | User roles, permissions | High     |

### Risk Management

| As-Is             | To-Be                  | Definition                                              | Context                       | Priority |
| ----------------- | ---------------------- | ------------------------------------------------------- | ----------------------------- | -------- |
| Risk Assessment   | Risk Assessment        | Process of identifying and evaluating risks             | Risk analysis, planning       | High     |
| Risk Analysis     | Risk Analysis          | Systematic examination of risk factors                  | Risk management, planning     | High     |
| Risk Management   | Risk Management        | Coordinated activities to direct and control risk       | Risk planning, compliance     | High     |
| Risk Mitigation   | Risk Mitigation        | Actions taken to reduce risk likelihood or impact       | Risk planning, controls       | High     |
| Critical Control  | Critical Control       | Essential control measure for managing significant risk | Risk management, compliance   | High     |
| Risk Signal       | Risk Signal            | Indicator of potential risk or failure                  | Resilience engine, monitoring | High     |
| Risk Rhythm       | Maintenance Scheduling | Regular pattern of risk-based maintenance activities    | Resilience planning           | High     |
| Margin Management | Resource Management    | Management of available resources for risk response     | Resilience planning           | High     |

---

## 🗄️ Database Field Names & Data Models

### Core Asset Fields

| As-Is            | To-Be            | Definition                         | Context        | Priority |
| ---------------- | ---------------- | ---------------------------------- | -------------- | -------- |
| assetNumber      | assetNumber      | Unique identifier for an asset     | Database field | High     |
| assetType        | assetType        | Classification of asset type       | Database enum  | High     |
| assetStatus      | assetStatus      | Current operational status         | Database enum  | High     |
| assetCondition   | assetCondition   | Physical condition assessment      | Database enum  | High     |
| assetPriority    | assetPriority    | Relative importance level          | Database enum  | High     |
| organisationId   | organisationId   | Reference to owning organisation   | Database field | High     |
| location         | location         | Physical location of asset         | Database field | High     |
| address          | address          | Specific address of asset          | Database field | High     |
| suburb           | suburb           | Suburb or district location        | Database field | High     |
| postcode         | postcode         | Postal code of location            | Database field | High     |
| state            | state            | State or territory                 | Database field | High     |
| country          | country          | Country of location                | Database field | High     |
| manufacturer     | manufacturer     | Asset manufacturer                 | Database field | High     |
| model            | model            | Asset model designation            | Database field | High     |
| serialNumber     | serialNumber     | Manufacturer's serial number       | Database field | High     |
| installationDate | installationDate | Date of asset installation         | Database field | High     |
| warrantyExpiry   | warrantyExpiry   | Warranty expiration date           | Database field | High     |
| expectedLifespan | expectedLifespan | Expected operational life in years | Database field | High     |
| purchasePrice    | purchasePrice    | Original purchase cost             | Database field | High     |
| currentValue     | currentValue     | Current market value               | Database field | High     |
| replacementCost  | replacementCost  | Cost to replace asset              | Database field | High     |
| depreciationRate | depreciationRate | Annual depreciation percentage     | Database field | High     |
| lastInspection   | lastInspection   | Date of last inspection            | Database field | High     |
| nextInspection   | nextInspection   | Date of next scheduled inspection  | Database field | High     |

### Work Order Fields

| As-Is              | To-Be              | Definition                          | Context        | Priority |
| ------------------ | ------------------ | ----------------------------------- | -------------- | -------- |
| workOrderNumber    | workOrderNumber    | Unique work order identifier        | Database field | High     |
| workOrderStatus    | workOrderStatus    | Current status of work order        | Database enum  | High     |
| workOrderPriority  | workOrderPriority  | Priority level of work order        | Database enum  | High     |
| workOrderType      | workOrderType      | Type of maintenance work            | Database enum  | High     |
| assignedTo         | assignedTo         | Person assigned to work order       | Database field | High     |
| dueDate            | dueDate            | Scheduled completion date           | Database field | High     |
| estimatedDuration  | estimatedDuration  | Expected time to complete           | Database field | High     |
| actualDuration     | actualDuration     | Actual time taken to complete       | Database field | High     |
| workDescription    | workDescription    | Description of work to be performed | Database field | High     |
| workInstructions   | workInstructions   | Detailed work instructions          | Database field | High     |
| safetyRequirements | safetyRequirements | Safety procedures and requirements  | Database field | High     |
| requiredTools      | requiredTools      | Tools needed for work               | Database field | High     |
| requiredMaterials  | requiredMaterials  | Materials needed for work           | Database field | High     |
| workOrderEvidence  | workOrderEvidence  | Supporting documentation            | Database model | High     |

### User & Organisation Fields

| As-Is          | To-Be          | Definition                     | Context        | Priority |
| -------------- | -------------- | ------------------------------ | -------------- | -------- |
| userId         | userId         | Unique user identifier         | Database field | High     |
| userRole       | userRole       | User's role in the system      | Database enum  | High     |
| organisationId | organisationId | Reference to organisation      | Database field | High     |
| email          | email          | User's email address           | Database field | High     |
| name           | name           | User's full name               | Database field | High     |
| phoneNumber    | phoneNumber    | User's phone number            | Database field | High     |
| timezone       | timezone       | User's timezone                | Database field | High     |
| language       | language       | User's preferred language      | Database field | High     |
| isActive       | isActive       | Whether user account is active | Database field | High     |
| lastLoginAt    | lastLoginAt    | Date of last login             | Database field | High     |
| createdAt      | createdAt      | Account creation date          | Database field | High     |
| updatedAt      | updatedAt      | Last update date               | Database field | High     |

---

## 🎨 UI Labels & Navigation

### Navigation Groups

| As-Is                     | To-Be                 | Definition                                   | Context            | Priority |
| ------------------------- | --------------------- | -------------------------------------------- | ------------------ | -------- |
| Strategic Overview        | Strategic Overview    | High-level executive dashboard and reporting | Sidebar navigation | High     |
| Resilience Command        | Asset Planning        | Asset planning and risk management functions | Sidebar navigation | High     |
| Operations Management     | Operations Management | Day-to-day operational activities            | Sidebar navigation | High     |
| Contractor/Partner Portal | Contractor Portal     | External contractor access and management    | Sidebar navigation | High     |
| Community Engagement      | Community Engagement  | Citizen interaction and reporting            | Sidebar navigation | High     |
| System Administration     | System Administration | System configuration and management          | Sidebar navigation | High     |

### Navigation Items

| As-Is               | To-Be                  | Definition                            | Context         | Priority |
| ------------------- | ---------------------- | ------------------------------------- | --------------- | -------- |
| Strategic Dashboard | Executive Dashboard    | High-level performance overview       | Navigation item | High     |
| Manager Dashboard   | Manager Dashboard      | Manager-level operational overview    | Navigation item | High     |
| Margin Management   | Resource Management    | Resource allocation and management    | Navigation item | High     |
| Demo Showcase       | Demo Showcase          | System demonstration features         | Navigation item | Medium   |
| Asset Performance   | Asset Performance      | Asset performance metrics and trends  | Navigation item | High     |
| Risk Overview       | Risk Overview          | Risk assessment and management        | Navigation item | High     |
| Compliance Status   | Compliance Status      | Regulatory compliance monitoring      | Navigation item | High     |
| Risk Rhythm         | Maintenance Scheduling | Risk-based maintenance scheduling     | Navigation item | High     |
| Margin Operations   | Resource Operations    | Resource deployment and management    | Navigation item | High     |
| Asset Lookup        | Asset Register         | Asset search and information          | Navigation item | High     |
| Asset Map           | Asset Map              | Geographic asset visualisation        | Navigation item | High     |
| Field Operations    | Field Operations       | Mobile field work management          | Navigation item | High     |
| Mobile Dashboard    | Mobile Dashboard       | Mobile-optimised dashboard            | Navigation item | High     |
| Inspections         | Inspections            | Asset inspection management           | Navigation item | High     |
| Work Orders         | Work Orders            | Work order management                 | Navigation item | High     |
| Work Sessions       | Work Sessions          | Work session tracking                 | Navigation item | High     |
| Contract Dashboard  | Contract Dashboard     | Contractor performance overview       | Navigation item | High     |
| My Work Orders      | My Work Orders         | Personal work order assignments       | Navigation item | High     |
| Performance Metrics | Performance Metrics    | Performance measurement and reporting | Navigation item | High     |
| Capacity Management | Capacity Management    | Resource capacity planning            | Navigation item | High     |
| Data Sharing        | Data Sharing           | External data sharing capabilities    | Navigation item | High     |
| Community Portal    | Community Portal       | Citizen access portal                 | Navigation item | High     |
| Track Requests      | Track Requests         | Citizen request tracking              | Navigation item | High     |
| Activity Logs       | Activity Logs          | System activity monitoring            | Navigation item | High     |
| Report Triage       | Report Triage          | Citizen report management             | Navigation item | High     |
| Admin Dashboard     | Admin Dashboard        | Administrative overview               | Navigation item | High     |
| User Management     | User Management        | User account management               | Navigation item | High     |
| Audit Logs          | Audit Logs             | System audit trail                    | Navigation item | High     |
| Security Dashboard  | Security Dashboard     | Security monitoring and management    | Navigation item | High     |
| Notifications       | Notifications          | System notification management        | Navigation item | High     |
| System Settings     | System Settings        | System configuration                  | Navigation item | High     |

### Form Labels

| As-Is               | To-Be               | Definition                          | Context    | Priority |
| ------------------- | ------------------- | ----------------------------------- | ---------- | -------- |
| Asset Name          | Asset Name          | Descriptive name of the asset       | Form field | High     |
| Asset Description   | Asset Description   | Detailed description of the asset   | Form field | High     |
| Asset Location      | Asset Location      | Physical location of the asset      | Form field | High     |
| Asset Condition     | Asset Condition     | Current condition assessment        | Form field | High     |
| Asset Priority      | Asset Priority      | Relative importance level           | Form field | High     |
| Work Description    | Work Description    | Description of work to be performed | Form field | High     |
| Work Instructions   | Work Instructions   | Detailed work instructions          | Form field | High     |
| Safety Requirements | Safety Requirements | Safety procedures and requirements  | Form field | High     |
| Required Tools      | Required Tools      | Tools needed for work               | Form field | High     |
| Required Materials  | Required Materials  | Materials needed for work           | Form field | High     |
| Estimated Duration  | Estimated Duration  | Expected time to complete           | Form field | High     |
| Due Date            | Due Date            | Scheduled completion date           | Form field | High     |
| Assigned To         | Assigned To         | Person assigned to work             | Form field | High     |
| Priority Level      | Priority Level      | Work priority classification        | Form field | High     |
| Work Type           | Work Type           | Type of maintenance work            | Form field | High     |
| Inspection Date     | Inspection Date     | Date of inspection                  | Form field | High     |
| Inspection Type     | Inspection Type     | Type of inspection performed        | Form field | High     |
| Inspection Results  | Inspection Results  | Results of inspection               | Form field | High     |
| Next Inspection     | Next Inspection     | Next scheduled inspection date      | Form field | High     |

---

## 🔌 API Endpoints & Functions

### Asset Management APIs

| As-Is                         | To-Be                         | Definition                  | Context       | Priority |
| ----------------------------- | ----------------------------- | --------------------------- | ------------- | -------- |
| /api/assets                   | /api/assets                   | Asset management endpoints  | API route     | High     |
| /api/assets/count             | /api/assets/count             | Asset count retrieval       | API route     | High     |
| /api/assets/critical          | /api/assets/critical          | Critical asset management   | API route     | High     |
| /api/assets/hierarchies       | /api/assets/hierarchies       | Asset hierarchy management  | API route     | High     |
| /api/assets/intelligence      | /api/assets/intelligence      | Asset intelligence features | API route     | High     |
| /api/assets/service-functions | /api/assets/service-functions | Function-based organisation | API route     | High     |
| getAssets                     | getAssets                     | Retrieve asset list         | Function name | High     |
| getAssetById                  | getAssetById                  | Retrieve specific asset     | Function name | High     |
| createAsset                   | createAsset                   | Create new asset            | Function name | High     |
| updateAsset                   | updateAsset                   | Update existing asset       | Function name | High     |
| deleteAsset                   | deleteAsset                   | Delete asset                | Function name | High     |
| getAssetsByType               | getAssetsByType               | Filter assets by type       | Function name | High     |
| getAssetsByCondition          | getAssetsByCondition          | Filter assets by condition  | Function name | High     |
| getAssetsByPriority           | getAssetsByPriority           | Filter assets by priority   | Function name | High     |
| getAssetsByLocation           | getAssetsByLocation           | Filter assets by location   | Function name | High     |

### Work Order APIs

| As-Is                   | To-Be                   | Definition                     | Context       | Priority |
| ----------------------- | ----------------------- | ------------------------------ | ------------- | -------- |
| /api/work-orders        | /api/work-orders        | Work order management          | API route     | High     |
| /api/work-orders/assign | /api/work-orders/assign | Work order assignment          | API route     | High     |
| /api/work-orders/status | /api/work-orders/status | Work order status management   | API route     | High     |
| getWorkOrders           | getWorkOrders           | Retrieve work order list       | Function name | High     |
| getWorkOrderById        | getWorkOrderById        | Retrieve specific work order   | Function name | High     |
| createWorkOrder         | createWorkOrder         | Create new work order          | Function name | High     |
| updateWorkOrder         | updateWorkOrder         | Update existing work order     | Function name | High     |
| assignWorkOrder         | assignWorkOrder         | Assign work order to user      | Function name | High     |
| completeWorkOrder       | completeWorkOrder       | Mark work order as complete    | Function name | High     |
| getWorkOrdersByStatus   | getWorkOrdersByStatus   | Filter work orders by status   | Function name | High     |
| getWorkOrdersByPriority | getWorkOrdersByPriority | Filter work orders by priority | Function name | High     |
| getWorkOrdersByAssignee | getWorkOrdersByAssignee | Filter work orders by assignee | Function name | High     |

### Compliance APIs

| As-Is                     | To-Be                     | Definition                 | Context       | Priority |
| ------------------------- | ------------------------- | -------------------------- | ------------- | -------- |
| /api/compliance           | /api/compliance           | Compliance management      | API route     | High     |
| /api/compliance/dashboard | /api/compliance/dashboard | Compliance dashboard       | API route     | High     |
| /api/compliance/iso-55000 | /api/compliance/iso-55000 | ISO 55000 compliance       | API route     | High     |
| /api/compliance/iso-14224 | /api/compliance/iso-14224 | ISO 14224 compliance       | API route     | High     |
| /api/compliance/iso-27001 | /api/compliance/iso-27001 | ISO 27001 compliance       | API route     | High     |
| /api/compliance/iso-31000 | /api/compliance/iso-31000 | ISO 31000 compliance       | API route     | High     |
| getComplianceStatus       | getComplianceStatus       | Retrieve compliance status | Function name | High     |
| getComplianceAlerts       | getComplianceAlerts       | Retrieve compliance alerts | Function name | High     |
| generateComplianceReport  | generateComplianceReport  | Generate compliance report | Function name | High     |
| updateComplianceStatus    | updateComplianceStatus    | Update compliance status   | Function name | High     |

### Resilience APIs

| As-Is                             | To-Be                             | Definition                 | Context       | Priority |
| --------------------------------- | --------------------------------- | -------------------------- | ------------- | -------- |
| /api/resilience                   | /api/resilience                   | Resilience management      | API route     | High     |
| /api/resilience/risk-rhythm       | /api/resilience/risk-rhythm       | Risk-based scheduling      | API route     | High     |
| /api/resilience/margin-operations | /api/resilience/margin-operations | Resource operations        | API route     | High     |
| /api/resilience/asset-lookup      | /api/resilience/asset-lookup      | Asset lookup functionality | API route     | High     |
| processSignals                    | processSignals                    | Process risk signals       | Function name | High     |
| allocateMargin                    | allocateMargin                    | Allocate resources         | Function name | High     |
| deployMargin                      | deployMargin                      | Deploy resources           | Function name | High     |
| updateConfig                      | updateConfig                      | Update configuration       | Function name | High     |
| healthCheck                       | healthCheck                       | System health check        | Function name | High     |

---

## 🧩 Component Names & Variables

### Dashboard Components

| As-Is               | To-Be               | Definition                      | Context        | Priority |
| ------------------- | ------------------- | ------------------------------- | -------------- | -------- |
| ControlDashboard    | ExecutiveDashboard  | Executive-level dashboard       | Component name | High     |
| ManagerDashboard    | ManagerDashboard    | Manager-level dashboard         | Component name | High     |
| StrategicDashboard  | StrategicDashboard  | Strategic overview dashboard    | Component name | High     |
| OperationsDashboard | OperationsDashboard | Operations management dashboard | Component name | High     |
| MobileDashboard     | MobileDashboard     | Mobile-optimised dashboard      | Component name | High     |
| ContractorDashboard | ContractorDashboard | Contractor portal dashboard     | Component name | High     |
| CommunityDashboard  | CommunityDashboard  | Community engagement dashboard  | Component name | High     |
| AdminDashboard      | AdminDashboard      | Administrative dashboard        | Component name | High     |
| SecurityDashboard   | SecurityDashboard   | Security monitoring dashboard   | Component name | High     |
| ComplianceDashboard | ComplianceDashboard | Compliance monitoring dashboard | Component name | High     |

### Asset Management Components

| As-Is            | To-Be            | Definition                     | Context        | Priority |
| ---------------- | ---------------- | ------------------------------ | -------------- | -------- |
| AssetList        | AssetList        | Asset listing component        | Component name | High     |
| AssetCard        | AssetCard        | Asset information card         | Component name | High     |
| AssetForm        | AssetForm        | Asset creation/editing form    | Component name | High     |
| AssetDetails     | AssetDetails     | Detailed asset information     | Component name | High     |
| AssetMap         | AssetMap         | Geographic asset visualisation | Component name | High     |
| AssetHierarchy   | AssetHierarchy   | Asset hierarchy display        | Component name | High     |
| AssetPerformance | AssetPerformance | Asset performance metrics      | Component name | High     |
| AssetCondition   | AssetCondition   | Asset condition assessment     | Component name | High     |
| AssetMaintenance | AssetMaintenance | Asset maintenance management   | Component name | High     |
| AssetInspection  | AssetInspection  | Asset inspection management    | Component name | High     |

### Work Order Components

| As-Is               | To-Be               | Definition                      | Context        | Priority |
| ------------------- | ------------------- | ------------------------------- | -------------- | -------- |
| WorkOrderList       | WorkOrderList       | Work order listing              | Component name | High     |
| WorkOrderCard       | WorkOrderCard       | Work order information card     | Component name | High     |
| WorkOrderForm       | WorkOrderForm       | Work order creation/editing     | Component name | High     |
| WorkOrderDetails    | WorkOrderDetails    | Detailed work order information | Component name | High     |
| WorkOrderAssignment | WorkOrderAssignment | Work order assignment           | Component name | High     |
| WorkOrderStatus     | WorkOrderStatus     | Work order status management    | Component name | High     |
| WorkOrderScheduling | WorkOrderScheduling | Work order scheduling           | Component name | High     |
| WorkOrderTracking   | WorkOrderTracking   | Work order progress tracking    | Component name | High     |
| WorkOrderEvidence   | WorkOrderEvidence   | Work order documentation        | Component name | High     |
| WorkOrderHistory    | WorkOrderHistory    | Work order history tracking     | Component name | High     |

### Form Components

| As-Is              | To-Be              | Definition                   | Context        | Priority |
| ------------------ | ------------------ | ---------------------------- | -------------- | -------- |
| ContactForm        | ContactForm        | Contact information form     | Component name | High     |
| CitizenReportForm  | CitizenReportForm  | Citizen issue reporting form | Component name | High     |
| AssetForm          | AssetForm          | Asset information form       | Component name | High     |
| WorkOrderForm      | WorkOrderForm      | Work order creation form     | Component name | High     |
| InspectionForm     | InspectionForm     | Asset inspection form        | Component name | High     |
| MaintenanceForm    | MaintenanceForm    | Maintenance planning form    | Component name | High     |
| RiskAssessmentForm | RiskAssessmentForm | Risk assessment form         | Component name | High     |
| ComplianceForm     | ComplianceForm     | Compliance reporting form    | Component name | High     |
| UserForm           | UserForm           | User account form            | Component name | High     |
| OrganisationForm   | OrganisationForm   | Organisation setup form      | Component name | High     |

### Report Components

| As-Is               | To-Be               | Definition                  | Context        | Priority |
| ------------------- | ------------------- | --------------------------- | -------------- | -------- |
| CustomReportBuilder | CustomReportBuilder | Custom report creation      | Component name | High     |
| AssetReport         | AssetReport         | Asset performance report    | Component name | High     |
| WorkOrderReport     | WorkOrderReport     | Work order summary report   | Component name | High     |
| MaintenanceReport   | MaintenanceReport   | Maintenance activity report | Component name | High     |
| ComplianceReport    | ComplianceReport    | Compliance status report    | Component name | High     |
| RiskReport          | RiskReport          | Risk assessment report      | Component name | High     |
| PerformanceReport   | PerformanceReport   | Performance metrics report  | Component name | High     |
| FinancialReport     | FinancialReport     | Financial impact report     | Component name | High     |
| AuditReport         | AuditReport         | Audit trail report          | Component name | High     |
| ExportFunctionality | ExportFunctionality | Data export capabilities    | Component name | High     |

---

## 📊 Status & Priority Terms

### Asset Status

| As-Is              | To-Be              | Definition                            | Context           | Priority |
| ------------------ | ------------------ | ------------------------------------- | ----------------- | -------- |
| ACTIVE             | Active             | Asset is operational and in use       | Database enum, UI | High     |
| INACTIVE           | Inactive           | Asset is not currently in use         | Database enum, UI | High     |
| UNDER_CONSTRUCTION | Under Construction | Asset is being built or installed     | Database enum, UI | High     |
| UNDER_MAINTENANCE  | Under Maintenance  | Asset is being maintained             | Database enum, UI | High     |
| DECOMMISSIONED     | Decommissioned     | Asset has been taken out of service   | Database enum, UI | High     |
| PLANNED            | Planned            | Asset is planned but not yet acquired | Database enum, UI | High     |

### Asset Condition

| As-Is     | To-Be     | Definition                      | Context           | Priority |
| --------- | --------- | ------------------------------- | ----------------- | -------- |
| EXCELLENT | Excellent | Asset is in excellent condition | Database enum, UI | High     |
| GOOD      | Good      | Asset is in good condition      | Database enum, UI | High     |
| FAIR      | Fair      | Asset is in fair condition      | Database enum, UI | High     |
| POOR      | Poor      | Asset is in poor condition      | Database enum, UI | High     |
| CRITICAL  | Critical  | Asset is in critical condition  | Database enum, UI | High     |
| UNKNOWN   | Unknown   | Asset condition is unknown      | Database enum, UI | High     |

### Asset Priority

| As-Is    | To-Be    | Definition              | Context           | Priority |
| -------- | -------- | ----------------------- | ----------------- | -------- |
| LOW      | Low      | Low priority asset      | Database enum, UI | High     |
| MEDIUM   | Medium   | Medium priority asset   | Database enum, UI | High     |
| HIGH     | High     | High priority asset     | Database enum, UI | High     |
| CRITICAL | Critical | Critical priority asset | Database enum, UI | High     |

### Work Order Status

| As-Is       | To-Be       | Definition                          | Context           | Priority |
| ----------- | ----------- | ----------------------------------- | ----------------- | -------- |
| PENDING     | Pending     | Work order is pending assignment    | Database enum, UI | High     |
| ASSIGNED    | Assigned    | Work order has been assigned        | Database enum, UI | High     |
| IN_PROGRESS | In Progress | Work is currently being performed   | Database enum, UI | High     |
| COMPLETED   | Completed   | Work has been completed             | Database enum, UI | High     |
| CANCELLED   | Cancelled   | Work order has been cancelled       | Database enum, UI | High     |
| ON_HOLD     | On Hold     | Work order is temporarily suspended | Database enum, UI | High     |

### Work Order Priority

| As-Is     | To-Be     | Definition                    | Context           | Priority |
| --------- | --------- | ----------------------------- | ----------------- | -------- |
| LOW       | Low       | Low priority work order       | Database enum, UI | High     |
| MEDIUM    | Medium    | Medium priority work order    | Database enum, UI | High     |
| HIGH      | High      | High priority work order      | Database enum, UI | High     |
| URGENT    | Urgent    | Urgent priority work order    | Database enum, UI | High     |
| EMERGENCY | Emergency | Emergency priority work order | Database enum, UI | High     |

---

## 👥 User Roles & Permissions

### User Roles

| As-Is               | To-Be               | Definition                                     | Context                | Priority |
| ------------------- | ------------------- | ---------------------------------------------- | ---------------------- | -------- |
| ADMIN               | Administrator       | System administrator with full access          | User role, permissions | High     |
| MANAGER             | Manager             | Asset manager with management access           | User role, permissions | High     |
| SUPERVISOR          | Supervisor          | Maintenance supervisor with operational access | User role, permissions | High     |
| CREW                | Crew Member         | Maintenance crew member with field access      | User role, permissions | High     |
| EXEC                | Executive           | Executive with strategic access                | User role, permissions | High     |
| CONTRACTOR          | Contractor          | External contractor with limited access        | User role, permissions | High     |
| PARTNER             | Partner             | Business partner with shared access            | User role, permissions | High     |
| CITIZEN             | Citizen             | Community member with reporting access         | User role, permissions | High     |
| MAINTENANCE_PLANNER | Maintenance Planner | Maintenance planning specialist                | User role, permissions | High     |

### Permission Levels

| As-Is      | To-Be      | Definition                               | Context          | Priority |
| ---------- | ---------- | ---------------------------------------- | ---------------- | -------- |
| READ       | Read       | View-only access to information          | Permission level | High     |
| WRITE      | Write      | Ability to create and modify information | Permission level | High     |
| DELETE     | Delete     | Ability to remove information            | Permission level | High     |
| ADMIN      | Admin      | Full administrative access               | Permission level | High     |
| MANAGER    | Manager    | Management-level access                  | Permission level | High     |
| SUPERVISOR | Supervisor | Supervisory-level access                 | Permission level | High     |
| CREW       | Crew       | Field-level access                       | Permission level | High     |
| CITIZEN    | Citizen    | Community-level access                   | Permission level | High     |

---

## 🔧 Technical & System Terms

### System Components

| As-Is                     | To-Be                     | Definition                         | Context          | Priority |
| ------------------------- | ------------------------- | ---------------------------------- | ---------------- | -------- |
| Resilience Engine         | Asset Intelligence Engine | Core system for asset intelligence | System component | High     |
| Margin Management         | Resource Management       | Resource allocation and management | System component | High     |
| Risk Rhythm               | Maintenance Scheduling    | Risk-based maintenance scheduling  | System component | High     |
| Signal Processing         | Event Processing          | Processing of system events        | System component | High     |
| Antifragile System        | Adaptive System           | System that improves under stress  | System component | High     |
| Critical Control Planning | Risk Control Planning     | Planning of critical risk controls | System component | High     |
| Margin Operations         | Resource Operations       | Resource deployment operations     | System component | High     |
| Asset Lookup              | Asset Search              | Asset search and retrieval         | System component | High     |
| Field Tool                | Mobile Field App          | Mobile field application           | System component | High     |
| Work Sessions             | Work Tracking             | Work activity tracking             | System component | High     |

### Data Management

| As-Is                  | To-Be                  | Definition                       | Context        | Priority |
| ---------------------- | ---------------------- | -------------------------------- | -------------- | -------- |
| Data Dictionary        | Data Dictionary        | Comprehensive data definitions   | Documentation  | High     |
| UI Labels Dictionary   | UI Labels Dictionary   | User interface label definitions | Documentation  | High     |
| Language Dictionary    | Language Dictionary    | Terminology standardisation      | Documentation  | High     |
| Sector Neutral         | Industry Neutral       | Industry-agnostic terminology    | System feature | High     |
| Language Management    | Terminology Management | Terminology standardisation      | System feature | High     |
| Template Management    | Template Management    | Template creation and management | System feature | High     |
| Import/Export          | Data Import/Export     | Data transfer capabilities       | System feature | High     |
| Audit Trail            | Audit Trail            | System activity tracking         | System feature | High     |
| Compliance Monitoring  | Compliance Monitoring  | Regulatory compliance tracking   | System feature | High     |
| Performance Monitoring | Performance Monitoring | System performance tracking      | System feature | High     |

### Integration Terms

| As-Is                | To-Be                | Definition                                    | Context     | Priority |
| -------------------- | -------------------- | --------------------------------------------- | ----------- | -------- |
| ERP Integration      | ERP Integration      | Enterprise resource planning integration      | Integration | High     |
| BMS Integration      | BMS Integration      | Building management system integration        | Integration | High     |
| EMS Integration      | EMS Integration      | Energy management system integration          | Integration | High     |
| IoT Integration      | IoT Integration      | Internet of Things device integration         | Integration | High     |
| API Integration      | API Integration      | Application programming interface integration | Integration | High     |
| Data Synchronisation | Data Synchronisation | Data consistency across systems               | Integration | High     |
| Real-time Updates    | Real-time Updates    | Live data updates                             | Integration | High     |
| Batch Processing     | Batch Processing     | Scheduled data processing                     | Integration | High     |
| Event Streaming      | Event Streaming      | Real-time event processing                    | Integration | High     |
| Webhook Integration  | Webhook Integration  | Event-driven integration                      | Integration | High     |

---

## 🎯 Implementation Priorities

### High Priority (Epic 24 Phase 1)

- **Asset Management Core Terms**: All asset lifecycle and maintenance terms
- **Database Field Names**: All database schema terminology
- **UI Labels & Navigation**: All user interface terminology
- **Status & Priority Terms**: All status and priority classifications
- **User Roles & Permissions**: All role-based access terminology

### Medium Priority (Epic 24 Phase 2)

- **API Endpoints & Functions**: All API terminology
- **Component Names & Variables**: All React component terminology
- **Technical & System Terms**: Core system terminology
- **Integration Terms**: External system integration terminology

### Low Priority (Epic 24 Phase 3)

- **Advanced Technical Terms**: Specialised technical terminology
- **Legacy Terms**: Deprecated terminology for migration
- **Regional Variations**: Location-specific terminology
- **Industry-Specific Terms**: Sector-specific terminology

---

## 📚 Related Documentation

- `docs/TODO-PI5.md` — Epic 24 implementation plan
- `docs/architecture/journey-centric-ux-plan.md` — UX design principles
- `docs/architecture/SAD.md` — System architecture documentation
- `docs/compliance/iso55000-compliance-mapping.md` — ISO 55000 compliance
- `docs/development/developer-brief.md` — Development standards

---

## 🔄 Maintenance & Updates

### Review Schedule

- **Monthly**: Review new terms and industry changes
- **Quarterly**: Update with new ISO standards and regulations
- **Annually**: Comprehensive review and stakeholder feedback

### Change Management

- **Version Control**: All changes tracked with version numbers
- **Stakeholder Approval**: Changes require stakeholder sign-off
- **Implementation Planning**: Changes coordinated with development cycles
- **Training Updates**: User training materials updated with changes

### Quality Assurance

- **Consistency Check**: Regular consistency reviews across all documentation
- **Industry Alignment**: Ongoing alignment with industry standards
- **User Feedback**: Regular user feedback collection and incorporation
- **Compliance Verification**: Regular compliance with ISO standards

---

## 🎯 Conclusion

This comprehensive language dictionary provides the foundation for Epic 24's language simplification and visualisation enhancement objectives. By standardising terminology across the Aegrid platform, we ensure consistency, clarity, and alignment with industry best practices.

The dictionary supports both the data dictionary and UI labels dictionary implementation, providing a unified approach to terminology management that enhances user experience and system maintainability.

**Next Steps**:

1. **Stakeholder Review**: Review dictionary with key stakeholders
2. **Implementation Planning**: Plan terminology updates across the system
3. **Data Dictionary Creation**: Create comprehensive data dictionary
4. **UI Labels Dictionary**: Create UI labels dictionary
5. **Training Materials**: Develop user training materials
6. **Migration Planning**: Plan terminology migration across the system

**Status**: 🚀 **READY FOR IMPLEMENTATION** - Epic 24 Language Simplification
