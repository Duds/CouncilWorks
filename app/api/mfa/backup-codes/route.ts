import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateBackupCodes } from "@/lib/mfa";

/**
 * POST /api/mfa/backup-codes - Generate new backup codes
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const codes = await generateBackupCodes(session.user.id);
    
    return NextResponse.json({ 
      success: true, 
      codes,
      message: "New backup codes generated. Please save them securely." 
    });
  } catch (error) {
    console.error("Error generating backup codes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
