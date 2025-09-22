'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Navigation, ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

/**
 * Enhanced Table of Contents component for documentation pages
 * @component TableOfContents
 * @example
 * ```tsx
 * <TableOfContents items={tocItems} />
 * ```
 * @accessibility
 * - ARIA roles: navigation
 * - Keyboard navigation: Tab through links
 * - Screen reader: Announces navigation structure
 * - Progress indicator for reading progress
 */
export default function TableOfContents({
  items,
  className = '',
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map(item => {
        const element = document.getElementById(item.id);
        return {
          id: item.id,
          element,
          top: element ? element.getBoundingClientRect().top : Infinity,
        };
      });

      // Find the heading that's currently in view
      const currentHeading = headings
        .filter(heading => heading.top <= 150) // 150px from top for better detection
        .sort((a, b) => b.top - a.top)[0]; // Get the one closest to top

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }

      // Calculate reading progress
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const newProgress = Math.min(scrollPercent, 100);
      setProgress(newProgress);

      // Update progress bar width directly
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.round(newProgress)}%`;
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 100; // Account for fixed header
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1:
        return <BookOpen className="w-3 h-3" />;
      case 2:
        return <ChevronRight className="w-3 h-3" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-current opacity-50" />;
    }
  };

  const getLevelStyle = (level: number) => {
    switch (level) {
      case 1:
        return 'font-semibold text-sm border-l-2 border-primary pl-3';
      case 2:
        return 'font-medium text-sm pl-6';
      case 3:
        return 'text-xs pl-9 opacity-90';
      default:
        return 'text-xs pl-12 opacity-75';
    }
  };

  return (
    <div className={`w-full max-w-sm ${className}`}>
      {/* Header with Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Contents</h3>
            <Badge variant="secondary" className="text-xs">
              {items.length} sections
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            <ChevronRight
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
          <div
            ref={progressBarRef}
            className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {Math.round(progress)}% complete
        </div>

        <Separator className="mt-3" />
      </div>

      {/* TOC Items */}
      {isExpanded && (
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          <nav aria-label="Table of contents">
            <div className="space-y-1">
              {items.map(item => (
                <div key={item.id} className="relative">
                  <Button
                    variant={activeId === item.id ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => scrollToHeading(item.id)}
                    className={`
                      justify-start w-full text-left h-auto py-2.5 px-3
                      transition-all duration-200 ease-in-out
                      ${
                        activeId === item.id
                          ? 'bg-primary/10 text-primary border-l-2 border-primary shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                      ${getLevelStyle(item.level)}
                      group
                    `}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={`
                        flex-shrink-0 transition-colors duration-200
                        ${activeId === item.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
                      `}
                      >
                        {getLevelIcon(item.level)}
                      </div>
                      <span className="text-sm leading-relaxed flex-1 min-w-0">
                        {item.title}
                      </span>
                      {activeId === item.id && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                  </Button>

                  {/* Active indicator line */}
                  {activeId === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-r-sm" />
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Quick Actions */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex-1 text-xs"
            >
              ↑ Top
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextItem = items.find(item => item.id !== activeId);
                if (nextItem) scrollToHeading(nextItem.id);
              }}
              className="flex-1 text-xs"
            >
              ↓ Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
