# Aegrid

Asset Lifecycle Intelligence Platform

## Phase 0 - Local Setup

- Requirements: Node 20, Docker
- Copy `.env.example` to `.env` and adjust as needed

### Run locally (Docker)

```bash
docker compose up -d db
npm ci
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

### Health check

- GET http://localhost:3000/api/health

### Tests

```bash
npm test
```

All docs use Australian English, DD/MM/YYYY dates, 24-hour time, metric units, and $AUD.

## Automated Monitoring & Fixing

The project includes comprehensive automated monitoring and fixing systems:

### Dependabot
- **Weekly dependency updates** every Monday at 9:00 AM AEST
- **Security vulnerability monitoring** with automatic PRs
- **GitHub Actions updates** for CI/CD workflows
- **Docker image updates** for container dependencies

### Workflow Failure Monitor
- **Proactive monitoring** of failed CI/CD workflows
- **Auto-fix capabilities** for common issues (dependencies, linting, TypeScript, tests)
- **Pattern recognition** to identify recurring problems
- **Slack notifications** for critical failures
- **Persistent failure detection** with automatic issue creation

### Cursor Background Agent
- **Real-time code fixes** as you develop
- **Scheduled maintenance** tasks (daily/weekly)
- **Workflow integration** to respond to failures
- **Multi-task support** for linting, TypeScript, imports, security

See [Automated Monitoring Setup](../../docs/development/automated-monitoring-setup.md) for detailed configuration and usage.

## Marketing site (landing page)

- Hero uses outcome‑led copy with a single primary CTA (Book a demo) and secondary CTA (Get a sandbox)
- Credibility strip with council logos and proof points
- "How it works" (3 steps), condensed persona value, FAQs
- Demo carousel with placeholder product UI assets under `public/images/`
- Analytics events for CTAs and section views in `lib/analytics.ts`
- Simple A/B testing hook in `hooks/useAbVariant.ts` (hero variants A/B)
- SEO: Open Graph/Twitter metadata in `app/layout.tsx` and JSON‑LD structured data

### Path Aliases

- `@/components/*` → `components/*`
- `@/lib/*` → `lib/*`
- `@/hooks/*` → `hooks/*`
- `@/utils/*` → `utils/*`
- `@/styles/*` → `styles/*`

## Settings & Administration

The application includes a comprehensive settings page (`/settings`) that provides:

### Personal Settings
- Profile management with tabbed interface
- Activity log viewing
- Session management

### Security Settings
- Multi-factor authentication (MFA) setup
- Password change functionality
- Security session review

### Notification Settings
- Email/SMS notification preferences
- Language and timezone configuration
- Push notification settings

### Administrative Functions (Admin Users Only)
- Admin dashboard access
- User management
- Audit logs
- Security settings

All settings are role-based and respect the RBAC (Role-Based Access Control) system.

## Asset Management System

### Core Features
- **Asset Register**: Comprehensive asset database with spatial capabilities
- **PostGIS Integration**: Full spatial database support for asset locations
- **Asset CRUD Operations**: Create, read, update, and delete assets with role-based access control
- **Search & Filtering**: Advanced search and filtering capabilities for asset discovery
- **Asset Types**: Support for buildings, roads, bridges, parks, infrastructure, and more
- **Status Tracking**: Asset status, condition, and priority management
- **Financial Tracking**: Purchase price, current value, replacement cost, and depreciation
- **Maintenance Integration**: Links to inspections, maintenance records, and work orders

### Asset Types Supported
- Buildings (libraries, community centres, offices)
- Infrastructure (roads, bridges, footpaths)
- Recreational (parks, playgrounds, sports facilities)
- Utilities (street lights, traffic lights, drainage)
- Services (water supply, sewer, electrical, telecommunications)

### Role-Based Access
- **MANAGER+**: Create, update, and manage assets
- **ADMIN**: Delete assets and full administrative control
- **SUPERVISOR**: View and manage assigned assets
- **CREW**: View asset details for work execution
- **EXEC**: View asset summaries and reports
- **CITIZEN**: Read-only access to public assets

### Spatial Capabilities
- **PostGIS Integration**: Full spatial database support
- **Point Geometry**: Asset location coordinates (latitude/longitude)
- **Spatial Queries**: Find assets within bounding boxes, calculate distances
- **Address Management**: Full Australian address format support
- **Suburb/Postcode Filtering**: Location-based asset filtering

### API Endpoints
- `GET /api/assets` - List assets with filtering and pagination
- `GET /api/assets/[id]` - Get individual asset details
- `POST /api/assets` - Create new assets
- `PUT /api/assets/[id]` - Update existing assets
- `DELETE /api/assets/[id]` - Delete assets (admin only)

### Database Schema
- **Asset Model**: Core asset information with spatial data
- **AssetDocument**: Document attachments and file management
- **AssetInspection**: Inspection records and condition tracking
- **AssetMaintenance**: Maintenance history and cost tracking
- **WorkOrder**: Work order management and assignment
- **Audit Logging**: Complete audit trail for all asset operations
