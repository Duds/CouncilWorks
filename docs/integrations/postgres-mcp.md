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

Example `.env.local` entry:

```bash
POSTGRES_MCP_CONNECTION_STRING="postgresql://user:password@localhost:5432/councilworks"
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

#### Troubleshooting

- Ensure Node.js ≥ 18 (`node -v`)
- Verify connectivity to PostgreSQL (host, port, credentials)
- If global binary not found, prefer `npx` or ensure your global npm bin is on PATH

#### References

- Upstream repository: `https://github.com/HenkDz/postgresql-mcp-server`
- Tooling overview and usage examples in upstream README
