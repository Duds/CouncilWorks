#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/run-postgres-mcp.sh
# Requires: POSTGRES_MCP_CONNECTION_STRING in environment or .env.local

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.local"

if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

if [ -z "${POSTGRES_MCP_CONNECTION_STRING:-}" ]; then
  echo "Error: POSTGRES_MCP_CONNECTION_STRING is not set."
  echo "Set it in .env.local or export it in your shell."
  exit 1
fi

# Prefer npx to avoid global PATH issues; lock non-interactive
exec npx -y @henkey/postgres-mcp-server \
  --connection-string "$POSTGRES_MCP_CONNECTION_STRING"