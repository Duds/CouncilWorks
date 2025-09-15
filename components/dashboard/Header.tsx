"use client";

import { Search, Bell, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getKeyboardShortcut } from "@/lib/device-detection";

interface HeaderProps {
  title?: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* Page Title Section */}
        <div className="flex-1">
          {title && (
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">{getKeyboardShortcut('F')}</span>
            </kbd>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Asset
              </span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Import Data
              </span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Open messages</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
