# CouncilWorks

Council Asset Lifecycle Intelligence Platform

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
