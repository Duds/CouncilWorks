"use client";

import { LandingPageAnalytics, SocialProofData } from '@/lib/analytics/landing-page-analytics';
import { MessageSquare, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SocialProofBarProps {
  data?: SocialProofData | null;
  variant?: 'minimal' | 'detailed' | 'floating';
  className?: string;
}

export default function SocialProofBar({
  data,
  variant = 'minimal',
  className = ''
}: SocialProofBarProps) {
  const [socialProofData, setSocialProofData] = useState<SocialProofData | null>(data || null);
  const [isLoading, setIsLoading] = useState(!data);

  useEffect(() => {
    if (!data) {
      const fetchData = async () => {
        try {
          const result = await LandingPageAnalytics.getSocialProofData();
          setSocialProofData(result);
        } catch (error) {
          console.error('Failed to load social proof data:', error);
          // Use fallback data
          setSocialProofData({
            userCount: 500,
            rating: 4.8,
            testimonialCount: 47,
            customerLogos: [],
            lastUpdated: new Date()
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [data]);

  if (isLoading || !socialProofData) {
    return <SocialProofSkeleton variant={variant} className={className} />;
  }

  const formatUserCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    return `${count}+`;
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  );

  if (variant === 'floating') {
    return (
      <div className={`fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg ${className}`}>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <StarRating rating={socialProofData.rating} />
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{formatUserCount(socialProofData.userCount)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100 ${className}`}>
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <StarRating rating={socialProofData.rating} />
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>

            {/* User Count */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {formatUserCount(socialProofData.userCount)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Australian Organisations</p>
            </div>

            {/* Testimonials */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">
                  {socialProofData.testimonialCount}
                </span>
              </div>
              <p className="text-sm text-gray-600">Success Stories</p>
            </div>
          </div>

          {/* Customer Logos */}
          {socialProofData.customerLogos.length > 0 && (
            <div className="mt-6 pt-6 border-t border-green-200">
              <p className="text-center text-sm text-gray-600 mb-4">Trusted by leading organisations</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                {socialProofData.customerLogos.map((logo, index) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`Customer logo ${index + 1}`}
                    className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Minimal variant (default)
  return (
    <div className={`border-b border-gray-200 bg-gray-50/50 ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <StarRating rating={socialProofData.rating} />
          </div>

          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="font-medium">{formatUserCount(socialProofData.userCount)}</span>
            <span>organisations</span>
          </div>

          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">{socialProofData.testimonialCount}</span>
            <span>success stories</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialProofSkeleton({ variant, className }: { variant: string; className: string }) {
  if (variant === 'detailed') {
    return (
      <div className={`bg-gray-50 border-b border-gray-200 ${className}`}>
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-b border-gray-200 bg-gray-50/50 ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="flex items-center justify-center gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
