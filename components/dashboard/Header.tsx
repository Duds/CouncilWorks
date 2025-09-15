"use client";

import { Search, Bell, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getKeyboardShortcut } from "@/lib/device-detection";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  
  // Get user initials for fallback avatar
  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="w-full flex-1">
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
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium">
                {session?.user?.name || "User"}
              </div>
              <div className="text-xs text-muted-foreground">
                {session?.user?.email || "user@example.com"}
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={session?.user?.image || undefined} 
                alt={session?.user?.name || "User avatar"}
              />
              <AvatarFallback>
                {getUserInitials(session?.user?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
