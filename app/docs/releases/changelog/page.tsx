import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Tag,
  CheckCircle,
  Plus,
  Wrench,
  Star,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
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
      <div className="max-w-6xl mx-auto space-y-8 px-6 py-16 sm:py-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Release Changelog
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track all notable changes, new features, and improvements to Aegrid
            - the ISO 55000 compliant asset intelligence platform.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 px-4 py-2"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              ISO 55000 Compliant
            </Badge>
          </div>
        </div>

        {/* Version 0.4.0 - Latest Release */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Tag className="h-6 w-6 text-primary" />
                    Version 0.4.0
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Landing Page Modernisation & Core Feature Highlighting
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 px-3 py-1"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Latest Release
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>2025-01-23</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Epic Status */}
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">
                  Epic 25: Landing Page Modernisation
                </h3>
                <p className="text-sm text-green-700">
                  Complete overhaul with core feature highlighting and executive
                  messaging
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Core Features */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Core Feature Showcase
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">
                        ISO 55000 Compliance
                      </div>
                      <div className="text-sm text-blue-700">
                        Highlighted as primary feature for professional
                        credibility
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">
                        Energy Management
                      </div>
                      <div className="text-sm text-green-700">
                        Advanced consumption analysis and optimisation
                        capabilities
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Target className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900">
                        AI Optimisation
                      </div>
                      <div className="text-sm text-purple-700">
                        Intelligent anomaly detection and predictive analytics
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Demos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Interactive Demonstrations
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <ExternalLink className="h-4 w-4 text-indigo-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-indigo-900">
                        Live Dashboard Previews
                      </div>
                      <div className="text-sm text-indigo-700">
                        Real-time asset performance metrics
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <ArrowRight className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-900">
                        Feature Walkthroughs
                      </div>
                      <div className="text-sm text-orange-700">
                        Step-by-step capability demonstrations
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <Star className="h-4 w-4 text-pink-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-pink-900">
                        Client Testimonials
                      </div>
                      <div className="text-sm text-pink-700">
                        Success stories with quantified results
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Completed */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Features Completed (4/4)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    F25.1: Core feature showcase
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    F25.2: Language dictionary implementation
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    F25.3: Executive-focused messaging
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    F25.4: Interactive demonstrations
                  </span>
                </div>
              </div>
            </div>

            {/* Market Impact */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Market Impact & Positioning
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-primary">Universities</div>
                  <div className="text-muted-foreground">
                    Campus asset management
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">
                    Property Portfolios
                  </div>
                  <div className="text-muted-foreground">
                    Commercial real estate
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-primary">Enterprise</div>
                  <div className="text-muted-foreground">
                    Large-scale operations
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version 0.2.0 */}
        <Card className="border border-green-200">
          <CardHeader className="bg-green-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-primary" />
                    Version 0.2.0
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Citizen Integration & Community Engagement
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>2025-01-15</span>
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
        <Card className="border-dashed border-2 border-primary/30">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              Project Status & Achievements
            </CardTitle>
            <p className="text-muted-foreground">
              Comprehensive overview of Aegrid&apos;s development progress and
              milestone achievements
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  7/7
                </div>
                <div className="text-sm font-medium text-green-800">
                  Completed Epics
                </div>
                <div className="text-xs text-green-600 mt-1">
                  100% Success Rate
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  41/41
                </div>
                <div className="text-sm font-medium text-blue-800">
                  Completed Features
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  All Features Delivered
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  53/53
                </div>
                <div className="text-sm font-medium text-purple-800">
                  User Stories
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  Complete Coverage
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  17/20
                </div>
                <div className="text-sm font-medium text-orange-800">
                  Technical Tasks
                </div>
                <div className="text-xs text-orange-600 mt-1">85% Complete</div>
              </div>
            </div>

            {/* Epic Completion Timeline */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Epic Completion Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Epic 1: Foundation
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    Multi-tenant architecture, authentication, RBAC
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Epic 2: Asset Register
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    GIS integration, asset management, spatial data
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Epic 3: RCM Templates
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    Reliability-centered maintenance, scheduling
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Epic 4: Mobile PWA
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    Offline inspections, mobile-first design
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Epic 5: Dashboards
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    Executive reporting, role-based analytics
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Epic 6: Citizen Integration
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    Community reporting, public engagement
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">
                      Epic 25: Landing Page
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    Modernisation, core feature highlighting
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Achievements */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Technical Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">
                        ISO 55000 Compliance
                      </div>
                      <div className="text-sm text-blue-700">
                        Asset management standard implementation
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Zap className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">
                        Hybrid Database Architecture
                      </div>
                      <div className="text-sm text-green-700">
                        PostgreSQL + Azure Cosmos DB integration
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Target className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-900">
                        AI-Powered Analytics
                      </div>
                      <div className="text-sm text-purple-700">
                        Predictive maintenance and anomaly detection
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <Users className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="font-medium text-orange-900">
                        Multi-Role RBAC
                      </div>
                      <div className="text-sm text-orange-700">
                        Comprehensive role-based access control
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Next Steps & Roadmap
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-primary mb-2">
                    Immediate Priorities
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Complete remaining technical tasks (3/20)</li>
                    <li>• Production deployment configuration</li>
                    <li>• Performance optimization and monitoring</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-primary mb-2">
                    Future Epics
                  </div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Advanced Analytics & Forecasting</li>
                    <li>• ERP & System Integrations</li>
                    <li>• IoT & Telematics Integration</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocsLayout>
  );
}
