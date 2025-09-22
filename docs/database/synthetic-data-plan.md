# Enhanced Synthetic Data Development & Seed Database Plan - Aegrid Rules Edition

## Overview

This document outlines the comprehensive plan for developing and seeding synthetic data for the Aegrid platform, featuring **Greenfield Shire Council** as a fictional early adopter council investing in future technologies. This enhanced plan aligns with the updated ERD and demonstrates all four Aegrid Rules through realistic operational scenarios.

## Enhanced Scope - Aegrid Rules Demonstration

### Rule 1: Every Asset Has a Purpose

- **500+ assets** with defined service purposes and critical control mappings
- **Function-based categorization** across renewable energy, smart infrastructure, and traditional assets
- **Purpose-driven workflows** for all maintenance and operational activities

### Rule 2: Risk Sets Rhythm

- **Risk-based maintenance schedules** with adaptive prioritisation
- **SLA-driven contractor management** with performance tracking
- **Signal-driven work orders** based on real-time risk assessment

### Rule 3: Real-World Response

- **Signal detection and response** with evidence capture
- **Emergency response protocols** with margin deployment
- **Citizen engagement** with real-time issue reporting and feedback

### Rule 4: Operate with Margin

- **Capacity margin management** across all resource types
- **Emergency response capabilities** with surge capacity
- **Future-focused planning** with margin utilization analytics

## Fictional Council: Greenfield Shire Council

### Council Profile

- **Name**: Greenfield Shire Council
- **Location**: Regional Victoria, Australia
- **Population**: 45,000 residents
- **Area**: 2,500 km²
- **Characteristics**: Progressive, technology-forward, sustainability-focused
- **Innovation Focus**: Early adopter of renewable energy and smart infrastructure

### Strategic Vision

Greenfield Shire Council is positioning itself as a leader in sustainable infrastructure and smart city technologies, with significant investments in:

- **Renewable Energy**: Wind farms, solar installations, battery storage systems
- **Smart Infrastructure**: IoT sensors, smart lighting, intelligent traffic management
- **Sustainability**: Electric vehicle charging networks, waste-to-energy facilities
- **Resilience**: Climate adaptation infrastructure, emergency response systems

## Master Data Structure

### 1. Organisation Data

```typescript
interface Organisation {
  id: string;
  name: 'Greenfield Shire Council';
  resilience_config: {
    margin_settings: {
      time_margin_percentage: 15;
      capacity_margin_percentage: 20;
      material_margin_percentage: 10;
      financial_margin_percentage: 12;
    };
    signal_thresholds: {
      critical: 90;
      high: 75;
      medium: 50;
      low: 25;
    };
    emergency_protocols: {
      weather_events: 'immediate_response';
      equipment_failure: '24_hour_response';
      service_disruption: '4_hour_response';
    };
  };
  margin_settings: {
    time_margin: {
      buffer_hours: 2;
      emergency_buffer_hours: 8;
    };
    capacity_margin: {
      surge_capacity_percentage: 25;
      emergency_capacity_percentage: 50;
    };
    material_margin: {
      critical_spares_percentage: 15;
      emergency_spares_percentage: 30;
    };
    financial_margin: {
      contingency_percentage: 10;
      emergency_fund_percentage: 5;
    };
  };
}
```

### 2. User Roles & Personas

```typescript
interface UserPersonas {
  executive: {
    name: 'Sarah Chen';
    role: 'EXEC';
    responsibilities: [
      'strategic_oversight',
      'margin_monitoring',
      'resilience_metrics',
    ];
  };
  manager: {
    name: 'Michael Rodriguez';
    role: 'MANAGER';
    responsibilities: [
      'risk_management',
      'resource_allocation',
      'maintenance_planning',
    ];
  };
  supervisor: {
    name: 'Emma Thompson';
    role: 'SUPERVISOR';
    responsibilities: [
      'work_coordination',
      'emergency_response',
      'team_management',
    ];
  };
  crew: {
    name: 'James Wilson';
    role: 'CREW';
    responsibilities: ['field_work', 'inspections', 'data_collection'];
  };
  citizen: {
    name: 'Community Members';
    role: 'CITIZEN';
    responsibilities: [
      'signal_reporting',
      'service_feedback',
      'community_engagement',
    ];
  };
  admin: {
    name: 'David Park';
    role: 'ADMIN';
    responsibilities: ['system_administration', 'configuration', 'monitoring'];
  };
}
```

