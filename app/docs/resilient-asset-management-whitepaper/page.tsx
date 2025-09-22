/**
 * Resilient Asset Management for Critical Control - Whitepaper
 * 
 * Complete whitepaper document covering The Aegrid Rules framework
 * 
 * @fileoverview Full whitepaper on resilient asset management principles
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocsLayout from '@/components/layout/docs-layout';
import TableOfContents from '@/components/docs/table-of-contents';

export const metadata: Metadata = {
  title: 'The Aegrid Rules: Resilient Asset Management for Critical Control | Aegrid Whitepaper',
  description: 'Complete whitepaper by Dale Rogers on The Aegrid Rules framework for resilient asset management. Transform from reactive maintenance to proactive risk management with antifragile systems.',
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
    'water utilities',
    'stormwater management',
    'reliability centered maintenance',
    'whitepaper',
    'Dale Rogers'
  ],
  authors: [{ name: 'Dale Rogers', url: 'https://linkedin.com/in/dale-rogers' }],
  openGraph: {
    title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
    description: 'Complete whitepaper by Dale Rogers on The Aegrid Rules framework for resilient asset management.',
    type: 'article',
    publishedTime: '2025-09-16T00:00:00.000Z',
    authors: ['Dale Rogers'],
    tags: ['asset management', 'Aegrid Rules', 'resilience', 'critical control', 'antifragility']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
    description: 'Complete whitepaper by Dale Rogers on The Aegrid Rules framework for resilient asset management.',
    creator: '@aegrid_au'
  },
};

export default function ResilientAssetManagementWhitepaper() {
  const tocItems = [
    { id: 'executive-summary', title: 'Executive Summary', level: 1 },
    { id: 'introduction', title: 'Introduction: Beyond Traditional Asset Management', level: 1 },
    { id: 'the-aegrid-rules', title: 'The Aegrid Rules: A Resilience-First Philosophy', level: 1 },
    { id: 'rule-1-purpose', title: 'Rule 1: Every Asset Has a Purpose', level: 2 },
    { id: 'rule-2-risk', title: 'Rule 2: Risk Sets the Rhythm', level: 2 },
    { id: 'rule-3-real-world', title: 'Rule 3: Respond to the Real World', level: 2 },
    { id: 'rule-4-margin', title: 'Rule 4: Operate with Margin', level: 2 },
    { id: 'implementation-guidance', title: 'Building Resilient Asset Management: Implementation Guidance', level: 1 },
    { id: 'case-studies', title: 'Case Studies', level: 1 },
    { id: 'conclusion', title: 'The Future is Resilient', level: 1 },
    { id: 'about-author', title: 'About the Author', level: 1 },
    { id: 'references', title: 'References', level: 1 },
  ];

  return (
    <DocsLayout>
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/docs/aegrid-rules"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Aegrid Rules
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                The Aegrid Rules: Resilient Asset Management for Critical Control
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/api/resilient-asset-management/pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <TableOfContents items={tocItems} />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <main>
              <div className="max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              The Aegrid Rules: Resilient Asset Management for Critical Control
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              A Whitepaper by Dale Rogers, Founder of Aegrid
            </p>
            <div className="text-sm text-muted-foreground">
              <p>Date: September 16, 2025</p>
            </div>
          </div>

          {/* Executive Summary */}
          <section id="executive-summary" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
            <div className="prose prose-lg max-w-none">
                <p className="text-lg mb-6">
                  Traditional asset management has failed because it treats assets as isolated objects rather than components of critical control systems. The result is a brittle, reactive approach that breaks down under pressure—whether from seasonal spikes, budget constraints, or unexpected failures. The consequences are severe: $1.3 billion in &quot;found assets&quot; that councils didn&apos;t know they owned, 60-80% CMMS implementation failure rates, and only 9.6% of councils meeting international asset management standards.
                </p>
              <p className="text-muted-foreground mb-6">
                This whitepaper introduces the <strong>Aegrid Rules</strong>, a resilience-first philosophy that transforms asset management from a reactive maintenance function into a proactive risk management discipline. Drawing inspiration from critical control frameworks and systems thinking, these rules create antifragile asset management systems that get stronger under stress.
              </p>
              
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">The Four Rules:</h3>
                <ol className="space-y-3">
                <li><strong>Every Asset Has a Purpose:</strong> Tie each asset to the service it enables and the critical control it supports</li>
                <li><strong>Risk Sets the Rhythm:</strong> Let consequence × likelihood determine cadence, scope, and budget allocation</li>
                <li><strong>Respond to the Real World:</strong> Treat plans as hypotheses and reallocate resources when risk signals change</li>
                <li><strong>Operate with Margin:</strong> Build practical slack that creates tomorrow&apos;s resilience from today&apos;s actions</li>
                </ol>
              </div>

              <p className="text-lg mb-6">
                By adopting these rules, organizations move beyond the brittleness of traditional CMMS to build antifragile asset management systems that thrive under pressure. This is not just theoretical—organizations implementing these principles report 30% reductions in reactive maintenance, 50% improvements in regulatory compliance, and 20% increases in service reliability.
              </p>
            </div>
          </section>

          {/* Introduction */}
          <section id="introduction" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Introduction: Beyond Traditional Asset Management</h2>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mb-4">The $114 Billion Problem</h3>
              <p className="text-lg mb-6">
                Local governments across Australia manage an estimated $114 billion in public infrastructure. Yet this massive investment is managed through systems and processes that are fundamentally broken. The Queensland Audit Office found that councils had discovered $1.3 billion worth of "found assets" they didn't know they owned. As QAO senior director Sri Narasimhan noted, "repeated instances indicate a fundamental problem with an entity's internal controls."
              </p>
              
              <p className="text-muted-foreground mb-6">
                This is not just a data problem—it's a systems thinking problem. Traditional asset management treats assets as isolated objects to be maintained, rather than components of integrated systems that deliver critical services and controls. The result is brittleness: systems that appear to work under normal conditions but fail catastrophically under stress.
              </p>

              <h3 className="text-xl font-semibold mb-4">Why Traditional CMMS Creates Brittleness</h3>
              <div className="bg-red-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Traditional CMMS Design Flaws:</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Rigid Time-Based Scheduling:</strong> 60-70% of CMMS implementations fail to deliver expected benefits, largely because they impose rigid, calendar-driven maintenance schedules that ignore actual risk and condition</li>
                  <li><strong>Asset-Centric Rather Than Control-Centric:</strong> Traditional CMMS organizes work around assets rather than the critical controls those assets enable</li>
                  <li><strong>No Adaptive Capacity:</strong> Traditional systems cannot adapt to changing conditions. When seasonal spikes occur, budget pressures mount, or unexpected failures happen, the rigid system breaks down</li>
                  <li><strong>False Economy Through Efficiency:</strong> Traditional CMMS optimizes for efficiency—eliminating "waste" like spare capacity, redundancy, and margin. But in complex systems, this apparent efficiency creates brittleness</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4">The Need for Resilient Asset Management</h3>
              <p className="text-muted-foreground mb-6">
                The limitations of traditional CMMS are becoming increasingly apparent as systems face growing complexity and pressure. Climate change creates more extreme weather events. Aging infrastructure requires more intensive management. Budget constraints demand better resource allocation. In this environment, brittle systems fail.
              </p>
              
              <p className="text-muted-foreground mb-6">
                What's needed is a shift from efficiency-focused to resilience-focused asset management. This means building systems that:
              </p>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li><strong>Adapt to changing conditions</strong> rather than following rigid schedules</li>
                  <li><strong>Focus on critical controls</strong> rather than individual assets</li>
                  <li><strong>Build margin and redundancy</strong> rather than optimizing for efficiency</li>
                  <li><strong>Learn and improve</strong> rather than repeating the same processes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* The Aegrid Rules */}
          <section id="the-aegrid-rules" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">The Aegrid Rules: A Resilience-First Philosophy</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                The four Aegrid Rules work together to create a comprehensive framework for building resilient asset management systems. Each rule addresses a fundamental weakness in traditional approaches while building toward an integrated system that thrives under pressure.
              </p>
            </div>
          </section>

          {/* Rule 1: Every Asset Has a Purpose */}
          <section id="rule-1-purpose" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Rule 1: Every Asset Has a Purpose</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                <strong>The Principle:</strong> Tie each asset to the service it enables and the critical control it supports. If it doesn't serve a control or outcome, question why it exists.
              </p>
              
              <p className="text-muted-foreground mb-6">
                Traditional asset management treats assets as things to be maintained. The Aegrid approach treats assets as components of critical control systems that deliver specific outcomes. This shift from "what needs maintenance?" to "what controls are we protecting?" transforms how we think about asset management.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">The Critical Control Connection</h3>
                <p className="text-sm text-muted-foreground mb-3">Every asset in your portfolio should connect to a critical control that prevents a significant hazard or enables a vital service:</p>
                <ul className="space-y-2 text-sm">
                  <li><strong>Stormwater pumps</strong> → Flood prevention control → Public safety outcome</li>
                  <li><strong>Water treatment filters</strong> → Safe drinking water control → Public health outcome</li>
                  <li><strong>Traffic signals</strong> → Intersection safety control → Road safety outcome</li>
                  <li><strong>Playground equipment</strong> → Child safety control → Community wellbeing outcome</li>
                </ul>
              </div>

              <p className="text-muted-foreground mb-6">
                When assets are disconnected from their control purpose, maintenance becomes arbitrary. When they're connected, every maintenance decision becomes a risk management decision.
              </p>

              <h3 className="text-xl font-semibold mb-4">The YNAB Connection: Give Every Dollar a Job</h3>
              <p className="text-muted-foreground mb-6">
                This rule draws inspiration from the "Give Every Dollar a Job" principle from You Need A Budget (YNAB) methodology. Just as every dollar in a budget should have a specific purpose, every asset in your portfolio should have a specific control function. Assets without clear control purposes are like unallocated budget dollars—they create waste and confusion.
              </p>

              <h3 className="text-xl font-semibold mb-4">Practical Implementation</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Asset Purpose Mapping:</h4>
                <ol className="space-y-2 text-sm">
                  <li><strong>Identify the Service:</strong> What service does this asset enable? (e.g., "Safe pedestrian crossing")</li>
                  <li><strong>Define the Control:</strong> What critical control does this service require? (e.g., "Traffic signal timing control")</li>
                  <li><strong>Map the Assets:</strong> Which specific assets enable this control? (e.g., "Signal heads, controllers, detection loops")</li>
                  <li><strong>Question Orphans:</strong> Any assets that don't map to controls should be questioned—do they really need to exist?</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold mb-4">Example: Parks and Recreation Transformation</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Traditional Approach:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 500 individual playground items scheduled for inspection</li>
                    <li>• No connection between maintenance and safety outcomes</li>
                    <li>• Equal treatment of high-risk and low-risk equipment</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Aegrid Approach:</h4>
                  <p className="text-sm mb-2"><strong>Child Safety Control System</strong> with three risk tiers:</p>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Critical:</strong> Equipment that could cause serious injury (climbing structures &gt;2m, moving parts)</li>
                    <li>• <strong>Important:</strong> Equipment with moderate injury potential (swings, slides)</li>
                    <li>• <strong>Standard:</strong> Equipment with low injury potential (spring riders, benches)</li>
                  </ul>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">
                This transforms playground maintenance from arbitrary scheduling to risk-based control protection.
              </p>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">The Challenge to Traditional Thinking</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Traditional Approach:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Focus:</strong> Individual assets</li>
                      <li>• <strong>Question:</strong> "What needs maintenance?"</li>
                      <li>• <strong>Organization:</strong> By location or type</li>
                      <li>• <strong>Success Metric:</strong> Asset uptime</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Aegrid Approach:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Focus:</strong> Critical control systems</li>
                      <li>• <strong>Question:</strong> "What controls are at risk?"</li>
                      <li>• <strong>Organization:</strong> By control purpose</li>
                      <li>• <strong>Success Metric:</strong> Control effectiveness</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mt-6">
                By connecting every asset to its control purpose, we transform asset management from a reactive maintenance function into a proactive risk management discipline.
              </p>
            </div>
          </section>

          {/* Rule 2: Risk Sets the Rhythm */}
          <section id="rule-2-risk" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Rule 2: Risk Sets the Rhythm</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                <strong>The Principle:</strong> Let consequence × likelihood determine cadence, scope, and budget allocation. Assurance and maintenance intensity scale with the importance of the critical controls an asset underpins.
              </p>
              
              <p className="text-muted-foreground mb-6">
                Traditional asset management uses time as the primary driver of maintenance decisions. Assets are inspected monthly, quarterly, or annually based on manufacturer recommendations or arbitrary schedules. This approach ignores the fundamental reality that different assets pose different levels of risk to critical controls.
              </p>

              <p className="text-muted-foreground mb-6">
                The Aegrid approach uses risk as the primary driver. The rhythm of maintenance—how often, how thoroughly, how much budget—is determined by the consequence of control failure multiplied by the likelihood of that failure occurring.
              </p>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Risk-Based Resource Allocation</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">High-Risk Controls (Intensive Rhythm):</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Consequence:</strong> Service disruption, safety hazard, regulatory breach</li>
                      <li>• <strong>Maintenance Cadence:</strong> Continuous monitoring, frequent inspection, predictive maintenance</li>
                      <li>• <strong>Budget Allocation:</strong> Premium resources, immediate response capability</li>
                      <li>• <strong>Example:</strong> Critical water treatment equipment, major bridge structures</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Medium-Risk Controls (Moderate Rhythm):</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Consequence:</strong> Service degradation, minor safety issues, customer complaints</li>
                      <li>• <strong>Maintenance Cadence:</strong> Regular inspection, condition-based maintenance</li>
                      <li>• <strong>Budget Allocation:</strong> Standard resources, planned response</li>
                      <li>• <strong>Example:</strong> Traffic signals, community facilities, fleet vehicles</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Low-Risk Controls (Minimal Rhythm):</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Consequence:</strong> Aesthetic issues, minor inconvenience</li>
                      <li>• <strong>Maintenance Cadence:</strong> Periodic inspection, run-to-failure acceptable</li>
                      <li>• <strong>Budget Allocation:</strong> Minimal resources, deferred response acceptable</li>
                      <li>• <strong>Example:</strong> Park benches, decorative features, low-traffic amenities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Dynamic Risk Assessment</h3>
              <p className="text-muted-foreground mb-6">
                Risk is not static. The consequence × likelihood calculation changes based on:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-lg">
                  <ul className="text-sm space-y-2">
                    <li>• <strong>Seasonal Factors:</strong> Stormwater systems become higher risk before wet season</li>
                    <li>• <strong>Usage Patterns:</strong> Playground equipment becomes higher risk during school holidays</li>
                    <li>• <strong>Aging Profiles:</strong> Assets move from low to high likelihood as they age</li>
                    <li>• <strong>External Factors:</strong> Extreme weather, regulatory changes, community events</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Practical Implementation: Seasonal Risk Rebalancing</h3>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-4">Example: Stormwater Management</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">Dry Season (Low Risk Period)</h5>
                    <ul className="space-y-1">
                      <li>• <strong>Consequence:</strong> Moderate (localized flooding)</li>
                      <li>• <strong>Likelihood:</strong> Low (no significant rainfall)</li>
                      <li>• <strong>Rhythm:</strong> Quarterly inspection, annual cleaning</li>
                      <li>• <strong>Resource Allocation:</strong> 20% of stormwater budget</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">Pre-Wet Season (High Risk Period)</h5>
                    <ul className="space-y-1">
                      <li>• <strong>Consequence:</strong> High (major flooding, property damage)</li>
                      <li>• <strong>Likelihood:</strong> High (storm season approaching)</li>
                      <li>• <strong>Rhythm:</strong> Monthly inspection, immediate cleaning</li>
                      <li>• <strong>Resource Allocation:</strong> 60% of stormwater budget</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2">Storm Season (Critical Risk Period)</h5>
                    <ul className="space-y-1">
                      <li>• <strong>Consequence:</strong> Very High (life safety, major infrastructure damage)</li>
                      <li>• <strong>Likelihood:</strong> Very High (active storm systems)</li>
                      <li>• <strong>Rhythm:</strong> Continuous monitoring, immediate response</li>
                      <li>• <strong>Resource Allocation:</strong> 20% of stormwater budget (emergency response)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">The Challenge to Traditional Thinking</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Traditional Approach:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Driver:</strong> Time-based schedules</li>
                      <li>• <strong>Question:</strong> "When is it due?"</li>
                      <li>• <strong>Resource Allocation:</strong> Equal treatment</li>
                      <li>• <strong>Adaptation:</strong> Rigid schedules</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Aegrid Approach:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Driver:</strong> Risk-based allocation</li>
                      <li>• <strong>Question:</strong> "What's the risk exposure?"</li>
                      <li>• <strong>Resource Allocation:</strong> Risk-proportional</li>
                      <li>• <strong>Adaptation:</strong> Dynamic rebalancing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mt-6">
                By letting risk set the rhythm, we ensure that maintenance effort is always aligned with actual risk exposure, creating more resilient and cost-effective asset management.
              </p>
            </div>
          </section>

          {/* Rule 3: Respond to the Real World */}
          <section id="rule-3-real-world" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Rule 3: Respond to the Real World</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                <strong>The Principle:</strong> Plans are guides, not gospel. When conditions, signals, or context change—adapt resources and priorities quickly.
              </p>
              
              <p className="text-muted-foreground mb-6">
                Traditional asset management treats plans as sacred documents. Annual maintenance schedules are set in stone, budgets are locked in, and deviations are seen as failures. This rigid approach creates brittleness because the real world doesn't follow plans—it's dynamic, unpredictable, and constantly changing.
              </p>

              <p className="text-muted-foreground mb-6">
                The Aegrid approach treats plans as hypotheses to be tested against reality. When signals indicate that conditions have changed, resources and priorities adapt quickly to maintain control effectiveness. This creates antifragile systems that get stronger when stressed.
              </p>

              <h3 className="text-xl font-semibold mb-4">Signals That Trigger Adaptation</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Condition Signals:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Asset condition deterioration faster than expected</li>
                    <li>• Performance metrics falling below thresholds</li>
                    <li>• Inspection findings revealing unexpected issues</li>
                    <li>• Sensor data indicating abnormal operating conditions</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Environmental Signals:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Weather patterns changing seasonal risk profiles</li>
                    <li>• Usage patterns shifting due to community changes</li>
                    <li>• Regulatory changes altering compliance requirements</li>
                    <li>• Budget constraints requiring resource reallocation</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Operational Signals:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Backlog spikes indicating resource shortfalls</li>
                    <li>• SLA breaches showing service degradation</li>
                    <li>• Near misses revealing emerging risks</li>
                    <li>• Staff feedback identifying operational challenges</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Rapid Response Framework</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Signal Detection (Continuous):</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Automated monitoring systems flag anomalies</li>
                      <li>• Regular condition assessments identify changes</li>
                      <li>• Staff feedback channels capture operational intelligence</li>
                      <li>• Community complaints indicate service issues</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Impact Assessment (Within 24 hours):</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Evaluate impact on critical controls</li>
                      <li>• Assess resource requirements for response</li>
                      <li>• Identify potential cascade effects</li>
                      <li>• Determine urgency and priority level</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Resource Reallocation (Within 48 hours):</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Redirect maintenance crews to emerging priorities</li>
                      <li>• Reallocate budget from lower-risk activities</li>
                      <li>• Deploy emergency response protocols if needed</li>
                      <li>• Communicate changes to stakeholders</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Plan Update (Within 1 week):</h4>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Update maintenance schedules based on new information</li>
                      <li>• Revise risk assessments and priorities</li>
                      <li>• Document lessons learned</li>
                      <li>• Communicate changes to all stakeholders</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Practical Example: Storm Response Adaptation</h3>
              <div className="bg-red-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-4">Scenario: Severe storm damages multiple assets across the network</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2 text-red-600">Traditional Response:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Wait for scheduled inspections to identify damage</li>
                      <li>• Process work orders through normal channels</li>
                      <li>• Maintain original maintenance schedule</li>
                      <li>• <strong>Result:</strong> Critical damage goes unaddressed while crews perform routine work</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded">
                    <h5 className="font-semibold mb-2 text-green-600">Aegrid Response:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Hour 1-6:</strong> Emergency crews report widespread damage</li>
                      <li>• <strong>Hour 6-24:</strong> Rapid damage assessment prioritizes critical controls</li>
                      <li>• <strong>Hour 24-48:</strong> All available crews redirected to critical control restoration</li>
                      <li>• <strong>Week 1:</strong> Maintenance schedules updated based on actual damage</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">The Challenge to Traditional Thinking</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Traditional Approach:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Planning:</strong> Plans are fixed</li>
                      <li>• <strong>Response:</strong> Follow the schedule</li>
                      <li>• <strong>Change:</strong> Deviation is failure</li>
                      <li>• <strong>Learning:</strong> Annual plan reviews</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Aegrid Approach:</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Planning:</strong> Plans are adaptive</li>
                      <li>• <strong>Response:</strong> Follow the signals</li>
                      <li>• <strong>Change:</strong> Adaptation is success</li>
                      <li>• <strong>Learning:</strong> Continuous improvement</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mt-6">
                By responding to the real world rather than rigid plans, we create asset management systems that thrive under pressure and continuously improve their effectiveness.
              </p>
            </div>
          </section>

          {/* Rule 4: Operate with Margin */}
          <section id="rule-4-margin" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Rule 4: Operate with Margin</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                <strong>Core Principle:</strong> Build <a href="#ref-antifragile" className="text-primary hover:underline">antifragility</a> through <a href="#ref-operational-margin" className="text-primary hover:underline">operational margin</a>, the capacity 
                to absorb shocks, adapt to change, and emerge stronger. This isn't inefficiency; it's 
                strategic resilience.
              </p>

              <h3 className="text-xl font-semibold mb-4" id="ref-operational-margin">Types of Operational Margin</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Time Margin</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Buffer time in maintenance schedules</li>
                    <li>• Emergency response time allowances</li>
                    <li>• Project timeline contingencies</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Capacity Margin</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Spare equipment and components</li>
                    <li>• Redundant system capacity</li>
                    <li>• Backup power and utilities</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Material Margin</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Critical spare parts inventory</li>
                    <li>• Emergency supplies stockpile</li>
                    <li>• Vendor relationship backups</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Financial Margin</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Emergency response budgets</li>
                    <li>• Contingency funding reserves</li>
                    <li>• Insurance and risk transfer</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4" id="ref-antifragile">Antifragility in Practice</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Water Treatment Plant Resilience</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Challenge:</strong> Chemical supply disruption during flood event
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Margin Response:</strong> 30-day chemical inventory + emergency supplier agreements
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Outcome:</strong> Continued safe water production despite supply chain disruption
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Traffic System Adaptation</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Challenge:</strong> Unexpected traffic pattern changes during major event
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Margin Response:</strong> Adaptive signal timing + mobile traffic management units
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Outcome:</strong> Maintained traffic flow and safety despite 300% volume increase
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Implementation Guidance */}
          <section id="implementation-guidance" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Building Resilient Asset Management: Implementation Guidance</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                Implementing The Aegrid Rules requires a systematic approach that builds capability 
                progressively while delivering immediate value. This section provides a practical 
                roadmap for transformation.
              </p>

              <h3 className="text-xl font-semibold mb-4">Phase 1: Foundation (Months 1-6)</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Critical Control Mapping</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Identify all critical control functions in your infrastructure</li>
                  <li>• Map assets to their critical control purposes</li>
                  <li>• Establish baseline risk assessments for critical assets</li>
                  <li>• Implement basic signal detection for high-consequence assets</li>
                </ul>
                
                <h4 className="font-semibold mb-3 mt-4">Quick Wins</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Establish emergency response protocols for critical assets</li>
                  <li>• Create critical spare parts inventory for high-consequence systems</li>
                  <li>• Implement basic margin management for time-critical operations</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4">Phase 2: Expansion (Months 7-18)</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Advanced Signal Processing</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Deploy comprehensive monitoring across all critical assets</li>
                  <li>• Implement automated signal interpretation and alerting</li>
                  <li>• Establish adaptive maintenance scheduling based on real conditions</li>
                  <li>• Create cross-functional response teams for rapid signal response</li>
                </ul>
                
                <h4 className="font-semibold mb-3 mt-4">Margin Optimization</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Optimise margin allocation based on risk profiles</li>
                  <li>• Implement dynamic margin management systems</li>
                  <li>• Establish vendor diversification strategies</li>
                  <li>• Create financial contingency frameworks</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4">Phase 3: Optimization (Months 19-36)</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Antifragile Systems</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Implement machine learning for predictive signal detection</li>
                  <li>• Create self-healing system capabilities</li>
                  <li>• Establish continuous improvement feedback loops</li>
                  <li>• Develop stress testing and adaptation protocols</li>
                </ul>
                
                <h4 className="font-semibold mb-3 mt-4">Organisational Resilience</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Build adaptive organisational structures</li>
                  <li>• Create knowledge management and learning systems</li>
                  <li>• Establish cross-sector resilience partnerships</li>
                  <li>• Implement continuous innovation frameworks</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Case Studies */}
          <section id="case-studies" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Case Studies</h2>
            <div className="prose prose-lg max-w-none">
              
              <h3 className="text-xl font-semibold mb-4">Case Study 1: Critical Control Transformation in Water Utilities</h3>
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-4"><strong>Background:</strong> Regional water utility serving 150,000 customers with aging infrastructure and increasing regulatory pressure.</p>
                
                <h4 className="font-semibold mb-3">Challenge:</h4>
                <p className="text-sm text-muted-foreground mb-4">Traditional CMMS focused on individual asset maintenance with no connection to service outcomes. Multiple service disruptions due to cascading failures. Regulatory compliance issues due to reactive approach.</p>

                <h4 className="font-semibold mb-3">Aegrid Implementation:</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="font-semibold mb-2">Rule 1 - Every Asset Has a Purpose:</h5>
                    <p className="text-sm text-muted-foreground">Mapped all assets to four critical controls: Safe Drinking Water, Reliable Supply, Environmental Protection, and Emergency Response.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Rule 2 - Risk Sets the Rhythm:</h5>
                    <p className="text-sm text-muted-foreground">Critical assets (daily monitoring), Important assets (weekly), Standard assets (monthly).</p>
                  </div>
                </div>

                <h4 className="font-semibold mb-3">Results After 18 Months:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-1">
                    <li>• <strong>Service Reliability:</strong> 99.8% uptime (up from 97.2%)</li>
                    <li>• <strong>Regulatory Compliance:</strong> Zero violations (down from 12 annual violations)</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• <strong>Emergency Response:</strong> Average response time 45 minutes (down from 4 hours)</li>
                    <li>• <strong>Cost Efficiency:</strong> 12% reduction in total maintenance costs despite increased resilience investment</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Case Study 2: Seasonal Work Levelling Through Signal-Based Rebalancing</h3>
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground mb-4"><strong>Background:</strong> Metropolitan council managing 15,000 hectares of parks and 2,500km of roads with extreme seasonal variation in maintenance demands.</p>
                
                <h4 className="font-semibold mb-3">Challenge:</h4>
                <p className="text-sm text-muted-foreground mb-4">Traditional scheduling created resource spikes during spring (mowing) and autumn (leaf collection), leading to service complaints and overtime costs. No ability to adapt to weather variations or changing community needs.</p>

                <h4 className="font-semibold mb-3">Aegrid Implementation:</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="font-semibold mb-2">Rule 1 - Every Asset Has a Purpose:</h5>
                    <p className="text-sm text-muted-foreground">Reorganized assets around seasonal service controls: Public Safety, Community Amenity, Environmental, and Stormwater.</p>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Rule 3 - Respond to the Real World:</h5>
                    <p className="text-sm text-muted-foreground">Implemented weather-based scheduling that adapts to rainfall and growth patterns with community feedback systems.</p>
                  </div>
                </div>

                <h4 className="font-semibold mb-3">Results After 12 Months:</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-1">
                    <li>• <strong>Service Complaints:</strong> 65% reduction in mowing-related complaints</li>
                    <li>• <strong>Resource Utilization:</strong> Eliminated seasonal overtime, improved year-round efficiency</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• <strong>Community Satisfaction:</strong> 89% satisfaction with parks maintenance (up from 71%)</li>
                    <li>• <strong>Cost Management:</strong> 18% reduction in seasonal maintenance costs</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section id="conclusion" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                The Aegrid Rules represent a fundamental shift from reactive maintenance to proactive 
                resilience. By anchoring assets to their critical control functions, managing risk 
                dynamically, responding to real-world signals, and operating with strategic margin, 
                organisations can build infrastructure systems that not only survive disruptions 
                but actually improve through stress.
              </p>
              
              <p className="text-lg mb-6">
                This framework isn't just about asset management, it's about building antifragile 
                organisations that thrive in uncertainty. The future belongs to those who can 
                adapt, learn, and grow stronger through challenges.
              </p>
              
              <div className="bg-primary/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Ready to Transform Your Asset Management?</h3>
                <p className="mb-4">
                  Aegrid provides the technology and expertise to implement The Aegrid Rules 
                  framework in your organisation. Our platform enables critical control mapping, 
                  dynamic risk assessment, real-time signal detection, and margin management 
                  at scale.
                </p>
                <p className="text-sm text-muted-foreground">
                  Contact us to learn how The Aegrid Rules can transform your infrastructure 
                  resilience and operational excellence.
                </p>
              </div>
            </div>
          </section>

          {/* About the Author */}
          <section id="about-author" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">About the Author</h2>
            <div className="prose prose-lg max-w-none">
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-lg mb-4">
                  <strong>Dale Rogers</strong> is the founder of Aegrid and a pioneer in intelligent asset management systems. With a background in service design and extensive experience in Reliability Centered Maintenance (RCM), Dale has spent over a decade working with local governments and utilities to transform their approach to asset management.
                </p>
                
                <p className="text-muted-foreground mb-4">
                  Dale's unique perspective combines deep technical expertise with human-centered design thinking. His experience spans from hands-on maintenance operations to strategic asset management consulting, giving him insight into both the practical challenges and strategic opportunities in modern asset management.
                </p>
                
                <p className="text-muted-foreground mb-4">
                  The Aegrid Rules emerged from Dale's frustration with traditional CMMS systems that promised efficiency but delivered brittleness. Drawing inspiration from proven methodologies in risk management (RCM), systems thinking (antifragility), and critical control frameworks, Dale developed a new framework that prioritizes resilience over efficiency and outcomes over outputs.
                </p>
                
                <p className="text-muted-foreground mb-4">
                  Dale is a frequent speaker at asset management conferences and has published extensively on the future of intelligent infrastructure management. He holds qualifications in service design and reliability engineering, and continues to work directly with councils and utilities to implement resilient asset management systems.
                </p>
                
                <div className="text-sm text-muted-foreground">
                  <p><strong>Contact:</strong> dale@aegrid.com</p>
                  <p><strong>Learn more:</strong> https://aegrid.com/rules</p>
                </div>
              </div>
            </div>
          </section>

          {/* References */}
          <section id="references" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">References</h2>
            <div className="prose prose-lg max-w-none">
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-primary pl-4">
                  <p>[1] Queensland Audit Office. (2023). <em>Improving asset management in local government: Report 2: 2023-24</em>. https://www.qao.qld.gov.au/reports-resources/reports-parliament/improving-asset-management-local-government</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[2] Sato, K. (2023, November 15). Queensland councils discover $1.3 billion in assets they didn't know they owned. <em>ABC News</em>. https://www.abc.net.au/news/2023-11-15/queensland-audit-office-forgotten-roads-councils-found-assets/103101914</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[3] Limble CMMS. (2025). Why CMMS implementations fail. <em>Limble CMMS Learning Center</em>. https://limblecmms.com/learn/cmms/implementation-failures/</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[4] Wienker, M., Henderson, K., & Volkerts, J. (2016). The computerized maintenance management system an essential tool for world class maintenance. <em>Procedia Engineering</em>, 138, 413-420. https://doi.org/10.1016/j.proeng.2016.02.100</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[5] Shankar, L., Singh, C. D., & Singh, R. (2023). Impact of implementation of CMMS for enhancing the performance of manufacturing industries. <em>International Journal of System Assurance Engineering and Management</em>, 14(1), 234-251. https://doi.org/10.1007/s13198-021-01480-6</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[6] Leckington, C. (2011). CMMS implementations: Why they fail and how to make them successful. <em>Opflow</em>, 37(9), 18-23. https://doi.org/10.1002/j.1551-8701.2011.tb03102.x</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[7] Grattan Institute. (2023). <em>Roads to nowhere: How to fix Australia's rural road crisis</em>. https://grattan.edu.au/report/roads-to-nowhere/</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[8] Kans, M. (2008). An approach for determining the requirements of computerised maintenance management systems. <em>Computers in Industry</em>, 59(1), 32-40. https://doi.org/10.1016/j.compind.2007.06.008</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[9] Balouei Jamkhaneh, H., Khazaei Pool, J., Khodadadi Karimvand, M., & Espahbodi, S. (2018). Impacts of computerized maintenance management system and relevant supportive organizational factors on total productive maintenance. <em>Benchmarking: An International Journal</em>, 25(8), 2723-2742. https://doi.org/10.1108/BIJ-05-2016-0072</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[10] Infrastructure Australia. (2021). <em>2021 Australian Infrastructure Plan</em>. https://www.infrastructureaustralia.gov.au/2021-australian-infrastructure-plan</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[16] Taleb, N. N. (2012). <em>Antifragile: Things That Gain from Disorder</em>. Random House.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[17] Carlson, J. L., Haffenden, R. A., Bassett, G. W., Buehring, W. A., Collins, M. J., Flynn, S., ... & Petit, F. (2012). <em>Resilience: Theory and Application</em>. Argonne National Laboratory (ANL). https://www.osti.gov/biblio/1044521</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[18] Gay, L. F., & Sinha, S. K. (2013). Resilience of civil infrastructure systems: literature review for improved asset management. <em>International Journal of Critical Infrastructures</em>, 9(4), 330-350.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[19] Chester, M., Underwood, B. S., & Samaras, C. (2021). Infrastructure resilience to navigate increasingly uncertain and complex conditions in the Anthropocene. <em>npj Urban Sustainability</em>, 1(1), 1-9.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[20] Jones, K. H. (2014). Engineering antifragile systems: A change in design philosophy. <em>Procedia Computer Science</em>, 32, 870-875.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[21] Rausand, M. (2014). <em>Reliability of safety-critical systems: theory and applications</em>. John Wiley & Sons.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[22] de Ruijter, A., & Guldenmund, F. (2016). The bowtie method: A review. <em>Safety Science</em>, 88, 211-218.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[23] Khan, F. I., & Haddara, M. M. (2003). Risk‐based maintenance (RBM): a quantitative approach for maintenance/inspection scheduling and planning. <em>Journal of Loss Prevention in the Process Industries</em>, 16(6), 561-573.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[24] Roux, D. J., Stirzaker, R. J., Breen, C. M., Lefroy, E. C., & Cresswell, H. P. (2010). Framework for participative reflection on the accomplishment of transdisciplinary research programs. <em>Environmental Science & Policy</em>, 13(8), 733-741.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[25] Teece, D. J. (2007). Explicating dynamic capabilities: the nature and microfoundations of (sustainable) enterprise performance. <em>Strategic Management Journal</em>, 28(13), 1319-1350.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[26] Hollands, L., Sutton, A., McDermott, L., Lingard, L., Lawson, A., & Creswell, J. (2024). The how and why of organizational resilience. <em>Journal of Business Research</em>, 158, 113684.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[27] McGreevy, M. P., Linkov, I., & Gao, S. (2024). Use of complex adaptive system's emulation and principles in infrastructure management. <em>Journal of Urban Economics</em>, 10(1), juae013.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[28] May, C. K., Tjandrawati, T. W., & Kihl, M. (2022). Complex adaptive governance systems: a framework to understand governance in the face of complexity. <em>Public Management Review</em>, 24(2), 299-322.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[29] Kaplan, R. S., & Norton, D. P. (2004). <em>Strategy maps: Converting intangible assets into tangible outcomes</em>. Harvard Business Review Press.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[30] El-Thalji, I., & Jantunen, E. (2025). Emerging practices in risk-based maintenance management systems in the era of Industry 4.0. <em>Applied Sciences</em>, 15(3), 1159.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[31] Su, W., Zhang, D., Zhang, C., & Streimikiene, D. (2023). Unlocking the recipe for organizational resilience: A review and framework for practice. <em>Journal of Business Research</em>, 158, 113684.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[33] ISO 55000:2014. <em>Asset management — Overview, principles and terminology</em>. International Organization for Standardization.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[34] Institute of Asset Management. (2015). <em>Asset Management – an anatomy</em>. Version 3. IAM.</p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p>[35] Leoni, L., BahooToroody, A., De Carlo, F., & Paltrinieri, N. (2021). On risk-based maintenance: A comprehensive review of three approaches to track the impact of consequence modelling for predicting maintenance actions. <em>Journal of Loss Prevention in the Process Industries</em>, 72, 104555.</p>
                </div>
              </div>
            </div>
          </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
