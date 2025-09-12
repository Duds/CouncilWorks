import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { 
  generateMFASecret, 
  verifyMFAToken, 
  enableMFA, 
  disableMFA, 
  getMFAStatus,
  generateBackupCodes,
  verifyBackupCode 
} from "@/lib/mfa";

const enableMFASchema = z.object({
  token: z.string().length(6, "Token must be 6 digits"),
});

const verifyTokenSchema = z.object({
  token: z.string().length(6, "Token must be 6 digits"),
});

const verifyBackupCodeSchema = z.object({
  code: z.string().min(6, "Backup code must be at least 6 characters"),
});

/**
 * GET /api/mfa/status - Get MFA status for the current user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await getMFAStatus(session.user.id);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error getting MFA status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/mfa/setup - Generate MFA secret and QR code
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { secret, qrCode, manualEntryKey } = await generateMFASecret(
      session.user.id,
      session.user.email
    );

    return NextResponse.json({
      secret: manualEntryKey,
      qrCode,
    });
  } catch (error) {
    console.error("Error generating MFA secret:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT /api/mfa/enable - Enable MFA with verification token
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { token } = enableMFASchema.parse(body);

    const success = await enableMFA(session.user.id, token);
    
    if (success) {
      const status = await getMFAStatus(session.user.id);
      return NextResponse.json({ 
        success: true, 
        status,
        message: "MFA enabled successfully" 
      });
    } else {
      return NextResponse.json({ 
        error: "Invalid token. Please try again." 
      }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid input", 
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error("Error enabling MFA:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/mfa - Disable MFA
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await disableMFA(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      message: "MFA disabled successfully" 
    });
  } catch (error) {
    console.error("Error disabling MFA:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
