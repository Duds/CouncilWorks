import type { Metadata } from 'next';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'The Aegrid Rules: A Revolutionary Framework for Intelligent Asset Management',
  description: 'Discover the four fundamental principles that transform how organisations approach asset management. Learn how the Aegrid Rules can revolutionise your council\'s asset strategy.',
  keywords: [
    'asset management',
    'Aegrid Rules',
    'intelligent asset management',
    'council asset management',
    'asset lifecycle',
    'maintenance strategy',
    'risk-based maintenance',
    'asset criticality',
    'service design',
    'Australian councils'
  ],
  authors: [{ name: 'Dale Rogers', url: 'https://linkedin.com/in/dale-rogers' }],
  openGraph: {
    title: 'The Aegrid Rules: A Revolutionary Framework for Intelligent Asset Management',
    description: 'Discover the four fundamental principles that transform how organisations approach asset management.',
    type: 'article',
    publishedTime: '2025-01-16T00:00:00.000Z',
    authors: ['Dale Rogers'],
    tags: ['asset management', 'Aegrid Rules', 'council management', 'service design']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Aegrid Rules: A Revolutionary Framework for Intelligent Asset Management',
    description: 'Discover the four fundamental principles that transform how organisations approach asset management.',
    creator: '@aegrid_au'
  },
  alternates: {
    canonical: 'https://aegrid.au/docs/aegrid-rules'
  }
};

export default function AegridRulesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The Aegrid Rules
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            A Revolutionary Framework for Intelligent Asset Management
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            By Dale Rogers, Founder & Service Designer
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Introduction</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              After 15 years working with councils across Australia, I've witnessed firsthand the challenges of reactive maintenance, fragmented systems, and the disconnect between asset management and service delivery. This experience led to the development of the Aegrid Rules – four fundamental principles that transform how organisations approach asset management.
            </p>
            <p className="text-muted-foreground mb-6">
              The Aegrid Rules aren't just theoretical concepts; they're practical principles born from real-world experience. They address the core issues that plague traditional asset management approaches and provide a clear path to intelligent, proactive asset management that delivers real value to communities.
            </p>
          </div>
        </section>

        {/* The Four Rules */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-8">The Four Aegrid Rules</h2>
          
          <div className="space-y-12">
            {/* Rule 1 */}
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">1</span>
                <h3 className="text-xl font-semibold">Every Asset Has a Purpose</h3>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-3">
                Structure assets around what they do, not just where they are.
              </p>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Traditional asset management often organises assets by location, department, or asset type. This approach obscures the true value and purpose of each asset. The first Aegrid Rule requires us to understand and structure assets around their service purpose – what they actually do for the community.
                </p>
                <p className="text-muted-foreground mb-4">
                  When we organise assets by purpose, we can see the complete picture of service delivery. A playground isn't just recreation equipment – it's community wellbeing infrastructure. A stormwater drain isn't just a pipe – it's flood protection infrastructure. This perspective enables better decision-making about maintenance priorities, replacement schedules, and resource allocation.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Implementation:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Define service purposes for all asset categories</li>
                    <li>Create purpose-based asset hierarchies</li>
                    <li>Map assets to community outcomes</li>
                    <li>Use purpose-driven maintenance scheduling</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">2</span>
                <h3 className="text-xl font-semibold">Match Maintenance to Risk</h3>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-3">
                Right-size your maintenance effort based on criticality and risk.
              </p>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Not all assets are created equal. Some assets are critical to service delivery, while others have minimal impact if they fail. The second Aegrid Rule requires us to assess each asset's criticality and match our maintenance effort accordingly.
                </p>
                <p className="text-muted-foreground mb-4">
                  This isn't about cutting maintenance budgets – it's about optimising them. Critical assets receive more frequent inspections and proactive maintenance. Non-critical assets can use run-to-failure strategies. This approach maximises reliability where it matters most while freeing up resources for strategic initiatives.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Implementation:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Conduct criticality assessments for all assets</li>
                    <li>Develop risk-based maintenance schedules</li>
                    <li>Implement condition monitoring for critical assets</li>
                    <li>Use predictive maintenance where appropriate</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">3</span>
                <h3 className="text-xl font-semibold">Protect the Critical Few</h3>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-3">
                Surface your most critical assets so you can focus on what matters most.
              </p>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  In any organisation, 20% of assets typically account for 80% of service delivery risk. The third Aegrid Rule requires us to identify and elevate these critical assets in all our systems, processes, and reporting.
                </p>
                <p className="text-muted-foreground mb-4">
                  Critical assets should be visible in every dashboard, highlighted in every report, and prioritised in every decision. They should have dedicated monitoring, faster response times, and higher maintenance standards. This ensures that the assets that matter most receive the attention they deserve.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Implementation:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Create critical asset dashboards</li>
                    <li>Implement elevated monitoring and alerting</li>
                    <li>Establish faster response protocols</li>
                    <li>Regular critical asset reviews</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="border-l-4 border-primary pl-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">4</span>
                <h3 className="text-xl font-semibold">Plan for Tomorrow, Today</h3>
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-3">
                Build a flexible, future-proof asset model that adapts to change.
              </p>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground mb-4">
                  Organisations change. Funding models change. Service expectations change. The fourth Aegrid Rule requires us to build asset management systems that can adapt to these changes without requiring complete restructuring.
                </p>
                <p className="text-muted-foreground mb-4">
                  This means using flexible data models, configurable hierarchies, and adaptable processes. It means designing systems that can accommodate new asset types, changing organisational structures, and evolving service requirements. Most importantly, it means building for the future while delivering value today.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Implementation:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Use flexible, configurable data models</li>
                    <li>Design adaptable organisational structures</li>
                    <li>Implement modular system architecture</li>
                    <li>Regular system evolution planning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Implementing the Aegrid Rules</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">
              Implementing the Aegrid Rules isn't a one-time project – it's a cultural transformation. Here's how to get started:
            </p>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Phase 1: Assessment</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Audit current asset management practices</li>
                  <li>Identify critical assets and service purposes</li>
                  <li>Assess current maintenance strategies</li>
                  <li>Evaluate system flexibility and adaptability</li>
                </ul>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Phase 2: Design</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Design purpose-based asset hierarchies</li>
                  <li>Develop risk-based maintenance schedules</li>
                  <li>Create critical asset management processes</li>
                  <li>Plan flexible system architecture</li>
                </ul>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Phase 3: Implementation</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Pilot new approaches with critical assets</li>
                  <li>Train teams on new processes</li>
                  <li>Implement monitoring and reporting</li>
                  <li>Establish continuous improvement cycles</li>
                </ul>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Phase 4: Scale</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Expand to all asset categories</li>
                  <li>Integrate with existing systems</li>
                  <li>Develop advanced analytics</li>
                  <li>Share learnings across the organisation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Ready to Transform Your Asset Management?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join us in implementing the Aegrid Rules through a pilot partnership. Let's work together to build the future of intelligent asset management.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:dale@aegrid.au?subject=Pilot%20Partnership%20Inquiry">
              <Button size="lg">Explore a Pilot Partnership</Button>
            </a>
            <Link href="/" as Route>
              <Button variant="secondary" size="lg">Return to Home</Button>
            </Link>
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
    </main>
  );
}
