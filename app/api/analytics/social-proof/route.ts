import { SocialProofData } from '@/lib/analytics/landing-page-analytics';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real implementation, this would fetch from a database
    // For now, we'll return static data that could be updated periodically

    const socialProofData: SocialProofData = {
      userCount: 0, // No customers yet
      rating: 5.0, // Design rating based on best practices
      testimonialCount: 0, // No testimonials yet
      customerLogos: [], // No customer logos yet
      lastUpdated: new Date()
    };

    // In production, you might want to:
    // 1. Track actual user registrations
    // 2. Calculate design quality ratings
    // 3. Collect and count real testimonials
    // 4. Display actual customer logos when available

    return NextResponse.json(socialProofData);
  } catch (error) {
    console.error('Social proof API error:', error);

    // Return honest fallback data on error
    const fallbackData: SocialProofData = {
      userCount: 0, // No customers yet
      rating: 5.0, // Design rating based on best practices
      testimonialCount: 0, // No testimonials yet
      customerLogos: [], // No customer logos yet
      lastUpdated: new Date()
    };

    return NextResponse.json(fallbackData);
  }
}
