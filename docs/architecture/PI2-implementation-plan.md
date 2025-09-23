# PI2 Implementation Plan - Technical Architecture

## Executive Summary

This document outlines the technical implementation plan for Product Increment 2 (PI2) of Aegrid, focusing on journey-centric UX transformation, graph-based asset intelligence, ISO compliance, and sector-neutral platform evolution.

## Technical Architecture Overview

### Current Architecture (PI1)
- **Frontend**: Next.js 15 with React 18 and TypeScript
- **Backend**: Node.js API with Prisma ORM
- **Database**: PostgreSQL with PostGIS extension
- **Authentication**: NextAuth.js with JWT sessions
- **Deployment**: Azure Container Apps
- **Storage**: Azure Blob Storage for documents

### Target Architecture (PI2)
- **Frontend**: Next.js 15 with journey-centric navigation and enhanced visualisation
- **Backend**: Node.js API with graph database integration
- **Primary Database**: PostgreSQL with PostGIS (existing)
- **Graph Database**: Neo4j or Azure Cosmos DB Gremlin API
- **Energy Management**: Core energy optimisation and BMS/EMS integration
- **AI Intelligence**: Embedded optimisation algorithms and predictive analytics
- **Authentication**: Enhanced NextAuth.js with ISO 27001/55000 compliance
- **Deployment**: Azure Container Apps with enhanced monitoring
- **Storage**: Multi-tier Azure Blob Storage with lifecycle management
- **Analytics**: Azure Machine Learning for predictive analytics
- **Integration**: Azure Service Bus for enterprise integrations

## Journey-Centric UX Implementation

### 1. Navigation Architecture Redesign

#### Component Structure
```typescript
// components/navigation/JourneySidebar.tsx
interface WorkflowGroup {
  id: string;
  label: string;
  icon: React.ComponentType;
  description: string;
  primaryPersonas: Persona[];
  journeyStage: JourneyStage;
  tabs: WorkflowTab[];
  isVisible: (userRole: Role) => boolean;
}

interface WorkflowTab {
  id: string;
  label: string;
  path: string;
  component: React.ComponentType;
  description: string;
  features: Feature[];
}
```

#### Implementation Steps
1. **Create New Navigation Components**
   - `JourneySidebar.tsx` - Main navigation component
   - `WorkflowGroup.tsx` - Individual workflow group
   - `WorkflowTab.tsx` - Tab content component
   - `MobileNavigation.tsx` - Mobile-optimized navigation

2. **Update Routing Structure**
   - Group-based routes (`/strategic`, `/planning`, `/operations`, etc.)
   - Nested tab routing within groups
   - Breadcrumb navigation system

3. **Implement Role-Based Visibility**
   - Dynamic workflow group visibility
   - Tab-level permissions
   - Feature-level access control

### 2. Missing Features Implementation

#### Priority 1: Core Missing Features
- **Team Management System**
  - User role assignment interface
  - Crew coordination tools
  - Skill tracking and matching
  - Workload balancing

- **Work Order Management Integration**
  - Direct work order access from main navigation
  - Work order assignment interface
  - Status tracking and updates
  - Mobile work order management

- **SLA Management Dashboard**
  - Service level agreement tracking
  - Vendor performance monitoring
  - SLA breach alerts and notifications
  - Contract management interface

#### Priority 2: Advanced Features
- **Vendor Portal Interface**
  - Vendor authentication and access
  - Work order assignment and tracking
  - Evidence upload and documentation
  - Performance reporting

- **Sustainability Module**
  - Environmental impact tracking
  - Carbon footprint calculation
  - Green asset management
  - Sustainability reporting

- **Critical Controls Interface**
  - Critical asset identification
  - Control rule definition
  - Compliance monitoring
  - Escalation management

## Graph-Based Asset Intelligence

### 1. Graph Database Selection

#### Option 1: Neo4j (Recommended)
**Pros**:
- Mature graph database with excellent performance
- Rich query language (Cypher)
- Strong community and documentation
- Native graph algorithms

**Cons**:
- Additional infrastructure complexity
- Licensing costs for enterprise features
- Learning curve for team

