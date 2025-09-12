export function AssetAnalytics() {
  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Asset Performance Analytics</h3>

      <div className="flex items-end justify-between h-48 gap-2">
        {/* Simplified bar chart representation */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 bg-muted h-16 rounded-t"></div>
          <span className="text-xs text-muted-foreground">Mon</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 bg-primary h-32 rounded-t"></div>
          <span className="text-xs text-muted-foreground">Tue</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 bg-primary h-24 rounded-t"></div>
          <span className="text-xs text-muted-foreground">Wed</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 bg-primary h-40 rounded-t"></div>
          <span className="text-xs text-muted-foreground">Thu</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 bg-muted h-20 rounded-t"></div>
          <span className="text-xs text-muted-foreground">Fri</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 bg-muted h-12 rounded-t"></div>
          <span className="text-xs text-muted-foreground">Sat</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 bg-muted h-8 rounded-t"></div>
          <span className="text-xs text-muted-foreground">Sun</span>
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">Asset utilisation rates across the week</div>
    </div>
  )
}
