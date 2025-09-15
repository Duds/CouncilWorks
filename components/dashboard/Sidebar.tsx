import { Building2, BarChart3, Calendar, Settings, Users, MapPin, Wrench, AlertTriangle, FileText, LogOut, HelpCircle, Smartphone, Bell } from "lucide-react";
import ReleaseBadge from "@/components/release-badge";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen flex flex-col pt-4 pl-4 pb-4">
      <div className="bg-surface rounded-xl shadow-sm h-full flex flex-col">
        <div className="pt-4 pl-4 pb-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-foreground">Aegrid</span>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Menu</div>
            <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <BarChart3 className="w-4 h-4" />Dashboard
            </a>
            <a href="/assets" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Building2 className="w-4 h-4" />Assets
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">1,247</span>
            </a>
            <a href="/rcm-templates" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Wrench className="w-4 h-4" />RCM Templates
            </a>
            <a href="/maintenance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Calendar className="w-4 h-4" />Maintenance
            </a>
            <a href="/assets/map" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <MapPin className="w-4 h-4" />Asset Map
            </a>
            <a href="/risk-analysis" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <AlertTriangle className="w-4 h-4" />Risk Analysis
            </a>
            <a href="/mobile/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Smartphone className="w-4 h-4" />Mobile App
            </a>
            <a href="/reports/risk-compliance" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <AlertTriangle className="w-4 h-4" />Risk & Compliance
            </a>
            <a href="/reports/asset-condition" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <BarChart3 className="w-4 h-4" />Asset Trending
            </a>
            <a href="/reports/builder" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Settings className="w-4 h-4" />Custom Reports
            </a>
            <a href="/admin/triage" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <AlertTriangle className="w-4 h-4" />Report Triage
            </a>
            <a href="/admin/notifications" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Bell className="w-4 h-4" />Notifications
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Users className="w-4 h-4" />Team
            </a>
          </div>
          <div className="mt-8 space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">General</div>
            <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <Settings className="w-4 h-4" />Settings
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <HelpCircle className="w-4 h-4" />Help
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors">
              <LogOut className="w-4 h-4" />Logout
            </a>
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <ReleaseBadge />
        </div>
      </div>
    </aside>
  );
}
