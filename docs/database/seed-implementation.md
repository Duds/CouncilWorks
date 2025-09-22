# Database Seed Implementation - Enhanced for Aegrid Rules

Last updated: 22/09/2025
Owner: Data Engineering
Version: 2.0 - Enhanced with ERD entities and Aegrid Rules alignment

## Purpose

Initialise the system with comprehensive reference data, realistic demo data, and RCM-lite templates that demonstrate The Aegrid Rules in action. Enable productive demos, tests, and onboarding with Greenfield Shire Council as the primary test organisation.

## Scope

### Core Data Sets

- **Organisation**: Greenfield Shire Council with resilience configuration
- **Users**: Complete role-based personas (EXEC, MANAGER, SUPERVISOR, CREW, ADMIN, CITIZEN, CONTRACTOR, PARTNER)
- **Assets**: 500+ assets across renewable energy, smart infrastructure, and traditional infrastructure
- **Vendors & Contracts**: 15+ vendor relationships with SLA tracking
- **RCM Templates**: Comprehensive maintenance templates for all asset types
- **Critical Controls**: Asset-specific critical control mappings
- **Historical Data**: 2+ years of operational data (15,000+ work orders, 8,000+ inspections)

### Aegrid Rules Demonstration

- **Rule 1 - Purpose**: Every asset has defined service purpose and critical control mapping
- **Rule 2 - Risk**: Risk-based maintenance schedules and SLA-driven prioritisation
- **Rule 3 - Response**: Signal-driven work orders and real-time evidence capture
- **Rule 4 - Margin**: Capacity margin management and emergency response protocols

## Enhanced Seed Structure

### 1. Organisation & Resilience Configuration

```typescript
// prisma/seed.ts - Enhanced with Aegrid Rules
import { PrismaClient } from '@prisma/client';
import { generateGreenfieldCouncil } from './seed-data/greenfield-council';
import { generateUserPersonas } from './seed-data/user-personas';
import { generateAssetPortfolio } from './seed-data/asset-portfolio';
import { generateVendorEcosystem } from './seed-data/vendor-ecosystem';
import { generateRCMTemplates } from './seed-data/rcm-templates';
import { generateCriticalControls } from './seed-data/critical-controls';
import { generateHistoricalData } from './seed-data/historical-data';
import { generateCitizenEngagement } from './seed-data/citizen-engagement';
import { generateSignalsAndRisk } from './seed-data/signals-risk';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Aegrid Rules demonstration data seeding...');

  // 1. Create Greenfield Shire Council with resilience config
  const organisation = await generateGreenfieldCouncil(prisma);

  // 2. Create complete user personas
  const users = await generateUserPersonas(prisma, organisation.id);

  // 3. Create comprehensive asset portfolio
  const assets = await generateAssetPortfolio(prisma, organisation.id);

  // 4. Create vendor ecosystem with contracts and SLAs
  const { vendors, contracts, slas } = await generateVendorEcosystem(
    prisma,
    organisation.id
  );

  // 5. Create RCM templates for all asset types
  const rcmTemplates = await generateRCMTemplates(prisma, organisation.id);

  // 6. Create critical controls and asset mappings
  const criticalControls = await generateCriticalControls(
    prisma,
    organisation.id,
    assets
  );

  // 7. Create citizen engagement data
  const citizenData = await generateCitizenEngagement(
    prisma,
    organisation.id,
    assets
  );

  // 8. Create signals and risk management data
  const signalsData = await generateSignalsAndRisk(
    prisma,
    organisation.id,
    assets
  );

  // 9. Generate 2+ years of historical operational data
  await generateHistoricalData(prisma, organisation.id, {
    assets,
    users,
    vendors,
    contracts,
    slas,
    criticalControls,
    rcmTemplates,
  });

  console.log('✅ Aegrid Rules demonstration data seeding completed!');
  console.log(
    `📊 Created: ${assets.length} assets, ${users.length} users, ${contracts.length} contracts`
  );
}
```

### 2. Enhanced Asset Types for Renewable Energy

