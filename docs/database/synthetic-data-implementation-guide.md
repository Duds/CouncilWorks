# Synthetic Data Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the synthetic data seeding system for Greenfield Shire Council, a fictional early adopter council investing in future technologies.

## Prerequisites

### Database Setup
- PostgreSQL database running
- Prisma schema migrated
- Database connection configured

### Dependencies
- Node.js 18+
- TypeScript
- Prisma CLI
- Required packages installed

## Implementation Steps

### 1. Database Schema Validation

Ensure the database schema supports all required entities:

```bash
# Check Prisma schema
npx prisma validate

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 2. Seed Script Setup

The seed script is located at `prisma/seed.ts` and includes:

- **Organisation**: Greenfield Shire Council with resilience configuration
- **Users**: All role types (EXEC, MANAGER, SUPERVISOR, CREW, ADMIN)
- **Assets**: Renewable energy, smart infrastructure, traditional infrastructure
- **Vendors**: Service providers with resilience capabilities
- **Contracts**: Service agreements with resilience terms
- **Critical Controls**: Safety, environmental, performance, emergency controls
- **Historical Data**: 2+ years of operational data
- **Real-Time Data**: Current signals and metrics

### 3. Data Generation Modules

#### Core Modules
- `greenfield-council.ts`: Organisation and user data
- `renewable-energy.ts`: Wind, solar, battery assets
- `smart-infrastructure.ts`: IoT, traffic, EV charging
- `traditional-infrastructure.ts`: Water, roads, bridges
- `historical-data.ts`: Vendors, contracts, critical controls
- `real-time-data.ts`: Current signals and metrics

#### Asset Categories

**Renewable Energy Assets (42 total)**
- Wind Turbines: 12 × 3.6MW
- Solar Arrays: 8 × 5MW
- Grid-Scale Batteries: 4 × 10MW/20MWh
- Community Batteries: 12 × 500kW/1MWh
- Mobile Batteries: 6 × 1MW/2MWh

**Smart Infrastructure Assets (2,988 total)**
- Smart Streetlights: 2,500 units
- Smart Poles: 150 units
- Smart Traffic Lights: 85 units
- Traffic Sensors: 200 units
- EV Charging Stations: 45 units
- EV Charging Hubs: 8 units

**Traditional Infrastructure Assets (47 total)**
- Water Treatment Plants: 2 units
- Wastewater Treatment Plants: 3 units
- Water Storage Tanks: 12 units
- Major Road Segments: 36 × 5km
- Bridges: 25 units
- Tunnels: 3 units
- Waste Management Facilities: 5 units

### 4. Running the Seed Script

```bash
# Run the seed script
npx prisma db seed

# Or run directly with Node
npx tsx prisma/seed.ts
```

### 5. Data Validation

#### Consistency Checks
```typescript
// Validate referential integrity
const assetCount = await prisma.asset.count();
const workOrderCount = await prisma.workOrder.count();
const inspectionCount = await prisma.inspection.count();

