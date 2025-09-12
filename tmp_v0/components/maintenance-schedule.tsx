import { Calendar, Clock, Wrench, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MaintenanceSchedule() {
  const maintenanceItems = [
    {
      id: 1,
      asset: "Water Pump Station A",
      type: "Preventive Maintenance",
      dueDate: "15/03/2024",
      time: "09:00",
      priority: "high",
      status: "scheduled",
    },
    {
      id: 2,
      asset: "Bridge Inspection - Main St",
      type: "RCM Assessment",
      dueDate: "18/03/2024",
      time: "14:30",
      priority: "medium",
      status: "in-progress",
    },
    {
      id: 3,
      asset: "Traffic Light System",
      type: "Critical Control Check",
      dueDate: "20/03/2024",
      time: "11:00",
      priority: "high",
      status: "pending",
    },
    {
      id: 4,
      asset: "Park Equipment Audit",
      type: "Safety Inspection",
      dueDate: "22/03/2024",
      time: "08:00",
      priority: "low",
      status: "scheduled",
    },
  ]

  const priorityColors = {
    high: "text-danger",
    medium: "text-warning",
    low: "text-success",
  }

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Maintenance Schedule</h3>
        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted bg-transparent">
          + New Task
        </Button>
      </div>

      <div className="space-y-4">
        {maintenanceItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-foreground">{item.asset}</h4>
              <p className="text-sm text-muted-foreground">{item.type}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{item.dueDate}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{item.time}</span>
            </div>

            <div className={`flex items-center gap-1 ${priorityColors[item.priority as keyof typeof priorityColors]}`}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium capitalize">{item.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
