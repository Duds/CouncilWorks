/**
 * Enhanced Whitepaper Page - The Aegrid Rules
 *
 * A comprehensive, beautifully designed whitepaper page with modern UI components
 *
 * @fileoverview Full whitepaper presentation with enhanced UX and PDF download
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Download,
  ArrowLeft,
  Share2,
  FileText,
  Users,
  Shield,
  TrendingUp,
  Clock,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import DocsLayout from '@/components/layout/docs-layout';
import TableOfContents from '@/components/docs/table-of-contents';

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
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
                          Treat plans as hypotheses and reallocate resources
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
                          Build practical slack that creates tomorrow&apos;s
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
                      Treat plans as hypotheses and reallocate resources when
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
                      Build practical slack that creates tomorrow&apos;s
                      resilience from today&apos;s actions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Build practical slack into your asset management system.
                      This means maintaining spare capacity, having backup
                      systems, and building in time buffers that allow the
                      system to absorb shocks and continue operating.
                    </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          1
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">Assess</h4>
                      <p className="text-sm text-muted-foreground">
                        Evaluate current asset management maturity and identify
                        critical gaps
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 dark:text-green-400 font-bold">
                          2
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">Design</h4>
                      <p className="text-sm text-muted-foreground">
                        Create resilient asset management framework based on The
                        Aegrid Rules
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-orange-600 dark:text-orange-400 font-bold">
                          3
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">Implement</h4>
                      <p className="text-sm text-muted-foreground">
                        Deploy new systems and processes with pilot programs
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                          4
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">Optimise</h4>
                      <p className="text-sm text-muted-foreground">
                        Continuously improve based on performance data and
                        feedback
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="my-12" />

            {/* Case Studies */}
            <section id="case-studies" className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Case Studies</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Water Utility Transformation
                    </CardTitle>
                    <CardDescription>
                      Critical Control Implementation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A regional water utility implemented The Aegrid Rules to
                      transform their asset management approach, focusing on
                      critical control systems rather than individual assets.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Reduction in emergency repairs:</span>
                        <span className="font-semibold text-green-600">
                          45%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Improvement in regulatory compliance:</span>
                        <span className="font-semibold text-green-600">
                          60%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cost savings:</span>
                        <span className="font-semibold text-green-600">
                          $2.3M annually
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Seasonal Work Levelling
                    </CardTitle>
                    <CardDescription>Signal-Based Rebalancing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      A metropolitan council used Rule 3 (Respond to the Real
                      World) to implement dynamic work scheduling based on
                      weather and demand signals.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Workforce utilisation:</span>
                        <span className="font-semibold text-green-600">
                          +35%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Response time improvement:</span>
                        <span className="font-semibold text-green-600">
                          50%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Employee satisfaction:</span>
                        <span className="font-semibold text-green-600">
                          +25%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="my-12" />

            {/* Conclusion */}
            <section id="conclusion" className="mb-12">
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Conclusion: The Future is Resilient
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">
                    The Aegrid Rules represent a fundamental shift from
                    traditional asset management to resilient, adaptive systems
                    that thrive under pressure. By treating assets as components
                    of critical control systems, organisations can build
                    antifragile infrastructure that gets stronger under stress.
                  </p>
                  <p>
                    The future belongs to organisations that can adapt, learn,
                    and improve continuously. The Aegrid Rules provide the
                    framework for building such organisations, transforming
                    asset management from a cost centre into a strategic
                    advantage.
                  </p>
                  <div className="bg-muted p-4 rounded-lg mt-6">
                    <h4 className="font-semibold mb-2">
                      Ready to Transform Your Asset Management?
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Contact Aegrid to learn how The Aegrid Rules can help your
                      organisation build resilient, adaptive asset management
                      systems.
                    </p>
                    <Button asChild>
                      <Link href="/contact">Start Your Transformation</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                        Dale Rogers brings over 15 years of experience in
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

          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <TableOfContents items={tocItems} />
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
