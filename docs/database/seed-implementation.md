# Database Seed Implementation

Last updated: 10/09/2025
Owner: Data Engineering

## Purpose
Initialise the system with reference data, realistic demo data, and RCM‑lite templates to enable productive demos, tests, and onboarding.

## Scope
- Reference: asset types, risk matrices, failure modes, maintenance tasks.
- Sample: ~100 playgrounds, 50 vehicles, 200 road segments with geometries, and linked inspections/work orders.
- Security: Tenanted by `organisation_id` for each dataset.

## Method
- Location: `prisma/seed.ts` or SQL under `db/seeds` executed via Prisma migrations.
- Idempotent seeds: check existence by natural keys; upsert as required.
- Spatial: generate realistic geometries (WKT/GeoJSON) for assets with PostGIS functions.
- Media: sample photos stored in object storage with signed URLs.

## Example (TypeScript with Prisma)
```ts
import { prisma } from '../src/lib/prisma'
import { randomUUID } from 'crypto'

async function main() {
  const orgId = process.env.SEED_ORG_ID ?? randomUUID()
  await prisma.organisation.upsert({
    where: { id: orgId },
    update: {},
    create: { id: orgId, name: 'Demo Council' },
  })
  // Seed asset types
  await prisma.assetType.createMany({ data: [
    { key: 'playground', name: 'Playground' },
    { key: 'vehicle', name: 'Vehicle' },
    { key: 'road_segment', name: 'Road Segment' },
  ], skipDuplicates: true })
  // ...more seeds
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => prisma.$disconnect())
```

## Execution
- Dev: `pnpm prisma db push && pnpm prisma db seed`.
- CI: run seeds for integration tests with ephemeral DB.

## Data Quality
- Validate CSV imports; enforce schema; audit changes.

## Rollback
- Seeds are additive; for destructive changes use migrations with backups.
