-- Add composite unique constraint to ServicePurpose
ALTER TABLE "ServicePurpose"
ADD CONSTRAINT "ServicePurpose_organisationId_name_key" UNIQUE ("organisationId", "name");
-- Update AssetPurposeMapping contribution field type from text to integer
-- First, we need to handle any existing data by converting text to integer
-- Assuming existing data is in format like "95" or "HIGH"
UPDATE "AssetPurposeMapping"
SET "contribution" = CASE
    WHEN "contribution"::text ~ '^[0-9]+$' THEN "contribution"::text::integer
    WHEN "contribution"::text = 'CRITICAL' THEN 95
    WHEN "contribution"::text = 'HIGH' THEN 85
    WHEN "contribution"::text = 'MEDIUM' THEN 70
    WHEN "contribution"::text = 'LOW' THEN 60
    ELSE 70
  END::text;
-- Now alter the column type
ALTER TABLE "AssetPurposeMapping"
ALTER COLUMN "contribution" TYPE INTEGER USING "contribution"::integer;
