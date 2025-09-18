'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
 * Table of Contents component for documentation pages
 * @component TableOfContents
 * @example
 * ```tsx
 * <TableOfContents items={tocItems} />
 * ```
 * @accessibility
 * - ARIA roles: navigation
 * - Keyboard navigation: Tab through links
 * - Screen reader: Announces navigation structure
 */
export default function TableOfContents({ items, className = '' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map(item => {
        const element = document.getElementById(item.id);
        return {
          id: item.id,
          element,
          top: element ? element.getBoundingClientRect().top : Infinity
        };
      });

      // Find the heading that's currently in view
      const currentHeading = headings
        .filter(heading => heading.top <= 100) // 100px from top
        .sort((a, b) => b.top - a.top)[0]; // Get the one closest to top

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      className={`sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto ${className}`}
      aria-label="Table of contents"
    >
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Table of Contents
        </h3>
        <Separator className="mb-4" />
        {items.map((item, index) => (
          <div key={item.id}>
            <Button
              variant={activeId === item.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => scrollToHeading(item.id)}
              className={`
                justify-start w-full text-left h-auto py-2 px-3
                ${activeId === item.id 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
                }
                ${item.level === 1 ? 'font-medium' : ''}
                ${item.level === 2 ? 'ml-3' : ''}
                ${item.level === 3 ? 'ml-6' : ''}
                ${item.level === 4 ? 'ml-9' : ''}
              `}
            >
              <span className="text-sm leading-relaxed">
                {item.title}
              </span>
            </Button>
            {index < items.length - 1 && (
              <Separator className="my-1 opacity-50" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