#### Option 2: Azure Cosmos DB Gremlin API
**Pros**:
- Fully managed service
- Integrated with existing Azure infrastructure
- No additional infrastructure management
- Pay-per-use pricing model

**Cons**:
- Less mature than Neo4j
- Limited graph algorithms
- Gremlin query language complexity

**Recommendation**: Start with Azure Cosmos DB Gremlin API for simplicity, migrate to Neo4j if advanced features are needed.

### 2. Graph Data Model Design

#### Asset Node Model
```cypher
// Asset node with properties
CREATE (a:Asset {
  id: "asset-001",
  name: "Main Water Pump",
  type: "Pump",
  status: "Active",
  condition: "Good",
  location: "Building A",
  installedDate: "2020-01-15",
  lastInspection: "2024-01-10",
  nextMaintenance: "2024-02-15"
})
```

#### Relationship Types
```cypher
// Parent-Child relationships
(a:Asset)-[:PARENT_OF]->(b:Asset)

// Dependencies
(a:Asset)-[:DEPENDS_ON]->(b:Asset)

// Location relationships
(a:Asset)-[:LOCATED_IN]->(l:Location)

// Maintenance relationships
(a:Asset)-[:REQUIRES_MAINTENANCE]->(m:MaintenanceTask)

// Tag relationships
(a:Asset)-[:TAGGED_WITH]->(t:Tag)
```

#### Hierarchy Support
```cypher
// Geographic hierarchy
(region:Region)-[:CONTAINS]->(area:Area)-[:CONTAINS]->(site:Site)-[:CONTAINS]->(asset:Asset)

// Functional hierarchy
(system:System)-[:CONTAINS]->(subsystem:Subsystem)-[:CONTAINS]->(component:Component)-[:CONTAINS]->(asset:Asset)

// Organisational hierarchy
(division:Division)-[:CONTAINS]->(department:Department)-[:CONTAINS]->(team:Team)-[:MANAGES]->(asset:Asset)
```

### 3. Implementation Strategy

#### Phase 1: Graph Database Setup
1. **Azure Cosmos DB Configuration**
   - Create Gremlin API account
   - Configure database and containers
   - Set up connection strings and security

2. **Data Migration**
   - Export existing asset data from PostgreSQL
   - Transform to graph format
   - Import into Cosmos DB

3. **API Integration**
   - Create graph query service
   - Implement CRUD operations
   - Add graph-specific endpoints

#### Phase 2: Graph Features Implementation
1. **Asset Relationship Management**
   - Parent-child relationship interface
   - Dependency management
   - Location mapping

2. **Tagging System**
   - Hierarchical tag structure
   - Tag management interface
   - Tag-based queries

3. **Visual Graph Explorer**
   - Interactive graph visualization
   - Node and edge manipulation
   - Query result visualization

## ISO Compliance Implementation

### 1. ISO 14224 Compliance

#### Equipment Classification System
```typescript
interface EquipmentClassification {
  equipmentClass: string; // ISO 14224 equipment class
  equipmentType: string;  // Specific equipment type
  manufacturer: string;   // Equipment manufacturer
  model: string;         // Equipment model
  serialNumber: string;  // Serial number
  installationDate: Date; // Installation date
  commissioningDate: Date; // Commissioning date
}

interface FailureMode {
  failureMode: string;   // ISO 14224 failure mode
  failureCause: string;  // Root cause
  failureEffect: string; // Effect on system
  detectionMethod: string; // Detection method
  maintenanceAction: string; // Corrective action
}
```

#### Implementation Steps
1. **Data Model Updates**
   - Add ISO 14224 fields to asset model
   - Create failure mode classification tables
   - Implement maintenance action classification

2. **Data Collection Interface**
   - Standardized data entry forms
   - Validation against ISO 14224 standards
   - Data quality checks

3. **Reporting and Export**
   - ISO 14224 compliant reports
   - Data exchange formats
   - Compliance dashboards

### 2. ISO 55000 Compliance

