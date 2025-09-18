# Synthetic Data Development & Seed Database Plan

## Overview

This document outlines the comprehensive plan for developing and seeding synthetic data for the Aegrid platform, featuring **Greenfield Shire Council** as a fictional early adopter council investing in future technologies including battery storage, wind farms, solar farms, and other innovative infrastructure.

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
  name: "Greenfield Shire Council";
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
      weather_events: "immediate_response";
      equipment_failure: "24_hour_response";
      service_disruption: "4_hour_response";
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
    name: "Sarah Chen";
    role: "EXEC";
    responsibilities: ["strategic_oversight", "margin_monitoring", "resilience_metrics"];
  };
  manager: {
    name: "Michael Rodriguez";
    role: "MANAGER";
    responsibilities: ["risk_management", "resource_allocation", "maintenance_planning"];
  };
  supervisor: {
    name: "Emma Thompson";
    role: "SUPERVISOR";
    responsibilities: ["work_coordination", "emergency_response", "team_management"];
  };
  crew: {
    name: "James Wilson";
    role: "CREW";
    responsibilities: ["field_work", "inspections", "data_collection"];
  };
  citizen: {
    name: "Community Members";
    role: "CITIZEN";
    responsibilities: ["signal_reporting", "service_feedback", "community_engagement"];
  };
  admin: {
    name: "David Park";
    role: "ADMIN";
    responsibilities: ["system_administration", "configuration", "monitoring"];
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
    capacity: "3.6MW each";
    locations: ["Hilltop Ridge", "Windy Plains", "Green Valley"];
    technology: "Direct drive, smart grid connected";
  };
  substations: {
    count: 3;
    capacity: "50MW each";
    technology: "Smart grid, battery backup";
  };
  transmission_lines: {
    length: "45km";
    voltage: "132kV";
    technology: "Smart monitoring, fault detection";
  };
}
```

#### Solar Farm Infrastructure
```typescript
interface SolarFarmAssets {
  solar_arrays: {
    count: 8;
    capacity: "5MW each";
    technology: "Bifacial panels, tracking systems";
    locations: ["Sunny Fields", "Solar Valley", "Bright Plains"];
  };
  inverters: {
    count: 16;
    capacity: "2.5MW each";
    technology: "Smart inverters, grid-forming capability";
  };
  battery_storage: {
    capacity: "25MW/50MWh";
    technology: "Lithium-ion, grid-scale";
    applications: ["peak_shaving", "frequency_regulation", "backup_power"];
  };
}
```

#### Battery Storage Systems
```typescript
interface BatteryStorageAssets {
  grid_scale_batteries: {
    count: 4;
    capacity: "10MW/20MWh each";
    technology: "Lithium-ion, liquid cooling";
    applications: ["renewable_integration", "grid_stability", "emergency_backup"];
  };
  community_batteries: {
    count: 12;
    capacity: "500kW/1MWh each";
    technology: "Modular, smart management";
    locations: ["residential_areas", "commercial_districts"];
  };
  mobile_batteries: {
    count: 6;
    capacity: "1MW/2MWh each";
    technology: "Transportable, rapid deployment";
    applications: ["emergency_response", "event_power", "maintenance_backup"];
  };
}
```

### 2. Smart Infrastructure Assets

#### Smart Lighting Network
```typescript
interface SmartLightingAssets {
  smart_streetlights: {
    count: 2500;
    technology: "LED, IoT sensors, adaptive dimming";
    features: ["motion_detection", "weather_adaptation", "energy_monitoring"];
  };
  smart_poles: {
    count: 150;
    technology: "Multi-purpose, 5G ready";
    features: ["air_quality_monitoring", "traffic_sensing", "emergency_alerts"];
  };
}
```

#### Intelligent Traffic Management
```typescript
interface TrafficManagementAssets {
  smart_traffic_lights: {
    count: 85;
    technology: "AI-controlled, adaptive timing";
    features: ["traffic_flow_optimization", "emergency_vehicle_priority"];
  };
  traffic_sensors: {
    count: 200;
    technology: "IoT, real-time monitoring";
    features: ["congestion_detection", "incident_reporting", "data_analytics"];
  };
}
```

#### Electric Vehicle Infrastructure
```typescript
interface EVInfrastructureAssets {
  charging_stations: {
    count: 45;
    technology: "Fast charging, smart grid connected";
    types: ["public", "workplace", "fleet"];
  };
  charging_hubs: {
    count: 8;
    technology: "Ultra-fast charging, battery storage";
    features: ["renewable_integration", "grid_services", "backup_power"];
  };
}
```

### 3. Traditional Infrastructure Assets

#### Water & Wastewater
```typescript
interface WaterInfrastructureAssets {
  water_treatment_plants: {
    count: 2;
    capacity: "25ML/day each";
    technology: "Smart monitoring, automated controls";
  };
  wastewater_treatment_plants: {
    count: 3;
    capacity: "20ML/day each";
    technology: "Biological treatment, energy recovery";
  };
  water_storage_tanks: {
    count: 12;
    capacity: "5ML each";
    technology: "Smart monitoring, leak detection";
  };
}
```

#### Roads & Bridges
```typescript
interface RoadInfrastructureAssets {
  major_roads: {
    length: "180km";
    technology: "Smart monitoring, condition sensors";
  };
  bridges: {
    count: 25;
    technology: "Structural health monitoring, IoT sensors";
  };
  tunnels: {
    count: 3;
    technology: "Smart ventilation, emergency systems";
  };
}
```

## Data Generation Strategy

### 1. Historical Data (2+ Years)

#### Operational Data
```typescript
interface HistoricalData {
  work_orders: {
    count: 15000;
    patterns: ["preventive_maintenance", "corrective_maintenance", "emergency_repairs"];
    seasonal_variations: ["summer_peak", "winter_maintenance", "storm_season"];
  };
  inspections: {
    count: 8000;
    frequencies: ["daily", "weekly", "monthly", "quarterly", "annually"];
    critical_controls: ["safety_systems", "environmental_monitoring", "performance_metrics"];
  };
  signals: {
    count: 50000;
    sources: ["iot_sensors", "weather_data", "citizen_reports", "system_metrics"];
    patterns: ["equipment_failure", "weather_events", "performance_degradation"];
  };
}
```

#### Weather & Environmental Data
```typescript
interface WeatherData {
  temperature: {
    range: "-5°C to 45°C";
    patterns: ["seasonal_variations", "heat_waves", "cold_snaps"];
  };
  rainfall: {
    annual_average: "650mm";
    patterns: ["drought_periods", "flood_events", "storm_seasons"];
  };
  wind: {
    average_speed: "15km/h";
    patterns: ["windy_seasons", "calm_periods", "storm_events"];
  };
  solar_irradiance: {
    daily_average: "5.2kWh/m²";
    patterns: ["seasonal_variations", "cloud_cover", "clear_days"];
  };
}
```

### 2. Real-Time Data Streams

#### IoT Sensor Data
```typescript
interface IoTDataStreams {
  renewable_energy_sensors: {
    wind_speed: "real_time";
    solar_irradiance: "real_time";
    battery_state_of_charge: "real_time";
    power_output: "real_time";
  };
  infrastructure_sensors: {
    structural_health: "continuous";
    environmental_conditions: "continuous";
    performance_metrics: "continuous";
    safety_systems: "continuous";
  };
  smart_city_sensors: {
    traffic_flow: "real_time";
    air_quality: "hourly";
    noise_levels: "continuous";
    pedestrian_count: "real_time";
  };
}
```

#### Citizen-Generated Data
```typescript
interface CitizenData {
  service_reports: {
    types: ["potholes", "streetlight_failures", "traffic_issues", "environmental_concerns"];
    frequency: "daily";
    channels: ["mobile_app", "web_portal", "phone", "email"];
  };
  community_feedback: {
    types: ["service_quality", "infrastructure_condition", "safety_concerns"];
    frequency: "weekly";
    sentiment: ["positive", "neutral", "negative"];
  };
}
```

## Database Seeding Implementation

### 1. Seed Script Structure

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { generateGreenfieldCouncil } from './seed-data/greenfield-council';
import { generateRenewableEnergyAssets } from './seed-data/renewable-energy';
import { generateSmartInfrastructureAssets } from './seed-data/smart-infrastructure';
import { generateTraditionalAssets } from './seed-data/traditional-infrastructure';
import { generateHistoricalData } from './seed-data/historical-data';
import { generateRealTimeData } from './seed-data/real-time-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Greenfield Shire Council data seeding...');
  
  // 1. Create Organisation
  const organisation = await generateGreenfieldCouncil(prisma);
  
  // 2. Create Users
  const users = await generateUsers(prisma, organisation.id);
  
  // 3. Create Assets
  const renewableAssets = await generateRenewableEnergyAssets(prisma, organisation.id);
  const smartAssets = await generateSmartInfrastructureAssets(prisma, organisation.id);
  const traditionalAssets = await generateTraditionalAssets(prisma, organisation.id);
  
  // 4. Create Vendors & Contracts
  const vendors = await generateVendors(prisma, organisation.id);
  const contracts = await generateContracts(prisma, organisation.id, vendors);
  
  // 5. Create Critical Controls
  const criticalControls = await generateCriticalControls(prisma, organisation.id);
  
  // 6. Create Historical Data
  await generateHistoricalData(prisma, organisation.id, {
    assets: [...renewableAssets, ...smartAssets, ...traditionalAssets],
    users,
    vendors,
    contracts,
    criticalControls
  });
  
  // 7. Create Real-Time Data Streams
  await generateRealTimeData(prisma, organisation.id);
  
  console.log('✅ Greenfield Shire Council data seeding completed!');
}

main()
  .catch((e) => {
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
      name: "Greenfield Shire Council",
      resilience_config: {
        margin_settings: {
          time_margin_percentage: 15,
          capacity_margin_percentage: 20,
          material_margin_percentage: 10,
          financial_margin_percentage: 12
        },
        signal_thresholds: {
          critical: 90,
          high: 75,
          medium: 50,
          low: 25
        },
        emergency_protocols: {
          weather_events: "immediate_response",
          equipment_failure: "24_hour_response",
          service_disruption: "4_hour_response"
        }
      },
      margin_settings: {
        time_margin: {
          buffer_hours: 2,
          emergency_buffer_hours: 8
        },
        capacity_margin: {
          surge_capacity_percentage: 25,
          emergency_capacity_percentage: 50
        },
        material_margin: {
          critical_spares_percentage: 15,
          emergency_spares_percentage: 30
        },
        financial_margin: {
          contingency_percentage: 10,
          emergency_fund_percentage: 5
        }
      }
    }
  });
}
```

