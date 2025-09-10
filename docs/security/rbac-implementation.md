# RBAC Implementation

Last updated: 10/09/2025
Owner: Security Lead
Related: `docs/architecture/SAD.md`

## Roles
- Admin: Configure system, manage users and org settings.
- Manager: Access dashboards, forecasts, and exports; manage assets and templates.
- Supervisor: Create and assign work orders; triage citizen reports.
- Crew: Perform inspections and job updates (mobile-first).
- Exec/Councillor: Read-only executive dashboards and exports.
- Citizen: Report issues only.

## Permissions (Indicative)
- Assets: CRUD (Manager/Admin), read (Supervisor/Crew/Exec).
- Work Orders: create/assign (Supervisor/Admin), update status (Crew/Supervisor), read (all staff).
- Inspections: create/update (Crew/Supervisor), read (Manager/Exec/Admin).
- Reports/Exports: Manager/Exec/Admin.
- Config/Templates: Manager/Admin.

## Enforcement Model
- Authentication: NextAuth.js with JWT sessions; providers as configured (OIDC/email/passwordless). Passwords hashed with bcrypt (12 rounds) when applicable.
- Authorisation: Claims include `organisationId`, `role`, and optional `scopes`. UI guards + API middleware validate role and scope.
- Database RLS: Policies ensure `organisation_id = current_setting('app.organisation_id')::uuid` and role constraints.
- Input Validation: Zod schemas for all API inputs; output sanitisation for HTML.

## Example (API Pseudocode)
```ts
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 401 })
  if (!hasRole(session.user.role, ["ADMIN", "MANAGER"])) return new Response("Forbidden", { status: 403 })
  const input = createAssetSchema.parse(await req.json())
  const asset = await prisma.asset.create({ data: toDb(input, session) })
  return Response.json(asset)
}
```

## RLS Policy Sketch
```sql
-- Set tenant context per request/connection
select set_config('app.organisation_id', :organisationId, true);

-- Example policy
create policy org_isolation on assets
  for all using (organisation_id = current_setting('app.organisation_id')::uuid);
```

## Auditing & Logging
- Store `created_by`, `updated_by`; immutable event log for critical actions.
- Correlate requests with trace IDs; mask PII in logs.

## Testing
- Unit tests for `hasRole` and permission matrices.
- API tests for authN/authZ: Unauthorized/Forbidden/Success.
- RLS tests ensuring cross-tenant access is blocked.

## Threat Considerations
- Multi-tenant isolation; offline tampering; CSRF/XSS; token theft; replay; privilege escalation.

## Operational Practices
- Regular access reviews; least privilege; secrets rotation; dependency updates; security headers; rate limiting.
