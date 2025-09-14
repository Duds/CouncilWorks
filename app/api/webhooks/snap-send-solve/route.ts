import { NextRequest, NextResponse } from 'next/server';
import { createSnapSendSolveService, SnapSendSolveWebhookPayload } from '@/lib/services/snap-send-solve-api';
import { headers } from 'next/headers';

/**
 * Snap Send Solve Webhook API Endpoint
 * Receives reports from Snap Send Solve external platform
 */
export async function POST(request: NextRequest) {
  try {
    // Get headers for signature validation
    const headersList = headers();
    const signature = headersList.get('x-snap-send-solve-signature');
    const timestamp = headersList.get('x-snap-send-solve-timestamp');

    // Parse webhook payload
    const payload: SnapSendSolveWebhookPayload = await request.json();

    // Validate webhook authenticity
    if (!signature || !timestamp) {
      console.error('Missing Snap Send Solve webhook signature or timestamp');
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    // Validate timestamp (prevent replay attacks)
    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp);
    
    if (Math.abs(currentTime - webhookTime) > 300) { // 5 minutes tolerance
      console.error('Snap Send Solve webhook timestamp too old');
      return NextResponse.json(
        { error: 'Webhook timestamp too old' },
        { status: 401 }
      );
    }

    // Process webhook
    const snapSendSolveService = createSnapSendSolveService();
    const report = await snapSendSolveService.processWebhook(payload);

    // Log successful processing
    console.log(`Successfully processed Snap Send Solve webhook for report: ${report.id}`);

    return NextResponse.json(
      { 
        success: true, 
        reportId: report.id,
        message: 'Webhook processed successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Failed to process Snap Send Solve webhook:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests for webhook verification
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    // Snap Send Solve webhook verification
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json(
    { message: 'Snap Send Solve webhook endpoint is active' },
    { status: 200 }
  );
}
