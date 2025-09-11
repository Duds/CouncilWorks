import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET() {
  logger.info({ msg: 'health_check' });
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}
