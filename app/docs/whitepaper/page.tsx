/**
 * Enhanced Whitepaper Page - The Aegrid Rules
 *
 * A comprehensive, beautifully designed whitepaper page with modern UI components
 *
 * @fileoverview Full whitepaper presentation with enhanced UX and PDF download
 */

import TableOfContents from '@/components/docs/table-of-contents';
import DocsLayout from '@/components/layout/docs-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    Clock,
    Download,
    FileText,
    Share2,
    Shield,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:
    'The Aegrid Rules: Resilient Asset Management for Critical Control | Whitepaper',
  description:
    'Complete whitepaper by Dale Rogers on The Aegrid Rules framework for resilient asset management. Transform from reactive maintenance to proactive risk management with antifragile systems.',
  keywords: [
    'Aegrid Rules',
    'resilient asset management',
    'critical control systems',
    'antifragile asset management',
    'risk-based maintenance',
    'asset criticality',
    'service purpose mapping',
    'adaptive maintenance',
    'margin management',
    'infrastructure resilience',
    'council asset management',
    'whitepaper',
    'Dale Rogers',
    'asset management framework',
    'proactive maintenance',
    'reactive maintenance transformation',
    'CMMS implementation',
    'asset lifecycle management',
    'critical control frameworks',
    'systems thinking',
  ],
  authors: [
    { name: 'Dale Rogers', url: 'https://linkedin.com/in/dale-rogers' },
  ],
  creator: 'Dale Rogers',
  publisher: 'Aegrid',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
    description:
      'Complete whitepaper by Dale Rogers on The Aegrid Rules framework for resilient asset management.',
    url: 'https://aegrid.au/docs/whitepaper',
    siteName: 'Aegrid',
    type: 'article',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
    description:
      'Complete whitepaper by Dale Rogers on The Aegrid Rules framework for resilient asset management.',
    creator: '@aegrid_au',
  },
  alternates: {
    canonical: 'https://aegrid.au/docs/whitepaper',
  },
  other: {
    'DC.title':
      'The Aegrid Rules: Resilient Asset Management for Critical Control',
    'DC.creator': 'Dale Rogers',
    'DC.subject': 'Asset Management, Resilient Systems, Critical Control',
    'DC.description':
      'Complete whitepaper on building antifragile infrastructure systems using The Aegrid Rules framework.',
    'DC.publisher': 'Aegrid',
    'DC.type': 'Whitepaper',
    'DC.format': 'text/html',
    'DC.identifier': 'https://aegrid.au/docs/whitepaper',
    'DC.language': 'en-AU',
  },
};

const tocItems = [
  { id: 'executive-summary', title: 'Executive Summary', level: 1 },
  {
    id: 'introduction',
    title: 'Introduction: Beyond Traditional Asset Management',
    level: 1,
  },
  { id: 'the-problem', title: 'The $114 Billion Problem', level: 2 },
  {
    id: 'traditional-cmms',
    title: 'Why Traditional CMMS Creates Brittleness',
    level: 2,
  },
  {
    id: 'need-for-resilience',
    title: 'The Need for Resilient Asset Management',
    level: 2,
  },
  {
    id: 'aegrid-rules',
    title: 'The Aegrid Rules: A Resilience-First Philosophy',
    level: 1,
  },
  { id: 'rule-1', title: 'Rule 1: Every Asset Has a Purpose', level: 2 },
  { id: 'rule-2', title: 'Rule 2: Risk Sets the Rhythm', level: 2 },
  { id: 'rule-3', title: 'Rule 3: Respond to the Real World', level: 2 },
  { id: 'rule-4', title: 'Rule 4: Operate with Margin', level: 2 },
  {
    id: 'implementation',
    title: 'Building Resilient Asset Management',
    level: 1,
  },
  { id: 'case-studies', title: 'Case Studies', level: 2 },
  { id: 'conclusion', title: 'Conclusion: The Future is Resilient', level: 1 },
  { id: 'about-author', title: 'About the Author', level: 1 },
];