#### Asset Management System Framework
```typescript
interface AssetManagementPolicy {
  policyId: string;
  policyName: string;
  policyDescription: string;
  scope: string[];
  objectives: AssetManagementObjective[];
  responsibilities: Responsibility[];
  reviewDate: Date;
  approvalDate: Date;
}

interface AssetManagementObjective {
  objectiveId: string;
  objectiveName: string;
  targetValue: number;
  measurementUnit: string;
  targetDate: Date;
  responsibleRole: Role;
}
```

#### Implementation Steps
1. **Policy Management System**
   - Asset management policy framework
   - Objective setting and tracking
   - Responsibility assignment

2. **Performance Monitoring**
   - KPI tracking and reporting
   - Performance dashboards
   - Trend analysis

3. **Continuous Improvement**
   - Improvement tracking system
   - Lessons learned database
   - Best practice sharing

### 3. ISO 27001 Compliance

#### Information Security Management
```typescript
interface SecurityControl {
  controlId: string;
  controlName: string;
  controlCategory: string;
  implementationStatus: 'Implemented' | 'Partially Implemented' | 'Not Implemented';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  responsibleRole: Role;
  lastReview: Date;
  nextReview: Date;
}

interface SecurityIncident {
  incidentId: string;
  incidentType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  detectionDate: Date;
  resolutionDate?: Date;
  impact: string;
  lessonsLearned: string;
}
```

#### Implementation Steps
1. **Security Controls Implementation**
   - Security control framework
   - Control assessment and monitoring
   - Risk assessment integration

2. **Incident Management**
   - Security incident tracking
   - Incident response procedures
   - Lessons learned capture

3. **Security Monitoring**
   - Security event logging
   - Threat detection
   - Vulnerability management

### 4. ISO 31000 Compliance

#### Risk Management Framework
```typescript
interface RiskAssessment {
  riskId: string;
  riskName: string;
  riskDescription: string;
  riskCategory: string;
  likelihood: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  impact: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskOwner: Role;
  assessmentDate: Date;
  nextReview: Date;
}

interface RiskTreatment {
  treatmentId: string;
  riskId: string;
  treatmentType: 'Avoid' | 'Mitigate' | 'Transfer' | 'Accept';
  treatmentDescription: string;
  implementationDate: Date;
  responsibleRole: Role;
  effectiveness: 'Low' | 'Medium' | 'High';
}
```

#### Implementation Steps
1. **Risk Management Framework**
   - Risk assessment process
   - Risk treatment options
   - Risk monitoring and review

2. **Risk Integration**
   - Asset risk assessment
   - Maintenance risk analysis
   - Project risk management

3. **Risk Reporting**
   - Risk dashboards
   - Risk reports
   - Risk trend analysis

## Sector-Neutral Platform Evolution

### 1. Language Refactoring Strategy

#### Terminology Mapping System
```typescript
interface TerminologyMapping {
  sector: string;
  originalTerm: string;
  neutralTerm: string;
  context: string;
  description: string;
}

const TERMINOLOGY_MAPPINGS = {
  'local-government': {
    'council': 'organisation',
    'citizen': 'stakeholder',
    'councillor': 'board-member',
    'rates': 'fees',
    'council-asset': 'organisational-asset'
  },
  'manufacturing': {
    'council': 'company',
    'citizen': 'customer',
    'councillor': 'executive',
    'rates': 'charges',
    'council-asset': 'production-asset'
  },
  'healthcare': {
    'council': 'hospital',
    'citizen': 'patient',
    'councillor': 'administrator',
    'rates': 'fees',
    'council-asset': 'medical-asset'
  }
};
```

#### Implementation Steps
1. **Database Schema Updates**
   - Add terminology mapping tables
   - Update existing data with neutral terms
   - Create sector-specific customisation

2. **User Interface Updates**
   - Dynamic terminology based on sector
   - User preference settings
   - Context-aware language

3. **Documentation Updates**
   - Update all documentation with neutral language
   - Create sector-specific guides
   - Training material updates

### 2. Sector-Specific Templates