## Asset Portfolio: Future Technology Focus

### 1. Renewable Energy Assets

#### Wind Farm Infrastructure

```typescript
interface WindFarmAssets {
  wind_turbines: {
    count: 12;
    capacity: '3.6MW each';
    locations: ['Hilltop Ridge', 'Windy Plains', 'Green Valley'];
    technology: 'Direct drive, smart grid connected';
  };
  substations: {
    count: 3;
    capacity: '50MW each';
    technology: 'Smart grid, battery backup';
  };
  transmission_lines: {
    length: '45km';
    voltage: '132kV';
    technology: 'Smart monitoring, fault detection';
  };
}
```

#### Solar Farm Infrastructure

```typescript
interface SolarFarmAssets {
  solar_arrays: {
    count: 8;
    capacity: '5MW each';
    technology: 'Bifacial panels, tracking systems';
    locations: ['Sunny Fields', 'Solar Valley', 'Bright Plains'];
  };
  inverters: {
    count: 16;
    capacity: '2.5MW each';
    technology: 'Smart inverters, grid-forming capability';
  };
  battery_storage: {
    capacity: '25MW/50MWh';
    technology: 'Lithium-ion, grid-scale';
    applications: ['peak_shaving', 'frequency_regulation', 'backup_power'];
  };
}
```

#### Battery Storage Systems

```typescript
interface BatteryStorageAssets {
  grid_scale_batteries: {
    count: 4;
    capacity: '10MW/20MWh each';
    technology: 'Lithium-ion, liquid cooling';
    applications: [
      'renewable_integration',
      'grid_stability',
      'emergency_backup',
    ];
  };
  community_batteries: {
    count: 12;
    capacity: '500kW/1MWh each';
    technology: 'Modular, smart management';
    locations: ['residential_areas', 'commercial_districts'];
  };
  mobile_batteries: {
    count: 6;
    capacity: '1MW/2MWh each';
    technology: 'Transportable, rapid deployment';
    applications: ['emergency_response', 'event_power', 'maintenance_backup'];
  };
}
```

### 2. Smart Infrastructure Assets

#### Smart Lighting Network

```typescript
interface SmartLightingAssets {
  smart_streetlights: {
    count: 2500;
    technology: 'LED, IoT sensors, adaptive dimming';
    features: ['motion_detection', 'weather_adaptation', 'energy_monitoring'];
  };
  smart_poles: {
    count: 150;
    technology: 'Multi-purpose, 5G ready';
    features: ['air_quality_monitoring', 'traffic_sensing', 'emergency_alerts'];
  };
}
```

#### Intelligent Traffic Management

```typescript
interface TrafficManagementAssets {
  smart_traffic_lights: {
    count: 85;
    technology: 'AI-controlled, adaptive timing';
    features: ['traffic_flow_optimization', 'emergency_vehicle_priority'];
  };
  traffic_sensors: {
    count: 200;
    technology: 'IoT, real-time monitoring';
    features: ['congestion_detection', 'incident_reporting', 'data_analytics'];
  };
}
```

#### Electric Vehicle Infrastructure

```typescript
interface EVInfrastructureAssets {
  charging_stations: {
    count: 45;
    technology: 'Fast charging, smart grid connected';
    types: ['public', 'workplace', 'fleet'];
  };
  charging_hubs: {
    count: 8;
    technology: 'Ultra-fast charging, battery storage';
    features: ['renewable_integration', 'grid_services', 'backup_power'];
  };
}
```

### 3. Traditional Infrastructure Assets

#### Water & Wastewater

```typescript
interface WaterInfrastructureAssets {
  water_treatment_plants: {
    count: 2;
    capacity: '25ML/day each';
    technology: 'Smart monitoring, automated controls';
  };
  wastewater_treatment_plants: {
    count: 3;
    capacity: '20ML/day each';
    technology: 'Biological treatment, energy recovery';
  };
  water_storage_tanks: {
    count: 12;
    capacity: '5ML each';
    technology: 'Smart monitoring, leak detection';
  };
}
```