#### Renewable Energy Assets Generation
```typescript
// seed-data/renewable-energy.ts
export async function generateRenewableEnergyAssets(prisma: PrismaClient, organisationId: string) {
  const assets = [];
  
  // Wind Turbines
  for (let i = 1; i <= 12; i++) {
    const asset = await prisma.asset.create({
      data: {
        organisation_id: organisationId,
        name: `Wind Turbine ${i}`,
        type: "WIND_TURBINE",
        location_geom: generateWindTurbineLocation(i),
        condition: Math.floor(Math.random() * 20) + 80, // 80-100
        risk_score: Math.floor(Math.random() * 30) + 20, // 20-50
        service_purpose: "RENEWABLE_ENERGY_GENERATION",
        critical_control_mapped: true,
        function_based_category: "ENERGY_INFRASTRUCTURE"
      }
    });
    assets.push(asset);
  }
  
  // Solar Arrays
  for (let i = 1; i <= 8; i++) {
    const asset = await prisma.asset.create({
      data: {
        organisation_id: organisationId,
        name: `Solar Array ${i}`,
        type: "SOLAR_ARRAY",
        location_geom: generateSolarArrayLocation(i),
        condition: Math.floor(Math.random() * 15) + 85, // 85-100
        risk_score: Math.floor(Math.random() * 25) + 15, // 15-40
        service_purpose: "RENEWABLE_ENERGY_GENERATION",
        critical_control_mapped: true,
        function_based_category: "ENERGY_INFRASTRUCTURE"
      }
    });
    assets.push(asset);
  }
  
  // Battery Storage Systems
  for (let i = 1; i <= 4; i++) {
    const asset = await prisma.asset.create({
      data: {
        organisation_id: organisationId,
        name: `Grid-Scale Battery ${i}`,
        type: "BATTERY_STORAGE",
        location_geom: generateBatteryLocation(i),
        condition: Math.floor(Math.random() * 10) + 90, // 90-100
        risk_score: Math.floor(Math.random() * 20) + 10, // 10-30
        service_purpose: "ENERGY_STORAGE_AND_GRID_STABILITY",
        critical_control_mapped: true,
        function_based_category: "ENERGY_INFRASTRUCTURE"
      }
    });
    assets.push(asset);
  }
  
  return assets;
}
```

