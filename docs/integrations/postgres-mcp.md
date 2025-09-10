### PostgreSQL MCP Server Integration (Claude/Model Context Protocol)

This guide documents how to run the PostgreSQL MCP server locally for CouncilWorks to allow AI assistants to safely query and manage PostgreSQL.

- **Upstream**: `https://github.com/HenkDz/postgresql-mcp-server`
- **Requirements**: Node.js ≥ 18, access to a PostgreSQL instance

#### Installation

You can run the server via `npx` (recommended to avoid global PATH issues):

```bash
npx -y @henkey/postgres-mcp-server --help
```

Or install globally:

```bash
npm install -g @henkey/postgres-mcp-server
```

#### Running via helper script

We provide a helper script that reads your connection string from `.env.local`:

- Script: `scripts/run-postgres-mcp.sh`
- Env var: `POSTGRES_MCP_CONNECTION_STRING`

Copy `.env.local.example` to `.env.local` and update values:

```bash
cp .env.local.example .env.local
```

Example `.env.local` entry:

```bash
POSTGRES_MCP_CONNECTION_STRING="postgresql://cw_dev_mcp:changeme@localhost:5432/councilworks_dev"
```

Run the server:

```bash
./scripts/run-postgres-mcp.sh
```

#### MCP client configuration (example)

If your MCP client supports JSON configuration (example below), add:

```json
{
  "mcpServers": {
    "postgresql-mcp": {
      "command": "npx",
      "args": [
        "@henkey/postgres-mcp-server",
        "--connection-string", "${POSTGRES_MCP_CONNECTION_STRING}"
      ]
    }
  }
}
```

#### Security and project standards

- Use least-privilege DB users; avoid superuser for day-to-day operations.
- Validate inputs and prefer parameterised operations (the server enforces this by design).
- Store secrets locally in `.env.local` (do not commit) and use separate dev/test DBs.
- Follow `docs/security/rbac-implementation.md` for role mapping in CouncilWorks.
- Australian conventions: dates DD/MM/YYYY, 24-hour time, Australian English.

#### Provision a dev-only database user (least privilege)

Use the provided SQL to create a minimal-privilege user for local development:

- File: `scripts/db/create-dev-user.sql`
- Defaults: user `cw_dev_mcp`, password `changeme`, database `councilworks_dev`

Run with psql (adjust connection as needed):

```bash
psql -U postgres -h localhost -p 5432 -f scripts/db/create-dev-user.sql
```

Optional: create the database if it does not exist:

```sql
CREATE DATABASE councilworks_dev;
```

#### Seed template for development

- File: `scripts/db/seed-template.sql`
- Replace placeholders with CouncilWorks domain seed data per `docs/database/seed-implementation.md`

Run:

```bash
psql "${POSTGRES_MCP_CONNECTION_STRING}" -f scripts/db/seed-template.sql
```

#### Troubleshooting

- Ensure Node.js ≥ 18 (`node -v`)
- Verify connectivity to PostgreSQL (host, port, credentials)
- If global binary not found, prefer `npx` or ensure your global npm bin is on PATH
- Connection refused: PostgreSQL not running or wrong port; start service and check firewall
- Auth failed: verify user/password and privileges; try connecting with `psql` using the same string
- SSL errors: append `?sslmode=disable` for local-only if appropriate, or configure certificates
- PATH issues for global install: output npm bin path `npm bin -g` and add to your shell's PATH
- Multiple projects: ensure distinct DB names/ports (e.g., CapOpt vs CouncilWorks) to avoid conflicts

#### Cursor setup (MCP & Integrations)

If it does not appear automatically in Cursor > Settings > MCP & Integrations:

1) Ensure the helper works from your shell:
   ```bash
   which npx; which node
   npx -y @henkey/postgres-mcp-server --help
   ```
   Example paths on this machine:
   - `/usr/bin/npx`
   - `/usr/bin/node`

2) Add an MCP server entry in the Cursor settings (use absolute paths):
   ```json
   {
     "mcpServers": {
       "postgresql-mcp": {
         "command": "/usr/bin/npx",
         "args": [
           "@henkey/postgres-mcp-server",
           "--connection-string", "${POSTGRES_MCP_CONNECTION_STRING}"
         ]
       }
     }
   }
   ```

3) Ensure your environment variable is visible to Cursor.
   - Start Cursor from a shell where `.env.local` is sourced or export the var globally
   - Alternatively, replace the `"${POSTGRES_MCP_CONNECTION_STRING}"` with the literal connection string.

4) Reload Cursor’s MCP registry:
   - Close and reopen Cursor, or
   - Use “Reload Window” (Command Palette), then check Settings > MCP & Integrations

If it still doesn’t appear, try running the server once manually to surface errors:
```bash
./scripts/run-postgres-mcp.sh
```
Then reopen Cursor.

#### References

- Upstream repository: `https://github.com/HenkDz/postgresql-mcp-server`
- Tooling overview and usage examples in upstream README
