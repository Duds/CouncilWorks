import Link from 'next/link';
import type { Route } from 'next';
import Image from 'next/image';
import type { Metadata } from 'next';
import CTAs from '@/components/marketing/CTAs';
import DemoCarousel from '@/components/marketing/DemoCarousel';
import SectionObserver from '@/components/marketing/SectionObserver';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Aegrid: Intelligent Asset Management for Visionary Councils | Pilot Partnership',
  description: 'Partner with Aegrid to transform your council\'s asset management. Service designer-led platform built on revolutionary Aegrid Rules. Explore pilot partnerships for innovative councils.',
  keywords: [
    'asset management',
    'council asset management',
    'pilot partnership',
    'Aegrid Rules',
    'intelligent asset management',
    'service design',
    'Australian councils',
    'asset lifecycle management',
    'maintenance strategy',
    'risk-based maintenance',
    'Dale Rogers',
    'council technology',
    'asset intelligence',
    'proactive maintenance',
    'asset criticality'
  ],
  authors: [{ name: 'Dale Rogers', url: 'https://linkedin.com/in/dale-rogers' }],
  creator: 'Dale Rogers',
  publisher: 'Aegrid',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Aegrid: Intelligent Asset Management for Visionary Councils',
    description: 'Partner with Aegrid to transform your council\'s asset management. Service designer-led platform built on revolutionary Aegrid Rules.',
    url: 'https://aegrid.au',
    siteName: 'Aegrid',
    images: [
      {
        url: '/images/Aegrid_HERO.png',
        width: 1200,
        height: 630,
        alt: 'Aegrid dashboard interface showing intelligent asset management',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aegrid: Intelligent Asset Management for Visionary Councils',
    description: 'Partner with Aegrid to transform your council\'s asset management. Service designer-led platform built on revolutionary Aegrid Rules.',
    images: ['/images/Aegrid_HERO.png'],
    creator: '@aegrid_au',
  },
  alternates: {
    canonical: 'https://aegrid.au',
  },
  category: 'Technology',
  classification: 'Asset Management Software',
  other: {
    'geo.region': 'AU',
    'geo.country': 'Australia',
    'geo.placename': 'Australia',
    'DC.title': 'Aegrid: Intelligent Asset Management for Visionary Councils',
    'DC.creator': 'Dale Rogers',
    'DC.subject': 'Asset Management, Council Technology, Service Design',
    'DC.description': 'Partner with Aegrid to transform your council\'s asset management. Service designer-led platform built on revolutionary Aegrid Rules.',
    'DC.publisher': 'Aegrid',
    'DC.contributor': 'Dale Rogers',
    'DC.type': 'Website',
    'DC.format': 'text/html',
    'DC.identifier': 'https://aegrid.au',
    'DC.source': 'https://aegrid.au',
    'DC.language': 'en-AU',
    'DC.coverage': 'Australia',
    'DC.rights': 'Copyright Aegrid',
  },
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const variant = cookieStore.get('cw-ab-hero')?.value === 'B' ? 'B' : 'A';
  const headline = variant === 'A'
    ? 'The Future of Asset Management Isn\'t More Maintenance. It\'s a New Approach.'
    : 'Partner with us to build the future of asset management for your council.';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Aegrid",
    "description": "Intelligent Asset Management for Visionary Councils",
    "url": "https://aegrid.au",
    "logo": "https://aegrid.au/images/aegrid-logo.png",
    "founder": {
      "@type": "Person",
      "name": "Dale Rogers",
      "jobTitle": "Founder & Service Designer",
      "url": "https://linkedin.com/in/dale-rogers"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AU"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "dale@aegrid.au",
      "contactType": "Business Inquiry"
    },
    "sameAs": [
      "https://linkedin.com/company/aegrid",
      "https://twitter.com/aegrid_au"
    ],
    "offers": {
      "@type": "Offer",
      "name": "Pilot Partnership",
      "description": "Explore a pilot partnership to transform your council's asset management",
      "category": "Asset Management Software"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section id="hero" className="relative isolate" aria-labelledby="hero-heading">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0">
            <Image
              src="/images/Aegrid_HERO.png"
              alt="Aegrid dashboard interface showing intelligent asset management capabilities"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <h1 id="hero-heading" className="text-4xl font-bold tracking-tight sm:text-5xl">{headline}</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Aegrid is a service designer-led platform that helps innovative councils move from reactive maintenance to predictable outcomes. We're looking for visionary partners to pilot a new approach to asset management, built on the 'Aegrid Rules' – a revolutionary framework for intelligent asset management.
            </p>
            <CTAs location="hero" variant={variant} />
            <p className="mt-2 text-xs text-muted-foreground">No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Founder & Aegrid Rules */}
      <section id="founder" className="mx-auto max-w-6xl px-6 py-16 sm:py-20" aria-labelledby="founder-heading">
        <div className="mb-10 max-w-3xl">
          <h2 id="founder-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">Built by a Service Designer Who's Lived the Problem</h2>
          <p className="mt-3 text-muted-foreground">Meet Dale Rogers, the founder behind Aegrid's revolutionary approach to asset management.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">From the Trenches to a New Philosophy</h3>
              <p className="mt-2 text-muted-foreground">
                Dale Rogers brings over 15 years of experience in service design and asset management. Having worked directly with councils across Australia, Dale witnessed firsthand the challenges of reactive maintenance and fragmented systems. This experience led to the development of the Aegrid Rules – four fundamental principles that transform how organisations approach asset management.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-base font-semibold">The Aegrid Rules</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <div>
                    <h5 className="font-medium">Every Asset Has a Purpose</h5>
                    <p className="text-sm text-muted-foreground">Structure assets around what they do, not just where they are.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <div>
                    <h5 className="font-medium">Match Maintenance to Risk</h5>
                    <p className="text-sm text-muted-foreground">Right-size your maintenance effort based on criticality and risk.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <div>
                    <h5 className="font-medium">Protect the Critical Few</h5>
                    <p className="text-sm text-muted-foreground">Surface your most critical assets so you can focus on what matters most.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <div>
                    <h5 className="font-medium">Plan for Tomorrow, Today</h5>
                    <p className="text-sm text-muted-foreground">Build a flexible, future-proof asset model that adapts to change.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <a href="/docs/aegrid-rules" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
                Read the Whitepaper: The Aegrid Rules for Intelligent Asset Management →
              </a>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/dale-rogers-founder.jpg"
              alt="Dale Rogers, Founder of Aegrid, professional headshot"
              width={400}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Pilot Partnership Journey */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-16 sm:py-20" aria-labelledby="pilot-heading">
        <div className="mb-10 max-w-3xl">
          <h2 id="pilot-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">Our Pilot Partnership Journey</h2>
          <p className="mt-3 text-muted-foreground">We'll work with you every step of the way to ensure a successful pilot and a smooth transition to a new way of working.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold">1) Discovery & Goal Setting</h3>
              <p className="mt-2 text-sm text-muted-foreground">We'll start by understanding your unique challenges and goals. Together, we'll define what success looks like for your pilot.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">2) Rapid Prototyping & Configuration</h3>
              <p className="mt-2 text-sm text-muted-foreground">We'll quickly configure a prototype of Aegrid that's tailored to your specific needs. You'll get to see your data in a new light and experience the power of the Aegrid Rules firsthand.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">3) Pilot & Iterate</h3>
              <p className="mt-2 text-sm text-muted-foreground">We'll work closely with your team to pilot Aegrid in a real-world setting. We'll gather feedback, iterate on the solution, and ensure that it's delivering real value.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">4) Scale & Sustain</h3>
              <p className="mt-2 text-sm text-muted-foreground">Once the pilot is complete, we'll help you scale the solution across your organisation and embed a new culture of proactive, intelligent asset management.</p>
            </div>
            <div className="pt-4">
              <a href="/contact" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Let's Start Your Pilot Journey
              </a>
            </div>
          </div>
          <DemoCarousel />
        </div>
      </section>

      {/* Value for every stakeholder */}
      <section id="personas" className="mx-auto max-w-6xl px-6 py-16 sm:py-20" aria-labelledby="stakeholder-heading">
        <div className="mb-10 max-w-3xl">
          <h2 id="stakeholder-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">Value for Every Stakeholder</h2>
          <p className="mt-3 text-muted-foreground">From the front line to the executive suite, Aegrid delivers tangible benefits that align with your council's strategic objectives.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ValueCard role="For Executives" bullets={["Drive strategic outcomes with a clear line of sight from assets to service delivery", "Performance KPIs", "Condition trends", "$AUD budget views"]} />
          <ValueCard role="For Managers" bullets={["Optimize resource allocation and make data-driven decisions with confidence", "↓ downtime with risk‑based plans", "↑ SLA compliance", "Clean audits"]} />
          <ValueCard role="For Crews" bullets={["Simplify your work and focus on what matters most with a user-friendly mobile app", "Offline inspections", "GPS + photos", "Fast mobile UI"]} />
          <ValueCard role="For Citizens" bullets={["Improve community satisfaction with more reliable services and greater transparency", "Report issues", "Track outcomes", "Transparent updates"]} />
          <ValueCard role="For Supervisors" bullets={["Assign and track work", "Live status & SLAs", "Map context"]} />
          <ValueCard role="For Admins" bullets={["SSO & RBAC", "Audit logging", "Organisation setup"]} />
        </div>
      </section>

      {/* Pilot-Focused FAQ */}
      <section id="faqs" className="mx-auto max-w-6xl px-6 py-16 sm:py-20" aria-labelledby="faq-heading">
        <div className="mb-10 max-w-3xl">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">Your Pilot Partnership Questions, Answered</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to know about partnering with Aegrid for a pilot project.</p>
        </div>
        <div className="space-y-3">
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">What are the benefits of a pilot partnership?</summary>
            <p className="mt-2 text-sm text-muted-foreground">A pilot partnership gives you early access to innovative asset management approaches, reduced risk through phased implementation, direct input into product development, and the opportunity to be a leader in your sector. You'll also benefit from our expertise in service design and change management.</p>
          </details>
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">What's the time commitment for a pilot?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Most pilots run for 3-6 months, with initial setup taking 2-4 weeks. We work around your schedule and can adapt the timeline to fit your operational requirements. The key is finding the right balance between thorough testing and minimal disruption to your current operations.</p>
          </details>
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">What happens after the pilot?</summary>
            <p className="mt-2 text-sm text-muted-foreground">After a successful pilot, we'll work with you to develop a full implementation plan. This includes scaling across your organisation, training your team, and establishing ongoing support. Pilot partners receive preferential pricing and priority support for full implementation.</p>
          </details>
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">How much does a pilot cost?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Pilot partnerships are designed to be low-risk investments. We offer flexible pricing models that can include reduced rates, success-based pricing, or even no-cost pilots for the right partners. The goal is mutual success, not immediate revenue.</p>
          </details>
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">What if the pilot doesn't work for us?</summary>
            <p className="mt-2 text-sm text-muted-foreground">That's exactly why we do pilots! If the pilot doesn't deliver the expected value, we'll work together to understand why and either adjust the approach or part ways amicably. There are no long-term commitments or penalties for ending a pilot early.</p>
          </details>
          <details className="rounded-md border border-border p-4">
            <summary className="cursor-pointer font-medium">How do we get started with a pilot?</summary>
            <p className="mt-2 text-sm text-muted-foreground">Start by reaching out to discuss your specific challenges and goals. We'll schedule a discovery call to understand your needs, then develop a tailored pilot proposal. The entire process typically takes 1-2 weeks from initial contact to pilot kickoff.</p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Aegrid: Intelligent Asset Management for Visionary Councils</h3>
              <p className="mt-2 text-sm text-muted-foreground">Partner with us to transform your asset management approach</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Aegrid. All rights reserved.</div>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href={"/docs" as Route}>Docs</Link>
                <Link href={"/docs/aegrid-rules" as Route}>The Aegrid Rules</Link>
                <Link href={"/changelog" as Route}>Changelog</Link>
                <a href="https://linkedin.com/in/dale-rogers" target="_blank" rel="noopener noreferrer">Dale's LinkedIn</a>
                <a href="mailto:support@aegrid.au">Support</a>
              </nav>
            </div>
          </div>
        </div>
      </footer>
      <SectionObserver sectionIds={["hero","founder","how","personas","faqs"]} />
    </main>
    </>
  );
}

function ValueCard({ role, bullets }: { role: string; bullets: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <h3 className="text-base font-semibold">{role}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span aria-hidden>•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
