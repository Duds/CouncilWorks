# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Initial documentation set and rules configured for CouncilWorks
- Wired functional tokens into Tailwind + shadcn/ui theme mapping
- Added shadcn/ui base components, theme provider and branding integration
- Added Epic 1 phased delivery plan (phases 0–3, deliverables, acceptance) in `docs/TODO.md` on 11/09/2025
- **12/09/2025**: Moved administrative functions to dedicated settings page
- **12/09/2025**: Enhanced profile management with tabbed interface
- **12/09/2025**: Fixed NextAuth.js configuration issues
- **12/09/2025**: ✅ Epic 1 (Foundation & Authentication) FULLY COMPLETED
- **12/09/2025**: ✅ Epic 2 Phase 1 (Database Schema & Core Infrastructure) COMPLETED

### Added
- Settings: Comprehensive settings page (`/settings`) with Personal, Security, Notification, and Administrative sections
- Settings: Tabbed profile management interface with Profile, Notifications, Security (MFA), and Password tabs
- Settings: Role-based access control for administrative functions
- Assets: Comprehensive asset management database schema with PostGIS spatial support
- Assets: Asset CRUD API endpoints with role-based access control
- Assets: Asset list UI component with search, filtering, and pagination
- Assets: PostGIS spatial functionality for asset location management
- Assets: Asset types, statuses, conditions, and priority enums
- Assets: Asset document, inspection, maintenance, and work order relationships
- Assets: Spatial database schema with Point geometry support
- Assets: Asset management UI with responsive card-based layout
- Assets: Advanced search and filtering capabilities (type, status, condition, priority)
- Assets: Financial tracking (purchase price, current value, replacement cost, depreciation)
- Assets: Location management with Australian address format support
- Assets: Asset status badges and priority indicators
- Assets: Pagination support for large asset datasets
- Assets: Accessibility improvements (title attributes for form controls)
- Assets: Navigation integration with sidebar Assets link
- UI: Tabs component (`components/ui/tabs.tsx`) for consistent tabbed interfaces
- Navigation: Updated sidebar to link to dedicated settings page

### Changed
- Dashboard: Removed administrative functions card from main dashboard
- Profile: Enhanced profile management component with tabbed interface
- Auth: Improved NextAuth.js configuration with conditional OAuth providers
- Navigation: Settings link now points to dedicated settings page instead of placeholder

### Fixed
- Auth: Resolved NextAuth.js CLIENT_FETCH_ERROR by making OAuth provider configuration conditional
- Accessibility: Added proper ARIA attributes to select elements in profile management

### Technical Implementation (Epic 2 Phase 1)
- Database: Created comprehensive asset management schema with 5 main models and relationships
- Database: Implemented PostGIS spatial extension with Point geometry support for asset locations
- Database: Added spatial indexing for performance optimization
- API: Implemented role-based access control for all asset operations (MANAGER+ for CRUD, ADMIN for delete)
- API: Added comprehensive input validation using Zod schemas
- API: Implemented audit logging for all asset operations
- API: Added spatial data handling for latitude/longitude coordinates
- UI: Created responsive asset list component with advanced filtering capabilities
- UI: Implemented pagination for large asset datasets
- UI: Added status, condition, and priority badge system
- Testing: Verified PostGIS functionality with spatial queries and distance calculations
- Testing: Confirmed database integrity with foreign key constraints and multi-tenant isolation

- Dashboard: Inserted Maintenance Schedule section below Quick Actions in `app/dashboard/page.tsx`
- Dashboard: Added Risk Assessment overview card with circular progress ring (0–100% mapped to 0–360°)
- Dashboard: Replaced Maintenance Schedule with Maintenance Backlog; removed Reminders and Upcoming Tasks
- Dashboard: Added Crew Utilisation, Spare Parts Risk, Failure Modes Watchlist, GIS HotSpots
- Dashboard: Moved Team Status beside Recent Activity (right column)
- Docs: Added `docs/dashboard-ideas.md` to capture further RCM/CCT dashboard ideas
 - Sidebar: Added Help link under General group
- Dashboard: Implemented device detection for search shortcut display (⌘F on Apple devices, ^F on others) in `components/dashboard/Header.tsx`
- Utils: Added `lib/device-detection.ts` with platform detection utilities for UI consistency
- Testing: Added comprehensive tests for device detection functionality
- Theming: Added optional light grey muted variants (`.muted-grey-1/2/3`) and cards sandbox at `/sandbox/cards`
- Theming: Updated global `--muted` token to Grey Option C (--grey-3) for cleaner card backgrounds
- Documentation: Added comprehensive theming framework at `docs/design/theming-framework.md`

### Added
- Outcome‑led landing page with revised hero, single primary CTA, and credibility strip
- "How it works" section, condensed persona value, FAQs
- Auto‑rotating demo carousel with placeholder product UI assets
- Analytics events for CTA clicks and section views; A/B hero variants
- SEO metadata, Open Graph/Twitter cards, and JSON‑LD (`SoftwareApplication`)
- Complete Phase 2 RBAC, RLS and admin controls implementation
- CONTRACTOR and PARTNER roles added to system
- Comprehensive RBAC with role hierarchy and permissions
- Row-Level Security (RLS) policies for multi-tenancy
- Admin UI for user management and role assignment
- Audit logging for sensitive operations
- Comprehensive test coverage for RBAC and RLS
- Authentication flow with proper redirect handling

## [0.2.0] - 10/09/2025
- Added PostgreSQL MCP server integration guide `docs/integrations/postgres-mcp.md`
- Added helper script `scripts/run-postgres-mcp.sh` to run the server with env connection string

## [0.1.1] - 10/09/2025
- Design: Added shadcn/ui usage examples and semantic token mapping guidance in `docs/design/brand-guidelines.md`
- Theming: Confirmed `styles/brand-tokens.css` functional tokens for light/dark and Tailwind `colors` mapping

## [0.1.0] - 10/09/2025
- Scaffolded and populated architecture, development, security, database docs
- Added backlog in `docs/TODO.md`
- Added Cursor rules aligned to CouncilWorks
