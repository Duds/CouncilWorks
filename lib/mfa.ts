import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { AuditAction } from "@prisma/client";

/**
 * Generate a new MFA secret for a user
 * @param userId - The user ID
 * @param userEmail - The user's email address
 * @returns Object containing secret and QR code data URL
 */
export async function generateMFASecret(userId: string, userEmail: string) {
  const secret = speakeasy.generateSecret({
    name: `Aegrid (${userEmail})`,
    issuer: "Aegrid",
    length: 32,
  });

  // Store the secret in the database
  await prisma.user.update({
    where: { id: userId },
    data: { mfaSecret: secret.base32 },
  });

  // Generate QR code
  const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32,
    qrCode: qrCodeDataURL,
    manualEntryKey: secret.base32,
  };
}

/**
 * Verify a TOTP token for MFA
 * @param userId - The user ID
 * @param token - The TOTP token to verify
 * @returns Boolean indicating if the token is valid
 */
export async function verifyMFAToken(userId: string, token: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mfaSecret: true, mfaEnabled: true },
  });

  if (!user?.mfaSecret || !user.mfaEnabled) {
    return false;
  }

  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: "base32",
    token,
    window: 2, // Allow 2 time steps (60 seconds) of tolerance
  });

  if (verified) {
    // Update the verified timestamp
    await prisma.user.update({
      where: { id: userId },
      data: { mfaVerifiedAt: new Date() },
    });

    // Log the verification
    await logAuditEvent(AuditAction.MFA_VERIFIED, userId, undefined, {
      timestamp: new Date().toISOString(),
      method: "totp",
    });
  }

  return verified;
}

/**
 * Generate backup codes for MFA recovery
 * @param userId - The user ID
 * @returns Array of backup codes
 */
export async function generateBackupCodes(userId: string): Promise<string[]> {
  const codes = Array.from({ length: 10 }, () => 
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  await prisma.user.update({
    where: { id: userId },
    data: { mfaBackupCodes: codes },
  });

  return codes;
}

/**
 * Verify a backup code for MFA
 * @param userId - The user ID
 * @param code - The backup code to verify
 * @returns Boolean indicating if the code is valid
 */
export async function verifyBackupCode(userId: string, code: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mfaBackupCodes: true, mfaEnabled: true },
  });

  if (!user?.mfaBackupCodes || !user.mfaEnabled) {
    return false;
  }

  const codeIndex = user.mfaBackupCodes.indexOf(code);
  if (codeIndex === -1) {
    return false;
  }

  // Remove the used backup code
  const updatedCodes = user.mfaBackupCodes.filter((_, index) => index !== codeIndex);
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      mfaBackupCodes: updatedCodes,
      mfaVerifiedAt: new Date(),
    },
  });

  // Log the backup code usage
  await logAuditEvent(AuditAction.MFA_BACKUP_CODE_USED, userId, undefined, {
    timestamp: new Date().toISOString(),
    method: "backup_code",
  });

  return true;
}

/**
 * Enable MFA for a user
 * @param userId - The user ID
 * @param token - The TOTP token to verify during setup
 * @returns Boolean indicating if MFA was successfully enabled
 */
export async function enableMFA(userId: string, token: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mfaSecret: true },
  });

  if (!user?.mfaSecret) {
    return false;
  }

  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: "base32",
    token,
    window: 2,
  });

  if (verified) {
    const backupCodes = await generateBackupCodes(userId);
    
    await prisma.user.update({
      where: { id: userId },
      data: { 
        mfaEnabled: true,
        mfaVerifiedAt: new Date(),
      },
    });

    // Log MFA enablement
    await logAuditEvent(AuditAction.MFA_ENABLED, userId, undefined, {
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  return false;
}

/**
 * Disable MFA for a user
 * @param userId - The user ID
 */
export async function disableMFA(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { 
      mfaEnabled: false,
      mfaSecret: null,
      mfaBackupCodes: [],
      mfaVerifiedAt: null,
    },
  });

  // Log MFA disablement
  await logAuditEvent(AuditAction.MFA_DISABLED, userId, undefined, {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Check if a user has MFA enabled
 * @param userId - The user ID
 * @returns Boolean indicating if MFA is enabled
 */
export async function isMFAEnabled(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { mfaEnabled: true },
  });

  return user?.mfaEnabled || false;
}

/**
 * Get MFA status for a user
 * @param userId - The user ID
 * @returns Object containing MFA status information
 */
export async function getMFAStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      mfaEnabled: true,
      mfaVerifiedAt: true,
      mfaBackupCodes: true,
    },
  });

  return {
    enabled: user?.mfaEnabled || false,
    verifiedAt: user?.mfaVerifiedAt,
    backupCodesCount: user?.mfaBackupCodes?.length || 0,
  };
}
