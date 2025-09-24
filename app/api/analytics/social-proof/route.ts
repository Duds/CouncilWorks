import { SocialProofData } from '@/lib/analytics/landing-page-analytics';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real implementation, this would fetch from a database
    // For now, we'll return static data that could be updated periodically

    const socialProofData: SocialProofData = {
      userCount: 500,
      rating: 4.8,
      testimonialCount: 47,
      customerLogos: [
        '/images/logos/university-tech.png',
        '/images/logos/property-group.png',
        '/images/logos/enterprise-solutions.png'
      ],
      lastUpdated: new Date()
    };

    // In production, you might want to:
    // 1. Fetch real user count from database
    // 2. Calculate average rating from reviews
    // 3. Count published testimonials
    // 4. Get actual customer logos

    return NextResponse.json(socialProofData);
  } catch (error) {
    console.error('Social proof API error:', error);

    // Return fallback data on error
    const fallbackData: SocialProofData = {
      userCount: 500,
      rating: 4.8,
      testimonialCount: 47,
      customerLogos: [],
      lastUpdated: new Date()
    };

    return NextResponse.json(fallbackData);
  }
}