#### Roads & Bridges

```typescript
interface RoadInfrastructureAssets {
  major_roads: {
    length: '180km';
    technology: 'Smart monitoring, condition sensors';
  };
  bridges: {
    count: 25;
    technology: 'Structural health monitoring, IoT sensors';
  };
  tunnels: {
    count: 3;
    technology: 'Smart ventilation, emergency systems';
  };
}
```

## Enhanced Data Generation Strategy - ERD Aligned

### 1. Core Entity Generation (Enhanced for ERD)

#### Vendor & Contract Ecosystem

```typescript
interface VendorEcosystem {
  vendors: {
    count: 15;
    types: [
      'electrical_contractors',
      'civil_contractors',
      'renewable_energy_specialists',
      'smart_infrastructure',
    ];
    performance_ratings: [3.5, 4.8]; // Realistic range
    capacity_margins: [15, 35]; // Percentage range
  };
  contracts: {
    count: 25;
    types: ['maintenance', 'emergency_response', 'installation', 'consulting'];
    durations: [12, 60]; // Months range
    sla_requirements: ['response_time', 'resolution_time', 'availability'];
  };
  slas: {
    count: 75;
    response_times: [1, 48]; // Hours range
    resolution_times: [4, 168]; // Hours range
    breach_escalation: ['immediate', '24_hour', '48_hour'];
  };
}
```

#### Critical Controls & Asset Mappings

```typescript
interface CriticalControlSystem {
  critical_controls: {
    count: 50;
    types: [
      'safety_systems',
      'environmental_monitoring',
      'performance_metrics',
      'compliance',
    ];
    window_hours: [1, 168]; // 1 hour to 1 week
    frequency_days: [1, 365]; // Daily to annual
    escalation_policies: ['immediate', '24_hour', '48_hour', 'weekly'];
  };
  asset_mappings: {
    coverage: '100%'; // Every asset has critical controls
    vendor_assignments: '80%'; // Most critical controls have assigned vendors
    compliance_tracking: 'real_time';
  };
}
```

#### Citizen Engagement Data

```typescript
interface CitizenEngagement {
  citizen_reports: {
    count: 2500;
    categories: [
      'infrastructure_issues',
      'safety_concerns',
      'service_quality',
      'environmental',
    ];
    risk_levels: ['low', 'medium', 'high', 'critical'];
    response_times: [2, 72]; // Hours range
    resolution_rates: 0.85; // 85% resolution rate
  };
  citizen_feedback: {
    count: 1800;
    satisfaction_ratings: [1, 5]; // 1-5 scale
    service_improvements: 'collected_and_analyzed';
    feedback_channels: ['mobile_app', 'web_portal', 'phone', 'email'];
  };
}
```

### 2. Enhanced Historical Data (2+ Years)

#### Operational Data with ERD Entities

```typescript
interface EnhancedHistoricalData {
  work_orders: {
    count: 18000;
    sla_compliance: 0.92; // 92% SLA compliance rate
    evidence_capture: 0.88; // 88% have evidence
    vendor_performance: 'tracked_and_rated';
    signal_driven: 0.65; // 65% signal-driven work orders
    margin_deployed: 0.15; // 15% required margin deployment
  };
  inspections: {
    count: 12000;
    critical_control_status: '100%_tracked';
    purpose_alignment: 0.95; // 95% aligned with asset purpose
    risk_assessment: 'integrated';
    evidence_photos: 'required_and_stored';
  };
  signals: {
    count: 75000;
    sources: [
      'iot_sensors',
      'weather_data',
      'citizen_reports',
      'system_metrics',
      'manual_inspections',
    ];
    response_times: [15, 1440]; // 15 minutes to 24 hours
    resolution_status: 'tracked_and_analyzed';
    lessons_learned: 'captured_and_applied';
  };
}
```

#### Weather & Environmental Data