export default function WhitepaperPage() {
  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/docs"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Link>
            <Badge variant="secondary" className="ml-auto">
              <FileText className="w-3 h-3 mr-1" />
              Whitepaper
            </Badge>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              The Aegrid Rules
            </h1>
            <h2 className="text-2xl text-muted-foreground mb-4">
              Resilient Asset Management for Critical Control
            </h2>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Dale Rogers, Founder of Aegrid</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>September 16, 2025</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <a
                  href="/docs/core/Aegrid_The_Foundation_for_Resilient_Asset_Management.pdf"
                  download
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Table of Contents Sidebar - Left */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-8">
              <TableOfContents items={tocItems} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            {/* Executive Summary */}
            <section id="executive-summary" className="mb-12">
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    Traditional asset management has failed because it treats
                    assets as isolated objects rather than components of
                    critical control systems. The result is a brittle, reactive
                    approach that breaks down under pressure—whether from
                    seasonal spikes, budget constraints, or unexpected failures.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <div className="text-2xl font-bold text-destructive">
                        $1.3B
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Found assets councils didn&apos;t know they owned
                      </div>
                    </div>
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <div className="text-2xl font-bold text-destructive">
                        60-80%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        CMMS implementation failure rates
                      </div>
                    </div>
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <div className="text-2xl font-bold text-destructive">
                        9.6%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Councils meeting international standards
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground">
                    This whitepaper introduces the <strong>Aegrid Rules</strong>
                    , a resilience-first philosophy that transforms asset
                    management from a reactive maintenance function into a
                    proactive risk management discipline. Drawing inspiration
                    from critical control frameworks and systems thinking, these
                    rules create antifragile asset management systems that get
                    stronger under stress.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">The Four Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          Every Asset Has a Purpose
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Tie each asset to the service it enables and the
                          critical control it supports
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Risk Sets the Rhythm</h4>
                        <p className="text-sm text-muted-foreground">
                          Let consequence × likelihood determine cadence, scope,
                          and budget allocation
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          Respond to the Real World
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Treat plans as hypotheses and roll with the punches and reallocate resources
                          when risk signals change
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold">Operate with Margin</h4>
                        <p className="text-sm text-muted-foreground">
                          Build practical slack, create room to recover that creates tomorrow&apos;s
                          resilience from today&apos;s actions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Proven Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          30%
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">
                          Reduction in reactive maintenance
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Organizations implementing Aegrid Rules
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          50%
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">
                          Improvement in regulatory compliance
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Faster audit preparation and reporting
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          20%
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">
                          Increase in service reliability
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Better asset performance and uptime
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-12" />

            {/* Introduction */}
            <section id="introduction" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">
                Introduction: Beyond Traditional Asset Management
              </h2>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle
                      id="the-problem"
                      className="flex items-center gap-2"
                    >
                      <TrendingUp className="w-5 h-5 text-destructive" />
                      The $114 Billion Problem
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      The Australian infrastructure deficit stands at $114
                      billion, with local government assets representing a
                      significant portion of this challenge. Traditional asset
                      management approaches have proven inadequate to address
                      this scale of complexity and risk.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground italic">
                        &quot;The current approach to asset management treats
                        symptoms, not systems. We need a fundamental shift from
                        reactive maintenance to proactive risk management.&quot;
                      </p>
                      <p className="text-sm mt-2 font-semibold">
                        — Dale Rogers, Founder of Aegrid
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle
                      id="traditional-cmms"
                      className="flex items-center gap-2"
                    >
                      <Shield className="w-5 h-5 text-orange-600" />
                      Why Traditional CMMS Creates Brittleness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Computerised Maintenance Management Systems (CMMS) were
                      designed for the industrial era, treating assets as
                      isolated objects rather than components of interconnected
                      systems. This creates several critical weaknesses:
                    </p>
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                      <li>
                        Assets are managed in silos, missing critical
                        interdependencies
                      </li>
                      <li>
                        Maintenance schedules are calendar-based, not risk-based
                      </li>
                      <li>
                        No connection between asset condition and service
                        delivery
                      </li>
                      <li>
                        Limited ability to adapt to changing risk profiles
                      </li>
                      <li>Focus on compliance over resilience</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle
                      id="need-for-resilience"
                      className="flex items-center gap-2"
                    >
                      <Target className="w-5 h-5 text-primary" />
                      The Need for Resilient Asset Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Resilient asset management treats assets as components of
                      critical control systems that enable essential services.
                      This approach recognises that asset management is
                      fundamentally about managing risk to service delivery, not
                      just maintaining physical objects.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="font-semibold mb-2 text-destructive">
                          Traditional Approach
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Asset-centric thinking</li>
                          <li>• Calendar-based maintenance</li>
                          <li>• Reactive problem solving</li>
                          <li>• Compliance-focused</li>
                        </ul>
                      </div>
                      <div className="p-4 border border-primary rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-2 text-primary">
                          Resilient Approach
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Service-centric thinking</li>
                          <li>• Risk-based maintenance</li>
                          <li>• Proactive risk management</li>
                          <li>• Resilience-focused</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-12" />

            {/* The Aegrid Rules */}
            <section id="aegrid-rules" className="mb-12">
              <h2 className="text-3xl font-bold mb-8">
                The Aegrid Rules: A Resilience-First Philosophy
              </h2>

              <div className="space-y-8">
                <Card id="rule-1" className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      Every Asset Has a Purpose
                    </CardTitle>
                    <CardDescription>
                      Structure assets around what they do (their service
                      purpose), not just where they sit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Every asset must have a clearly defined service purpose.
                      Hierarchies or tags should reflect intended function (e.g.
                      mowing, transport, lifting) so value is always visible.
                      Avoid &quot;miscellaneous&quot; or &quot;other&quot;
                      buckets that obscure purpose.
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                        The Critical Control Connection
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                        Every asset in your portfolio should connect to a
                        critical control that prevents a significant hazard or
                        enables a vital service.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">
                              Stormwater pumps
                            </span>
                          </div>
                          <div className="ml-4 text-muted-foreground">
                            → Flood prevention control → Public safety outcome
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">
                              Water treatment filters
                            </span>
                          </div>
                          <div className="ml-4 text-muted-foreground">
                            → Safe drinking water control → Public health
                            outcome
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">Traffic signals</span>
                          </div>
                          <div className="ml-4 text-muted-foreground">
                            → Intersection safety control → Road safety outcome
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">
                              Playground equipment
                            </span>
                          </div>
                          <div className="ml-4 text-muted-foreground">
                            → Child safety control → Community wellbeing outcome
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Implementation Principles:
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          • Function-First Modeling: Every asset must have a
                          clearly defined service purpose
                        </li>
                        <li>
                          • Purpose-Driven Hierarchy: Organise assets by
                          function, not just location or type
                        </li>
                        <li>
                          • Value Visibility: Ensure asset purpose and value
                          contribution are always apparent
                        </li>
                        <li>
                          • No Orphaned Assets: Every asset must serve a defined
                          business function
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">
                        Example: Parks and Recreation Transformation
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">
                            Traditional Approach:
                          </h5>
                          <ul className="text-muted-foreground space-y-1 ml-4">
                            <li>
                              • 500 individual playground items scheduled for
                              inspection
                            </li>
                            <li>
                              • No connection between maintenance and safety
                              outcomes
                            </li>
                            <li>
                              • Equal treatment of high-risk and low-risk
                              equipment
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">
                            Aegrid Approach:
                          </h5>
                          <div className="text-muted-foreground ml-4">
                            <div className="font-medium mb-1">
                              Child Safety Control System with three risk tiers:
                            </div>
                            <ul className="space-y-1">
                              <li>
                                •{' '}
                                <span className="font-medium text-red-600">
                                  Critical:
                                </span>{' '}
                                Equipment that could cause serious injury
                                (climbing structures &gt;2m, moving parts)
                              </li>
                              <li>
                                •{' '}
                                <span className="font-medium text-orange-600">
                                  Important:
                                </span>{' '}
                                Equipment with moderate injury potential
                                (swings, slides)
                              </li>
                              <li>
                                •{' '}
                                <span className="font-medium text-green-600">
                                  Standard:
                                </span>{' '}
                                Equipment with low injury potential (spring
                                riders, benches)
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card id="rule-2" className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      Risk Sets the Rhythm
                    </CardTitle>
                    <CardDescription>
                      Match maintenance to risk → Criticality-driven grouping
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Asset hierarchy should enable risk-based maintenance by
                      clearly tagging/structuring criticality, failure modes,
                      and service impact. Allow grouping by condition, risk, and
                      performance, not just asset type or location.
                    </p>

                    <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                      <h4 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">
                        Risk-Based Resource Allocation
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h5 className="font-medium text-red-700 dark:text-red-300">
                            High-Risk Controls (Intensive Rhythm)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Consequence: Service disruption, safety hazard,
                              regulatory breach
                            </li>
                            <li>
                              • Cadence: Continuous monitoring, frequent
                              inspection, predictive maintenance
                            </li>
                            <li>
                              • Budget: Premium resources, immediate response
                              capability
                            </li>
                            <li>
                              • Example: Critical water treatment equipment,
                              major bridge structures
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-orange-700 dark:text-orange-300">
                            Medium-Risk Controls (Moderate Rhythm)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Consequence: Service degradation, minor safety
                              issues, customer complaints
                            </li>
                            <li>
                              • Cadence: Regular inspection, condition-based
                              maintenance
                            </li>
                            <li>
                              • Budget: Standard resources, planned response
                            </li>
                            <li>
                              • Example: Traffic signals, community facilities,
                              fleet vehicles
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-700 dark:text-green-300">
                            Low-Risk Controls (Minimal Rhythm)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Consequence: Aesthetic issues, minor
                              inconvenience
                            </li>
                            <li>
                              • Cadence: Periodic inspection, run-to-failure
                              acceptable
                            </li>
                            <li>
                              • Budget: Minimal resources, deferred response
                              acceptable
                            </li>
                            <li>
                              • Example: Park benches, decorative features,
                              low-traffic amenities
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Implementation Principles:
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          • Risk-Based Prioritisation: Maintenance frequency and
                          methods based on asset criticality
                        </li>
                        <li>
                          • Failure Mode Analysis: Document and track potential
                          failure modes for each asset
                        </li>
                        <li>
                          • Service Impact Assessment: Understand consequences
                          of asset failure
                        </li>
                        <li>
                          • RCM-Lite Integration: Support reliability-centered
                          maintenance approaches
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                        Seasonal Risk Rebalancing Example: Stormwater Management
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h5 className="font-medium text-blue-800 dark:text-blue-200">
                            Dry Season (Low Risk Period)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Consequence: Moderate (localized flooding)
                            </li>
                            <li>• Likelihood: Low (no significant rainfall)</li>
                            <li>
                              • Rhythm: Quarterly inspection, annual cleaning
                            </li>
                            <li>
                              • Resource Allocation: 20% of stormwater budget
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-orange-800 dark:text-orange-200">
                            Pre-Wet Season (High Risk Period)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Consequence: High (major flooding, property
                              damage)
                            </li>
                            <li>
                              • Likelihood: High (storm season approaching)
                            </li>
                            <li>
                              • Rhythm: Monthly inspection, immediate cleaning
                            </li>
                            <li>
                              • Resource Allocation: 60% of stormwater budget
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-red-800 dark:text-red-200">
                            Storm Season (Critical Risk Period)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Consequence: Very High (life safety, major
                              infrastructure damage)
                            </li>
                            <li>
                              • Likelihood: Very High (active storm systems)
                            </li>
                            <li>
                              • Rhythm: Continuous monitoring, immediate
                              response
                            </li>
                            <li>
                              • Resource Allocation: 20% of stormwater budget
                              (emergency response)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card id="rule-3" className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      Respond to the Real World
                    </CardTitle>
                    <CardDescription>
                      Treat plans as hypotheses and roll with the punches and reallocate resources when
                      risk signals change.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Asset management plans should be living documents that
                      adapt to changing conditions. Build systems that can
                      detect risk signals and automatically adjust maintenance
                      priorities and resource allocation.
                    </p>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold mb-2 text-green-900 dark:text-green-100">
                        Signals That Trigger Adaptation
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h5 className="font-medium text-blue-700 dark:text-blue-300">
                            Condition Signals
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Asset condition deterioration faster than
                              expected
                            </li>
                            <li>
                              • Performance metrics falling below thresholds
                            </li>
                            <li>
                              • Inspection findings revealing unexpected issues
                            </li>
                            <li>
                              • Sensor data indicating abnormal operating
                              conditions
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-orange-700 dark:text-orange-300">
                            Environmental Signals
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Weather patterns changing seasonal risk profiles
                            </li>
                            <li>
                              • Usage patterns shifting due to community changes
                            </li>
                            <li>
                              • Regulatory changes altering compliance
                              requirements
                            </li>
                            <li>
                              • Budget constraints requiring resource
                              reallocation
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-purple-700 dark:text-purple-300">
                            Operational Signals
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Backlog spikes indicating resource shortfalls
                            </li>
                            <li>• SLA breaches showing service degradation</li>
                            <li>• Near misses revealing emerging risks</li>
                            <li>
                              • Staff feedback identifying operational
                              challenges
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                        Rapid Response Framework
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                        <div className="space-y-2">
                          <h5 className="font-medium text-blue-800 dark:text-blue-200">
                            Signal Detection (Continuous)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Automated monitoring systems flag anomalies
                            </li>
                            <li>
                              • Regular condition assessments identify changes
                            </li>
                            <li>
                              • Staff feedback channels capture operational
                              intelligence
                            </li>
                            <li>
                              • Community complaints indicate service issues
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-orange-800 dark:text-orange-200">
                            Impact Assessment (Within 24 hours)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>• Evaluate impact on critical controls</li>
                            <li>• Assess resource requirements for response</li>
                            <li>• Identify potential cascade effects</li>
                            <li>• Determine urgency and priority level</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-800 dark:text-green-200">
                            Resource Reallocation (Within 48 hours)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Redirect maintenance crews to emerging
                              priorities
                            </li>
                            <li>
                              • Reallocate budget from lower-risk activities
                            </li>
                            <li>
                              • Deploy emergency response protocols if needed
                            </li>
                            <li>• Communicate changes to stakeholders</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-purple-800 dark:text-purple-200">
                            Plan Update (Within 1 week)
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Update maintenance schedules based on new
                              information
                            </li>
                            <li>• Revise risk assessments and priorities</li>
                            <li>• Document lessons learned</li>
                            <li>• Communicate changes to all stakeholders</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Implementation Principles:
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          • Adaptive Planning: Treat maintenance plans as
                          hypotheses to be tested
                        </li>
                        <li>
                          • Signal Detection: Build systems to detect changing
                          risk conditions
                        </li>
                        <li>
                          • Resource Flexibility: Enable rapid reallocation of
                          maintenance resources
                        </li>
                        <li>
                          • Continuous Learning: Use operational data to improve
                          planning accuracy
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card id="rule-4" className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </div>
                      Operate with Margin
                    </CardTitle>
                    <CardDescription>
                      Build practical slack, create room to recover that creates tomorrow&apos;s
                      resilience from today&apos;s actions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Build practical slack, create room to recover into your asset management system.
                      This means maintaining spare capacity, having backup
                      systems, and building in time buffers that allow the
                      system to absorb shocks and continue operating.
                    </p>

                    <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
                        Types of Margin in Asset Management
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="space-y-2">
                          <h5 className="font-medium text-blue-700 dark:text-blue-300">
                            Time Margin
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Protected crew hours each week for emergent risk
                              work
                            </li>
                            <li>
                              • Buffer time in maintenance schedules for
                              unexpected complexity
                            </li>
                            <li>
                              • Advance scheduling that allows for weather
                              delays or equipment failures
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-700 dark:text-green-300">
                            Capacity Margin
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Redundancy/failover on the critical path (N+1
                              for controls that prevent major hazards)
                            </li>
                            <li>
                              • Cross-trained staff who can work across
                              different asset types
                            </li>
                            <li>
                              • Surge capacity agreements with contractors for
                              peak demand periods
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-orange-700 dark:text-orange-300">
                            Material Margin
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Critical spares for high-consequence assets
                              (min–max with review on demand signals)
                            </li>
                            <li>
                              • Pre-kitted jobs: parts + permits + procedures
                              bundled for rapid deployment
                            </li>
                            <li>
                              • Strategic inventory positioned near critical
                              assets
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-purple-700 dark:text-purple-300">
                            Financial Margin
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Pre-approved change windows and contingency
                              budget for rapid rebalancing
                            </li>
                            <li>
                              • Emergency response budget separate from routine
                              maintenance
                            </li>
                            <li>
                              • Reserve funds for unexpected critical repairs
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                        Example: Water Treatment Plant Resilience
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <h5 className="font-medium text-red-700 dark:text-red-300 mb-2">
                            Traditional Approach:
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Single pump per critical process (efficient but
                              brittle)
                            </li>
                            <li>
                              • Just-in-time parts delivery (no inventory
                              &quot;waste&quot;)
                            </li>
                            <li>
                              • Fully utilized maintenance staff (maximum
                              efficiency)
                            </li>
                            <li>
                              • Fixed maintenance schedules (predictable but
                              inflexible)
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">
                            Aegrid Approach:
                          </h5>
                          <div className="space-y-3">
                            <div>
                              <div className="font-medium text-blue-800 dark:text-blue-200">
                                Capacity Margin:
                              </div>
                              <ul className="text-muted-foreground space-y-1 text-xs ml-2">
                                <li>
                                  • N+1 Redundancy: Two pumps per critical
                                  process, one running, one standby
                                </li>
                                <li>
                                  • Cross-trained operators: Staff qualified on
                                  multiple systems
                                </li>
                                <li>
                                  • Protected maintenance hours: 20% of crew
                                  time reserved for emergent work
                                </li>
                              </ul>
                            </div>
                            <div>
                              <div className="font-medium text-orange-800 dark:text-orange-200">
                                Material Margin:
                              </div>
                              <ul className="text-muted-foreground space-y-1 text-xs ml-2">
                                <li>
                                  • Critical spares: Pump impellers, motor
                                  bearings, control components in stock
                                </li>
                                <li>
                                  • Pre-kitted repairs: Common failure modes
                                  have parts and procedures ready
                                </li>
                                <li>
                                  • Supplier agreements: 24-hour delivery
                                  guarantee for emergency parts
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Implementation Principles:
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          • Spare Capacity: Maintain backup assets and systems
                        </li>
                        <li>
                          • Time Buffers: Build scheduling flexibility into
                          maintenance plans
                        </li>
                        <li>
                          • Resource Reserves: Maintain contingency budgets and
                          personnel
                        </li>
                        <li>
                          • Future-Proofing: Design systems that can adapt to
                          changing requirements
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-12" />

            {/* Implementation */}
            <section id="implementation" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">
                Building Resilient Asset Management
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle>
                    From Reactive to Resilient: A Transformation Framework
                  </CardTitle>
                  <CardDescription>
                    A practical approach to implementing The Aegrid Rules in
                    your organisation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                            1
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                          Phase 1: Foundation (Months 1-3)
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">
                            Establish Critical Control Mapping
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Identify the top 10 critical controls in your
                              organization
                            </li>
                            <li>
                              • Map assets that enable each critical control
                            </li>
                            <li>
                              • Assess current risk exposure for each control
                            </li>
                            <li>
                              • Create simple dashboards showing control health
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">
                            Build Signal Detection Capability
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Implement basic condition monitoring for
                              critical assets
                            </li>
                            <li>
                              • Establish feedback channels from operational
                              staff
                            </li>
                            <li>
                              • Create simple alert systems for threshold
                              breaches
                            </li>
                            <li>
                              • Begin collecting baseline performance data
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">
                            Create Initial Margin
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Reserve 10% of maintenance crew time for
                              emergent work
                            </li>
                            <li>
                              • Establish minimum spare parts inventory for
                              critical assets
                            </li>
                            <li>
                              • Create emergency response budget (5% of annual
                              maintenance budget)
                            </li>
                            <li>• Cross-train key staff on critical systems</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                            2
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
                          Phase 2: Expansion (Months 4-9)
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-800 dark:text-green-200">
                            Implement Risk-Based Rhythms
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Develop risk matrices for all critical controls
                            </li>
                            <li>
                              • Adjust maintenance frequencies based on risk
                              levels
                            </li>
                            <li>
                              • Create seasonal risk profiles and adaptive
                              schedules
                            </li>
                            <li>
                              • Implement predictive maintenance for high-risk
                              assets
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-800 dark:text-green-200">
                            Enhance Adaptive Capacity
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Develop rapid response protocols for common
                              scenarios
                            </li>
                            <li>
                              • Create flexible resource allocation procedures
                            </li>
                            <li>
                              • Implement mobile technology for real-time
                              communication
                            </li>
                            <li>
                              • Establish performance dashboards for
                              decision-making
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-800 dark:text-green-200">
                            Scale Margin Operations
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Expand redundancy for critical control systems
                            </li>
                            <li>• Develop pre-kitted repair capabilities</li>
                            <li>
                              • Create surge capacity agreements with
                              contractors
                            </li>
                            <li>
                              • Build comprehensive emergency response
                              capabilities
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                            3
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
                          Phase 3: Optimization (Months 10-18)
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-medium text-purple-800 dark:text-purple-200">
                            Full System Integration
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Integrate all assets into critical control
                              framework
                            </li>
                            <li>
                              • Implement advanced analytics for signal
                              detection
                            </li>
                            <li>
                              • Create automated resource reallocation
                              capabilities
                            </li>
                            <li>• Develop comprehensive resilience metrics</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-purple-800 dark:text-purple-200">
                            Continuous Improvement
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Establish regular system performance reviews
                            </li>
                            <li>• Implement lessons learned processes</li>
                            <li>
                              • Create innovation programs for resilience
                              enhancement
                            </li>
                            <li>
                              • Develop staff expertise in resilient asset
                              management
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-purple-800 dark:text-purple-200">
                            Cultural Transformation
                          </h4>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • Shift performance metrics from efficiency to
                              resilience
                            </li>
                            <li>• Train all staff in Aegrid principles</li>
                            <li>
                              • Create incentive systems that reward adaptive
                              behavior
                            </li>
                            <li>
                              • Establish resilience as core organizational
                              value
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-12" />

            {/* Case Studies */}
            <section id="case-studies" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Case Studies</h2>

              <div className="space-y-8">
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          1
                        </span>
                      </div>
                      Case Study 1: Critical Control Transformation in Water
                      Utilities
                    </CardTitle>
                    <CardDescription>
                      Regional water utility serving 150,000 customers with
                      aging infrastructure and increasing regulatory pressure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Challenge:</h4>
                      <p className="text-sm text-muted-foreground">
                        Traditional CMMS focused on individual asset maintenance
                        with no connection to service outcomes. Multiple service
                        disruptions due to cascading failures. Regulatory
                        compliance issues due to reactive approach.
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">
                        Aegrid Implementation:
                      </h4>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                            Rule 1 - Every Asset Has a Purpose:
                          </h5>
                          <p className="text-muted-foreground mb-2">
                            Mapped all assets to four critical controls:
                          </p>
                          <ul className="text-muted-foreground space-y-1 ml-4">
                            <li>
                              • <strong>Safe Drinking Water Control:</strong>{' '}
                              Treatment plant, distribution pumps, monitoring
                              systems
                            </li>
                            <li>
                              • <strong>Reliable Supply Control:</strong> Source
                              infrastructure, storage tanks, main distribution
                              lines
                            </li>
                            <li>
                              •{' '}
                              <strong>Environmental Protection Control:</strong>{' '}
                              Wastewater treatment, discharge monitoring, spill
                              prevention
                            </li>
                            <li>
                              • <strong>Emergency Response Control:</strong>{' '}
                              Backup systems, communication networks, mobile
                              equipment
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                            Rule 2 - Risk Sets the Rhythm:
                          </h5>
                          <ul className="text-muted-foreground space-y-1 ml-4">
                            <li>
                              •{' '}
                              <strong>
                                Critical Assets (Daily monitoring):
                              </strong>{' '}
                              Primary treatment systems, main distribution pumps
                            </li>
                            <li>
                              •{' '}
                              <strong>
                                Important Assets (Weekly monitoring):
                              </strong>{' '}
                              Secondary treatment, distribution networks
                            </li>
                            <li>
                              •{' '}
                              <strong>
                                Standard Assets (Monthly monitoring):
                              </strong>{' '}
                              Administrative facilities, non-critical equipment
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                            Rule 3 - Respond to the Real World:
                          </h5>
                          <ul className="text-muted-foreground space-y-1 ml-4">
                            <li>
                              • Implemented real-time water quality monitoring
                              with automated alerts
                            </li>
                            <li>
                              • Created rapid response teams that can be
                              deployed within 2 hours
                            </li>
                            <li>
                              • Established flexible maintenance schedules that
                              adapt to seasonal demand
                            </li>
                            <li>
                              • Developed community communication protocols for
                              service disruptions
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                            Rule 4 - Operate with Margin:
                          </h5>
                          <ul className="text-muted-foreground space-y-1 ml-4">
                            <li>
                              • Installed N+1 redundancy for all critical
                              pumping systems
                            </li>
                            <li>
                              • Created 72-hour emergency parts inventory for
                              critical components
                            </li>
                            <li>
                              • Established 24/7 on-call capability with
                              cross-trained operators
                            </li>
                            <li>
                              • Built 15% buffer capacity into treatment and
                              distribution systems
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">
                        Results After 18 Months:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            99.8%
                          </div>
                          <div className="text-muted-foreground">
                            Service Reliability
                          </div>
                          <div className="text-xs text-muted-foreground">
                            (up from 97.2%)
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            Zero
                          </div>
                          <div className="text-muted-foreground">
                            Regulatory Violations
                          </div>
                          <div className="text-xs text-muted-foreground">
                            (down from 12 annual)
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            45 min
                          </div>
                          <div className="text-muted-foreground">
                            Emergency Response
                          </div>
                          <div className="text-xs text-muted-foreground">
                            (down from 4 hours)
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            $2.3M
                          </div>
                          <div className="text-muted-foreground">
                            Annual Cost Savings
                          </div>
                          <div className="text-xs text-muted-foreground">
                            (12% reduction)
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          2
                        </span>
                      </div>
                      Case Study 2: Seasonal Work Levelling Through Signal-Based
                      Rebalancing
                    </CardTitle>
                    <CardDescription>
                      Metropolitan council managing 15,000 hectares of parks and
                      2,500km of roads with extreme seasonal variation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Challenge:</h4>
                      <p className="text-sm text-muted-foreground">
                        Traditional scheduling created resource spikes during
                        spring (mowing) and autumn (leaf collection), leading to
                        service complaints and overtime costs. No ability to
                        adapt to weather variations or changing community needs.
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold mb-3 text-green-900 dark:text-green-100">
                        Seasonal Adaptation Example - Spring Mowing Program:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <h5 className="font-medium text-red-700 dark:text-red-300">
                            Traditional Approach:
                          </h5>
                          <ul className="text-muted-foreground space-y-1 text-xs">
                            <li>
                              • All 2,000 mowing areas scheduled to start same
                              week in September
                            </li>
                            <li>
                              • Fixed weekly frequency regardless of growth
                              rates or usage
                            </li>
                            <li>• No adaptation to weather variations</li>
                            <li>
                              • Result: Resource spikes, service complaints,
                              overtime costs
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium text-green-700 dark:text-green-300">
                            Aegrid Approach:
                          </h5>
                          <div className="space-y-2 text-xs">
                            <div>
                              <div className="font-medium text-blue-800 dark:text-blue-200">
                                Week 1-2 (Early Spring):
                              </div>
                              <div className="text-muted-foreground ml-2">
                                Public safety areas only (road verges, sight
                                lines)
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-blue-800 dark:text-blue-200">
                                Week 3-4 (Growth acceleration):
                              </div>
                              <div className="text-muted-foreground ml-2">
                                Add high-use community areas (CBD parks, sports
                                fields)
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-blue-800 dark:text-blue-200">
                                Week 5-8 (Peak growth):
                              </div>
                              <div className="text-muted-foreground ml-2">
                                Full program deployment with weather-based
                                frequency adjustment
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-blue-800 dark:text-blue-200">
                                Week 9-12 (Growth stabilization):
                              </div>
                              <div className="text-muted-foreground ml-2">
                                Reduce frequency, focus on quality over coverage
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">
                        Results After 12 Months:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            65%
                          </div>
                          <div className="text-muted-foreground">
                            Reduction in Service Complaints
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            Eliminated
                          </div>
                          <div className="text-muted-foreground">
                            Seasonal Overtime
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            89%
                          </div>
                          <div className="text-muted-foreground">
                            Community Satisfaction
                          </div>
                          <div className="text-xs text-muted-foreground">
                            (up from 71%)
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            18%
                          </div>
                          <div className="text-muted-foreground">
                            Cost Reduction
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-12" />

            {/* Conclusion */}
            <section id="conclusion" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Conclusion</h2>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
                    The Path to Resilient Asset Management
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The Aegrid Rules represent a fundamental shift from reactive
                    asset management to proactive critical control management.
                    By focusing on what matters most—the services that
                    communities depend on—organizations can build systems that
                    not only survive disruptions but emerge stronger from them.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                        Key Success Factors
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • Leadership commitment to the critical control
                          mindset
                        </li>
                        <li>
                          • Investment in real-time monitoring and response
                          capabilities
                        </li>
                        <li>
                          • Building organizational capacity for adaptive
                          management
                        </li>
                        <li>
                          • Creating systems that learn and improve from
                          disruptions
                        </li>
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                      <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">
                        Expected Outcomes
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 40-60% reduction in unplanned outages</li>
                        <li>• 25-35% improvement in resource utilization</li>
                        <li>• 50-70% faster recovery from disruptions</li>
                        <li>• 20-30% reduction in total cost of ownership</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold mb-4 text-purple-900 dark:text-purple-100">
                    Building Antifragile Systems
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The ultimate goal is to create antifragile systems that
                    benefit from volatility, randomness, and stressors. This
                    doesn&apos;t mean seeking out problems—it means building
                    systems robust enough to handle whatever the world throws at
                    them while maintaining the capacity to adapt and improve.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                          1
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">Robust</h4>
                      <p className="text-sm text-muted-foreground">
                        Systems that resist breaking under stress
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                          2
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">Resilient</h4>
                      <p className="text-sm text-muted-foreground">
                        Systems that bounce back quickly from disruptions
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                          3
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">Antifragile</h4>
                      <p className="text-sm text-muted-foreground">
                        Systems that get stronger from volatility
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-100">
                    Ready to Transform Your Asset Management?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    The Aegrid Rules are not just theory—they&apos;re a
                    practical framework that has been successfully implemented
                    across different sectors and scales. Start your
                    transformation today by identifying your critical controls
                    and mapping your assets to their service purposes.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Full Whitepaper
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link href="/contact">Start Your Transformation</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-12" />

            {/* About the Author */}
            <section id="about-author" className="mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg">Dale Rogers</h4>
                        <p className="text-muted-foreground">
                          Founder & Service Designer, Aegrid
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dale Rogers brings over 30 years of experience in
                        service design and asset management. Having worked
                        directly with councils across Australia, Dale witnessed
                        firsthand the challenges of reactive maintenance and
                        fragmented systems. This experience led to the
                        development of The Aegrid Rules—four fundamental
                        principles that transform how organisations approach
                        asset management.
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <a
                          href="https://linkedin.com/in/dale-rogers"
                          className="text-primary hover:underline"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="mailto:dale@aegrid.au"
                          className="text-primary hover:underline"
                        >
                          dale@aegrid.au
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
