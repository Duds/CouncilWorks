import {
  Building2,
  BarChart3,
  Calendar,
  Settings,
  Users,
  MapPin,
  Wrench,
  AlertTriangle,
  FileText,
  LogOut,
} from "lucide-react"

export function DashboardSidebar() {
  return (
    <aside className="w-64 h-screen flex flex-col m-4 mr-0">
      <div className="bg-card rounded-xl shadow-sm border-0 h-full flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">CouncilWorks</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">MENU</div>

            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Assets
              <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">1,247</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Wrench className="w-4 h-4" />
              Maintenance
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <MapPin className="w-4 h-4" />
              GIS Mapping
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Risk Analysis
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <FileText className="w-4 h-4" />
              Reports
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Users className="w-4 h-4" />
              Team
            </a>
          </div>

          <div className="mt-8 space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">GENERAL</div>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </a>
          </div>
        </nav>
      </div>
    </aside>
  )
}