#### Historical Data Generation
```typescript
// seed-data/historical-data.ts
export async function generateHistoricalData(prisma: PrismaClient, organisationId: string, context: any) {
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2);
  
  // Generate Work Orders
  for (let i = 0; i < 15000; i++) {
    const asset = context.assets[Math.floor(Math.random() * context.assets.length)];
    const user = context.users[Math.floor(Math.random() * context.users.length)];
    const contract = context.contracts[Math.floor(Math.random() * context.contracts.length)];
    
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
        margin_deployed: Math.random() > 0.8
      }
    });
  }
  
  // Generate Inspections
  for (let i = 0; i < 8000; i++) {
    const asset = context.assets[Math.floor(Math.random() * context.assets.length)];
    const user = context.users[Math.floor(Math.random() * context.users.length)];
    
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
        purpose_alignment: Math.random() > 0.9
      }
    });
  }
  
  // Generate Signal Detection Events
  for (let i = 0; i < 50000; i++) {
    const asset = context.assets[Math.floor(Math.random() * context.assets.length)];
    
    await prisma.signalDetection.create({
      data: {
        organisation_id: organisationId,
        asset_id: asset.id,
        signal_type: generateSignalType(),
        severity: generateSignalSeverity(),
        detected_at: generatePastDate(1, 730),
        response_time_hours: Math.floor(Math.random() * 48) + 1,
        resolution_status: generateResolutionStatus(),
        lessons_learned: generateLessonsLearned()
      }
    });
  }
}
```

### 3. Real-Time Data Streams

#### Signal Generation
```typescript
// seed-data/real-time-data.ts
export async function generateRealTimeData(prisma: PrismaClient, organisationId: string) {
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
        cost_benefit_ratio: Math.random() * 2 + 1 // 1-3
      }
    });
  }
  
  // Generate resilience metrics
  const metricTypes = ['RESPONSE_TIME', 'RECOVERY_TIME', 'ADAPTABILITY', 'ANTIFRAGILITY'];
  
  for (const metricType of metricTypes) {
    await prisma.resilienceMetrics.create({
      data: {
        organisation_id: organisationId,
        metric_type: metricType,
        value: Math.random() * 100,
        measurement_date: new Date(),
        trend_direction: generateTrendDirection(),
        target_value: 85,
        performance_rating: generatePerformanceRating()
      }
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
    validateResilienceMetricsRanges
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
    testResilienceMetricsPerformance
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
