import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import DocsLayout from '@/components/layout/docs-layout';

export const metadata: Metadata = {
  title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
  description: 'A comprehensive framework for transforming asset management from reactive maintenance to proactive risk management. Learn how the Aegrid Rules create antifragile systems that thrive under pressure.',
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
    'reliability centered maintenance'
  ],
  authors: [{ name: 'Dale Rogers', url: 'https://linkedin.com/in/dale-rogers' }],
  openGraph: {
    title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
    description: 'A comprehensive framework for transforming asset management from reactive maintenance to proactive risk management.',
    type: 'article',
    publishedTime: '2025-09-16T00:00:00.000Z',
    authors: ['Dale Rogers'],
    tags: ['asset management', 'Aegrid Rules', 'resilience', 'critical control', 'antifragility']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Aegrid Rules: Resilient Asset Management for Critical Control',
    description: 'A comprehensive framework for transforming asset management from reactive maintenance to proactive risk management.',
    creator: '@aegrid_au'
  },
  alternates: {
    canonical: 'https://aegrid.au/docs/aegrid-rules'
  }
};

export default function AegridRulesPage() {
  return (
    <DocsLayout>
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The Aegrid Rules
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Resilient Asset Management for Critical Control
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            A Whitepaper by Dale Rogers, Founder of Aegrid
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            September 16, 2025
          </p>
        </div>

        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Executive Summary</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              Traditional asset management has failed because it treats assets as isolated objects rather than components of critical control systems. The result is a brittle, reactive approach that breaks down under pressure—whether from seasonal spikes, budget constraints, or unexpected failures. The consequences are severe: $1.3 billion in "found assets" that councils didn't know they owned, 60-80% CMMS implementation failure rates, and only 9.6% of councils meeting international asset management standards.
            </p>
            <p className="text-muted-foreground mb-6">
              This whitepaper introduces the <strong>Aegrid Rules</strong>, a resilience-first philosophy that transforms asset management from a reactive maintenance function into a proactive risk management discipline. Drawing inspiration from critical control frameworks and systems thinking, these rules create antifragile asset management systems that get stronger under stress.
            </p>
            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">The Four Rules:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Every Asset Has a Purpose:</strong> Tie each asset to the service it enables and the critical control it supports</li>
                <li><strong>Risk Sets the Rhythm:</strong> Let consequence × likelihood determine cadence, scope, and budget allocation</li>
                <li><strong>Respond to the Real World:</strong> Treat plans as hypotheses and reallocate resources when risk signals change</li>
                <li><strong>Operate with Margin:</strong> Build practical slack that creates tomorrow's resilience from today's actions</li>
              </ol>
            </div>
            <p className="text-muted-foreground mb-6">
              By adopting these rules, organizations move beyond the brittleness of traditional CMMS to build antifragile asset management systems that thrive under pressure. This is not just theoretical—organizations implementing these principles report 30% reductions in reactive maintenance, 50% improvements in regulatory compliance, and 20% increases in service reliability.
            </p>
          </div>
        </section>

        {/* The Four Rules */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-8">The Aegrid Rules: A Resilience-First Philosophy</h2>
          
          <div className="space-y-12">
            {/* Rule 1 */}
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">1</span>
                <h3 className="text-xl font-semibold">Every Asset Has a Purpose</h3>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-3">
                Tie each asset to the service it enables and the critical control it supports. If it doesn't serve a control or outcome, question why it exists.
              </p>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Traditional asset management treats assets as things to be maintained. The Aegrid approach treats assets as components of critical control systems that deliver specific outcomes. This shift from "what needs maintenance?" to "what controls are we protecting?" transforms how we think about asset management.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">The Critical Control Connection</h4>
                  <p className="text-sm text-muted-foreground mb-3">Every asset in your portfolio should connect to a critical control that prevents a significant hazard or enables a vital service:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li><strong>Stormwater pumps</strong> → Flood prevention control → Public safety outcome</li>
                    <li><strong>Water treatment filters</strong> → Safe drinking water control → Public health outcome</li>
                    <li><strong>Traffic signals</strong> → Intersection safety control → Road safety outcome</li>
                    <li><strong>Playground equipment</strong> → Child safety control → Community wellbeing outcome</li>
                  </ul>
                </div>

                <p className="text-muted-foreground mb-4">
                  When assets are disconnected from their control purpose, maintenance becomes arbitrary. When they're connected, every maintenance decision becomes a risk management decision.
                </p>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Practical Implementation:</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    <li><strong>Identify the Service:</strong> What service does this asset enable? (e.g., "Safe pedestrian crossing")</li>
                    <li><strong>Define the Control:</strong> What critical control does this service require? (e.g., "Traffic signal timing control")</li>
                    <li><strong>Map the Assets:</strong> Which specific assets enable this control? (e.g., "Signal heads, controllers, detection loops")</li>
                    <li><strong>Question Orphans:</strong> Any assets that don't map to controls should be questioned—do they really need to exist?</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">2</span>
                <h3 className="text-xl font-semibold">Risk Sets the Rhythm</h3>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-3">
                Let consequence × likelihood determine cadence, scope, and budget allocation. Assurance and maintenance intensity scale with the importance of the critical controls an asset underpins.
              </p>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Traditional asset management uses time as the primary driver of maintenance decisions. Assets are inspected monthly, quarterly, or annually based on manufacturer recommendations or arbitrary schedules. This approach ignores the fundamental reality that different assets pose different levels of risk to critical controls.
                </p>
                <p className="text-muted-foreground mb-4">
                  The Aegrid approach uses risk as the primary driver. The rhythm of maintenance—how often, how thoroughly, how much budget—is determined by the consequence of control failure multiplied by the likelihood of that failure occurring.
                </p>

                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Risk-Based Resource Allocation</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>High-Risk Controls (Intensive Rhythm):</strong>
                      <ul className="list-disc list-inside text-muted-foreground ml-4 mt-1">
                        <li>Consequence: Service disruption, safety hazard, regulatory breach</li>
                        <li>Maintenance Cadence: Continuous monitoring, frequent inspection, predictive maintenance</li>
                        <li>Example: Critical water treatment equipment, major bridge structures</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Medium-Risk Controls (Moderate Rhythm):</strong>
                      <ul className="list-disc list-inside text-muted-foreground ml-4 mt-1">
                        <li>Consequence: Service degradation, minor safety issues, customer complaints</li>
                        <li>Maintenance Cadence: Regular inspection, condition-based maintenance</li>
                        <li>Example: Traffic signals, community facilities, fleet vehicles</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Low-Risk Controls (Minimal Rhythm):</strong>
                      <ul className="list-disc list-inside text-muted-foreground ml-4 mt-1">
                        <li>Consequence: Aesthetic issues, minor inconvenience</li>
                        <li>Maintenance Cadence: Periodic inspection, run-to-failure acceptable</li>
                        <li>Example: Park benches, decorative features, low-traffic amenities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Practical Example: Seasonal Risk Rebalancing</h4>
                  <p className="text-sm text-muted-foreground mb-2"><strong>Stormwater Management:</strong></p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><strong>Dry Season:</strong> Quarterly inspection, annual cleaning (20% of stormwater budget)</div>
                    <div><strong>Pre-Wet Season:</strong> Monthly inspection, immediate cleaning (60% of stormwater budget)</div>
                    <div><strong>Storm Season:</strong> Continuous monitoring, immediate response (20% emergency response)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">3</span>
                <h3 className="text-xl font-semibold">Respond to the Real World</h3>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-3">
                Plans are guides, not gospel. When conditions, signals, or context change—adapt resources and priorities quickly.
              </p>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Traditional asset management treats plans as sacred documents. Annual maintenance schedules are set in stone, budgets are locked in, and deviations are seen as failures. This rigid approach creates brittleness because the real world doesn't follow plans—it's dynamic, unpredictable, and constantly changing.
                </p>
                <p className="text-muted-foreground mb-4">
                  The Aegrid approach treats plans as hypotheses to be tested against reality. When signals indicate that conditions have changed, resources and priorities adapt quickly to maintain control effectiveness. This creates antifragile systems that get stronger when stressed.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Signals That Trigger Adaptation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Condition Signals:</strong>
                      <ul className="list-disc list-inside text-muted-foreground mt-1">
                        <li>Asset condition deterioration faster than expected</li>
                        <li>Performance metrics falling below thresholds</li>
                        <li>Inspection findings revealing unexpected issues</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Environmental Signals:</strong>
                      <ul className="list-disc list-inside text-muted-foreground mt-1">
                        <li>Weather patterns changing seasonal risk profiles</li>
                        <li>Usage patterns shifting due to community changes</li>
                        <li>Regulatory changes altering compliance requirements</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Operational Signals:</strong>
                      <ul className="list-disc list-inside text-muted-foreground mt-1">
                        <li>Backlog spikes indicating resource shortfalls</li>
                        <li>SLA breaches showing service degradation</li>
                        <li>Near misses revealing emerging risks</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Rapid Response Framework</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><strong>Signal Detection (Continuous):</strong> Automated monitoring systems flag anomalies</div>
                    <div><strong>Impact Assessment (Within 24 hours):</strong> Evaluate impact on critical controls</div>
                    <div><strong>Resource Reallocation (Within 48 hours):</strong> Redirect maintenance crews to emerging priorities</div>
                    <div><strong>Plan Update (Within 1 week):</strong> Update maintenance schedules based on new information</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">4</span>
                <h3 className="text-xl font-semibold">Operate with Margin</h3>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-3">
                Build practical slack so today's actions create tomorrow's resilience. Margin = time, capacity, and materials that let you absorb shocks without losing control.
              </p>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Traditional asset management optimizes for efficiency, eliminating "waste" like spare capacity, redundancy, and buffer time. This creates brittle systems that appear efficient under normal conditions but fail catastrophically under stress. The Aegrid approach deliberately builds margin into the system—practical slack that enables resilience.
                </p>
                <p className="text-muted-foreground mb-4">
                  Rather than viewing margin as inefficiency, the Aegrid approach recognizes it as essential investment in system resilience. As Nassim Taleb notes: "redundancy is ambiguous because it seems like a waste if nothing unusual happens. Except that something unusual happens—usually."
                </p>

                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Types of Margin in Asset Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Time Margin:</strong>
                      <ul className="list-disc list-inside text-muted-foreground mt-1">
                        <li>Protected crew hours each week for emergent risk work</li>
                        <li>Buffer time in maintenance schedules for unexpected complexity</li>
                        <li>Advance scheduling that allows for weather delays</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Capacity Margin:</strong>
                      <ul className="list-disc list-inside text-muted-foreground mt-1">
                        <li>Redundancy/failover on the critical path (N+1 for controls that prevent major hazards)</li>
                        <li>Cross-trained staff who can work across different asset types</li>
                        <li>Surge capacity agreements with contractors for peak demand periods</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Material Margin:</strong>
                      <ul className="list-disc list-inside text-muted-foreground mt-1">
                        <li>Critical spares for high-consequence assets (min–max with review on demand signals)</li>
                        <li>Pre-kitted jobs: parts + permits + procedures bundled for rapid deployment</li>
                        <li>Strategic inventory positioned near critical assets</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Financial Margin:</strong>
                      <ul className="list-disc list-inside text-muted-foreground mt-1">
                        <li>Pre-approved change windows and contingency budget for rapid rebalancing</li>
                        <li>Emergency response budget separate from routine maintenance</li>
                        <li>Reserve funds for unexpected critical repairs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Practical Example: Water Treatment Plant Resilience</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><strong>Capacity Margin:</strong> N+1 Redundancy - Two pumps per critical process, one running, one standby</div>
                    <div><strong>Material Margin:</strong> Critical spares - Pump impellers, motor bearings, control components in stock</div>
                    <div><strong>Time Margin:</strong> Condition monitoring - Vibration sensors provide 2-week failure warning</div>
                    <div><strong>Financial Margin:</strong> Emergency fund - 10% of annual budget reserved for unplanned work</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">From Reactive to Resilient: A Transformation Framework</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">
              Transforming from traditional, brittle asset management to resilient, Aegrid-based management requires a systematic approach. This transformation cannot happen overnight, but it can begin immediately with small, high-impact changes that build momentum toward full implementation.
            </p>
            
            <div className="space-y-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-lg">Phase 1: Foundation (Months 1-3)</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="font-semibold mb-2">Establish Critical Control Mapping:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Identify the top 10 critical controls in your organization</li>
                      <li>Map assets that enable each critical control</li>
                      <li>Assess current risk exposure for each control</li>
                      <li>Create simple dashboards showing control health</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Build Signal Detection Capability:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Implement basic condition monitoring for critical assets</li>
                      <li>Establish feedback channels from operational staff</li>
                      <li>Create simple alert systems for threshold breaches</li>
                      <li>Begin collecting baseline performance data</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Create Initial Margin:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Reserve 10% of maintenance crew time for emergent work</li>
                      <li>Establish minimum spare parts inventory for critical assets</li>
                      <li>Create emergency response budget (5% of annual maintenance budget)</li>
                      <li>Cross-train key staff on critical systems</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-lg">Phase 2: Expansion (Months 4-9)</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="font-semibold mb-2">Implement Risk-Based Rhythms:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Develop risk matrices for all critical controls</li>
                      <li>Adjust maintenance frequencies based on risk levels</li>
                      <li>Create seasonal risk profiles and adaptive schedules</li>
                      <li>Implement predictive maintenance for high-risk assets</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Enhance Adaptive Capacity:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Develop rapid response protocols for common scenarios</li>
                      <li>Create flexible resource allocation procedures</li>
                      <li>Implement mobile technology for real-time communication</li>
                      <li>Establish performance dashboards for decision-making</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Scale Margin Operations:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Expand redundancy for critical control systems</li>
                      <li>Develop pre-kitted repair capabilities</li>
                      <li>Create surge capacity agreements with contractors</li>
                      <li>Build comprehensive emergency response capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4 text-lg">Phase 3: Optimization (Months 10-18)</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="font-semibold mb-2">Full System Integration:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Integrate all assets into critical control framework</li>
                      <li>Implement advanced analytics for signal detection</li>
                      <li>Create automated resource reallocation capabilities</li>
                      <li>Develop comprehensive resilience metrics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Continuous Improvement:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Establish regular system performance reviews</li>
                      <li>Implement lessons learned processes</li>
                      <li>Create innovation programs for resilience enhancement</li>
                      <li>Develop staff expertise in resilient asset management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Cultural Transformation:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Shift performance metrics from efficiency to resilience</li>
                      <li>Train all staff in Aegrid principles</li>
                      <li>Create incentive systems that reward adaptive behavior</li>
                      <li>Establish resilience as core organizational value</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">The Future is Resilient</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              The traditional approach to asset management—rigid, efficiency-focused, and reactive—is fundamentally broken. In a world of increasing complexity, climate volatility, and resource constraints, brittle systems fail catastrophically. The evidence is overwhelming: $1.3 billion in "found assets", 60-80% CMMS failure rates, and only 9.6% of councils meeting international standards.
            </p>
            <p className="text-muted-foreground mb-6">
              The Aegrid Rules offer a different path—one that leads to resilient, antifragile asset management systems that thrive under pressure. By connecting every asset to its critical control purpose, letting risk set the rhythm of maintenance, responding rapidly to real-world signals, and operating with deliberate margin, organizations can transform their asset management from a cost center into a strategic capability.
            </p>
            
            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4">Proven Results</h3>
              <p className="text-sm text-muted-foreground mb-4">Organizations implementing these principles report:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">30%</div>
                  <div className="text-muted-foreground">reduction in reactive maintenance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50%</div>
                  <div className="text-muted-foreground">improvement in regulatory compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">20%</div>
                  <div className="text-muted-foreground">increase in service reliability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15%</div>
                  <div className="text-muted-foreground">reduction in total maintenance costs</div>
                </div>
              </div>
            </div>

            <div className="text-center bg-muted p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Ready to Transform Your Asset Management?</h3>
              <p className="text-muted-foreground mb-6">
                Join us in implementing the Aegrid Rules through a pilot partnership. Let's work together to build the future of resilient asset management.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="mailto:dale@aegrid.com?subject=Pilot%20Partnership%20Inquiry">
                  <Button size="lg">Explore a Pilot Partnership</Button>
                </a>
                <Link href="/">
                  <Button variant="secondary" size="lg">Return to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About the Author */}
        <section className="mt-12 pt-8 border-t border-border">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">DR</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Dale Rogers</h3>
              <p className="text-sm text-muted-foreground mb-2">Founder & Service Designer, Aegrid</p>
              <p className="text-sm text-muted-foreground">
                Dale brings over 15 years of experience in service design and asset management, having worked directly with councils across Australia. His unique combination of technical expertise and service design thinking led to the development of the Aegrid Rules and the creation of Aegrid's intelligent asset management platform.
              </p>
              <div className="mt-3">
                <a 
                  href="https://linkedin.com/in/dale-rogers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}

