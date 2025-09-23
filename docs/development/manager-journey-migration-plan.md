# Manager Journey Migration Plan: From Traditional to Aegrid Rules

**Migration Plan for Refactoring Asset Management Interface**

*Date: December 2024*

---

## Executive Summary

This migration plan transforms the current asset planning group from 7 scattered tools to 3 focused interfaces that embody the Aegrid Rules. The plan includes strategic decisions about asset list access and behavioral design principles.

---

## Current State Analysis

### Existing "Asset Planning" Group
- **Asset Register** - Traditional asset inventory
- **Critical Controls** - Basic risk identification
- **Risk Planner** - Conventional risk assessment
- **RCM Templates** - Standard maintenance templates
- **Maintenance Planning** - Calendar-driven scheduling
- **Custom Reports** - Static reporting
- **Data Import** - Administrative data management

### Problems Identified
1. **Scattered Navigation**: 7 different tools to manage
2. **Traditional Thinking**: Asset-centric, not purpose-driven
3. **Time-Based Scheduling**: Not risk-driven
4. **Complex Workflows**: Overwhelming for managers
5. **No Aegrid Rules Integration**: Missing resilience principles

---

## Target State: "Resilience Command"

### New Sidebar Group Structure
```
Resilience Command
├── Control Dashboard (Rule 1: Every Asset Has a Purpose)
├── Risk Rhythm (Rule 2: Risk Sets the Rhythm)
├── Margin Operations (Rules 3 & 4: Respond to Real World + Operate with Margin)
└── Asset Lookup (Purpose-Driven Asset Access)
```

### Strategic Decision: Asset List Integration

**Question**: Should we include an asset list or make it difficult to access for behavioral reasons?

**Recommendation**: Include a **Purpose-Driven Asset Lookup** that supports the Aegrid Rules.

#### Behavioral Design Analysis

**Arguments FOR Asset List Access:**
- **Practical Needs**: Managers need to look up specific assets
- **Emergency Situations**: Quick access during incidents
- **Validation**: Verify asset details and status
- **Training**: Help users understand the system
- **Customer Expectations**: Familiar interface for adoption

**Arguments AGAINST Easy Asset Access:**
- **Behavioral Change**: Encourages traditional asset-centric thinking
- **Purpose Drift**: Users might bypass purpose-driven workflows
- **Cognitive Load**: Adds another interface to manage

#### Solution: Purpose-Driven Asset Lookup

**Design Principles:**
1. **Purpose-First Access**: Assets organized by service purpose, not asset type
2. **Contextual Integration**: Asset details embedded within Control Dashboard
3. **Guided Discovery**: Help users find assets through purpose, not browsing
4. **Emergency Override**: Quick access for urgent situations

---

## Migration Strategy

### Phase 1: Foundation (Month 1)
**Goal**: Replace sidebar group and establish basic structure

#### Week 1-2: Sidebar Refactoring
- [ ] Remove 4 of 7 existing tools from sidebar
- [ ] Create new "Resilience Command" sidebar group
- [ ] Implement basic navigation structure
- [ ] Update role-based access controls

#### Week 3-4: Control Dashboard MVP
- [ ] Create purpose-driven asset organization
- [ ] Implement critical control status overview
- [ ] Build basic asset lookup functionality
- [ ] Design responsive interface layout

**Deliverable**: Basic Control Dashboard with purpose-driven asset access

### Phase 2: Risk Integration (Month 2)
**Goal**: Implement risk-based scheduling and prioritization

#### Week 1-2: Risk Rhythm Interface
- [ ] Create dynamic scheduling interface
- [ ] Implement consequence × likelihood calculation
- [ ] Build seasonal risk profile adjustments
- [ ] Design resource allocation recommendations

#### Week 3-4: Integration and Testing
- [ ] Integrate Risk Rhythm with Control Dashboard
- [ ] Implement cross-interface data flow
- [ ] Conduct user testing with managers
- [ ] Refine based on feedback

