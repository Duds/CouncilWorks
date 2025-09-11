# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Initial documentation set and rules configured for CouncilWorks
- Wired functional tokens into Tailwind + shadcn/ui theme mapping
- Added shadcn/ui base components, theme provider and branding integration
- Added Epic 1 phased delivery plan (phases 0–3, deliverables, acceptance) in `docs/TODO.md` on 11/09/2025

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

## [0.1.1] - 10/09/2025
- Design: Added shadcn/ui usage examples and semantic token mapping guidance in `docs/design/brand-guidelines.md`
- Theming: Confirmed `styles/brand-tokens.css` functional tokens for light/dark and Tailwind `colors` mapping

## [0.1.0] - 10/09/2025
- Scaffolded and populated architecture, development, security, database docs
- Added backlog in `docs/TODO.md`
- Added Cursor rules aligned to CouncilWorks
