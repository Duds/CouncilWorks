"use client";

import { Search, Bell, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getKeyboardShortcut } from "@/lib/device-detection";

interface HeaderProps {
  title?: string;
  description?: string;
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        {/* Page Title Section */}
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
      <div className="flex items-center gap-4 ml-auto px-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search assets..."
            className="w-full appearance-none bg-background pl-8 pr-20 shadow-none"
          />
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1 pointer-events-none">
            <Kbd size="sm">^</Kbd>
            <Kbd size="sm">F</Kbd>
          </div>
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
    </header>
  );
}