```typescript
// Extend AssetType enum with renewable energy assets
enum EnhancedAssetType {
  // Traditional Infrastructure (existing)
  BUILDING,
  ROAD,
  BRIDGE,
  FOOTPATH,
  PARK,
  PLAYGROUND,
  SPORTS_FACILITY,
  LIBRARY,
  COMMUNITY_CENTRE,
  CAR_PARK,
  STREET_FURNITURE,
  TRAFFIC_LIGHT,
  STREET_LIGHT,
  DRAINAGE,
  WATER_SUPPLY,
  SEWER,
  ELECTRICAL_INFRASTRUCTURE,
  TELECOMMUNICATIONS,

  // Renewable Energy Assets (new)
  WIND_TURBINE,
  SOLAR_ARRAY,
  BATTERY_STORAGE,
  WIND_FARM_SUBSTATION,
  SOLAR_FARM_INVERTER,
  GRID_SCALE_BATTERY,
  COMMUNITY_BATTERY,
  MOBILE_BATTERY,

  // Smart Infrastructure (new)
  SMART_STREETLIGHT,
  SMART_POLE,
  SMART_TRAFFIC_LIGHT,
  TRAFFIC_SENSOR,
  EV_CHARGING_STATION,
  EV_CHARGING_HUB,
  IOT_SENSOR,
  AIR_QUALITY_MONITOR,

  // Water & Wastewater (enhanced)
  WATER_TREATMENT_PLANT,
  WASTEWATER_TREATMENT_PLANT,
  WATER_STORAGE_TANK,
  SMART_WATER_METER,

  OTHER,
}
```

### 3. New Entities for Enhanced ERD

```typescript
// Additional models needed for full ERD implementation
model Vendor {
  id                String   @id @default(cuid())
  organisationId    String
  organisation      Organisation @relation(fields: [organisationId], references: [id])
  name              String
  abn               String?
  contactEmail      String
  contactPhone      String?
  performanceRating Decimal? @db.Decimal(3,2)
  capacityMargin    Int?     @default(20)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  contracts         Contract[]
  workOrders        WorkOrder[]
  users             User[]

  @@index([organisationId])
  @@index([performanceRating])
}

model Contract {
  id              String   @id @default(cuid())
  organisationId  String
  organisation    Organisation @relation(fields: [organisationId], references: [id])
  vendorId        String
  vendor          Vendor   @relation(fields: [vendorId], references: [id])
  name            String
  startDate       DateTime
  endDate         DateTime
  scope           String
  status          String   @default("ACTIVE")
  renewalDueDate  DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  slas            SLA[]
  workOrders      WorkOrder[]

  @@index([organisationId])
  @@index([vendorId])
  @@index([status])
}

model SLA {
  id                  String   @id @default(cuid())
  organisationId      String
  organisation        Organisation @relation(fields: [organisationId], references: [id])
  contractId          String
  contract            Contract @relation(fields: [contractId], references: [id])
  name                String
  responseTimeHours   Int
  resolutionTimeHours Int
  frequencyDays       Int?
  costModel           String
  breachEscalation    String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  workOrders          WorkOrder[]

  @@index([organisationId])
  @@index([contractId])
}

model CriticalControl {
  id                String   @id @default(cuid())
  organisationId    String
  organisation      Organisation @relation(fields: [organisationId], references: [id])
  name              String
  description       String?
  type              String
  windowHours       Int
  frequencyDays     Int
  escalationPolicy  String?
  status            String   @default("ACTIVE")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  assetMappings     AssetCriticalControl[]
  complianceRecords ComplianceRecord[]
  escalationEvents  EscalationEvent[]

  @@index([organisationId])
  @@index([type])
  @@index([status])
}

model AssetCriticalControl {
  id                String   @id @default(cuid())
  organisationId    String
  organisation      Organisation @relation(fields: [organisationId], references: [id])
  assetId           String
  asset             Asset    @relation(fields: [assetId], references: [id])
  criticalControlId String
  criticalControl   CriticalControl @relation(fields: [criticalControlId], references: [id])
  vendorId          String?
  vendor            Vendor?  @relation(fields: [vendorId], references: [id])
  lastExecutedAt    DateTime?
  nextDueAt         DateTime?
  status            String   @default("ACTIVE")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([assetId, criticalControlId])
  @@index([organisationId])
  @@index([assetId])
  @@index([criticalControlId])
}
```

### 4. Enhanced Work Order with SLA Tracking

