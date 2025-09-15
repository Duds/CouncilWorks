-- Creates a least-privilege dev user for Aegrid local development
-- Adjust password and database name as needed

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles WHERE rolname = 'cw_dev_mcp'
  ) THEN
    CREATE ROLE cw_dev_mcp LOGIN PASSWORD 'changeme';
  END IF;
END
$$;

-- Ensure database exists (run separately if needed)
-- CREATE DATABASE aegrid_dev;

-- Grant minimal privileges on target database
GRANT CONNECT ON DATABASE aegrid_dev TO cw_dev_mcp;

-- Connect to the database and set schema privileges
-- \c aegrid_dev

-- For public schema: usage only by default; grant needed tables explicitly later
GRANT USAGE ON SCHEMA public TO cw_dev_mcp;

-- Grant read on existing tables; future tables can be handled via default privs
GRANT SELECT ON ALL TABLES IN SCHEMA public TO cw_dev_mcp;

-- Default privileges for new tables created by current owner
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO cw_dev_mcp;
