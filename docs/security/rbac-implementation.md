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
- Vendor: Restricted portal access to accept/complete assigned work orders, upload evidence (photos, notes, invoices), and view own compliance history.
  - Note: Vendors can see/control only tasks and controls linked to active contracts where they are party.

## Permissions (Indicative)
- Assets: CRUD (Manager/Admin), read (Supervisor/Crew/Exec).
- Work Orders: create/assign (Supervisor/Admin), update status (Crew/Supervisor), read (all staff).
- Inspections: create/update (Crew/Supervisor), read (Manager/Exec/Admin).
- Reports/Exports: Manager/Exec/Admin.
- Config/Templates: Manager/Admin.
- Contracts & SLAs: create/update (Manager/Admin), read (Supervisor); Vendor can read linked work orders and SLA status for their assignments only.
 - Critical Controls:
   - Configure controls, escalation paths, and overrides: Manager/Admin only.
   - View control status/compliance: Manager/Supervisor/Admin; Vendor only for controls linked to their contracted tasks.
   - Override control (with justification and multi-party ack): Manager/Admin with audit trail; never Vendor.

## Enforcement Model
- Authentication: NextAuth.js with JWT sessions; providers as configured (OIDC/email/passwordless). Passwords hashed with bcrypt (12 rounds) when applicable.
- Authorisation: Claims include `organisationId`, `role`, and optional `scopes`. Vendor users are scoped to their `vendorId` and can only access work orders and evidence belonging to active contracts where they are party to. UI guards + API middleware validate role, scope, and vendor constraints.
- Database RLS: Policies ensure `organisation_id = current_setting('app.organisation_id')::uuid` and role constraints.
  - Additional vendor scoping: `vendor_id` on work orders/controls and evidence used to scope vendor access.
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
select set_config('app.vendor_id', coalesce(:vendorId, ''), true); -- empty for non‑vendor users

-- Example policy
create policy org_isolation on assets
  for all using (organisation_id = current_setting('app.organisation_id')::uuid);

-- Vendor isolation on work orders and evidence
create policy vendor_isolation on work_orders
  for select using (
    organisation_id = current_setting('app.organisation_id')::uuid
    and (
      current_setting('app.vendor_id', true) is null
      or vendor_id = nullif(current_setting('app.vendor_id', true), '')::uuid
    )
  );

-- Critical control visibility
create policy control_visibility on critical_controls
  for select using (
    organisation_id = current_setting('app.organisation_id')::uuid
  );

create policy vendor_control_visibility on asset_critical_controls
  for select using (
    organisation_id = current_setting('app.organisation_id')::uuid
    and (
      current_setting('app.vendor_id', true) is null
      or vendor_id = nullif(current_setting('app.vendor_id', true), '')::uuid
    )
  );
```

## Auditing & Logging
- Store `created_by`, `updated_by`; immutable event log for critical actions.
- Correlate requests with trace IDs; mask PII in logs.
- Capture SLA state transitions (acknowledged, in_progress, paused, completed, breached) with timestamps and user/vendor ids.
 - Record critical control events: created/updated, scheduled, acknowledged, completed, escalated, overridden (with justification), including actors and timestamps.

## Testing
- Unit tests for `hasRole` and permission matrices.
- API tests for authN/authZ: Unauthorized/Forbidden/Success.
- RLS tests ensuring cross-tenant access is blocked.
- Vendor access tests validating vendor scoping and evidence upload permissions.

## Threat Considerations
- Multi-tenant isolation; offline tampering; CSRF/XSS; token theft; replay; privilege escalation.

## Operational Practices
- Regular access reviews; least privilege; secrets rotation; dependency updates; security headers; rate limiting.