```typescript
interface WeatherData {
  temperature: {
    range: '-5°C to 45°C';
    patterns: ['seasonal_variations', 'heat_waves', 'cold_snaps'];
  };
  rainfall: {
    annual_average: '650mm';
    patterns: ['drought_periods', 'flood_events', 'storm_seasons'];
  };
  wind: {
    average_speed: '15km/h';
    patterns: ['windy_seasons', 'calm_periods', 'storm_events'];
  };
  solar_irradiance: {
    daily_average: '5.2kWh/m²';
    patterns: ['seasonal_variations', 'cloud_cover', 'clear_days'];
  };
}
```

### 2. Real-Time Data Streams

#### IoT Sensor Data

```typescript
interface IoTDataStreams {
  renewable_energy_sensors: {
    wind_speed: 'real_time';
    solar_irradiance: 'real_time';
    battery_state_of_charge: 'real_time';
    power_output: 'real_time';
  };
  infrastructure_sensors: {
    structural_health: 'continuous';
    environmental_conditions: 'continuous';
    performance_metrics: 'continuous';
    safety_systems: 'continuous';
  };
  smart_city_sensors: {
    traffic_flow: 'real_time';
    air_quality: 'hourly';
    noise_levels: 'continuous';
    pedestrian_count: 'real_time';
  };
}
```

#### Citizen-Generated Data

```typescript
interface CitizenData {
  service_reports: {
    types: [
      'potholes',
      'streetlight_failures',
      'traffic_issues',
      'environmental_concerns',
    ];
    frequency: 'daily';
    channels: ['mobile_app', 'web_portal', 'phone', 'email'];
  };
  community_feedback: {
    types: ['service_quality', 'infrastructure_condition', 'safety_concerns'];
    frequency: 'weekly';
    sentiment: ['positive', 'neutral', 'negative'];
  };
}
```

## Enhanced Database Seeding Implementation - ERD Aligned

### 1. Comprehensive Seed Script Structure

