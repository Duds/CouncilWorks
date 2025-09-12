import type React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface AssetStatsCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "increase" | "decrease" | "neutral"
    period: string
  }
  icon?: React.ReactNode
  variant?: "primary" | "secondary" | "accent" | "success"
}

export function AssetStatsCard({ title, value, change, icon, variant = "primary" }: AssetStatsCardProps) {
  const variantClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-success-foreground",
  }

  return (
    <div className={`rounded-xl p-6 ${variantClasses[variant]} relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
          <div className="text-3xl font-bold mb-1">{value}</div>
          {change && (
            <div className="flex items-center gap-1 text-sm opacity-80">
              {change.type === "increase" && <TrendingUp className="w-4 h-4" />}
              {change.type === "decrease" && <TrendingDown className="w-4 h-4" />}
              <span>
                {change.value} {change.period}
              </span>
            </div>
          )}
        </div>
        {icon && <div className="opacity-20 text-4xl">{icon}</div>}
      </div>
    </div>
  )
}
