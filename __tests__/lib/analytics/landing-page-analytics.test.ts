import { LandingPageAnalytics, trackConversion, trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';

// Mock fetch
global.fetch = jest.fn();

describe('LandingPageAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
  });

  describe('trackLandingPageEvent', () => {
    it('should track events when analytics instance exists', () => {
      // Mock the analytics instance
      const mockTrack = jest.fn();
      jest.spyOn(require('@/lib/analytics/landing-page-analytics'), 'getLandingPageAnalytics')
        .mockReturnValue({ track: mockTrack });

      trackLandingPageEvent('page_view', { test: 'value' });

      expect(mockTrack).toHaveBeenCalledWith('page_view', { test: 'value' });
    });

    it('should handle missing analytics instance gracefully', () => {
      jest.spyOn(require('@/lib/analytics/landing-page-analytics'), 'getLandingPageAnalytics')
        .mockReturnValue(null);

      // Should not throw
      expect(() => {
        trackLandingPageEvent('page_view', { test: 'value' });
      }).not.toThrow();
    });
  });

  describe('trackConversion', () => {
    it('should track conversion events', () => {
      const mockTrackConversion = jest.fn();
      jest.spyOn(require('@/lib/analytics/landing-page-analytics'), 'getLandingPageAnalytics')
        .mockReturnValue({ trackConversion: mockTrackConversion });

      const conversionEvent = {
        type: 'lead' as const,
        funnelStage: 'awareness' as const,
        properties: { source: 'hero_cta' }
      };

      trackConversion(conversionEvent);

      expect(mockTrackConversion).toHaveBeenCalledWith(conversionEvent);
    });
  });

  describe('Social Proof Data', () => {
    it('should fetch social proof data', async () => {
      const mockData = {
        userCount: 500,
        rating: 4.8,
        testimonialCount: 47,
        customerLogos: [],
        lastUpdated: new Date()
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      const result = await LandingPageAnalytics.getSocialProofData();

      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('/api/analytics/social-proof');
    });

    it('should return fallback data on error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await LandingPageAnalytics.getSocialProofData();

      expect(result).toEqual({
        userCount: 500,
        rating: 4.8,
        testimonialCount: 47,
        customerLogos: [],
        lastUpdated: expect.any(Date)
      });
    });
  });
});
