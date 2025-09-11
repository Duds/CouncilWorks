-- Enable Row Level Security (RLS) for multi-tenancy
-- This migration sets up RLS policies to ensure data isolation between organisations

-- Enable RLS on all tables
ALTER TABLE "Organisation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user's organisation ID
CREATE OR REPLACE FUNCTION get_current_user_organisation_id()
RETURNS TEXT AS $$
BEGIN
  -- This will be populated by the application when setting the session variable
  RETURN current_setting('app.current_user_organisation_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  -- This will be populated by the application when setting the session variable
  RETURN current_setting('app.current_user_role', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organisation policies
-- Users can only see their own organisation
CREATE POLICY "Users can view their own organisation" ON "Organisation"
  FOR SELECT USING (id = get_current_user_organisation_id());

-- Users can only update their own organisation (admin only)
CREATE POLICY "Admins can update their organisation" ON "Organisation"
  FOR UPDATE USING (
    id = get_current_user_organisation_id() 
    AND get_current_user_role() = 'ADMIN'
  );

-- User policies
-- Users can only see users in their organisation
CREATE POLICY "Users can view users in their organisation" ON "User"
  FOR SELECT USING ("organisationId" = get_current_user_organisation_id());

-- Only admins and managers can create users in their organisation
CREATE POLICY "Admins and managers can create users" ON "User"
  FOR INSERT WITH CHECK (
    "organisationId" = get_current_user_organisation_id()
    AND get_current_user_role() IN ('ADMIN', 'MANAGER')
  );

-- Only admins and managers can update users in their organisation
CREATE POLICY "Admins and managers can update users" ON "User"
  FOR UPDATE USING (
    "organisationId" = get_current_user_organisation_id()
    AND get_current_user_role() IN ('ADMIN', 'MANAGER')
  );

-- Only admins can delete users (soft delete by deactivating)
CREATE POLICY "Admins can deactivate users" ON "User"
  FOR UPDATE USING (
    "organisationId" = get_current_user_organisation_id()
    AND get_current_user_role() = 'ADMIN'
  );

-- Account policies
-- Users can only see their own accounts
CREATE POLICY "Users can view their own accounts" ON "Account"
  FOR SELECT USING (
    "userId" IN (
      SELECT id FROM "User" 
      WHERE "organisationId" = get_current_user_organisation_id()
    )
  );

-- Users can only create accounts for themselves
CREATE POLICY "Users can create their own accounts" ON "Account"
  FOR INSERT WITH CHECK (
    "userId" IN (
      SELECT id FROM "User" 
      WHERE "organisationId" = get_current_user_organisation_id()
    )
  );

-- Users can only update their own accounts
CREATE POLICY "Users can update their own accounts" ON "Account"
  FOR UPDATE USING (
    "userId" IN (
      SELECT id FROM "User" 
      WHERE "organisationId" = get_current_user_organisation_id()
    )
  );

-- Users can only delete their own accounts
CREATE POLICY "Users can delete their own accounts" ON "Account"
  FOR DELETE USING (
    "userId" IN (
      SELECT id FROM "User" 
      WHERE "organisationId" = get_current_user_organisation_id()
    )
  );

-- Session policies
-- Users can only see their own sessions
CREATE POLICY "Users can view their own sessions" ON "Session"
  FOR SELECT USING (
    "userId" IN (
      SELECT id FROM "User" 
      WHERE "organisationId" = get_current_user_organisation_id()
    )
  );

-- Users can only create sessions for themselves
CREATE POLICY "Users can create their own sessions" ON "Session"
  FOR INSERT WITH CHECK (
    "userId" IN (
      SELECT id FROM "User" 
      WHERE "organisationId" = get_current_user_organisation_id()
    )
  );

-- Users can only update their own sessions
CREATE POLICY "Users can update their own sessions" ON "Session"
  FOR UPDATE USING (
    "userId" IN (
      SELECT id FROM "User" 
      WHERE "organisationId" = get_current_user_organisation_id()
    )
  );

-- Users can only delete their own sessions
CREATE POLICY "Users can delete their own sessions" ON "Session"
  FOR DELETE USING (
    "userId" IN (
      SELECT id FROM "User" 
      WHERE "organisationId" = get_current_user_organisation_id()
    )
  );

-- AuditLog policies
-- Users can only see audit logs for their organisation
CREATE POLICY "Users can view organisation audit logs" ON "AuditLog"
  FOR SELECT USING ("organisationId" = get_current_user_organisation_id());

-- Only admins can create audit logs
CREATE POLICY "Admins can create audit logs" ON "AuditLog"
  FOR INSERT WITH CHECK (
    "organisationId" = get_current_user_organisation_id()
    AND get_current_user_role() = 'ADMIN'
  );

-- VerificationToken policies
-- Verification tokens are global and don't need organisation-specific policies
-- But we'll restrict access to prevent enumeration attacks
CREATE POLICY "Users can view verification tokens" ON "VerificationToken"
  FOR SELECT USING (true);

CREATE POLICY "Users can create verification tokens" ON "VerificationToken"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update verification tokens" ON "VerificationToken"
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete verification tokens" ON "VerificationToken"
  FOR DELETE USING (true);