export function RiskAssessment() {
  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Risk Assessment Overview</h3>

      <div className="relative w-32 h-32 mx-auto mb-6">
        {/* Simplified circular progress */}
        <div className="w-32 h-32 rounded-full border-8 border-muted relative">
          <div
            className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary border-r-primary border-b-primary"
            style={{ transform: "rotate(0deg)" }}
          ></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">73%</div>
              <div className="text-xs text-muted-foreground">Compliant</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm text-foreground">Low Risk</span>
          <span className="ml-auto text-sm text-muted-foreground">847 assets</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-warning rounded-full"></div>
          <span className="text-sm text-foreground">Medium Risk</span>
          <span className="ml-auto text-sm text-muted-foreground">312 assets</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-danger rounded-full"></div>
          <span className="text-sm text-foreground">High Risk</span>
          <span className="ml-auto text-sm text-muted-foreground">88 assets</span>
        </div>
      </div>
    </div>
  )
}
