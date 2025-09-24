"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { motion, useInView } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Loader2
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
  onLoad?: () => void;
  loadingDelay?: number;
}

function LazySection({
  children,
  fallback = <DefaultFallback />,
  threshold = 0.1,
  rootMargin = '100px',
  triggerOnce = true,
  className = '',
  onLoad,
  loadingDelay = 500
}: LazySectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    threshold,
    rootMargin,
    once: triggerOnce
  });

  useEffect(() => {
    if (isInView && !isLoaded && !isLoading) {
      setIsLoading(true);

      // Simulate loading delay for better UX
      const timer = setTimeout(() => {
        setIsLoaded(true);
        setIsLoading(false);
        onLoad?.();

        trackLandingPageEvent('feature_interaction', {
          action: 'lazy_section_loaded',
          threshold,
          rootMargin
        });
      }, loadingDelay);

      return () => clearTimeout(timer);
    }
  }, [isInView, isLoaded, isLoading, loadingDelay, onLoad, threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isLoaded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      ) : isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {fallback}
        </motion.div>
      ) : (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <EyeOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Scroll to load content</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DefaultFallback() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}

interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
}

function ProgressiveImage({
  src,
  alt,
  placeholder,
  className = '',
  width,
  height,
  onLoad
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-center">
            <EyeOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  lazy?: boolean;
  className?: string;
}

function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  lazy = true,
  className = ''
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasBeenExpanded, setHasBeenExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    if (newExpanded && !hasBeenExpanded) {
      setHasBeenExpanded(true);
      trackLandingPageEvent('feature_interaction', {
        action: 'section_expanded',
        section_title: title
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </motion.div>
        </div>
      </CardHeader>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <CardContent className="pt-0">
          {lazy && !hasBeenExpanded ? (
            <div className="text-center py-8">
              <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to load content</p>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </motion.div>
    </Card>
  );
}

interface VirtualizedListProps {
  items: Array<{
    id: string;
    title: string;
    description: string;
    badge?: string;
  }>;
  itemHeight?: number;
  containerHeight?: number;
  className?: string;
}

function VirtualizedList({
  items,
  itemHeight = 80,
  containerHeight = 400,
  className = ''
}: VirtualizedListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);

  return (
    <div
      ref={setContainerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="absolute w-full px-4 py-2"
            style={{
              top: (visibleStart + index) * itemHeight,
              height: itemHeight
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="h-full">
              <CardContent className="p-4 h-full flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface IntersectionObserverSectionProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  onIntersect?: (isIntersecting: boolean) => void;
}

function IntersectionObserverSection({
  children,
  threshold = 0.1,
  rootMargin = '0px',
  className = '',
  onIntersect
}: IntersectionObserverSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);
        onIntersect?.(isIntersecting);

        if (isIntersecting) {
          trackLandingPageEvent('feature_interaction', {
            action: 'section_intersected',
            threshold,
            rootMargin
          });
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, onIntersect]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export {
    CollapsibleSection, IntersectionObserverSection, LazySection,
    ProgressiveImage, VirtualizedList
};
