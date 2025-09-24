import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Tag,
  CheckCircle,
  Wrench,
  Star,
  Zap,
  Shield,
  Target,
  TrendingUp,
  Users,
  Award,
  ExternalLink,
  History,
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

        {/* Version 0.5.0 - Latest Release */}
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
                    Version 0.5.0
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive Platform Improvements & ISO 55000 Policy
                    Framework
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
                  <span>2025-01-24</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Major Features */}
            <div className="space-y-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-yellow-600" />
                Major Features & Improvements
              </h3>

              {/* ISO 55000 Policy Framework */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-blue-900 mb-2">
                    ISO 55000 Policy Framework (F23.1)
                  </div>
                  <div className="text-sm text-blue-700 mb-3">
                    Comprehensive asset management policy framework with
                    templates, guidance, alignment tracking, and review
                    processes for ISO 55000 compliance
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="font-medium text-blue-800 mb-1">
                        Key Features:
                      </div>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Policy template management</li>
                        <li>• Compliance assessment tools</li>
                        <li>• Governance structure templates</li>
                        <li>• Alignment scoring system</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-blue-800 mb-1">
                        Compliance Features:
                      </div>
                      <ul className="space-y-1 text-blue-700">
                        <li>• ISO 55000 principle alignment</li>
                        <li>• Automated compliance reporting</li>
                        <li>• Gap analysis and recommendations</li>
                        <li>• Review cycle management</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3 Implementation */}
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-green-900 mb-2">
                    Phase 3 Advanced Features Implementation
                  </div>
                  <div className="text-sm text-green-700 mb-3">
                    Complete implementation of Phase 3 advanced features
                    including interactive demos, industry-specific pages, and
                    enhanced analytics
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="font-medium text-green-800 mb-1">
                        New Components:
                      </div>
                      <ul className="space-y-1 text-green-700">
                        <li>• Interactive demo system</li>
                        <li>• Industry-specific landing pages</li>
                        <li>• Advanced analytics dashboard</li>
                        <li>• Enterprise features showcase</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-green-800 mb-1">
                        Performance Improvements:
                      </div>
                      <ul className="space-y-1 text-green-700">
                        <li>• Hero section loading: 3-5s → &lt;1s</li>
                        <li>• Eliminated hydration mismatches</li>
                        <li>• Optimized component rendering</li>
                        <li>• Cleaned up unused dependencies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aegrid Rules Updates */}
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-purple-900 mb-2">
                    Aegrid Rules Documentation & Corrections
                  </div>
                  <div className="text-sm text-purple-700 mb-3">
                    Comprehensive updates to The Aegrid Rules documentation,
                    corrections, and implementation guidance
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="font-medium text-purple-800 mb-1">
                        Documentation Updates:
                      </div>
                      <ul className="space-y-1 text-purple-700">
                        <li>• Updated Rule 4 wording clarification</li>
                        <li>• Comprehensive correction summaries</li>
                        <li>• Implementation guidance updates</li>
                        <li>• Archive of outdated references</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-purple-800 mb-1">
                        Content Improvements:
                      </div>
                      <ul className="space-y-1 text-purple-700">
                        <li>• Whitepaper content updates</li>
                        <li>• Core rules page enhancements</li>
                        <li>• Landing page rule integration</li>
                        <li>• Consistent messaging alignment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Improvements */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                <Wrench className="h-5 w-5 text-orange-600" />
                Technical Improvements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Performance Optimizations
                      </div>
                      <div className="text-sm text-gray-700">
                        Hero section loading time reduced from 3-5s to &lt;1s
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Hydration Fixes
                      </div>
                      <div className="text-sm text-gray-700">
                        Eliminated hydration mismatches and console errors
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Component Cleanup
                      </div>
                      <div className="text-sm text-gray-700">
                        Removed redundant sections and streamlined structure
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">
                        API Route Fixes
                      </div>
                      <div className="text-sm text-gray-700">
                        Fixed import paths and authentication configurations
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Epic Status */}
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">
                  Phase 3 Implementation Complete
                </h3>
                <p className="text-sm text-green-700">
                  All Phase 3 advanced features implemented with comprehensive
                  performance improvements
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
                        Comprehensive policy framework with automated compliance
                        tracking
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">
                        Advanced Analytics
                      </div>
                      <div className="text-sm text-green-700">
                        Interactive demos and industry-specific analytics
                        dashboards
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Target className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900">
                        Enhanced Aegrid Rules
                      </div>
                      <div className="text-sm text-purple-700">
                        Updated documentation with comprehensive implementation
                        guidance
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Demos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  Interactive Demonstrations
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <ExternalLink className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-900">
                        Live Dashboard Previews
                      </div>
                      <div className="text-sm text-orange-700">
                        Real-time asset performance metrics and compliance
                        tracking
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Award className="h-4 w-4 text-indigo-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-indigo-900">
                        Policy Framework Demo
                      </div>
                      <div className="text-sm text-indigo-700">
                        Interactive ISO 55000 policy creation and compliance
                        assessment
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <Star className="h-4 w-4 text-pink-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-pink-900">
                        Industry-Specific Views
                      </div>
                      <div className="text-sm text-pink-700">
                        Tailored experiences for universities, property
                        portfolios, and enterprise
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Version 0.4.0 - Previous Release */}
            <div className="mt-12">
              <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2 text-lg">
                <History className="h-5 w-5 text-gray-600" />
                Previous Releases
              </h3>

              <Card className="border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-200 rounded-lg">
                        <Tag className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                          Version 0.4.0
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Landing Page Modernisation & Core Feature Highlighting
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>2025-01-23</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Epic Status */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">
                        Epic 25: Landing Page Modernisation
                      </h3>
                      <p className="text-sm text-green-700">
                        Complete overhaul with core feature highlighting and
                        executive messaging
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
                              Intelligent anomaly detection and predictive
                              analytics
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Demos */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                        Interactive Demonstrations
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <ExternalLink className="h-4 w-4 text-orange-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-orange-900">
                              Live Dashboard Previews
                            </div>
                            <div className="text-sm text-orange-700">
                              Real-time asset performance metrics and energy
                              consumption analysis
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                          <Award className="h-4 w-4 text-indigo-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-indigo-900">
                              Feature Walkthrough Videos
                            </div>
                            <div className="text-sm text-indigo-700">
                              Step-by-step demonstrations of key capabilities
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
                              Success stories with quantified results (23% cost
                              reduction, $500K+ savings)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocsLayout>
  );
}