**Deliverable**: Functional Risk Rhythm with integrated workflows

### Phase 3: Margin Operations (Month 3)
**Goal**: Deploy signal response and margin management

#### Week 1-2: Margin Operations Interface
- [ ] Create signal processing dashboard
- [ ] Implement margin utilization tracking
- [ ] Build emergency resource management
- [ ] Design resilience metrics display

#### Week 3-4: Full Integration
- [ ] Integrate all three interfaces
- [ ] Implement cross-interface notifications
- [ ] Conduct comprehensive user testing
- [ ] Performance optimization

**Deliverable**: Complete Resilience Command system

### Phase 4: Optimization (Month 4)
**Goal**: Refine and perfect the focused approach

#### Week 1-2: User Experience Refinement
- [ ] Optimize workflows based on usage data
- [ ] Improve interface responsiveness
- [ ] Enhance accessibility features
- [ ] Polish visual design

#### Week 3-4: Training and Documentation
- [ ] Create user training materials
- [ ] Document new workflows
- [ ] Train support staff
- [ ] Prepare rollout strategy

**Deliverable**: Production-ready Resilience Command system

---

## Technical Implementation Details

### API Endpoint Changes

#### Current Endpoints (To Be Deprecated)
```
GET /api/assets - Traditional asset list
GET /api/critical-controls - Basic control status
GET /api/risk-planner - Static risk assessment
GET /api/maintenance/planning - Time-based scheduling
GET /api/rcm-templates - Template management
GET /api/reports/custom - Static reporting
POST /api/imports - Manual data import
```

#### New Endpoints (To Be Created)
```
GET /api/resilience/controls - Purpose-driven control status
GET /api/resilience/risk-rhythm - Dynamic risk-based scheduling
GET /api/resilience/margin-operations - Signal response and margin management
GET /api/resilience/asset-lookup - Purpose-driven asset search
POST /api/resilience/actions - Cross-interface actions
```

### Database Schema Updates

#### New Tables
```sql
-- Purpose-driven asset organization
CREATE TABLE service_purposes (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  critical_control_id UUID REFERENCES critical_controls(id)
);

-- Risk rhythm calculations
CREATE TABLE risk_rhythm_profiles (
  id UUID PRIMARY KEY,
  asset_id UUID REFERENCES assets(id),
  consequence_score INTEGER,
  likelihood_score INTEGER,
  risk_score INTEGER GENERATED ALWAYS AS (consequence_score * likelihood_score) STORED,
  seasonal_adjustment DECIMAL(3,2),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Signal processing
CREATE TABLE resilience_signals (
  id UUID PRIMARY KEY,
  signal_type VARCHAR(100) NOT NULL,
  source VARCHAR(100) NOT NULL,
  asset_id UUID REFERENCES assets(id),
  signal_data JSONB,
  processed_at TIMESTAMP,
  response_required BOOLEAN DEFAULT FALSE
);

-- Margin operations
CREATE TABLE margin_operations (
  id UUID PRIMARY KEY,
  operation_type VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  current_utilization DECIMAL(5,2),
  available_capacity DECIMAL(5,2),
  emergency_threshold DECIMAL(5,2),
  last_deployed TIMESTAMP
);
```

### Component Architecture

#### New React Components
```typescript
// Control Dashboard Components
<ControlDashboard />
  ├── <PurposeOverview />
  ├── <CriticalControlStatus />
  ├── <AssetLookup />
  └── <PurposeDecisions />

// Risk Rhythm Components
<RiskRhythm />
  ├── <DynamicSchedule />
  ├── <RiskCalculations />
  ├── <SeasonalProfiles />
  └── <PriorityAdjustments />

// Margin Operations Components
<MarginOperations />
  ├── <SignalProcessing />
  ├── <MarginUtilization />
  ├── <EmergencyResources />
  └── <ResilienceMetrics />
```

---

## User Experience Design

### Navigation Flow
```
Dashboard → Resilience Command → [Control Dashboard | Risk Rhythm | Margin Operations]
```

