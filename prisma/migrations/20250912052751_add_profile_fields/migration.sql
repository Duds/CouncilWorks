-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en-AU',
ADD COLUMN     "notificationPreferences" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Australia/Sydney';
