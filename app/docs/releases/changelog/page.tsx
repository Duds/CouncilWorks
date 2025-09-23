import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Tag,
  CheckCircle,
  Plus,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import DocsLayout from '@/components/layout/docs-layout';

/**
 * Changelog Page
 * Displays the application's release history and version changes
 * @component ChangelogPage
 * @example
 * ```tsx
 * <ChangelogPage />
 * ```
 * @accessibility
 * - ARIA roles: main, region
 * - Keyboard navigation: Tab through changelog sections
 * - Screen reader: Announces version changes and features
 */
export default function ChangelogPage() {
  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto space-y-6 px-6 py-16 sm:py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Changelog</h1>
          <p className="text-muted-foreground">
            Track all notable changes and updates to CouncilWorks.
          </p>
        </div>

        {/* Version 0.4.0 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                Version 0.4.0
              </CardTitle>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  2025-01-23
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Epic 25 Complete
              </Badge>
              <Badge variant="outline">Landing Page Modernisation</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-600" />
                  Core Feature Showcase
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                  <li>
                    • <strong>ISO 55000 Compliance</strong>: Highlighted as
                    primary feature for professional credibility
                  </li>
                  <li>
                    • <strong>Energy Management</strong>: Advanced consumption
                    analysis and optimisation capabilities
                  </li>
                  <li>
                    • <strong>AI Optimisation</strong>: Intelligent anomaly
                    detection and predictive analytics
                  </li>
                  <li>
                    • <strong>Visual Demonstrations</strong>: Structured feature
                    cards with compelling layouts
                  </li>
                  <li>
                    • <strong>Market Positioning</strong>: Targeting
                    universities, property portfolios, and enterprise
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-600" />
                  Interactive Demonstrations
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                  <li>
                    • <strong>Live Dashboard Previews</strong>: Real-time asset
                    performance metrics
                  </li>
                  <li>
                    • <strong>Feature Walkthrough Videos</strong>: Step-by-step
                    capability demonstrations
                  </li>
                  <li>
                    • <strong>Client Testimonials</strong>: Success stories with
                    quantified results
                  </li>
                  <li>
                    • <strong>Executive Messaging</strong>: Professional
                    credibility with ROI emphasis
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Features Completed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F25.1: Core feature showcase</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F25.2: Language dictionary implementation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F25.3: Executive-focused messaging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F25.4: Interactive demonstrations</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version 0.2.0 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                Version 0.2.0
              </CardTitle>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  2025-01-15
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Epic 6 Complete
              </Badge>
              <Badge variant="outline">Citizen Integration</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-600" />
                  Added
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                  <li>
                    • <strong>Citizen Reporting Portal</strong>: Multi-step form
                    with file uploads and anonymous reporting
                  </li>
                  <li>
                    • <strong>Snap Send Solve Integration</strong>: Webhook
                    processing and external report aggregation
                  </li>
                  <li>
                    • <strong>Report Triage System</strong>: Administrative
                    dashboard for assignment and status management
                  </li>
                  <li>
                    • <strong>Citizen Notification System</strong>:
                    Multi-channel notifications with template management
                  </li>
                  <li>
                    • <strong>&ldquo;You Said, We Did&rdquo; Dashboard</strong>:
                    Public transparency with impact metrics
                  </li>
                  <li>
                    • <strong>Report Status Tracking</strong>: Comprehensive
                    timeline and progress monitoring
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-blue-600" />
                  Features Completed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm ml-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F6.1: Citizen reporting portal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F6.2: Snap Send Solve integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F6.3: Report triage workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F6.4: Notification system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>F6.5: Public dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version 0.1.1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                Version 0.1.1
              </CardTitle>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  2025-09-10
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-600" />
                Added
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                <li>
                  • Design: Added shadcn/ui usage examples and semantic token
                  mapping guidance
                </li>
                <li>
                  • Theming: Confirmed functional tokens for light/dark and
                  Tailwind mapping
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Version 0.1.0 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-primary" />
                Version 0.1.0
              </CardTitle>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  2025-09-10
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-600" />
                Added
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                <li>
                  • Scaffolded and populated architecture, development,
                  security, database docs
                </li>
                <li>• Added backlog in TODO.md</li>
                <li>• Added Cursor rules aligned to Aegrid</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Summary */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Project Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">7/7</div>
                <div className="text-sm text-muted-foreground">
                  Completed Epics
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">41/41</div>
                <div className="text-sm text-muted-foreground">
                  Completed Features
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">53/53</div>
                <div className="text-sm text-muted-foreground">
                  User Stories
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">17/20</div>
                <div className="text-sm text-muted-foreground">
                  Technical Tasks
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocsLayout>
  );
}
