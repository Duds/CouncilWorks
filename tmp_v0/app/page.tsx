import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AssetStatsCard } from "@/components/asset-stats-card"
import { MaintenanceSchedule } from "@/components/maintenance-schedule"
import { AssetAnalytics } from "@/components/asset-analytics"
import { RiskAssessment } from "@/components/risk-assessment"
import { TeamCollaboration } from "@/components/team-collaboration"
import { Building2, Wrench, AlertTriangle, CheckCircle } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        {/* Main Content Grid */}
        <main className="flex-1 overflow-auto p-4 pt-0">
          <div className="mb-6 mt-4">
            <h1 className="text-2xl font-bold text-foreground mb-2">Asset Management Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor, maintain, and optimise your council assets with RCM and CCT approaches.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AssetStatsCard
              title="Total Assets"
              value="1,247"
              change={{ value: "Increased from last month", type: "increase", period: "" }}
              icon={<Building2 />}
              variant="primary"
            />

            <AssetStatsCard
              title="Active Maintenance"
              value="23"
              change={{ value: "Decreased from last month", type: "decrease", period: "" }}
              icon={<Wrench />}
              variant="secondary"
            />

            <AssetStatsCard
              title="Risk Assessments"
              value="156"
              change={{ value: "Increased from last month", type: "increase", period: "" }}
              icon={<AlertTriangle />}
              variant="accent"
            />

            <AssetStatsCard
              title="Compliance Rate"
              value="94%"
              change={{ value: "On Target", type: "neutral", period: "" }}
              icon={<CheckCircle />}
              variant="success"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <MaintenanceSchedule />
            </div>

            <div className="space-y-6">
              <RiskAssessment />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssetAnalytics />
            <TeamCollaboration />
          </div>
        </main>
      </div>
    </div>
  )
}
