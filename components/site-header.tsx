'use client';

import { Search, Bell, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { getModifierKeySymbol } from '@/lib/device-detection';

interface SiteHeaderProps {
  title?: string;
}

/**
 * Site header component following shadcn/ui dashboard pattern
 * Provides navigation controls and search functionality with proper alignment
 * @component SiteHeader
 * @example
 * ```tsx
 * <SiteHeader title="Dashboard" />
 * ```
 * @accessibility
 * - ARIA roles: banner
 * - Keyboard navigation: Tab through header controls
 * - Screen reader: Announces page title and navigation state
 */
export function SiteHeader({ title }: SiteHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-sidebar-border px-4 lg:px-6">
      {/* Left side - Navigation */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {title && (
          <h1 className="text-base font-medium">
            {title}
          </h1>
        )}
      </div>
      
      {/* Right side - Actions */}
      <div className="ml-auto flex items-center gap-3">
        {/* Search - Hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 w-[200px] lg:w-[300px]"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Kbd className="h-5 px-1.5 text-xs">{getModifierKeySymbol()}</Kbd>
            <Kbd className="h-5 px-1.5 text-xs">F</Kbd>
          </div>
        </div>
        
        {/* Icon buttons */}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="relative h-9 w-9 p-0">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            {/* Notification indicator dot */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background"></span>
          </Button>
          
          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Messages</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