```typescript
// Enhanced WorkOrder model with SLA compliance
model WorkOrder {
  id                String   @id @default(cuid())
  organisationId    String
  organisation      Organisation @relation(fields: [organisationId], references: [id])
  assetId           String
  asset             Asset    @relation(fields: [assetId], references: [id])
  contractId        String?
  contract          Contract? @relation(fields: [contractId], references: [id])
  slaId             String?
  sla               SLA?     @relation(fields: [slaId], references: [id])
  assignedTo        String?
  assignedToUser    User?    @relation(fields: [assignedTo], references: [id])
  vendorId          String?
  vendor            Vendor?  @relation(fields: [vendorId], references: [id])
  status            String   @default("OPEN")
  priority          String   @default("MEDIUM")
  dueDate           DateTime?
  acceptedAt        DateTime?
  acknowledgedAt    DateTime?
  startedAt         DateTime?
  completedAt       DateTime?
  slaResponseTime   Int?
  slaResolutionTime Int?
  slaStatus         String?
  declineReason     String?
  evidenceCount     Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  evidence          WorkOrderEvidence[]
  inspections       Inspection[]
  citizenReports    CitizenReport[]
  emergencyResponse EmergencyResponse[]
  escalationEvents  EscalationEvent[]

  @@index([organisationId])
  @@index([assetId])
  @@index([status])
  @@index([priority])
  @@index([dueDate])
  @@index([slaStatus])
}
```

### 5. Citizen Engagement Models

```typescript
model CitizenReport {
  id              String   @id @default(cuid())
  organisationId  String
  organisation    Organisation @relation(fields: [organisationId], references: [id])
  assetId         String?
  asset           Asset?   @relation(fields: [assetId], references: [id])
  workOrderId     String?
  workOrder       WorkOrder? @relation(fields: [workOrderId], references: [id])
  reporterName    String
  reporterEmail   String
  reporterPhone   String?
  issueCategory   String
  riskLevel       String
  description     String
  location        Unsupported("geometry(Point,4326)")?
  status          String   @default("OPEN")
  reportedAt      DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  feedback        CitizenFeedback[]

  @@index([organisationId])
  @@index([assetId])
  @@index([issueCategory])
  @@index([riskLevel])
  @@index([status])
}

model CitizenFeedback {
  id                 String   @id @default(cuid())
  organisationId     String
  organisation       Organisation @relation(fields: [organisationId], references: [id])
  citizenReportId    String?
  citizenReport      CitizenReport? @relation(fields: [citizenReportId], references: [id])
  workOrderId        String?
  workOrder          WorkOrder? @relation(fields: [workOrderId], references: [id])
  satisfactionRating Int      // 1-5 scale
  feedbackText       String?
  serviceImprovement String?
  submittedAt        DateTime @default(now())
  createdAt          DateTime @default(now())

  @@index([organisationId])
  @@index([citizenReportId])
  @@index([workOrderId])
  @@index([satisfactionRating])
}
```

## Execution Strategy

### Development Environment

```bash
# Full seed with Aegrid Rules demonstration
pnpm prisma db push
pnpm prisma db seed --preview-feature

# Verify seed data
pnpm prisma studio
```

### CI/CD Integration

```bash
# Lightweight seed for testing
SEED_MODE=minimal pnpm prisma db seed

# Full demonstration seed
SEED_MODE=demonstration pnpm prisma db seed
```

### Data Validation

- **Referential Integrity**: All foreign key relationships validated
- **Aegrid Rules Compliance**: Every asset has purpose, risk mapping, and margin capacity
- **Geographic Distribution**: Realistic spatial distribution across Greenfield Shire
- **Temporal Consistency**: Historical data follows realistic patterns and seasonality

## Success Metrics

### Data Quality

- **100%** referential integrity across all entities
- **95%+** field population for critical fields
- **Realistic** geographic and temporal distributions
- **Sub-second** query performance for common operations

### Aegrid Rules Demonstration

- **Rule 1**: 100% of assets have defined service purpose
- **Rule 2**: Risk-based maintenance schedules implemented
- **Rule 3**: Signal-driven work orders with evidence capture
- **Rule 4**: Margin management and emergency response protocols

### User Journey Support

- **All personas** have realistic data and workflows
- **All asset types** have appropriate maintenance templates
- **All contracts** have SLA tracking and performance metrics
- **All critical controls** have proper asset mappings