```typescript
// prisma/seed.ts - Enhanced for Aegrid Rules Demonstration
import { PrismaClient } from '@prisma/client';
import { generateGreenfieldCouncil } from './seed-data/greenfield-council';
import { generateUserPersonas } from './seed-data/user-personas';
import { generateAssetPortfolio } from './seed-data/asset-portfolio';
import { generateVendorEcosystem } from './seed-data/vendor-ecosystem';
import { generateRCMTemplates } from './seed-data/rcm-templates';
import { generateCriticalControls } from './seed-data/critical-controls';
import { generateCitizenEngagement } from './seed-data/citizen-engagement';
import { generateSignalsAndRisk } from './seed-data/signals-risk';
import { generateHistoricalData } from './seed-data/historical-data';
import { generateEvidenceAndDocumentation } from './seed-data/evidence-documentation';
import { generateMarginManagement } from './seed-data/margin-management';
import { generateEmergencyResponse } from './seed-data/emergency-response';
import { generateComplianceAndAudit } from './seed-data/compliance-audit';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Aegrid Rules demonstration data seeding...');
  console.log('📋 Demonstrating: Purpose, Risk, Response, Margin');

  try {
    // 1. Create Greenfield Shire Council with resilience configuration
    console.log('🏛️ Creating organisation...');
    const organisation = await generateGreenfieldCouncil(prisma);

    // 2. Create complete user personas (Rule 1: Purpose-driven roles)
    console.log('👥 Creating user personas...');
    const users = await generateUserPersonas(prisma, organisation.id);

    // 3. Create comprehensive asset portfolio (Rule 1: Every asset has purpose)
    console.log('🏗️ Creating asset portfolio...');
    const assets = await generateAssetPortfolio(prisma, organisation.id);

    // 4. Create vendor ecosystem with contracts and SLAs (Rule 2: Risk-based management)
    console.log('🤝 Creating vendor ecosystem...');
    const { vendors, contracts, slas } = await generateVendorEcosystem(
      prisma,
      organisation.id
    );

    // 5. Create RCM templates for all asset types (Rule 2: Risk sets rhythm)
    console.log('📋 Creating RCM templates...');
    const rcmTemplates = await generateRCMTemplates(prisma, organisation.id);

    // 6. Create critical controls and asset mappings (Rule 1: Purpose-driven controls)
    console.log('🎯 Creating critical controls...');
    const criticalControls = await generateCriticalControls(
      prisma,
      organisation.id,
      assets
    );

    // 7. Create citizen engagement data (Rule 3: Real-world response)
    console.log('👥 Creating citizen engagement...');
    const citizenData = await generateCitizenEngagement(
      prisma,
      organisation.id,
      assets
    );

    // 8. Create signals and risk management data (Rule 3: Signal-driven response)
    console.log('📡 Creating signals and risk data...');
    const signalsData = await generateSignalsAndRisk(
      prisma,
      organisation.id,
      assets
    );

    // 9. Create evidence and documentation (Rule 3: Evidence-based operations)
    console.log('📸 Creating evidence and documentation...');
    const evidenceData = await generateEvidenceAndDocumentation(
      prisma,
      organisation.id
    );

    // 10. Create margin management data (Rule 4: Operate with margin)
    console.log('📊 Creating margin management...');
    const marginData = await generateMarginManagement(prisma, organisation.id);

    // 11. Create emergency response data (Rule 4: Emergency capabilities)
    console.log('🚨 Creating emergency response...');
    const emergencyData = await generateEmergencyResponse(
      prisma,
      organisation.id,
      assets
    );

    // 12. Create compliance and audit data (Rule 4: Future-focused compliance)
    console.log('📋 Creating compliance and audit...');
    const complianceData = await generateComplianceAndAudit(
      prisma,
      organisation.id,
      assets
    );

    // 13. Generate 2+ years of historical operational data
    console.log('📈 Creating historical data...');
    await generateHistoricalData(prisma, organisation.id, {
      assets,
      users,
      vendors,
      contracts,
      slas,
      criticalControls,
      rcmTemplates,
      citizenData,
      signalsData,
      evidenceData,
      marginData,
      emergencyData,
      complianceData,
    });

    console.log('✅ Aegrid Rules demonstration data seeding completed!');
    console.log(`📊 Created:`);
    console.log(`   • ${assets.length} assets with defined purposes`);
    console.log(`   • ${users.length} users across all roles`);
    console.log(`   • ${contracts.length} contracts with SLA tracking`);
    console.log(`   • ${criticalControls.length} critical controls mapped`);
    console.log(`   • ${citizenData.reports} citizen reports`);
    console.log(`   • ${signalsData.count} risk signals`);
    console.log(`   • ${marginData.count} margin management records`);
    console.log(`   • ${emergencyData.count} emergency response events`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 2. Data Generation Functions

#### Organisation Generation

```typescript
// seed-data/greenfield-council.ts
export async function generateGreenfieldCouncil(prisma: PrismaClient) {
  return await prisma.organisation.create({
    data: {
      name: 'Greenfield Shire Council',
      resilience_config: {
        margin_settings: {
          time_margin_percentage: 15,
          capacity_margin_percentage: 20,
          material_margin_percentage: 10,
          financial_margin_percentage: 12,
        },
        signal_thresholds: {
          critical: 90,
          high: 75,
          medium: 50,
          low: 25,
        },
        emergency_protocols: {
          weather_events: 'immediate_response',
          equipment_failure: '24_hour_response',
          service_disruption: '4_hour_response',
        },
      },
      margin_settings: {
        time_margin: {
          buffer_hours: 2,
          emergency_buffer_hours: 8,
        },
        capacity_margin: {
          surge_capacity_percentage: 25,
          emergency_capacity_percentage: 50,
        },
        material_margin: {
          critical_spares_percentage: 15,
          emergency_spares_percentage: 30,
        },
        financial_margin: {
          contingency_percentage: 10,
          emergency_fund_percentage: 5,
        },
      },
    },
  });
}
```

#### Renewable Energy Assets Generation

```typescript
// seed-data/renewable-energy.ts
export async function generateRenewableEnergyAssets(
  prisma: PrismaClient,
  organisationId: string
) {
  const assets = [];

  // Wind Turbines
  for (let i = 1; i <= 12; i++) {
    const asset = await prisma.asset.create({
      data: {
        organisation_id: organisationId,
        name: `Wind Turbine ${i}`,
        type: 'WIND_TURBINE',
        location_geom: generateWindTurbineLocation(i),
        condition: Math.floor(Math.random() * 20) + 80, // 80-100
        risk_score: Math.floor(Math.random() * 30) + 20, // 20-50
        service_purpose: 'RENEWABLE_ENERGY_GENERATION',
        critical_control_mapped: true,
        function_based_category: 'ENERGY_INFRASTRUCTURE',
      },
    });
    assets.push(asset);
  }

  // Solar Arrays
  for (let i = 1; i <= 8; i++) {
    const asset = await prisma.asset.create({
      data: {
        organisation_id: organisationId,
        name: `Solar Array ${i}`,
        type: 'SOLAR_ARRAY',
        location_geom: generateSolarArrayLocation(i),
        condition: Math.floor(Math.random() * 15) + 85, // 85-100
        risk_score: Math.floor(Math.random() * 25) + 15, // 15-40
        service_purpose: 'RENEWABLE_ENERGY_GENERATION',
        critical_control_mapped: true,
        function_based_category: 'ENERGY_INFRASTRUCTURE',
      },
    });
    assets.push(asset);
  }

  // Battery Storage Systems
  for (let i = 1; i <= 4; i++) {
    const asset = await prisma.asset.create({
      data: {
        organisation_id: organisationId,
        name: `Grid-Scale Battery ${i}`,
        type: 'BATTERY_STORAGE',
        location_geom: generateBatteryLocation(i),
        condition: Math.floor(Math.random() * 10) + 90, // 90-100
        risk_score: Math.floor(Math.random() * 20) + 10, // 10-30
        service_purpose: 'ENERGY_STORAGE_AND_GRID_STABILITY',
        critical_control_mapped: true,
        function_based_category: 'ENERGY_INFRASTRUCTURE',
      },
    });
    assets.push(asset);
  }

  return assets;
}
```

#### Historical Data Generation

```typescript
// seed-data/historical-data.ts
export async function generateHistoricalData(
  prisma: PrismaClient,
  organisationId: string,
  context: any
) {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2);

  // Generate Work Orders
  for (let i = 0; i < 15000; i++) {
    const asset =
      context.assets[Math.floor(Math.random() * context.assets.length)];
    const user =
      context.users[Math.floor(Math.random() * context.users.length)];
    const contract =
      context.contracts[Math.floor(Math.random() * context.contracts.length)];

    await prisma.workOrder.create({
      data: {
        organisation_id: organisationId,
        asset_id: asset.id,
        contract_id: contract.id,
        sla_id: contract.sla_id,
        status: generateWorkOrderStatus(),
        due_date: generateFutureDate(1, 30),
        assigned_to: user.id,
        signal_driven: Math.random() > 0.7,
        adaptive_priority: Math.floor(Math.random() * 5) + 1,
        margin_deployed: Math.random() > 0.8,
      },
    });
  }

  // Generate Inspections
  for (let i = 0; i < 8000; i++) {
    const asset =
      context.assets[Math.floor(Math.random() * context.assets.length)];
    const user =
      context.users[Math.floor(Math.random() * context.users.length)];

    await prisma.inspection.create({
      data: {
        organisation_id: organisationId,
        asset_id: asset.id,
        inspector_id: user.id,
        date: generatePastDate(1, 730),
        condition: Math.floor(Math.random() * 40) + 60, // 60-100
        notes: generateInspectionNotes(),
        signal_detected: Math.random() > 0.8,
        critical_control_status: generateCriticalControlStatus(),
        purpose_alignment: Math.random() > 0.9,
      },
    });
  }

  // Generate Signal Detection Events
  for (let i = 0; i < 50000; i++) {
    const asset =
      context.assets[Math.floor(Math.random() * context.assets.length)];

    await prisma.signalDetection.create({
      data: {
        organisation_id: organisationId,
        asset_id: asset.id,
        signal_type: generateSignalType(),
        severity: generateSignalSeverity(),
        detected_at: generatePastDate(1, 730),
        response_time_hours: Math.floor(Math.random() * 48) + 1,
        resolution_status: generateResolutionStatus(),
        lessons_learned: generateLessonsLearned(),
      },
    });
  }
}
```

### 3. Real-Time Data Streams

#### Signal Generation

```typescript
// seed-data/real-time-data.ts
export async function generateRealTimeData(
  prisma: PrismaClient,
  organisationId: string
) {
  // Generate current margin management data
  const marginTypes = ['TIME', 'CAPACITY', 'MATERIAL', 'FINANCIAL'];

  for (const marginType of marginTypes) {
    await prisma.marginManagement.create({
      data: {
        organisation_id: organisationId,
        margin_type: marginType,
        utilization_rate: Math.random() * 0.8 + 0.1, // 10-90%
        effectiveness_score: Math.random() * 0.4 + 0.6, // 60-100%
        deployment_count: Math.floor(Math.random() * 50) + 1,
        last_deployed: generatePastDate(1, 30),
        cost_benefit_ratio: Math.random() * 2 + 1, // 1-3
      },
    });
  }

  // Generate resilience metrics
  const metricTypes = [
    'RESPONSE_TIME',
    'RECOVERY_TIME',
    'ADAPTABILITY',
    'ANTIFRAGILITY',
  ];

  for (const metricType of metricTypes) {
    await prisma.resilienceMetrics.create({
      data: {
        organisation_id: organisationId,
        metric_type: metricType,
        value: Math.random() * 100,
        measurement_date: new Date(),
        trend_direction: generateTrendDirection(),
        target_value: 85,
        performance_rating: generatePerformanceRating(),
      },
    });
  }
}
```

## Data Validation & Quality Assurance

### 1. Data Consistency Checks

```typescript
// validation/data-consistency.ts
export async function validateDataConsistency(prisma: PrismaClient) {
  const checks = [
    validateAssetCriticalControlMapping,
    validateWorkOrderAssetRelationships,
    validateInspectionAssetRelationships,
    validateSignalAssetRelationships,
    validateMarginUtilizationRates,
    validateResilienceMetricsRanges,
  ];

  for (const check of checks) {
    await check(prisma);
  }
}
```

### 2. Performance Testing

```typescript
// validation/performance-testing.ts
export async function testDataPerformance(prisma: PrismaClient) {
  const tests = [
    testAssetQueryPerformance,
    testWorkOrderQueryPerformance,
    testSignalQueryPerformance,
    testMarginQueryPerformance,
    testResilienceMetricsPerformance,
  ];

  for (const test of tests) {
    await test(prisma);
  }
}
```

## Implementation Timeline

### Week 1: Foundation Setup

- [ ] Database schema validation
- [ ] Seed script framework
- [ ] Basic data generation functions
- [ ] Organisation and user data

### Week 2: Asset Portfolio Generation

- [ ] Renewable energy assets
- [ ] Smart infrastructure assets
- [ ] Traditional infrastructure assets
- [ ] Asset relationships and mappings

### Week 3: Historical Data Generation

- [ ] Work order history
- [ ] Inspection history
- [ ] Signal detection history
- [ ] Performance metrics history

### Week 4: Real-Time Data Streams

- [ ] Current margin management data
- [ ] Real-time resilience metrics
- [ ] Signal detection streams
- [ ] Performance monitoring data

### Week 5: Validation & Testing

- [ ] Data consistency validation
- [ ] Performance testing
- [ ] User acceptance testing
- [ ] Documentation completion

## Success Metrics

### Data Quality Metrics

- **Data Consistency**: 100% referential integrity
- **Data Completeness**: 95%+ field population
- **Data Accuracy**: Realistic patterns and relationships
- **Performance**: Sub-second query response times

### Business Value Metrics

- **Realistic Scenarios**: All user journeys supported
- **Aegrid Rules Validation**: All four rules demonstrated
- **Resilience Testing**: Comprehensive resilience scenarios
- **Stakeholder Confidence**: Realistic demos and validation

## Conclusion

This synthetic data plan provides a comprehensive foundation for testing and validating the Aegrid platform's resilience capabilities. Greenfield Shire Council serves as an ideal test case, combining traditional infrastructure with cutting-edge renewable energy and smart city technologies, enabling thorough testing of all Aegrid Rules and resilience features.

The generated dataset will support:

- **Comprehensive Testing**: All PI3 features tested against realistic data
- **User Journey Validation**: All personas and workflows supported
- **Resilience Scenarios**: Emergency response and margin management testing
- **Performance Validation**: System performance under realistic loads
- **Stakeholder Confidence**: Realistic demos and user acceptance testing
