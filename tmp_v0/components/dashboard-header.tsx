import { Search, Bell, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getKeyboardShortcut } from "@/lib/device-detection"

export function DashboardHeader() {
  return (
    <div className="m-4 mb-0">
      <header className="bg-card rounded-xl shadow-sm border-0 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets..."
                className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-80"
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground bg-background border border-border px-2 py-1 rounded">
                {getKeyboardShortcut('F')}
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">+ Add Asset</Button>

            <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
              Import Data
            </Button>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-foreground" />
              </button>

              <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
              </button>

              <div className="flex items-center gap-3 ml-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">Sarah Mitchell</div>
                  <div className="text-xs text-muted-foreground">s.mitchell@council.gov.au</div>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">SM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