### Purpose-Driven Asset Lookup Design

#### Primary Access Method: Contextual Integration
- Asset details embedded within Control Dashboard
- Assets organized by service purpose, not type
- Search by purpose, not asset name
- Guided discovery through critical controls

#### Secondary Access Method: Emergency Override
- Quick search for urgent situations
- Purpose-first search suggestions
- Clear indication when bypassing purpose-driven workflow
- Automatic purpose validation prompts

### Behavioral Design Elements

#### Positive Reinforcement
- **Purpose Validation**: Highlight when assets serve clear purposes
- **Risk Awareness**: Show risk implications of decisions
- **Resilience Metrics**: Display system strength improvements
- **Learning Prompts**: Suggest purpose-driven alternatives

#### Gentle Guidance
- **Purpose-First Search**: Default to purpose-based queries
- **Contextual Help**: Explain why purpose-driven approach matters
- **Workflow Suggestions**: Guide users toward Aegrid Rules compliance
- **Progressive Disclosure**: Show complexity only when needed

---

## Risk Mitigation

### Technical Risks
- **Data Migration**: Ensure smooth transition from old to new interfaces
- **Performance**: Maintain responsiveness with integrated views
- **Compatibility**: Support existing integrations and APIs
- **Testing**: Comprehensive testing across all user roles

### User Adoption Risks
- **Change Resistance**: Provide clear training and support
- **Workflow Disruption**: Gradual rollout with fallback options
- **Learning Curve**: Intuitive design with progressive complexity
- **Expectation Management**: Clear communication about new approach

### Business Risks
- **Feature Parity**: Ensure no loss of essential functionality
- **Customer Satisfaction**: Monitor user feedback and satisfaction
- **Support Load**: Prepare support team for new interface
- **Rollback Plan**: Ability to revert if issues arise

---

## Success Metrics

### Technical Metrics
- **Page Load Time**: < 2 seconds for all interfaces
- **API Response Time**: < 500ms for critical endpoints
- **Error Rate**: < 1% for all operations
- **Uptime**: 99.9% availability

### User Experience Metrics
- **Task Completion Rate**: > 95% for common workflows
- **Time to Complete**: 50% reduction in daily management time
- **User Satisfaction**: > 4.5/5 rating
- **Support Tickets**: < 10% increase during transition

### Business Metrics
- **Purpose Alignment**: 100% of assets mapped to critical controls
- **Risk-Based Scheduling**: 90% of maintenance scheduled by risk
- **Signal Response**: < 4 hours average response time
- **Margin Utilization**: Effective use of operational slack

---

## Training and Change Management

### User Training Strategy
1. **Pre-Migration**: Communicate changes and benefits
2. **Migration Week**: Hands-on training sessions
3. **Post-Migration**: Ongoing support and refinement
4. **Long-term**: Continuous improvement based on feedback

### Training Materials
- **Video Tutorials**: Screen recordings of new workflows
- **User Guides**: Step-by-step documentation
- **FAQ**: Common questions and answers
- **Best Practices**: Aegrid Rules application examples

### Change Management
- **Stakeholder Communication**: Regular updates on progress
- **Feedback Loops**: User input throughout migration
- **Success Stories**: Share early wins and benefits
- **Continuous Improvement**: Iterative refinement based on usage

---

## Conclusion

This migration plan transforms asset management from traditional, complex workflows to focused, purpose-driven interfaces that embody the Aegrid Rules. The inclusion of a purpose-driven asset lookup balances practical needs with behavioral design principles, ensuring managers can access what they need while being guided toward resilience-focused thinking.

The phased approach minimizes risk while delivering clear value at each stage, ultimately creating a more effective and intuitive asset management experience that helps managers make better decisions about resilient infrastructure.

---

*This migration plan provides a comprehensive roadmap for transforming the manager journey from traditional asset management to focused resilience engineering, aligned with the Aegrid Rules and practical user needs.*
