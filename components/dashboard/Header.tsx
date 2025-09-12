import { Search, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  return (
    <div className="pt-4 pl-4 pr-4 pb-0">
      <header className="bg-surface rounded-xl shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets..."
                className="pl-10 pr-10 py-2 bg-white rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-80"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground bg-muted border border-border px-2 py-0.5 rounded-md shadow-sm">
                Ctrl&nbsp;F
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">+ Add Asset</Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">Import Data</Button>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Open messages" title="Open messages">
                <Mail className="w-5 h-5 text-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors relative" aria-label="Notifications" title="Notifications">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">Sarah Mitchell</div>
                  <div className="text-xs text-muted-foreground">s.mitchell@council.gov.au</div>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://tapback.co/api/avatar/${encodeURIComponent("Sarah Mitchell")}.webp`} />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
