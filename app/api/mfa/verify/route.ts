import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { verifyMFAToken, verifyBackupCode } from "@/lib/mfa";

const verifyTokenSchema = z.object({
  token: z.string().length(6, "Token must be 6 digits"),
});

const verifyBackupCodeSchema = z.object({
  code: z.string().min(6, "Backup code must be at least 6 characters"),
});

/**
 * POST /api/mfa/verify - Verify MFA token or backup code
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Try to verify as TOTP token first
    if (body.token && typeof body.token === "string" && body.token.length === 6) {
      const { token } = verifyTokenSchema.parse(body);
      const isValid = await verifyMFAToken(session.user.id, token);
      
      if (isValid) {
        return NextResponse.json({ 
          success: true, 
          message: "MFA verification successful" 
        });
      } else {
        return NextResponse.json({ 
          error: "Invalid token" 
        }, { status: 400 });
      }
    }
    
    // Try to verify as backup code
    if (body.code && typeof body.code === "string") {
      const { code } = verifyBackupCodeSchema.parse(body);
      const isValid = await verifyBackupCode(session.user.id, code);
      
      if (isValid) {
        return NextResponse.json({ 
          success: true, 
          message: "Backup code verification successful" 
        });
      } else {
        return NextResponse.json({ 
          error: "Invalid backup code" 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      error: "Invalid input. Provide either 'token' or 'code'." 
    }, { status: 400 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid input", 
        details: error.errors 
      }, { status: 400 });
    }
    
    console.error("Error verifying MFA:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
