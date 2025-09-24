# Manager Journey Energy Management Integration Proposal

## Overview

This proposal outlines the integration of energy management capabilities into the Manager Journey to support comprehensive asset lifecycle management, including energy assets, sustainability goals, and carbon management.

## Current Energy Management Capabilities

### Existing Components (Analysis from Codebase)

- **Energy Management Dashboard** (`app/energy-management/page.tsx`)
- **Energy Consumption Chart** (`components/energy/energy-consumption-chart.tsx`)
- **Energy Efficiency Metrics** (`components/energy/energy-efficiency-metrics.tsx`)
- **Carbon Tracking Panel** (`components/energy/carbon-tracking-panel.tsx`)
- **Energy Alerts Panel** (`components/energy/energy-alerts-panel.tsx`)
- **Energy Optimisation Panel** (`components/energy/energy-optimisation-panel.tsx`)
- **Energy Management Core** (`lib/energy-management-core.ts`)

### Current Energy Asset Types (From Schema)

- WIND_TURBINE
- SOLAR_ARRAY
- BATTERY_STORAGE
- WIND_FARM_SUBSTATION
- SOLAR_FARM_INVERTER
- GRID_SCALE_BATTERY
- COMMUNITY_BATTERY
- MOBILE_BATTERY
- SMART_STREETLIGHT
- SMART_POLE
- EV_CHARGING_STATION
- EV_CHARGING_HUB

## Energy Management Integration Points in Manager Journey

### 1. Strategic Asset Overview (Enhanced with Energy)

#### Current Journey Step:

```
:Reviews Executive Overview Dashboard;
note right: **Strategic Asset Overview**\nAsset portfolio health\nCritical asset status\nPerformance metrics\nRisk indicators
```

#### Enhanced with Energy:

```
:Reviews Executive Overview Dashboard;
note right: **Strategic Asset Overview**\nAsset portfolio health (including energy assets)\nCritical asset status (energy infrastructure)\nPerformance metrics (energy efficiency KPIs)\nRisk indicators (energy security)\nCarbon footprint tracking\nRenewable energy targets\nEnergy cost optimization
```

### 2. Critical Control Management (Energy-Specific Controls)

#### New Energy-Specific Critical Controls:

- **Energy Security Controls**: Grid stability, backup power systems
- **Renewable Energy Performance**: Solar/wind output monitoring
- **Battery Safety Controls**: Thermal management, charge/discharge cycles
- **EV Charging Infrastructure**: Availability, safety, performance
- **Carbon Compliance**: Emissions monitoring, regulatory compliance

#### Enhanced Journey Step:

```
if (Energy critical controls need attention?) then (yes)
  :Reviews Energy Critical Control Status;
  note right: **Energy Critical Control Management**\nGrid stability monitoring\nRenewable asset performance\nBattery system safety\nEV charging availability\nCarbon compliance status

  :Creates Energy Emergency Work Order;
  note right: **Energy Emergency Response**\nGrid restoration procedures\nRenewable asset maintenance\nBattery system isolation\nEV charging repair\nEmissions reduction actions
```

### 3. Risk-Based Maintenance (Energy Asset Integration)

#### Energy-Specific Risk Factors:

- **Weather Impact**: Solar panel efficiency, wind turbine performance
- **Grid Stability**: Frequency fluctuations, voltage variations
- **Demand Patterns**: Peak load management, capacity planning
- **Technology Lifecycle**: Battery degradation, inverter aging
- **Regulatory Changes**: Carbon pricing, renewable energy targets

#### Enhanced Journey Step:

```
:Analyzes Energy Risk Signals;
note right: **Energy Signal Processing**\nWeather impact on renewables\nGrid stability indicators\nEnergy demand patterns\nTechnology performance\nCarbon pricing changes\nRegulatory compliance risks

:Adjusts Energy Maintenance Priorities;
note right: **Energy-Specific Priority Management**\nRenewable asset optimization\nBattery lifecycle management\nGrid connection maintenance\nEV infrastructure upkeep\nCarbon reduction initiatives
```