#### Template Structure
```typescript
interface SectorTemplate {
  sectorId: string;
  sectorName: string;
  assetTypes: AssetType[];
  maintenanceTemplates: MaintenanceTemplate[];
  workflows: Workflow[];
  terminology: TerminologyMapping;
  complianceRequirements: ComplianceRequirement[];
}

const SECTOR_TEMPLATES = {
  'manufacturing': {
    assetTypes: ['Production Line', 'Machine Tool', 'Conveyor', 'Robot'],
    maintenanceTemplates: ['Preventive Maintenance', 'Predictive Maintenance', 'Condition-Based Maintenance'],
    workflows: ['Production Planning', 'Quality Control', 'Safety Management'],
    complianceRequirements: ['ISO 9001', 'ISO 14001', 'OSHA']
  },
  'healthcare': {
    assetTypes: ['Medical Device', 'Diagnostic Equipment', 'Life Support', 'Imaging'],
    maintenanceTemplates: ['Calibration', 'Safety Testing', 'Preventive Maintenance'],
    workflows: ['Patient Safety', 'Regulatory Compliance', 'Equipment Management'],
    complianceRequirements: ['FDA', 'ISO 13485', 'HIPAA']
  }
};
```

## Advanced Analytics & AI Implementation

### 1. Predictive Analytics Engine

#### Machine Learning Models
```typescript
interface PredictiveModel {
  modelId: string;
  modelName: string;
  modelType: 'Classification' | 'Regression' | 'TimeSeries';
  inputFeatures: string[];
  outputPrediction: string;
  accuracy: number;
  lastTraining: Date;
  nextTraining: Date;
}

interface PredictionResult {
  assetId: string;
  predictionType: string;
  predictedValue: number;
  confidence: number;
  predictionDate: Date;
  recommendedAction: string;
}
```

#### Implementation Steps
1. **Data Preparation**
   - Historical data collection
   - Feature engineering
   - Data quality assessment

2. **Model Development**
   - Failure prediction models
   - Maintenance optimization models
   - Cost prediction models

3. **Model Deployment**
   - Azure Machine Learning integration
   - Real-time prediction API
   - Model monitoring and retraining

### 2. AI-Powered Insights

#### Recommendation Engine
```typescript
interface Recommendation {
  recommendationId: string;
  assetId: string;
  recommendationType: 'Maintenance' | 'Replacement' | 'Optimization';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  expectedBenefit: string;
  implementationCost: number;
  confidence: number;
  validUntil: Date;
}

interface AnomalyDetection {
  anomalyId: string;
  assetId: string;
  anomalyType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  detectedDate: Date;
  dataPoints: DataPoint[];
}
```

## Enterprise Integration Hub

### 1. ERP Integration Framework

#### Integration Architecture
```typescript
interface ERPIntegration {
  integrationId: string;
  erpSystem: 'SAP' | 'Oracle' | 'Microsoft Dynamics' | 'Custom';
  connectionType: 'API' | 'Database' | 'File Transfer';
  syncFrequency: 'Real-time' | 'Hourly' | 'Daily' | 'Weekly';
  dataMapping: DataMapping[];
  lastSync: Date;
  status: 'Active' | 'Inactive' | 'Error';
}

interface DataMapping {
  sourceField: string;
  targetField: string;
  transformation: string;
  validation: string;
}
```

#### Implementation Steps
1. **Integration Framework**
   - Common integration patterns
   - Data transformation engine
   - Error handling and retry logic

2. **ERP-Specific Connectors**
   - SAP connector
   - Oracle connector
   - Microsoft Dynamics connector
   - Custom API connector

3. **Data Synchronisation**
   - Real-time sync for critical data
   - Batch sync for historical data
   - Conflict resolution strategies

### 2. IoT & Telematics Integration

#### IoT Data Model
```typescript
interface IoTDevice {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  assetId: string;
  connectionStatus: 'Connected' | 'Disconnected' | 'Error';
  lastDataReceived: Date;
  dataPoints: DataPoint[];
}

interface TelematicsData {
  deviceId: string;
  timestamp: Date;
  location: GeoLocation;
  speed: number;
  fuelLevel: number;
  engineHours: number;
  maintenanceAlerts: MaintenanceAlert[];
}
```

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-4)
**Week 1-2**: Navigation Architecture Redesign
- Create new navigation components
- Implement workflow groups
- Update routing structure

