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
import LandingFooter from '@/components/layout/landing-footer';
import TableOfContents from '@/components/docs/table-of-contents';

export const metadata: Metadata = {
  title: 'Resilient Asset Management for Critical Control | Aegrid Whitepaper',
  description: 'Complete whitepaper on The Aegrid Rules framework for resilient asset management in critical infrastructure environments.',
  keywords: [
    'asset management',
    'resilient infrastructure',
    'critical control',
    'risk management',
    'adaptive systems',
    'operational margin',
    'whitepaper',
    'Aegrid Rules'
  ],
  openGraph: {
    title: 'Resilient Asset Management for Critical Control',
    description: 'Complete whitepaper on The Aegrid Rules framework for resilient asset management.',
    type: 'article',
    authors: ['Aegrid Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resilient Asset Management for Critical Control',
    description: 'Complete whitepaper on The Aegrid Rules framework for resilient asset management.',
  },
};

export default function ResilientAssetManagementWhitepaper() {
  const tocItems = [
    { id: 'executive-summary', title: 'Executive Summary', level: 1 },
    { id: 'rule-1-purpose', title: 'Rule 1: Every Asset Has a Purpose', level: 1 },
    { id: 'rule-2-risk', title: 'Rule 2: Risk Sets the Rhythm', level: 1 },
    { id: 'rule-3-real-world', title: 'Rule 3: Respond to the Real World', level: 1 },
    { id: 'rule-4-margin', title: 'Rule 4: Operate with Margin', level: 1 },
    { id: 'implementation-guide', title: 'Implementation Guide', level: 1 },
    { id: 'conclusion', title: 'Conclusion', level: 1 },
    { id: 'references', title: 'References', level: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
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
                Resilient Asset Management Whitepaper
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/resilient-asset-management/pdf" target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Link>
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
              Resilient Asset Management for Critical Control
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              A Framework for Building Antifragile Infrastructure Systems
            </p>
            <div className="text-sm text-muted-foreground">
              <p>By: Aegrid Team</p>
              <p>Version: 1.0 | Date: December 2024</p>
            </div>
          </div>

          {/* Executive Summary */}
          <section id="executive-summary" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                In an era of increasing complexity and uncertainty, traditional asset management approaches 
                are proving inadequate for critical infrastructure. This whitepaper introduces The Aegrid Rules, 
                a framework designed to build resilient, adaptive, and <a href="#ref-antifragile" className="text-primary hover:underline">antifragile</a> asset management systems 
                that thrive under stress rather than merely survive it.
              </p>
              
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">The Four Aegrid Rules</h3>
                <ol className="space-y-3">
                  <li><strong>Every Asset Has a Purpose:</strong> Function-based anchoring ensures every asset serves a defined critical control function</li>
                  <li><strong>Risk Sets the Rhythm:</strong> <a href="#ref-risk-assessment" className="text-primary hover:underline">Consequence × likelihood</a> drives maintenance frequency and resource allocation</li>
                  <li><strong>Respond to the Real World:</strong> Adaptive management based on real-time signals and changing conditions</li>
                  <li><strong>Operate with Margin:</strong> Built-in slack enables rapid response and system resilience</li>
                </ol>
              </div>

              <p className="text-lg">
                These rules work together to create systems that not only withstand disruptions but actually 
                improve through stress, ensuring critical infrastructure remains operational when it matters most.
              </p>
            </div>
          </section>

          {/* Rule 1: Every Asset Has a Purpose */}
          <section id="rule-1-purpose" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Rule 1: Every Asset Has a Purpose</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                <strong>Core Principle:</strong> Every asset must serve a clearly defined critical control function. 
                This isn't just about categorisation, it's about understanding how each asset contributes to 
                system resilience and critical operations.
              </p>

              <h3 className="text-xl font-semibold mb-4">Critical Control Connection</h3>
              <p className="mb-6">
                Assets aren't just "things we maintain", they're components of critical control systems. 
                Understanding this connection transforms how we prioritise, maintain, and manage assets.
              </p>

              <h3 className="text-xl font-semibold mb-4">Asset Purpose Mapping</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Purpose Categories:</h4>
                <ul className="space-y-2">
                  <li><strong>Safety Control:</strong> Assets that prevent catastrophic failure</li>
                  <li><strong>Service Continuity:</strong> Assets that maintain essential services</li>
                  <li><strong>Regulatory Compliance:</strong> Assets required for legal/regulatory compliance</li>
                  <li><strong>Operational Efficiency:</strong> Assets that optimise system performance</li>
                  <li><strong>Emergency Response:</strong> Assets that enable rapid crisis response</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4">Practical Implementation</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Water Treatment Plant Example</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Primary Purpose:</strong> Safety Control (prevent contamination)<br/>
                    <strong>Secondary Purpose:</strong> Service Continuity (maintain water supply)<br/>
                    <strong>Critical Control Function:</strong> Chemical dosing pumps maintain safe water quality
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Traffic Management System</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Primary Purpose:</strong> Service Continuity (maintain traffic flow)<br/>
                    <strong>Secondary Purpose:</strong> Safety Control (prevent accidents)<br/>
                    <strong>Critical Control Function:</strong> Signal controllers manage intersection safety
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Rule 2: Risk Sets the Rhythm */}
          <section id="rule-2-risk" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Rule 2: Risk Sets the Rhythm</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                <strong>Core Principle:</strong> Maintenance frequency and resource allocation should be driven by 
                <a href="#ref-risk-assessment" className="text-primary hover:underline"> consequence × likelihood</a>, not arbitrary schedules. High-consequence assets get more attention, 
                regardless of their failure probability.
              </p>

              <h3 className="text-xl font-semibold mb-4" id="ref-risk-assessment">Consequence × Likelihood Framework</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Risk Assessment Matrix:</h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div></div>
                  <div className="text-center font-semibold">Low Likelihood</div>
                  <div className="text-center font-semibold">Medium Likelihood</div>
                  <div className="text-center font-semibold">High Likelihood</div>
                  
                  <div className="font-semibold">High Consequence</div>
                  <div className="bg-yellow-100 p-2 text-center">Medium Risk</div>
                  <div className="bg-red-100 p-2 text-center">High Risk</div>
                  <div className="bg-red-200 p-2 text-center">Critical Risk</div>
                  
                  <div className="font-semibold">Medium Consequence</div>
                  <div className="bg-green-100 p-2 text-center">Low Risk</div>
                  <div className="bg-yellow-100 p-2 text-center">Medium Risk</div>
                  <div className="bg-red-100 p-2 text-center">High Risk</div>
                  
                  <div className="font-semibold">Low Consequence</div>
                  <div className="bg-green-100 p-2 text-center">Low Risk</div>
                  <div className="bg-green-100 p-2 text-center">Low Risk</div>
                  <div className="bg-yellow-100 p-2 text-center">Medium Risk</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Dynamic Risk Assessment</h3>
              <p className="mb-6">
                Risk isn't static. Seasonal changes, weather patterns, usage spikes, and external events 
                all affect asset risk profiles. The rhythm must adapt accordingly.
              </p>

              <h3 className="text-xl font-semibold mb-4">Risk-Based Resource Allocation</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Summer Storm Season</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Increased Risk:</strong> Drainage systems, electrical infrastructure<br/>
                    <strong>Resource Shift:</strong> More frequent inspections, standby crews<br/>
                    <strong>Timeline:</strong> April-October increased monitoring
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Holiday Traffic Surge</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Increased Risk:</strong> Traffic signals, road surfaces<br/>
                    <strong>Resource Shift:</strong> Pre-holiday maintenance, real-time monitoring<br/>
                    <strong>Timeline:</strong> 2 weeks before major holidays
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Rule 3: Respond to the Real World */}
          <section id="rule-3-real-world" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Rule 3: Respond to the Real World</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg mb-6">
                <strong>Core Principle:</strong> Asset management must adapt to real-world conditions, not rigid 
                schedules. This means <a href="#ref-signal-detection" className="text-primary hover:underline">detecting signals</a>, interpreting their meaning, and responding appropriately 
                to changing circumstances.
              </p>

              <h3 className="text-xl font-semibold mb-4" id="ref-signal-detection">Signal Detection Framework</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Signal Types:</h4>
                <ul className="space-y-2">
                  <li><strong>Performance Signals:</strong> Efficiency drops, unusual patterns</li>
                  <li><strong>Environmental Signals:</strong> Weather changes, seasonal shifts</li>
                  <li><strong>Usage Signals:</strong> Demand spikes, usage pattern changes</li>
                  <li><strong>Condition Signals:</strong> Wear indicators, degradation markers</li>
                  <li><strong>External Signals:</strong> Regulatory changes, community feedback</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-4">Adaptive Response Framework</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Signal Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Continuous monitoring of asset performance, environmental conditions, and usage patterns
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Signal Interpretation</h4>
                  <p className="text-sm text-muted-foreground">
                    Analysis of signal patterns to determine appropriate response level and urgency
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold">Response Execution</h4>
                  <p className="text-sm text-muted-foreground">
                    Immediate action based on signal interpretation, with escalation protocols for critical signals
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">Rapid Response Framework</h3>
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Response Levels:</h4>
                <ul className="space-y-2">
                  <li><strong>Level 1 - Monitor:</strong> Track signal, no immediate action required</li>
                  <li><strong>Level 2 - Investigate:</strong> Deploy inspection team within 24 hours</li>
                  <li><strong>Level 3 - Respond:</strong> Immediate maintenance action required</li>
                  <li><strong>Level 4 - Emergency:</strong> Full emergency response protocol activated</li>
                </ul>
              </div>
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

          {/* Implementation Guide */}
          <section id="implementation-guide" className="mb-12">
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

          {/* References */}
          <section id="references" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">References</h2>
            <div className="prose prose-lg max-w-none">
              <div className="space-y-4">
                <div id="ref-antifragile" className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Antifragility</h3>
                  <p className="text-sm text-muted-foreground">
                    Taleb, N. N. (2012). <em>Antifragile: Things That Gain from Disorder</em>. Random House.
                    <br />
                    <span className="text-xs">The foundational concept of systems that improve through stress and uncertainty.</span>
                  </p>
                </div>

                <div id="ref-risk-assessment" className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Risk Assessment Framework</h3>
                  <p className="text-sm text-muted-foreground">
                    ISO 31000:2018. <em>Risk management ,  Guidelines</em>. International Organization for Standardization.
                    <br />
                    <span className="text-xs">International standard for risk management principles and framework.</span>
                  </p>
                </div>

                <div id="ref-signal-detection" className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Signal Detection Theory</h3>
                  <p className="text-sm text-muted-foreground">
                    Green, D. M., & Swets, J. A. (1966). <em>Signal Detection Theory and Psychophysics</em>. Wiley.
                    <br />
                    <span className="text-xs">Foundational work on signal detection and decision-making under uncertainty.</span>
                  </p>
                </div>

                <div id="ref-operational-margin" className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Operational Margin Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Hollnagel, E. (2014). <em>Safety-I and Safety-II: The Past and Future of Safety Management</em>. Ashgate.
                    <br />
                    <span className="text-xs">Comprehensive framework for understanding safety margins and system resilience.</span>
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Asset Management Standards</h3>
                  <p className="text-sm text-muted-foreground">
                    ISO 55000:2014. <em>Asset management ,  Overview, principles and terminology</em>. International Organization for Standardization.
                    <br />
                    <span className="text-xs">International standard for asset management systems and principles.</span>
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Critical Infrastructure Resilience</h3>
                  <p className="text-sm text-muted-foreground">
                    National Infrastructure Advisory Council. (2009). <em>Critical Infrastructure Resilience: Final Report and Recommendations</em>. Department of Homeland Security.
                    <br />
                    <span className="text-xs">Framework for building resilience in critical infrastructure systems.</span>
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">Adaptive Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Walters, C. J. (1986). <em>Adaptive Management of Renewable Resources</em>. Macmillan.
                    <br />
                    <span className="text-xs">Foundational work on adaptive management principles for complex systems.</span>
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold mb-2">System Resilience Engineering</h3>
                  <p className="text-sm text-muted-foreground">
                    Woods, D. D. (2015). <em>Four Concepts for Resilience and the Implications for the Future of Resilience Engineering</em>. Reliability Engineering & System Safety.
                    <br />
                    <span className="text-xs">Contemporary framework for understanding and building system resilience.</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
              </div>
            </main>
          </div>
        </div>
        <LandingFooter />
      </div>
    </div>
  );
}