console.log(`Assets: ${assetCount}`);
console.log(`Work Orders: ${workOrderCount}`);
console.log(`Inspections: ${inspectionCount}`);
```

#### Performance Testing
```typescript
// Test query performance
const startTime = Date.now();
const assets = await prisma.asset.findMany({
  where: { organisation_id: organisationId },
  include: { workOrders: true, inspections: true }
});
const endTime = Date.now();
console.log(`Query time: ${endTime - startTime}ms`);
```

### 6. Data Characteristics

#### Realistic Patterns
- **Seasonal Variations**: Summer peak, winter maintenance, storm season
- **Weather Patterns**: Temperature, rainfall, wind, solar irradiance
- **Equipment Lifecycles**: Installation dates, condition degradation
- **Emergency Scenarios**: Various emergency types and response patterns

#### Signal Diversity
- **IoT Sensors**: Equipment monitoring, environmental conditions
- **Weather Data**: Temperature, rainfall, wind, solar irradiance
- **Citizen Reports**: Service issues, safety concerns, feedback
- **System Metrics**: Performance, efficiency, utilization rates

#### Margin Scenarios
- **Time Margin**: Buffer hours, emergency response times
- **Capacity Margin**: Surge capacity, emergency capacity
- **Material Margin**: Critical spares, emergency spares
- **Financial Margin**: Contingency funds, emergency funds

### 7. Testing Scenarios

#### Aegrid Rules Validation
- **Rule 1 (Purpose)**: All assets have clear service purposes
- **Rule 2 (Risk)**: Dynamic risk patterns and seasonal variations
- **Rule 3 (Response)**: Emergency scenarios and adaptive responses
- **Rule 4 (Margin)**: Margin utilization and deployment scenarios

#### User Journey Testing
- **Executive**: Strategic oversight and margin monitoring
- **Manager**: Risk management and resource allocation
- **Supervisor**: Work coordination and emergency response
- **Crew**: Field work and data collection
- **Admin**: System administration and configuration

#### Resilience Testing
- **Signal Detection**: Multi-source signal processing
- **Emergency Response**: Rapid resource reallocation
- **Margin Deployment**: Automated margin utilization
- **Antifragile Learning**: System improvement from stress

### 8. Performance Considerations

#### Database Optimization
- **Indexes**: Ensure proper indexing on foreign keys
- **Query Optimization**: Use efficient queries for large datasets
- **Connection Pooling**: Configure appropriate connection limits
- **Memory Management**: Monitor memory usage during seeding

#### Scalability
- **Batch Processing**: Process data in batches to avoid memory issues
- **Progress Tracking**: Log progress for large data generation
- **Error Handling**: Robust error handling and recovery
- **Rollback Capability**: Ability to rollback failed seeding

### 9. Monitoring and Validation

#### Data Quality Metrics
- **Completeness**: 95%+ field population
- **Consistency**: 100% referential integrity
- **Accuracy**: Realistic patterns and relationships
- **Performance**: Sub-second query response times

#### Business Value Metrics
- **Realistic Scenarios**: All user journeys supported
- **Aegrid Rules**: All four rules demonstrated
- **Resilience Testing**: Comprehensive resilience scenarios
- **Stakeholder Confidence**: Realistic demos and validation

### 10. Troubleshooting

#### Common Issues
- **Memory Issues**: Reduce batch sizes or increase memory limits
- **Timeout Issues**: Increase database timeout settings
- **Connection Issues**: Check database connection configuration
- **Schema Issues**: Validate Prisma schema and migrations

#### Debugging
```typescript
// Enable Prisma logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Add progress logging
console.log(`Processing ${i} of ${total} items...`);
```

### 11. Maintenance

#### Regular Updates
- **Data Refresh**: Update historical data periodically
- **Schema Updates**: Maintain schema compatibility
- **Performance Monitoring**: Monitor query performance
- **Data Validation**: Regular consistency checks

#### Version Control
- **Seed Script Versioning**: Track changes to seed scripts
- **Data Versioning**: Version control for generated data
- **Schema Versioning**: Maintain schema version compatibility
- **Documentation Updates**: Keep documentation current

## Success Criteria

### Technical Success
- [ ] All entities created successfully
- [ ] Referential integrity maintained
- [ ] Query performance acceptable
- [ ] Memory usage within limits

### Business Success
- [ ] All user journeys supported
- [ ] Aegrid Rules demonstrated
- [ ] Resilience scenarios covered
- [ ] Stakeholder validation passed

### Quality Success
- [ ] Data consistency validated
- [ ] Performance benchmarks met
- [ ] Error handling robust
- [ ] Documentation complete

## Conclusion

This synthetic data implementation provides a comprehensive foundation for testing and validating the Aegrid platform's resilience capabilities. Greenfield Shire Council serves as an ideal test case, combining traditional infrastructure with cutting-edge renewable energy and smart city technologies.

The generated dataset supports:
- **Comprehensive Testing**: All PI3 features tested against realistic data
- **User Journey Validation**: All personas and workflows supported
- **Resilience Scenarios**: Emergency response and margin management testing
- **Performance Validation**: System performance under realistic loads
- **Stakeholder Confidence**: Realistic demos and user acceptance testing

This foundation enables accelerated PI3 development with immediate testing and validation capabilities against realistic, comprehensive data.