**Week 3-4**: Graph Database Integration
- Set up Azure Cosmos DB Gremlin API
- Implement basic graph operations
- Create asset relationship management

### Phase 2: Core Features (Weeks 5-8)
**Week 5-6**: Missing Features Implementation
- Team Management System
- Work Order Management Integration
- SLA Management Dashboard

**Week 7-8**: ISO Compliance Foundation
- ISO 14224 data model updates
- ISO 55000 policy framework
- Basic compliance reporting

### Phase 3: Advanced Features (Weeks 9-12)
**Week 9-10**: Graph Intelligence Features
- Multiple hierarchy support
- Tagging system implementation
- Visual graph explorer

**Week 11-12**: Language Refactoring
- Terminology mapping system
- Sector-specific customisation
- User interface updates

### Phase 4: Intelligence & Integration (Weeks 13-16)
**Week 13-14**: Advanced Analytics
- Predictive analytics engine
- AI-powered insights
- Recommendation system

**Week 15-16**: Enterprise Integration
- ERP integration framework
- IoT and telematics integration
- Data synchronisation

### Phase 5: Compliance & Certification (Weeks 17-20)
**Week 17-18**: ISO Compliance Completion
- ISO 27001 security implementation
- ISO 31000 risk management
- Compliance auditing

**Week 19-20**: Testing & Certification
- System integration testing
- Performance optimization
- Certification process

## Risk Management

### Technical Risks
1. **Graph Database Complexity**
   - **Risk**: Learning curve and implementation complexity
   - **Mitigation**: Start with simple use cases, provide training
   - **Contingency**: Fallback to relational database with graph-like queries

2. **Performance Impact**
   - **Risk**: Graph queries may impact performance
   - **Mitigation**: Implement caching, optimize queries
   - **Contingency**: Use read replicas, implement query optimization

3. **Integration Challenges**
   - **Risk**: ERP integration complexity
   - **Mitigation**: Use proven integration patterns, start with simple integrations
   - **Contingency**: Manual data import/export processes

### Business Risks
1. **User Adoption**
   - **Risk**: Users may resist new navigation structure
   - **Mitigation**: Comprehensive training, gradual rollout
   - **Contingency**: Maintain old navigation as fallback

2. **Compliance Timeline**
   - **Risk**: ISO certification may take longer than expected
   - **Mitigation**: Start compliance work early, engage experts
   - **Contingency**: Phased certification approach

## Success Metrics

### Technical Metrics
- **Performance**: <2s response times for all operations
- **Availability**: 99.9% uptime SLA
- **Scalability**: Support 10,000+ assets per organisation
- **Security**: Zero security incidents

### User Experience Metrics
- **Task Completion Rate**: 95%+ for primary workflows
- **Time to Complete Tasks**: 50% reduction in average task time
- **User Satisfaction**: 4.5+ rating for navigation ease
- **Error Rate**: <2% navigation-related errors

### Business Metrics
- **Feature Adoption**: 80%+ adoption of new workflow groups
- **User Engagement**: 40% increase in daily active users
- **Support Tickets**: 60% reduction in navigation-related requests
- **Training Time**: 50% reduction in new user onboarding time

### Compliance Metrics
- **ISO 14224**: Full compliance certification
- **ISO 55000**: Asset management system certification
- **ISO 27001**: Information security certification
- **ISO 31000**: Risk management framework certification

## Conclusion

This comprehensive implementation plan provides a roadmap for transforming Aegrid into a journey-centric, graph-based asset intelligence platform that meets industry standards and serves multiple sectors. The phased approach ensures manageable implementation while delivering value incrementally.

The technical architecture leverages modern technologies and best practices to create a scalable, maintainable, and user-friendly platform. The focus on ISO compliance ensures enterprise-grade quality, while the sector-neutral approach expands market reach.

By following this plan, Aegrid will evolve into a world-class asset management platform that embodies "The Aegrid Rules" and delivers exceptional value to organisations across multiple industries.
