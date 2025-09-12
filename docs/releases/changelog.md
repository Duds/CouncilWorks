# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- Design:
  - Replace green-tinted muted surfaces with neutral grey (`#F1F3F5` light, `#1F2937` dark) to reduce visual noise
  - Introduce `NestedCard` with A/B variants: left-border (A) and top-bar (B) accent indicators
  - Update `StatsCard` to neutral surface with slim top accent bar and status badge
- Initial documentation set and rules configured for CouncilWorks
- Wired functional tokens into Tailwind + shadcn/ui theme mapping
- Added shadcn/ui base components, theme provider and branding integration
- Added Epic 1 phased delivery plan (phases 0–3, deliverables, acceptance) in `docs/TODO.md` on 11/09/2025

### Added (Marketing)

- Dashboard: Inserted Maintenance Schedule section below Quick Actions in `app/dashboard/page.tsx`
- Dashboard: Added Risk Assessment overview card with circular progress ring (0–100% mapped to 0–360°)
- Dashboard: Replaced Maintenance Schedule with Maintenance Backlog; removed Reminders and Upcoming Tasks
- Dashboard: Added Crew Utilisation, Spare Parts Risk, Failure Modes Watchlist, GIS HotSpots
- Dashboard: Moved Team Status beside Recent Activity (right column)
- Docs: Added `docs/dashboard-ideas.md` to capture further RCM/CCT dashboard ideas
- Sidebar: Added Help link under General group

### Added (Platform)

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
