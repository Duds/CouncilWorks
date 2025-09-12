import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TeamCollaboration() {
  const teamMembers = [
    {
      name: "David Chen",
      role: "Asset Manager",
      task: "Bridge Inspection Protocol",
      status: "completed",
      avatar: "DC",
    },
    {
      name: "Emma Thompson",
      role: "Maintenance Coordinator",
      task: "Water System Maintenance",
      status: "in-progress",
      avatar: "ET",
    },
    {
      name: "James Wilson",
      role: "Risk Analyst",
      task: "Critical Control Assessment",
      status: "pending",
      avatar: "JW",
    },
    {
      name: "Lisa Rodriguez",
      role: "GIS Specialist",
      task: "Asset Mapping Update",
      status: "in-progress",
      avatar: "LR",
    },
  ]

  const statusColors = {
    completed: "bg-success text-success-foreground",
    "in-progress": "bg-warning text-warning-foreground",
    pending: "bg-muted text-muted-foreground",
  }

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Team Collaboration</h3>
        <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">{member.avatar}</span>
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-foreground">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <p className="text-sm text-foreground">{member.task}</p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[member.status as keyof typeof statusColors]}`}
            >
              {member.status.replace("-", " ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