### 4. Resource Operations (Energy Capacity Management)

#### Energy Resource Considerations:

- **Energy Generation Capacity**: Available renewable generation
- **Storage Capacity**: Battery charge levels, backup power
- **Grid Connection**: Import/export capabilities
- **Maintenance Resources**: Specialized energy technicians
- **Emergency Response**: Energy restoration crews

#### Enhanced Journey Step:

```
:Monitors Energy Resource Capacity;
note right: **Energy Capacity Management**\nRenewable generation available\nBattery storage levels\nGrid import/export capacity\nEnergy specialist availability\nEmergency restoration readiness

if (Energy capacity constraints detected?) then (yes)
  :Deploys Energy Margin Resources;
  note right: **Energy Margin Deployment**\nBackup generation activation\nLoad shedding procedures\nEnergy storage deployment\nDemand response programs\nEmergency grid support
```

### 5. Asset Retirement (Energy Asset Lifecycle)

#### Energy Asset Retirement Considerations:

- **Technology Obsolescence**: Inverter upgrades, battery replacement
- **Performance Degradation**: Solar panel efficiency decline
- **Regulatory Changes**: Grid code compliance, safety standards
- **End-of-Life Management**: Battery recycling, component disposal
- **Replacement Planning**: Technology advancement adoption

#### Enhanced Journey Step:

```
if (Energy asset retirement/replacement needed?) then (yes)
  :Initiates Energy Asset Retirement Process;
  note right: **Energy Asset Retirement**\nTechnology obsolescence assessment\nPerformance degradation analysis\nRegulatory compliance review\nRecycling procedures\nUpgrade opportunities

  :Creates Energy Replacement Work Order;
  note right: **Energy Replacement Planning**\nNext-generation technology\nGrid integration requirements\nPerformance optimization\nCarbon impact assessment
```

### 6. Strategic Planning (Energy Strategy Integration)

#### Energy Strategic Planning Elements:

- **Renewable Energy Targets**: Net zero commitments, clean energy goals
- **Grid Modernization**: Smart grid implementation, storage integration
- **Carbon Management**: Emissions reduction, offset strategies
- **Energy Efficiency**: Optimization programs, demand management
- **Investment Planning**: ROI analysis, funding priorities

#### Enhanced Journey Step:

```
:Conducts Energy Strategic Planning;
note right: **Energy Strategic Planning**\nRenewable energy roadmap\nGrid modernization strategy\nCarbon neutrality planning\nEnergy efficiency programs\nSustainability investments\nRegulatory compliance strategy

:Updates Energy Management Plan;
note right: **Energy Plan Management**\nNet zero pathway updates\nRenewable targets revision\nGrid integration planning\nCarbon accounting\nTechnology roadmaps
```

## New Manager Journey Energy Management Components

### 1. Energy Performance Dashboard

**Purpose**: Monitor energy asset performance and efficiency
**Features**:

- Real-time energy generation monitoring
- Energy consumption analytics
- Carbon footprint tracking
- Renewable energy performance
- Cost optimization recommendations

### 2. Energy Risk Assessment

**Purpose**: Assess energy-specific risks and vulnerabilities
**Features**:

- Grid stability monitoring
- Weather impact analysis
- Technology lifecycle assessment
- Regulatory compliance tracking
- Energy security evaluation

### 3. Energy Work Order Management

**Purpose**: Manage energy asset maintenance and optimization
**Features**:

- Energy-specific work order templates
- Renewable asset maintenance scheduling
- Battery management procedures
- Grid connection maintenance
- EV charging infrastructure upkeep

### 4. Carbon Management Interface

**Purpose**: Track and manage carbon emissions and reduction initiatives
**Features**:

- Carbon footprint calculation
- Emissions tracking and reporting
- Carbon offset management
- Renewable energy certificate tracking
- Sustainability goal monitoring

### 5. Energy Investment Planning

**Purpose**: Plan energy infrastructure investments and upgrades
**Features**:

- Technology ROI analysis
- Grid modernization planning
- Renewable energy project evaluation
- Energy storage optimization
- Demand response program design

## Database Schema Enhancements

### Energy Management Extensions

```sql
-- Energy Asset Performance
model EnergyAssetPerformance {
  id: String @id @default(cuid())
  assetId: String
  timestamp: DateTime
  energyGenerated: Decimal?
  energyConsumed: Decimal
  efficiency: Decimal
  carbonIntensity: Decimal
  performanceScore: Int
  status: String
}

-- Energy Risk Assessment
model EnergyRiskAssessment {
  id: String @id @default(cuid())
  assetId: String
  riskType: String
  probability: Decimal
  impact: Decimal
  riskScore: Int
  mitigation: String
  assessmentDate: DateTime
  nextReview: DateTime
}

-- Carbon Management
model CarbonFootprint {
  id: String @id @default(cuid())
  organisationId: String
  scope: String // SCOPE_1, SCOPE_2, SCOPE_3
  category: String
  emissions: Decimal
  period: String
  source: String
  verified: Boolean
  createdAt: DateTime
}

-- Energy Investment Planning
model EnergyInvestmentPlan {
  id: String @id @default(cuid())
  name: String
  investmentType: String
  technology: String
  capacity: Decimal
  estimatedCost: Decimal
  expectedROI: Decimal
  paybackPeriod: Int
  carbonReduction: Decimal
  status: String
  plannedDate: DateTime
}
```

## Implementation Roadmap

### Phase 1: Energy Monitoring Integration (Weeks 1-2)

1. **Energy Performance Dashboard**
   - Integrate existing energy components into Manager Journey
   - Add energy metrics to executive overview
   - Create energy-specific KPI tracking

2. **Energy Asset Status**
   - Extend Critical Control Monitor for energy assets
   - Add energy-specific risk indicators
   - Implement energy alert integration

### Phase 2: Energy Operations Management (Weeks 3-4)

1. **Energy Work Order Management**
   - Create energy-specific work order templates
   - Implement renewable asset maintenance scheduling
   - Add battery management procedures

2. **Energy Resource Operations**
   - Integrate energy capacity monitoring
   - Add grid connection status tracking
   - Implement demand response capabilities

### Phase 3: Strategic Energy Management (Weeks 5-6)

1. **Carbon Management**
   - Implement carbon footprint tracking
   - Add emissions reduction planning
   - Create sustainability reporting

2. **Energy Investment Planning**
   - Add technology ROI analysis
   - Implement renewable energy project evaluation
   - Create grid modernization planning tools

## Success Metrics

### Operational Metrics

- **Energy Asset Availability**: > 95%
- **Renewable Energy Performance**: Within 5% of targets
- **Energy Emergency Response**: < 15 minutes
- **Carbon Tracking Accuracy**: > 99%

### Strategic Metrics

- **Renewable Energy Adoption**: Annual increase targets
- **Carbon Reduction**: Progress toward net zero
- **Energy Cost Optimization**: Annual cost savings
- **Grid Resilience**: Outage duration reduction

### User Experience Metrics

- **Energy Dashboard Usage**: Daily active users
- **Energy Work Order Completion**: < 4 hours average
- **Manager Satisfaction**: > 4.5/5 for energy tools
- **Carbon Reporting Efficiency**: < 1 hour generation time

## Conclusion

Integrating energy management into the Manager Journey transforms Aegrid from a traditional asset management platform into a comprehensive energy-aware system. This integration supports:

1. **Holistic Asset Management**: Energy and traditional assets managed together
2. **Sustainability Goals**: Carbon neutrality and renewable energy targets
3. **Operational Excellence**: Optimized energy operations and maintenance
4. **Strategic Planning**: Long-term energy infrastructure development
5. **Regulatory Compliance**: Environmental and energy regulations

The proposed integration maintains alignment with The Aegrid Rules while extending them to cover energy-specific considerations, ensuring managers can effectively oversee both traditional and energy infrastructure assets within a unified platform.
