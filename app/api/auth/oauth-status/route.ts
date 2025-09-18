import { NextResponse } from "next/server";

export async function GET() {
  try {
    const oauthStatus = {
      google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      microsoft: !!(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
      nextauthUrl: process.env.NEXTAUTH_URL || null,
      nextauthSecret: !!process.env.NEXTAUTH_SECRET,
    };

    return NextResponse.json(oauthStatus);
  } catch (error) {
    console.error("Error checking OAuth status:", error);
    return NextResponse.json(
      { error: "Failed to check OAuth status" },
      { status: 500 }
    );
  }
}
