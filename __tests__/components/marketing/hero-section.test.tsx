import HeroSection from '@/components/marketing/hero-section';
import { render, screen } from '@testing-library/react';

// Mock the A/B testing hook
jest.mock('@/hooks/useAdvancedABTesting', () => ({
  useHeroABTesting: () => ({
    variant: 'A',
    isLoading: false,
    config: {
      headline: 'Transform Your Asset Management with AI-Powered Intelligence',
      subheadline: 'Join 500+ Australian organisations using Aegrid to reduce maintenance costs by 23% and prevent equipment failures before they happen.',
      primaryCTA: 'Start Free Pilot',
      secondaryCTA: 'Watch Demo'
    },
    trackEvent: jest.fn()
  })
}));

// Mock the analytics
jest.mock('@/lib/analytics/landing-page-analytics', () => ({
  initializeLandingPageAnalytics: jest.fn(),
  LandingPageAnalytics: {
    getSocialProofData: jest.fn().mockResolvedValue({
      userCount: 500,
      rating: 4.8,
      testimonialCount: 47,
      customerLogos: [],
      lastUpdated: new Date()
    })
  }
}));

describe('HeroSection', () => {
  it('renders the hero section with correct content', () => {
    render(<HeroSection />);

    // Check for main headline
    expect(screen.getByText(/Transform Your Asset Management with AI-Powered Intelligence/i)).toBeInTheDocument();

    // Check for subheadline
    expect(screen.getByText(/Join 500\+ Australian organisations/i)).toBeInTheDocument();

    // Check for trust indicators
    expect(screen.getByText(/ISO 55000 Compliant/i)).toBeInTheDocument();
    expect(screen.getAllByText(/AI-Powered Intelligence/i)).toHaveLength(2); // Appears in headline and trust indicator
    expect(screen.getByText(/500\+ Organisations/i)).toBeInTheDocument();
  });

  it('displays social proof elements', () => {
    render(<HeroSection />);

    // Check for trust badge
    expect(screen.getByText(/Trusted by 500\+ Australian organisations/i)).toBeInTheDocument();

    // Check for metrics
    expect(screen.getByText('23%')).toBeInTheDocument();
    expect(screen.getByText('$500k')).toBeInTheDocument();
    expect(screen.getByText('4.8★')).toBeInTheDocument();
  });

  it('shows CTA buttons', () => {
    render(<HeroSection />);

    // Check for CTA buttons (these would be rendered by the CTA component)
    expect(screen.getByText(/Start Free Pilot/i)).toBeInTheDocument();
    expect(screen.getByText(/Watch Demo/i)).toBeInTheDocument();
  });
});
