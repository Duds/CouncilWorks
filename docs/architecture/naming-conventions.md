# Resource Naming Convention

## API
- Versioning: `/api/v1/` prefix; bump major for breaking changes.
- Resources (plural, kebab-case paths): `/assets/{assetId}`, `/work-orders/{workOrderId}`, `/inspections/{inspectionId}`, `/users/{userId}`.
- Query: Use standard filters `?status=`, `?type=`, `?from=`/`to=` with DD/MM/YYYY display and ISO dates in API.
- Errors: Problem+JSON with trace ID; consistent codes and messages.

## Database
- Tables: snake_case, plural (e.g. `assets`, `work_orders`, `inspections`).
- Columns: snake_case; foreign keys as `{referenced_table_singular}_id`.
- Identifiers: UUID primary keys; `organisation_id` for tenancy; created/updated timestamps.
- Spatial: geometry/geography columns suffixed `_geom` or `_geog`.

## Code & Files
- Folders: kebab-case; files kebab-case; TypeScript identifiers camelCase.
- Docker images: `aegrid-{service}`; tags as semver or git SHA.
- Branches: `feature/{name}`, `fix/{name}`, `docs/{name}`; semantic commits.
- Infrastructure: consistent labels/annotations; K8s names kebab-case.
