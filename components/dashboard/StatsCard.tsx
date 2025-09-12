import type React from "react";
import { TrendingUp, TrendingDown, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  title: string;
  value: string | number;
  change?: { value: string; type: "increase" | "decrease" | "neutral"; period?: string };
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "success";
}

export default function StatsCard({ title, value, change, icon, variant = "primary" }: Props) {
  // Neutral surface with subtle accent indicator; variant selects accent colour for icon/badge only
  const accentText: Record<NonNullable<Props["variant"]>, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    success: "text-emerald-600",
  };

  return (
    <div className="rounded-xl p-6 relative overflow-hidden bg-white border border-border">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t bg-emerald-500/70" />
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium opacity-90">{title}</h3>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
              <BadgeCheck className="w-3 h-3 mr-1" />
              OK
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          {change && (
            <div className="flex items-center gap-1 text-sm opacity-80">
              {change.type === "increase" && <TrendingUp className={"w-4 h-4 " + accentText[variant]} />}
              {change.type === "decrease" && <TrendingDown className={"w-4 h-4 " + accentText[variant]} />}
              <span>
                {change.value} {change.period}
              </span>
            </div>
          )}
        </div>
        {icon && <div className={"opacity-60 text-4xl " + accentText[variant]}>{icon}</div>}
      </div>
    </div>
  );
}
