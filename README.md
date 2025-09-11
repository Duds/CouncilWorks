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
